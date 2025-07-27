<script setup lang="ts">
import { computed } from 'vue';

interface ProcessInfo {
  batch_id: string;
  file_name: string;
  progress: number;
  status: 'active' | 'completed' | 'error' | 'paused';
  started_at: string;
  completed_at?: string;
  connection_status: string;
  is_active: boolean;
  details?: {
    current_student: string;
    processed_records: number;
    total_records: number;
    sheet: number;
    last_update: string;
  };
}

const props = defineProps<{
  processes: ProcessInfo[];
}>();

const emit = defineEmits<{
  selectProcess: [batchId: string];
  removeProcess: [batchId: string];
}>();

// Computed properties
const allProcesses = computed(() => props.processes);

const activeProcesses = computed(() =>
  props.processes.filter(p => p.status === 'active')
);

const completedProcesses = computed(() =>
  props.processes.filter(p => p.status === 'completed')
);

const totalProcesses = computed(() => props.processes.length);

const overallProgress = computed(() => {
  if (props.processes.length === 0) return 0;

  const totalProgress = props.processes.reduce((sum, process) => sum + process.progress, 0);
  return totalProgress / props.processes.length;
});

// Helper functions
const getOverallStatusColor = () => {
  if (activeProcesses.value.length === 0) return 'success';
  if (activeProcesses.value.some(p => p.status === 'error')) return 'error';
  return 'primary';
};

const getProcessStatusColor = (status: string) => {
  switch (status) {
    case 'active': return 'primary';
    case 'completed': return 'success';
    case 'error': return 'error';
    case 'paused': return 'warning';
    default: return 'secondary';
  }
};

const getProcessStatusIcon = (status: string) => {
  switch (status) {
    case 'active': return 'tabler-loader';
    case 'completed': return 'tabler-check';
    case 'error': return 'tabler-x';
    case 'paused': return 'tabler-pause';
    default: return 'tabler-clock';
  }
};

const getConnectionColor = (status: string) => {
  switch (status) {
    case 'connected': return 'success';
    case 'connecting': return 'warning';
    case 'reconnecting': return 'info';
    case 'error': return 'error';
    default: return 'secondary';
  }
};

