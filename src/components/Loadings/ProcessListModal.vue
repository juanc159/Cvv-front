<template>
  <v-dialog v-model="isOpen" max-width="800" persistent>
    <v-card>
      <v-card-title class="d-flex align-center justify-space-between">
        <div class="d-flex align-center">
          <v-icon icon="tabler-list" class="me-2" />
          Procesos de Importación
        </div>
        <v-chip :color="getStatusColor('info')" size="small">
          {{ processes.length }} proceso{{ processes.length !== 1 ? 's' : '' }}
        </v-chip>
      </v-card-title>

      <v-card-text class="pa-0">
        <v-list>
          <v-list-item v-for="process in processes" :key="process.batch_id"
            :class="{ 'bg-primary-lighten-5': process.is_active }" @click="selectProcess(process.batch_id)">
            <template v-slot:prepend>
              <v-avatar :color="getStatusColor(process.status)" size="40">
                <v-icon :icon="getStatusIcon(process.status)" color="white" />
              </v-avatar>
            </template>

            <v-list-item-title class="font-weight-medium">
              {{ process.file_name }}
              <v-chip v-if="process.is_active" color="primary" size="x-small" class="ms-2">
                Activo
              </v-chip>
            </v-list-item-title>

            <v-list-item-subtitle>
              <div class="d-flex align-center mt-1">
                <v-progress-linear :model-value="process.progress" height="4" rounded
                  :color="getStatusColor(process.status)" class="me-2" style="flex: 1;" />
                <span class="text-caption font-weight-bold">
                  {{ Math.round(process.progress) }}%
                </span>
              </div>
              <div class="d-flex justify-space-between align-center mt-1">
                <span class="text-caption">
                  Iniciado: {{ formatTime(process.started_at) }}
                </span>
                <v-chip :color="getConnectionColor(process.connection_status)" size="x-small" variant="outlined">
                  {{ process.connection_status }}
                </v-chip>
              </div>
            </v-list-item-subtitle>

            <template v-slot:append>
              <div class="d-flex flex-column align-center">
                <v-btn v-if="process.status === 'completed'" icon="tabler-trash" size="small" variant="text"
                  color="error" @click.stop="removeProcess(process.batch_id)" />
                <v-btn v-else icon="tabler-eye" size="small" variant="text" color="primary"
                  @click.stop="selectProcess(process.batch_id)" />
              </div>
            </template>
          </v-list-item>
        </v-list>
      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <v-btn variant="text" @click="closeModal">
          Cerrar
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

interface ProcessInfo {
  batch_id: string;
  file_name: string;
  progress: number;
  status: string;
  started_at: string;
  completed_at?: string;
  connection_status: string;
  is_active: boolean;
}

const props = defineProps<{
  processes: ProcessInfo[];
}>();

const emit = defineEmits<{
  selectProcess: [batchId: string];
  removeProcess: [batchId: string];
  close: [];
}>();

const isOpen = ref(true);

const selectProcess = (batchId: string) => {
  emit('selectProcess', batchId);
  closeModal();
};

const removeProcess = (batchId: string) => {
  emit('removeProcess', batchId);
};

const closeModal = () => {
  isOpen.value = false;
  emit('close');
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'active': return 'primary';
    case 'completed': return 'success';
    case 'error': return 'error';
    case 'paused': return 'warning';
    default: return 'secondary';
  }
};

const getStatusIcon = (status: string) => {
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
  return new Date(timestamp).toLocaleTimeString();
};

// Cerrar modal cuando no hay procesos
watch(() => props.processes.length, (newLength) => {
  if (newLength <= 1) {
    closeModal();
  }
});
</script>
