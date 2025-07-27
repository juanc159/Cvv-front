<template>
  <!-- Lista de procesos (cuando hay múltiples) -->
  <ProcessListModal v-if="globalLoading.showProcessList.value && globalLoading.processList.value.length > 1"
    :processes="globalLoading.processList.value" @select-process="globalLoading.setActiveProcess"
    @remove-process="globalLoading.removeProcess" @close="globalLoading.toggleProcessList" />

  <!-- Loading principal (cuando hay un proceso activo) -->
  <LoadingV2Enhanced v-if="globalLoading.currentProcess.value && !showMultiProgress"
    :is-loading="globalLoading.hasActiveProcesses.value" :progress="globalLoading.currentProgress.value"
    :show-debug-toggle="true" :debug-data="globalLoading.debugInfo.value"
    :title="globalLoading.currentProcess.value?.progress_data.current_action || 'Procesando'" :subtitle="getSubtitle()"
    :steps="loadingSteps" :tips="loadingTips" :show-process-list="globalLoading.processList.value.length > 1"
    :process-count="globalLoading.processList.value.length" @minimized="globalLoading.minimize"
    @restored="globalLoading.restore" @completed="handleCompleted" @show-process-list="toggleMultiProgress" />

  <!-- Display de múltiples procesos -->
  <v-dialog v-model="showMultiProgress" max-width="900" persistent>
    <v-card>
      <v-card-title class="d-flex align-center justify-space-between">
        <span>Procesos de Importación</span>
        <v-btn icon="tabler-x" variant="text" @click="showMultiProgress = false" />
      </v-card-title>

      <v-card-text class="pa-0" style="max-height: 70vh; overflow-y: auto;">
        <MultiProgressDisplay :processes="enhancedProcessList" @select-process="handleSelectProcess"
          @remove-process="globalLoading.removeProcess" />
      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <v-btn variant="text" @click="showMultiProgress = false">
          Cerrar
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!-- Panel de control de debugging (solo en desarrollo) -->
  <div v-if="isDevelopment" class="debug-panel">
    <v-card class="debug-card" elevation="8">
      <v-card-title class="text-caption">🔧 Debug Panel</v-card-title>
      <v-card-text class="pa-2">
        <div class="d-flex flex-column gap-1">
          <v-btn size="x-small" color="info" @click="toggleMultiProgress">
            📊 Ver todos los procesos
          </v-btn>

          <v-btn size="x-small" color="warning" @click="globalLoading.cleanupCompletedProcesses"
            :disabled="!hasCompletedProcesses">
            🧹 Limpiar completados
          </v-btn>

          <v-btn size="x-small" color="error" @click="globalLoading.forceCleanup">
            🗑️ Limpieza forzada
          </v-btn>

          <v-btn size="x-small" :color="globalLoading.isAutoLoadEnabled() ? 'success' : 'secondary'"
            @click="toggleAutoLoad">
            {{ globalLoading.isAutoLoadEnabled() ? '🔄 Auto-load ON' : '⏸️ Auto-load OFF' }}
          </v-btn>

          <div class="text-caption mt-1">
            Procesos: {{ globalLoading.processList.value.length }}
          </div>
        </div>
      </v-card-text>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import { getGlobalLoadingInstance, initializeGlobalLoading } from '@/composables/useGlobalLoading';
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import LoadingV2Enhanced from './LoadingV2Enhanced.vue';
import MultiProgressDisplay from './MultiProgressDisplay.vue';
import ProcessListModal from './ProcessListModal.vue';

// Obtener la instancia global
const globalLoading = getGlobalLoadingInstance();

// Estado local
const showMultiProgress = ref(false);

// Verificar si estamos en desarrollo
const isDevelopment = computed(() => {
  return import.meta.env.DEV || import.meta.env.MODE === 'development'
});

// Verificar si hay procesos completados
const hasCompletedProcesses = computed(() => {
  return globalLoading.processList.value.some(p => p.status === 'completed')
});

// Lista de procesos mejorada con detalles
const enhancedProcessList = computed(() => {
  return globalLoading.processList.value.map(process => ({
    ...process,
    details: globalLoading.currentActiveProcess.value === process.batch_id ? {
      current_student: globalLoading.debugInfo.value.currentStudent || 'N/A',
      processed_records: globalLoading.debugInfo.value.processedRecords || 0,
      total_records: globalLoading.debugInfo.value.totalRecords || 0,
      sheet: globalLoading.debugInfo.value.sheet || 0,
      last_update: globalLoading.debugInfo.value.lastUpdate || 'Nunca'
    } : undefined
  }));
});

// Función para alternar auto-load
const toggleAutoLoad = () => {
  if (globalLoading.isAutoLoadEnabled()) {
    globalLoading.disableAutoLoad()
  } else {
    globalLoading.enableAutoLoad()
  }
};

// Función para alternar vista de múltiples procesos
const toggleMultiProgress = () => {
  showMultiProgress.value = !showMultiProgress.value;
};

// Manejar selección de proceso
const handleSelectProcess = (batchId: string) => {
  globalLoading.setActiveProcess(batchId);
  showMultiProgress.value = false;
};

// Pasos dinámicos basados en el progreso
const loadingSteps = computed(() => [
  'Validando archivo Excel',
  'Procesando estructura de datos',
  'Importando registros de estudiantes',
  'Guardando notas en base de datos',
  'Finalizando importación'
]);

// Tips personalizados
const loadingTips = [
  '📊 Puedes cargar múltiples archivos simultáneamente',
  '👥 Los procesos se ejecutan en paralelo de forma independiente',
  '📝 Cada importación mantiene su propio progreso',
  '🔄 Puedes cambiar entre procesos activos fácilmente',
  '✅ Minimiza y continúa navegando, todo sigue funcionando',
  '📈 El progreso se actualiza en tiempo real para cada proceso',
  '🎯 Los procesos completados se mantienen hasta que los elimines',
  '⚡ Cada usuario puede tener sus propios procesos simultáneos'
];

// Función para obtener subtítulo dinámico
const getSubtitle = () => {
  const currentProcess = globalLoading.currentProcess.value;
  if (!currentProcess) return 'Sin procesos activos';

  const meta = currentProcess.progress_data.metadata;
  const progress = globalLoading.currentProgress.value;

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

const handleCompleted = () => {
  console.log('✅ Loading completed globally');
};

// Inicializar el sistema al montar (SIN cargar estado automáticamente)
onMounted(() => {
  console.log('🚀 [MANAGER] GlobalLoadingManager mounted');
  initializeGlobalLoading(); // Solo inicializa, no carga estado
});

// Cleanup al desmontar
onBeforeUnmount(() => {
  console.log('🧹 [MANAGER] GlobalLoadingManager unmounting');
  globalLoading.cleanup();
});
</script>

<style scoped>
.debug-panel {
  position: fixed;
  bottom: 20px;
  left: 20px;
  z-index: 10000;
}

.debug-card {
  min-width: 150px;
  backdrop-filter: blur(10px);
  background: rgba(255, 255, 255, 0.9);
}

.v-theme--dark .debug-card {
  background: rgba(30, 30, 30, 0.9);
}
</style>