const formatTime = (timestamp: string) => {
  return new Date(timestamp).toLocaleString();
};
</script>
<template>
  <div class="multi-progress-container">
    <!-- Header con resumen -->
    <v-card class="mb-4" elevation="2">
      <v-card-title class="d-flex align-center justify-space-between">
        <div class="d-flex align-center">
          <v-icon icon="tabler-list-check" class="me-2" />
          Procesos de Importación
        </div>
        <v-chip :color="getOverallStatusColor()" size="small">
          {{ activeProcesses.length }} activo{{ activeProcesses.length !== 1 ? 's' : '' }}
        </v-chip>
      </v-card-title>

      <v-card-text v-if="activeProcesses.length > 0">
        <!-- Progreso general -->
        <div class="mb-4">
          <div class="d-flex justify-space-between align-center mb-2">
            <span class="text-body-2 font-weight-medium">Progreso General</span>
            <span class="text-body-2 font-weight-bold">{{ Math.round(overallProgress) }}%</span>
          </div>
          <v-progress-linear :model-value="overallProgress" height="8" rounded color="primary" class="mb-2" />
          <div class="text-caption text-medium-emphasis">
            {{ completedProcesses.length }} de {{ totalProcesses }} procesos completados
          </div>
        </div>
      </v-card-text>
    </v-card>

    <!-- Lista de procesos individuales -->
    <div class="process-list">
      <v-card v-for="process in allProcesses" :key="process.batch_id" class="mb-3"
        :class="{ 'process-active': process.is_active, 'process-completed': process.status === 'completed' }"
        elevation="1">
        <v-card-text class="pa-4">
          <!-- Header del proceso -->
          <div class="d-flex align-center justify-space-between mb-3">
            <div class="d-flex align-center">
              <v-avatar :color="getProcessStatusColor(process.status)" size="32" class="me-3">
                <v-icon :icon="getProcessStatusIcon(process.status)" color="white" size="16" />
              </v-avatar>
              <div>
                <div class="text-body-1 font-weight-medium">
                  {{ process.file_name }}
                  <v-chip v-if="process.is_active" color="primary" size="x-small" class="ms-2">
                    Activo
                  </v-chip>
                </div>
                <div class="text-caption text-medium-emphasis">
                  Iniciado: {{ formatTime(process.started_at) }}
                  <span v-if="process.completed_at" class="ms-2">
                    • Completado: {{ formatTime(process.completed_at) }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Acciones -->
            <div class="d-flex align-center">
              <v-chip :color="getConnectionColor(process.connection_status)" size="x-small" variant="outlined"
                class="me-2">
                {{ process.connection_status }}
              </v-chip>

              <v-btn v-if="process.status === 'completed'" icon="tabler-trash" size="small" variant="text" color="error"
                @click="$emit('remove-process', process.batch_id)" />
              <v-btn v-else-if="!process.is_active" icon="tabler-eye" size="small" variant="text" color="primary"
                @click="$emit('select-process', process.batch_id)" />
            </div>
          </div>

          <!-- Barra de progreso del proceso -->
          <div class="mb-3">
            <div class="d-flex justify-space-between align-center mb-2">
              <span class="text-body-2">Progreso del archivo</span>
              <span class="text-body-2 font-weight-bold">{{ Math.round(process.progress) }}%</span>
            </div>
            <v-progress-linear :model-value="process.progress" height="6" rounded
              :color="getProcessStatusColor(process.status)" class="mb-1" />
          </div>

          <!-- Detalles del progreso (solo para procesos activos) -->
          <div v-if="process.is_active && process.details" class="process-details">
            <v-divider class="mb-3" />

            <div class="d-flex justify-space-between text-caption mb-2">
              <span>Estudiante actual:</span>
              <span class="font-weight-medium">{{ process.details.current_student }}</span>
            </div>

            <div class="d-flex justify-space-between text-caption mb-2">
              <span>Registros procesados:</span>
              <span class="font-weight-medium">
                {{ process.details.processed_records || 0 }} / {{ process.details.total_records || 0 }}
              </span>
            </div>

            <div class="d-flex justify-space-between text-caption mb-2">
              <span>Hoja actual:</span>
              <span class="font-weight-medium">{{ process.details.sheet || 0 }}</span>
            </div>

            <div class="d-flex justify-space-between text-caption">
              <span>Última actualización:</span>
              <span class="font-weight-medium">{{ process.details.last_update || 'Nunca' }}</span>
            </div>
          </div>

          <!-- Mensaje de estado -->
          <div v-if="process.status === 'completed'" class="mt-3">
            <v-alert type="success" density="compact" variant="tonal">
              <v-icon start icon="tabler-check" />
              Importación completada exitosamente
            </v-alert>
          </div>

          <div v-else-if="process.status === 'error'" class="mt-3">
            <v-alert type="error" density="compact" variant="tonal">
              <v-icon start icon="tabler-x" />
              Error durante la importación
            </v-alert>
          </div>
        </v-card-text>
      </v-card>
    </div>

    <!-- Mensaje cuando no hay procesos -->
    <v-card v-if="allProcesses.length === 0" class="text-center pa-8" variant="outlined">
      <v-icon icon="tabler-file-upload" size="64" class="mb-4 text-medium-emphasis" />
      <h3 class="text-h6 mb-2">No hay procesos activos</h3>
      <p class="text-body-2 text-medium-emphasis">
        Los procesos de importación aparecerán aquí cuando inicies una carga de archivos.
      </p>
    </v-card>
  </div>
</template>


<style scoped>
.multi-progress-container {
  max-width: 800px;
  margin: 0 auto;
}

.process-active {
  border-left: 4px solid rgb(var(--v-theme-primary));
  background: rgba(var(--v-theme-primary), 0.05);
}

.process-completed {
  border-left: 4px solid rgb(var(--v-theme-success));
  background: rgba(var(--v-theme-success), 0.05);
}

.process-details {
  background: rgba(var(--v-theme-surface), 0.5);
  border-radius: 8px;
  padding: 12px;
}
</style>
