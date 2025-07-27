<template>
  <!-- Loading Principal -->
  <LoadingV2Enhanced v-if="globalLoading.isLoading.value && !globalLoading.isMinimized.value" :is-loading="true"
    :progress="globalLoading.currentProgress.value" :title="title" :subtitle="subtitle" @minimized="handleMinimize"
    @completed="handleCompleted" :show-multiple-button="globalLoading.hasMultipleProcesses.value"
    @show-multiple="handleShowMultiple" :debug-data="globalLoading.debugInfo.value" />

  <!-- Estado Minimizado -->
  <div v-else-if="globalLoading.isLoading.value && globalLoading.isMinimized.value" class="minimized-overlay">
    <v-card class="minimized-card" @click="handleRestore">
      <v-progress-circular :model-value="globalLoading.currentProgress.value" color="primary" size="40" width="3">
        {{ Math.round(globalLoading.currentProgress.value) }}%
      </v-progress-circular>
      <div class="minimized-info ms-3">
        <div class="text-caption font-weight-medium">
          {{ globalLoading.activeProcesses.value.length }} activo{{ globalLoading.activeProcesses.value.length !== 1 ?
            's' : '' }}
          {{ globalLoading.queuedProcesses.value.length > 0 ? `, ${globalLoading.queuedProcesses.value.length} en cola`
          : '' }}
        </div>
        <div class="text-caption text-medium-emphasis">
          {{ Math.round(globalLoading.currentProgress.value) }}% completado
        </div>
      </div>
      <v-btn icon size="small" variant="text" @click.stop="handleShowMultiple" class="ms-2">
        <v-icon icon="tabler-list" />
      </v-btn>
      <v-icon class="minimize-icon ms-2" icon="tabler-chevron-up" @click.stop="handleRestore" />
    </v-card>
  </div>

  <!-- Lista de Procesos -->
  <ProcessListModal v-if="globalLoading.showProcessList.value" :all-processes="globalLoading.allProcesses.value"
    :active-processes="globalLoading.activeProcesses.value"
    :completed-processes="globalLoading.completedProcesses.value"
    :queued-processes="globalLoading.queuedProcesses.value" :sorted-processes="globalLoading.sortedProcesses.value"
    @remove-process="handleRemoveProcess" @clear-completed="handleClearCompleted" @close="handleCloseProcessList" />

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
import { useGlobalLoading } from '@/composables/useGlobalLoading';
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import LoadingV2Enhanced from './LoadingV2Enhanced.vue';
import ProcessListModal from './ProcessListModal.vue';

const globalLoading = useGlobalLoading();
const showCompletionNotification = ref(false);
const progress = computed(() => globalLoading.currentProgress.value);

const title = computed(() => {
  const process = globalLoading.currentProcess.value;
  const progress = globalLoading.currentProgress.value;

  if (!process) return 'Sin proceso activo';
  if (progress >= 100) return '¡Importación Completada!';
  if (progress === 0) return 'Procesando importación';
  return process.current_action || 'Procesando importación';
});

const subtitle = computed(() => {
  const process = globalLoading.currentProcess.value;
  const progress = globalLoading.currentProgress.value;

  if (!process) return 'Sin proceso activo';
  if (progress >= 100) return '¡El archivo se ha procesado exitosamente!';
  if (progress === 0) return 'Iniciando proceso de importación...';

  let subtitle = `${Math.round(progress)}% completado - ${process.current_student}`;

  // ✅ AGREGAR INFO DE COLA SI HAY PROCESOS PENDIENTES
  if (globalLoading.queuedProcesses.value.length > 0) {
    subtitle += ` • ${globalLoading.queuedProcesses.value.length} en cola`;
  }

  return subtitle;
});

const handleCompleted = () => {
  console.log('✅ [MANAGER] Loading completed');
};

const handleMinimize = () => {
  globalLoading.minimize();
};

const handleRestore = () => {
  globalLoading.restore();
};

const handleShowMultiple = () => {
  globalLoading.showProcessListModal();
};

const handleRemoveProcess = (batchId: string) => {
  globalLoading.removeProcess(batchId);
};

// ✅ NUEVA FUNCIÓN PARA LIMPIAR COMPLETADOS
const handleClearCompleted = () => {
  globalLoading.clearCompletedProcesses();
};

const handleCloseProcessList = () => {
  globalLoading.hideProcessListModal();
};

const setupCallbacks = () => {
  globalLoading.onCompleted((batchId: string) => {
    console.log(`🎉 [MANAGER] ¡IMPORTACIÓN COMPLETADA! Batch: ${batchId}`);

    if (globalLoading.isMinimized.value) {
      showCompletionNotification.value = true;
    }
  });

  globalLoading.onError((batchId: string, error: any) => {
    console.error(`❌ [MANAGER] Error en batch ${batchId}:`, error);
  });

  globalLoading.onProgressUpdated((batchId: string, progress: number) => {
    console.log(`📊 [MANAGER] Progreso: ${progress}% para batch ${batchId}`);
  });
};

onMounted(() => {
  console.log('🚀 [MANAGER] GlobalLoadingManager mounted');
  setupCallbacks();
});

onBeforeUnmount(() => {
  console.log('🧹 [MANAGER] GlobalLoadingManager unmounting');
  globalLoading.cleanup();
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
