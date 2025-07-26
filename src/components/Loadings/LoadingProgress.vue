<template>
  <div>
    <LoadingV2Enhanced v-model:isLoading="isLoading" :progress="currentProgress" :show-debug-toggle="true"
      :debug-data="debugInfo" :allow-cancel="true" :title="progressData.current_action" :subtitle="getSubtitle()"
      :steps="loadingSteps" :tips="loadingTips" @minimized="handleMinimized" @restored="handleRestored"
      @cancel="handleCancel" @completed="handleCompleted" />
  </div>
</template>

<script setup lang="ts">

import { computed, defineProps, nextTick, onBeforeUnmount, ref, watch } from 'vue';
import LoadingV2Enhanced from './LoadingV2Enhanced.vue';

interface ProgressMetadata {
  sheet: number;
  chunk: number;
  processed_rows: number;
  total_rows: number;
  total_records: number;
  processed_records: number;
  general_progress: number;
  subjects_processed: number;
}

interface ProgressData {
  batch_id: string;
  progress: number;
  current_student: string;
  current_action: string;
  metadata: ProgressMetadata;
  timestamp: string;
  general_progress: number;
}

type Strategy = 'polling' | 'sse';

const props = defineProps<{
  batchId?: string;
  initialProgress?: ProgressData;
  strategy?: Strategy;
}>();

const emit = defineEmits<{
  completed: [];
  error: [error: any];
  strategyChanged: [strategy: Strategy];
  progressUpdated: [progress: number];
  cancelled: [];
}>();

// Estado de carga
const isLoading = ref(false);
const strategy = ref<Strategy>(props.strategy || 'sse');
const connectionStatus = ref('disconnected');
const lastUpdateTime = ref<string>('');
const messagesReceived = ref(0);
const isMinimized = ref(false);

const progressData = ref<ProgressData>({
  batch_id: '',
  progress: 0,
  current_student: 'Iniciando proceso...',
  current_action: 'Preparando importación',
  metadata: {
    sheet: 0,
    chunk: 0,
    processed_rows: 0,
    total_rows: 0,
    total_records: 0,
    processed_records: 0,
    general_progress: 0,
    subjects_processed: 0
  },
  timestamp: '',
  general_progress: 0
});

// Computed para debug info
const debugInfo = computed(() => ({
  strategy: strategy.value,
  connectionStatus: connectionStatus.value,
  batchId: progressData.value.batch_id,
  processedRecords: progressData.value.metadata.processed_records,
  totalRecords: progressData.value.metadata.total_records,
  currentStudent: progressData.value.current_student,
  lastUpdate: lastUpdateTime.value,
  sheet: progressData.value.metadata.sheet,
  chunk: progressData.value.metadata.chunk
}));

// Computed para el progreso actual
const currentProgress = computed(() => {
  let progress = progressData.value.metadata?.general_progress || 0;

  if (progress === 0) {
    const { processed_records, total_records } = progressData.value.metadata || {};
    if (total_records && total_records > 0) {
      progress = Math.round((processed_records / total_records) * 100);
    }
  }

  if (progress === 0) {
    progress = progressData.value.progress || 0;
  }

  return Math.min(100, Math.max(0, progress));
});

// Pasos dinámicos basados en el progreso
const loadingSteps = computed(() => [
  'Validando archivo Excel',
  'Procesando estructura de datos',
  'Importando registros de estudiantes',
  'Guardando notas en base de datos',
  'Finalizando importación'
]);

// Tips personalizados
const loadingTips = ref([
  '📊 Asegúrate de que el archivo Excel tenga el formato correcto',
  '👥 Los estudiantes se crean automáticamente si no existen',
  '📝 Las notas se actualizan si ya existen registros previos',
  '🔄 El proceso puede tomar varios minutos dependiendo del tamaño',
  '✅ Puedes minimizar esta ventana y continuar navegando',
  '📈 El progreso se actualiza en tiempo real',
  '🎯 Cada hoja del Excel se procesa por separado',
  '⚡ El proceso continuará aunque cambies de página'
]);

// Función para obtener subtítulo dinámico
const getSubtitle = () => {
  const meta = progressData.value.metadata;
  const progress = currentProgress.value;

  if (progress === 0) {
    return 'Iniciando proceso de importación...';
  }

  if (progress < 10) {
    return 'Validando estructura del archivo...';
  }

  if (progress < 100) {
    return `Procesando ${meta.processed_records || 0} de ${meta.total_records || 0} registros`;
  }

  return '¡Importación completada exitosamente!';
};

// ==================== POLLING STRATEGY ====================
let pollingInterval: NodeJS.Timeout | null = null;

