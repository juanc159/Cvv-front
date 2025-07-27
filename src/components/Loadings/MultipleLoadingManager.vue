<template>
  <!-- Modal Principal - Proceso Individual -->
  <LoadingV2Enhanced
    v-if="multiLoading.hasActiveProcesses.value && !multiLoading.isMinimized.value && !multiLoading.showProcessList.value"
    :is-loading="true" :progress="progress" :title="getTitle()" :subtitle="getSubtitle()" @minimized="handleMinimize"
    @completed="handleCompleted" :show-multiple-button="multiLoading.hasMultipleProcesses.value"
    @show-multiple="handleShowMultiple" />

  <!-- Estado Minimizado -->
  <div v-else-if="multiLoading.hasActiveProcesses.value && multiLoading.isMinimized.value" class="minimized-overlay">
    <v-card class="minimized-card" @click="handleRestore">
      <v-progress-circular :model-value="multiLoading.overallProgress.value" color="primary" size="40" width="3">
        {{ Math.round(multiLoading.overallProgress.value) }}%
      </v-progress-circular>
      <div class="minimized-info ms-3">
        <div class="text-caption font-weight-medium">
          {{ multiLoading.activeProcesses.value.length }} proceso{{ multiLoading.activeProcesses.value.length !== 1 ?
            's' : '' }}
        </div>
        <div class="text-caption text-medium-emphasis">
          {{ Math.round(multiLoading.overallProgress.value) }}% completado
        </div>
      </div>
      <v-btn icon size="small" variant="text" @click.stop="handleShowMultiple" class="ms-2">
        <v-icon icon="tabler-list" />
      </v-btn>
      <v-icon class="minimize-icon ms-2" icon="tabler-chevron-up" @click.stop="handleRestore" />
    </v-card>
  </div>

  <!-- Lista de Procesos Múltiples -->
  <MultipleProcessList v-if="multiLoading.showProcessList.value" :processes="multiLoading.processes.value"
    @select-process="handleSelectProcess" @remove-process="handleRemoveProcess" @close="handleCloseProcessList" />

  <!-- Notification cuando completa -->
  <v-snackbar v-model="showCompletionNotification" :timeout="5000" color="success" location="top">
    <v-icon start icon="tabler-check" />
    ¡Importación completada exitosamente!
    <template v-slot:actions>
      <v-btn variant="text" @click="showCompletionNotification = false">
        Cerrar
      </v-btn>
    </template>
  </v-snackbar>
</template>

<script setup lang="ts">
import { useMultipleLoading } from '@/composables/useMultipleLoading';
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import LoadingV2Enhanced from './LoadingV2Enhanced.vue';
import MultipleProcessList from './MultipleProcessList-copy.vue';

const multiLoading = useMultipleLoading();
const showCompletionNotification = ref(false);
const progress = computed(() => multiLoading.currentActiveProcess.value?.progress || 0);

const getTitle = () => {
  const process = multiLoading.currentActiveProcess.value;
  if (!process) return 'Sin proceso activo';

  const progressValue = process.progress;
  if (progressValue >= 100) return '¡Importación Completada!';
  if (progressValue === 0) return 'Procesando importación';
  return process.current_action || 'Procesando importación';
};

const getSubtitle = () => {
  const process = multiLoading.currentActiveProcess.value;
  if (!process) return 'Sin proceso activo';

  const progressValue = process.progress;
  if (progressValue >= 100) return '¡El archivo se ha procesado exitosamente!';
  if (progressValue === 0) return 'Iniciando proceso de importación...';
  return `${Math.round(progressValue)}% completado - ${process.current_student}`;
};

const handleCompleted = () => {
  console.log('✅ [MANAGER] Loading completed');
};

const handleMinimize = () => {
  multiLoading.minimize();
};

const handleRestore = () => {
  multiLoading.restore();
};

const handleShowMultiple = () => {
  multiLoading.showProcessListModal();
};

const handleSelectProcess = (batchId: string) => {
  multiLoading.selectProcess(batchId);
};

const handleRemoveProcess = (batchId: string) => {
  multiLoading.removeProcess(batchId);
};

const handleCloseProcessList = () => {
  multiLoading.hideProcessListModal();
};

const setupCallbacks = () => {
  multiLoading.onCompleted((batchId: string) => {
    console.log(`🎉 [MANAGER] ¡IMPORTACIÓN COMPLETADA! Batch: ${batchId}`);

    if (multiLoading.isMinimized.value) {
      showCompletionNotification.value = true;
    }
  });

  multiLoading.onError((batchId: string, error: any) => {
    console.error(`❌ [MANAGER] Error en batch ${batchId}:`, error);
  });

  multiLoading.onProgressUpdated((batchId: string, progress: number) => {
    console.log(`📊 [MANAGER] Progreso: ${progress}% para batch ${batchId}`);
  });
};

onMounted(() => {
  console.log('🚀 [MANAGER] MultipleLoadingManager mounted');
  setupCallbacks();
});

onBeforeUnmount(() => {
  console.log('🧹 [MANAGER] MultipleLoadingManager unmounting');
  multiLoading.cleanup();
});
</script>

<style scoped>
.minimized-overlay {
  position: fixed;
  z-index: 9999;
  bottom: 20px;
  right: 20px;
}

.minimized-card {
  display: flex;
  align-items: center;
  border-radius: 24px;
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 15%);
  cursor: pointer;
  padding: 8px 16px;
  transition: all 0.3s ease;
  min-width: 250px;
}

.minimized-card:hover {
  box-shadow: 0 6px 16px rgba(0, 0, 0, 20%);
  transform: translateY(-3px);
}

.minimize-icon {
  transition: transform 0.3s ease;
}

.minimized-info {
  flex: 1;
}
</style>
