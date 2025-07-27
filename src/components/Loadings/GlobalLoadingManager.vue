<template>
  <!-- ✅ SIMPLIFICADO: Solo mostrar si está cargando -->
  <LoadingV2Enhanced v-if="globalLoading.isLoading.value" :is-loading="true"
    :progress="globalLoading.currentProgress.value" :title="title" :subtitle="subtitle" @minimized="handleMinimize"
    @completed="handleCompleted" />

  <!-- Debug Panel Simple -->
  <div v-if="isDevelopment" class="debug-panel">
    <v-card class="debug-card" elevation="8">
      <v-card-title class="text-caption">🔧 Debug Loading</v-card-title>
      <v-card-text class="pa-2">
        <div class="text-caption">
          <strong>isLoading:</strong> {{ globalLoading.isLoading.value ? 'SÍ' : 'NO' }}
        </div>
        <div class="text-caption">
          <strong>isMinimized:</strong> {{ globalLoading.isMinimized.value ? 'SÍ' : 'NO' }}
        </div>
        <div class="text-caption">
          <strong>Progreso:</strong> {{ globalLoading.currentProgress.value }}%
        </div>
        <div class="text-caption">
          <strong>Batch:</strong> {{ globalLoading.currentProcess.value?.batch_id || 'Ninguno' }}
        </div>
        <div class="text-caption">
          <strong>Estado:</strong> {{ globalLoading.currentProcess.value?.status || 'Ninguno' }}
        </div>
        <div class="text-caption">
          <strong>Callbacks:</strong> {{ callbacksConfigured ? 'SÍ' : 'NO' }}
        </div>
        <div class="mt-2">
          <v-btn size="small" @click="forceShow">Forzar Mostrar</v-btn>
          <v-btn size="small" @click="forceHide" class="ml-1">Forzar Ocultar</v-btn>
          <v-btn size="small" @click="testProgress" class="ml-1">Test Progress</v-btn>
        </div>
      </v-card-text>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import { useGlobalLoading } from '@/composables/useGlobalLoading';
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
const globalLoading = useGlobalLoading();
const { toast } = useToast();
const callbacksConfigured = ref(false);

const isDevelopment = computed(() => {
  return import.meta.env.DEV || import.meta.env.MODE === 'development'
});

const title = computed(() => {
  const process = globalLoading.currentProcess.value;
  const progress = globalLoading.currentProgress.value;

  if (!process) return 'Cargando...';
  if (progress >= 100) return '¡Importación Completada!';
  if (progress === 0) return 'Iniciando importación...';
  return process.current_action || 'Procesando importación';
});

const subtitle = computed(() => {
  const process = globalLoading.currentProcess.value;
  const progress = globalLoading.currentProgress.value;

  if (!process) return 'Preparando...';
  if (progress >= 100) return '¡El archivo se ha procesado exitosamente!';
  if (progress === 0) return 'Iniciando proceso de importación...';
  return `${Math.round(progress)}% completado - ${process.current_student}`;
});

const handleCompleted = () => {
  console.log('✅ [MANAGER] Loading completed');
};

const handleMinimize = () => {
  console.log('📦 [MANAGER] Minimizando...');
  globalLoading.minimize();
};

// ✅ FUNCIONES DE DEBUG
const forceShow = () => {
  console.log('🔧 [DEBUG] Forzando mostrar modal');
  globalLoading.isLoading.value = true;
  globalLoading.isMinimized.value = false;

  // Crear proceso fake si no existe
  if (!globalLoading.currentProcess.value) {
    globalLoading.currentProcess.value = {
      batch_id: 'debug-test',
      progress: 50,
      current_student: 'Estudiante de prueba',
      current_action: 'Procesando datos de prueba',
      status: 'active'
    };
  }
};

const forceHide = () => {
  console.log('🔧 [DEBUG] Forzando ocultar modal');
  globalLoading.stopLoading();
};

const testProgress = () => {
  console.log('🔧 [DEBUG] Simulando progreso...');
  forceShow();

  let progress = 0;
  const interval = setInterval(() => {
    progress += 10;
    if (globalLoading.currentProcess.value) {
      globalLoading.currentProcess.value.progress = progress;
      globalLoading.currentProcess.value.current_student = `Estudiante ${progress}%`;
      globalLoading.currentProcess.value.current_action = `Procesando ${progress}%`;
    }

    if (progress >= 100) {
      clearInterval(interval);
      setTimeout(() => {
        globalLoading.stopLoading();
      }, 2000);
    }
  }, 500);
};

onMounted(() => {
  console.log('🚀 [MANAGER] GlobalLoadingManager mounted');
  console.log('🔧 [MANAGER] Estado inicial:', {
    isLoading: globalLoading.isLoading.value,
    isMinimized: globalLoading.isMinimized.value,
    currentProcess: globalLoading.currentProcess.value
  });

  // ✅ CONFIGURAR CALLBACKS INMEDIATAMENTE AL MONTAR
  setupCallbacks();
  callbacksConfigured.value = true;
});

onBeforeUnmount(() => {
  console.log('🧹 [MANAGER] GlobalLoadingManager unmounting');
  globalLoading.cleanup();
});

// ✅ CONFIGURAR CALLBACKS EN EL MANAGER, NO EN LA PÁGINA
const setupCallbacks = () => {
  console.log('🔧 [MANAGER] Configurando callbacks...');

  globalLoading.onCompleted((batchId: string) => {
    console.log(`🎉 [MANAGER] ¡IMPORTACIÓN COMPLETADA! Batch: ${batchId}`);
    toast("¡Importación completada exitosamente!", "", "success");

    // Auto-cerrar después de 3 segundos
    setTimeout(() => {
      globalLoading.stopLoading();
    }, 3000);
  });

  globalLoading.onError((batchId: string, error: any) => {
    console.error(`❌ [MANAGER] Error en batch ${batchId}:`, error);
    toast("Error durante la importación", "", "danger");
  });

  globalLoading.onProgressUpdated((batchId: string, progress: number) => {
    console.log(`📊 [MANAGER] Progreso: ${progress}% para batch ${batchId}`);
  });

  console.log('✅ [MANAGER] Callbacks configurados correctamente');
};
</script>

<style scoped>
.debug-panel {
  position: fixed;
  bottom: 20px;
  left: 20px;
  z-index: 10000;
}

.debug-card {
  min-width: 200px;
  backdrop-filter: blur(10px);
  background: rgba(255, 255, 255, 0.9);
}

.v-theme--dark .debug-card {
  background: rgba(30, 30, 30, 0.9);
}
</style>