const pollProgress = async (batchId: string) => {
  try {
    connectionStatus.value = 'connecting';

    const url = `${BASE_BACK_API}/batch-status/${batchId}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    connectionStatus.value = 'connected';

    if (data.progress_data) {
      updateProgressData(data.progress_data);
    }

  } catch (error) {
    console.error('❌ Error polling progress:', error);
    connectionStatus.value = 'error';

    // No emitir error inmediatamente, intentar reconectar
    if (isLoading.value) {
      setTimeout(() => {
        if (isLoading.value) {
          pollProgress(batchId);
        }
      }, 5000);
    }
  }
};

const startPolling = (batchId: string) => {
  console.log(`🔄 [POLLING] Starting for batch: ${batchId}`);
  connectionStatus.value = 'connecting';

  pollProgress(batchId);
  pollingInterval = setInterval(() => {
    if (isLoading.value) {
      pollProgress(batchId);
    }
  }, 2000);
};

const stopPolling = () => {
  if (pollingInterval) {
    console.log('🛑 [POLLING] Stopping');
    clearInterval(pollingInterval);
    pollingInterval = null;
    connectionStatus.value = 'disconnected';
  }
};

// ==================== SERVER-SENT EVENTS STRATEGY ====================
let eventSource: EventSource | null = null;
let reconnectAttempts = 0;
const maxReconnectAttempts = 5;
let reconnectTimeout: NodeJS.Timeout | null = null;

const startSSE = (batchId: string) => {
  console.log(`📡 [SSE] Starting for batch: ${batchId}`);
  connectionStatus.value = 'connecting';
  messagesReceived.value = 0;

  // CORREGIDO: URL simplificada
  const url = `${BASE_BACK_API}/progress/${batchId}`;
  console.log('📡 SSE URL:', url);

  try {
    eventSource = new EventSource(url);

    eventSource.addEventListener('message', (event) => {
      handleSSEMessage(event);
    });

    eventSource.addEventListener('progress', (event) => {
      handleSSEMessage(event);
    });

    eventSource.addEventListener('heartbeat', (event) => {
      console.log('💓 [SSE] Heartbeat event:', event);
      messagesReceived.value++;
      connectionStatus.value = 'connected';
    });

    eventSource.onopen = (event) => {
      console.log('✅ [SSE] Connection opened:', event);
      connectionStatus.value = 'connected';
      reconnectAttempts = 0;
      messagesReceived.value++;
    };

    eventSource.onerror = (error) => {
      console.error('❌ [SSE] Connection error:', error);

      if (eventSource?.readyState === EventSource.CLOSED) {
        console.log('🔒 [SSE] Connection closed by server');
        connectionStatus.value = 'disconnected';
        return;
      }

      connectionStatus.value = 'error';

      // Solo reconectar si el loading sigue activo
      if (isLoading.value && reconnectAttempts < maxReconnectAttempts) {
        reconnectAttempts++;
        const delay = Math.min(1000 * Math.pow(2, reconnectAttempts), 30000);

        console.log(`🔄 [SSE] Attempting reconnect ${reconnectAttempts}/${maxReconnectAttempts} in ${delay}ms`);
        connectionStatus.value = 'reconnecting';

        reconnectTimeout = setTimeout(() => {
          if (isLoading.value) {
            stopSSE();
            startSSE(batchId);
          }
        }, delay);
      }
    };

  } catch (error) {
    console.error('❌ [SSE] Error creating EventSource:', error);
    connectionStatus.value = 'error';
  }
};

const handleSSEMessage = (event: MessageEvent) => {
  try {
    messagesReceived.value++;
    connectionStatus.value = 'connected';
    reconnectAttempts = 0;

    if (!event.data) return;

    const data = JSON.parse(event.data);

    if (data.type === 'heartbeat') {
      console.log('💓 [SSE] Heartbeat received');
      return;
    }

    if (data.type === 'progress' || !data.type) {
      updateProgressData(data);
    }

    if (data.type === 'completed') {
      if (data.final_progress) {
        updateProgressData(data.final_progress);
      }
    }

  } catch (error) {
    console.error('❌ [SSE] Error handling message:', error);
  }
};

const stopSSE = () => {
  if (eventSource) {
    console.log('🛑 [SSE] Stopping');
    eventSource.close();
    eventSource = null;
  }

  if (reconnectTimeout) {
    clearTimeout(reconnectTimeout);
    reconnectTimeout = null;
  }

  connectionStatus.value = 'disconnected';
  reconnectAttempts = 0;
};

// ==================== SHARED FUNCTIONS ====================

const updateProgressData = (newData: any) => {
  const updatedData = {
    batch_id: newData.batch_id || progressData.value.batch_id,
    progress: newData.progress || 0,
    current_student: newData.current_student || 'Procesando...',
    current_action: newData.current_action || 'Importando datos',
    metadata: {
      sheet: newData.metadata?.sheet || 0,
      chunk: newData.metadata?.chunk || 0,
      processed_rows: newData.metadata?.processed_rows || 0,
      total_rows: newData.metadata?.total_rows || 0,
      total_records: newData.metadata?.total_records || 0,
      processed_records: newData.metadata?.processed_records || 0,
      general_progress: newData.metadata?.general_progress || 0,
      subjects_processed: newData.metadata?.subjects_processed || 0
    },
    timestamp: newData.timestamp || new Date().toISOString(),
    general_progress: newData.metadata?.general_progress || 0
  };

  progressData.value = updatedData;
  lastUpdateTime.value = new Date().toLocaleTimeString();

  nextTick(() => {
    const currentProg = currentProgress.value;
    emit('progressUpdated', currentProg);

    // Si llegamos al 100%, completar
    if (updatedData.metadata.general_progress >= 100) {
      console.log(`✅ [${strategy.value.toUpperCase()}] Progress completed!`);
      setTimeout(() => {
        stopLoading();
        emit('completed');
      }, 1500);
    }
  });
};

// Funciones de conexión unificadas
const startConnection = (batchId: string) => {
  console.log(`🚀 Starting connection with ${strategy.value} strategy`);
  if (strategy.value === 'polling') {
    startPolling(batchId);
  } else {
    startSSE(batchId);
  }
};

const stopConnection = () => {
  console.log('🛑 Stopping all connections');
  stopPolling();
  stopSSE();
};

// ==================== EVENT HANDLERS ====================

const handleMinimized = () => {
  isMinimized.value = true;
  console.log('📱 Loading minimized - process continues in background');
};

const handleRestored = () => {
  isMinimized.value = false;
  console.log('📱 Loading restored');
};

const handleCancel = async () => {
  console.log('❌ User requested cancellation');

  // Intentar cancelar el batch en el backend
  if (progressData.value.batch_id) {
    try {
      // CORREGIDO: URL simplificada
      const response = await fetch(`${BASE_BACK_API}/batch-cancel/${progressData.value.batch_id}`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        }
      });

      if (response.ok) {
        console.log('✅ Batch cancelled successfully');
      } else {
        console.warn('⚠️ Failed to cancel batch on server');
      }
    } catch (error) {
      console.error('❌ Error cancelling batch:', error);
    }
  }

  stopLoading();
  emit('cancelled');
};

const handleCompleted = () => {
  console.log('✅ Loading completed');
  emit('completed');
};

// ==================== PUBLIC API ====================

const startLoading = (batchId: string) => {
  console.log(`🚀 Starting loading with ${strategy.value} strategy for batch: ${batchId}`);

  isLoading.value = true;
  progressData.value.batch_id = batchId;

  // Resetear progreso
  progressData.value.metadata.general_progress = 0;
  progressData.value.metadata.processed_records = 0;
  progressData.value.progress = 0;
  lastUpdateTime.value = '';
  messagesReceived.value = 0;
  isMinimized.value = false;

  startConnection(batchId);
};

const stopLoading = () => {
  console.log('🛑 Stopping loading');
  isLoading.value = false;
  stopConnection();
};

const changeStrategy = (newStrategy: Strategy) => {
  strategy.value = newStrategy;
  emit('strategyChanged', newStrategy);
};

// ==================== PERSISTENCE ====================

// Guardar estado en localStorage para persistencia entre páginas
const saveState = () => {
  if (isLoading.value && progressData.value.batch_id) {
    const state = {
      batchId: progressData.value.batch_id,
      strategy: strategy.value,
      isMinimized: isMinimized.value,
      progressData: progressData.value,
      timestamp: Date.now()
    };
    localStorage.setItem('importProgress', JSON.stringify(state));
  }
};

const loadState = () => {
  const saved = localStorage.getItem('importProgress');
  if (saved) {
    try {
      const state = JSON.parse(saved);
      // Solo restaurar si es reciente (menos de 1 hora)
      if (Date.now() - state.timestamp < 3600000) {
        progressData.value = state.progressData;
        strategy.value = state.strategy;
        isMinimized.value = state.isMinimized;

        // Reanudar conexión
        if (state.progressData.metadata.general_progress < 100) {
          isLoading.value = true;
          startConnection(state.batchId);
        }
      } else {
        localStorage.removeItem('importProgress');
      }
    } catch (error) {
      console.error('Error loading saved state:', error);
      localStorage.removeItem('importProgress');
    }
  }
};

const clearState = () => {
  localStorage.removeItem('importProgress');
};

// Guardar estado periódicamente
let saveInterval: NodeJS.Timeout | null = null;

const startStateSaving = () => {
  saveInterval = setInterval(saveState, 5000); // Guardar cada 5 segundos
};

const stopStateSaving = () => {
  if (saveInterval) {
    clearInterval(saveInterval);
    saveInterval = null;
  }
};

// Lifecycle hooks
onBeforeUnmount(() => {
  saveState(); // Guardar antes de desmontar
  stopConnection();
  stopStateSaving();
});

// Cargar estado al montar
loadState();

// Iniciar guardado automático cuando hay carga activa
watch(isLoading, (newValue) => {
  if (newValue) {
    startStateSaving();
  } else {
    stopStateSaving();
    clearState();
  }
});

// Exponer funciones para uso externo
defineExpose({
  startLoading,
  stopLoading,
  changeStrategy,
  isLoading,
  progressData,
  currentProgress,
  strategy: strategy.value,
  connectionStatus,
  loadState
});
</script>
