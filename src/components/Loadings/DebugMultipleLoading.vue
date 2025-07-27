<template>
  <v-card class="ma-4">
    <v-card-title>🔧 Debug Multiple Loading</v-card-title>
    <v-card-text>
      <div class="mb-2">
        <strong>Estado actual:</strong>
      </div>
      <div class="text-caption mb-1">
        Procesos totales: {{ multiLoading.processes.value.length }}
      </div>
      <div class="text-caption mb-1">
        Procesos activos: {{ multiLoading.activeProcesses.value.length }}
      </div>
      <div class="text-caption mb-1">
        Proceso actual: {{ multiLoading.currentActiveProcess.value?.batch_id || 'Ninguno' }}
      </div>
      <div class="text-caption mb-1">
        Minimizado: {{ multiLoading.isMinimized.value ? 'Sí' : 'No' }}
      </div>
      <div class="text-caption mb-1">
        Show List: {{ multiLoading.showProcessList.value ? 'Sí' : 'No' }}
      </div>

      <v-divider class="my-3" />

      <div class="mb-2">
        <strong>Acciones de prueba:</strong>
      </div>

      <v-btn size="small" @click="testCreateProcess" class="me-2 mb-2">
        Crear Proceso Test
      </v-btn>

      <v-btn size="small" @click="testShowList" class="me-2 mb-2">
        Mostrar Lista
      </v-btn>

      <v-btn size="small" @click="testRestore" class="me-2 mb-2">
        Restaurar Vista
      </v-btn>

      <v-btn size="small" @click="testMinimize" class="me-2 mb-2">
        Minimizar
      </v-btn>

      <v-btn size="small" @click="testCleanup" class="me-2 mb-2" color="error">
        Limpiar Todo
      </v-btn>

      <v-divider class="my-3" />

      <div class="mb-2">
        <strong>Lista de procesos:</strong>
      </div>

      <div v-if="multiLoading.processes.value.length === 0" class="text-caption text-medium-emphasis">
        No hay procesos
      </div>

      <div v-for="process in multiLoading.processes.value" :key="process.batch_id" class="text-caption mb-1">
        📄 {{ process.file_name }} - {{ process.progress }}% - {{ process.status }}
        <v-chip size="x-small" :color="process.is_active ? 'primary' : 'secondary'" class="ms-1">
          {{ process.is_active ? 'Activo' : 'Inactivo' }}
        </v-chip>
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { useMultipleLoading } from '@/composables/useMultipleLoading';
import { computed } from 'vue';

const multiLoading = useMultipleLoading();

const isDev = computed(() => {
  return import.meta.env.DEV || import.meta.env.MODE === 'development'
});

let testCounter = 1;

const testCreateProcess = () => {
  const batchId = `test-batch-${Date.now()}`;
  const fileName = `archivo-test-${testCounter}.xlsx`;

  console.log(`🧪 [DEBUG] Creando proceso test: ${batchId}`);

  const success = multiLoading.startLoading(batchId, fileName);

  if (success) {
    console.log(`✅ [DEBUG] Proceso creado exitosamente`);
    console.log(`📊 [DEBUG] Estado después de crear:`, {
      hasActiveProcesses: multiLoading.hasActiveProcesses.value,
      isMinimized: multiLoading.isMinimized.value,
      currentActive: multiLoading.currentActiveProcess.value?.batch_id,
      totalProcesses: multiLoading.processes.value.length
    });
  } else {
    console.error(`❌ [DEBUG] Error creando proceso`);
  }

  testCounter++;
};

const testShowList = () => {
  console.log(`📋 [DEBUG] Mostrando lista de procesos`);
  multiLoading.showProcessListModal();
};

const testRestore = () => {
  console.log(`📤 [DEBUG] Restaurando vista`);
  multiLoading.restore();
};

const testMinimize = () => {
  console.log(`📦 [DEBUG] Minimizando vista`);
  multiLoading.minimize();
};

const testCleanup = () => {
  console.log(`🧹 [DEBUG] Limpiando todo`);
  multiLoading.cleanup();
  testCounter = 1;
};
</script>
