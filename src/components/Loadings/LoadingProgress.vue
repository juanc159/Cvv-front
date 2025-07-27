<template>
  <div>
    <LoadingV2Enhanced v-model:isLoading="isLoading" :progress="currentProgress" :show-debug-toggle="true"
      :debug-data="debugInfo" :allow-cancel="false" :title="progressData.current_action" :subtitle="getSubtitle()"
      :steps="loadingSteps" :tips="loadingTips" @minimized="handleMinimized" @restored="handleRestored"
      @completed="handleCompleted" />
  </div>
</template>

<script setup lang="ts">
import { computed, defineProps, ref } from 'vue';
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

// Event handlers
const handleMinimized = () => {
  isMinimized.value = true;
  console.log('📱 Loading minimized - process continues in background');
};

const handleRestored = () => {
  isMinimized.value = false;
  console.log('📱 Loading restored');
};

const handleCompleted = () => {
  console.log('✅ Loading completed');
  emit('completed');
};

// Exponer funciones para uso externo
defineExpose({
  isLoading,
  progressData,
  currentProgress,
  strategy: strategy.value,
  connectionStatus
});
</script>
