<script lang="ts" setup>
definePage({
  name: "ActivitiesStudent",
  path: "/dashboard/student/activities",
  meta: {
    redirectIfLoggedIn: true,
    requiresAuth: true,
  },
});

import { ref } from 'vue';

// --- 1. MOCK DATA (TAREAS DEL ESTUDIANTE) ---
const pendingActivities = ref([
  {
    id: 1,
    title: "Resolución de Ecuaciones Cuadráticas",
    subject: "Matemáticas",
    teacher: "Prof. Alberto",
    deadline: "2025-10-15T23:59", // Fecha futura
    description: "Resolver los ejercicios de la página 45. Subir foto o PDF.",
    file_types: "PDF, JPG"
  },
  {
    id: 3,
    title: "Mapa Mental: La Célula",
    subject: "Biología",
    teacher: "Prof. Marta",
    deadline: "2025-10-12T10:00", // Fecha muy cercana
    description: "Realizar un mapa mental creativo sobre las partes de la célula.",
    file_types: "Imagen, PDF"
  }
]);

const historyActivities = ref([
  {
    id: 2,
    title: "Ensayo sobre la Guerra Federal",
    subject: "Historia",
    deadline: "2025-09-30",
    status: "graded", // graded, sent
    score: 19,
    feedback: "Excelente redacción, muy buenos argumentos.",
    file_sent: "ensayo_guerra.pdf",
    date_sent: "2025-09-29 15:30"
  },
  {
    id: 4,
    title: "Ejercicios de Inglés: Verbo To Be",
    subject: "Inglés",
    deadline: "2025-10-01",
    status: "sent", // Enviado pero no corregido
    score: null,
    feedback: null,
    file_sent: "homework_1.docx",
    date_sent: "2025-10-01 09:00"
  }
]);

// --- ESTADOS ---
const currentTab = ref('pending'); // 'pending' | 'history'
const showUploadModal = ref(false);
const showFeedbackModal = ref(false);
const loadingUpload = ref(false);
const uploadProgress = ref(0);

const selectedActivity = ref<any>(null);
const fileToUpload = ref<File[]>([]);

// --- FUNCIONES ---

// Abrir modal de subida
const openUploadModal = (activity: any) => {
  selectedActivity.value = activity;
  fileToUpload.value = [];
  uploadProgress.value = 0;
  showUploadModal.value = true;
};

// Simular subida de tarea
const submitHomework = () => {
  if (!fileToUpload.value.length) return;

  loadingUpload.value = true;

  // Simulación de barra de carga
  let progress = 0;
  const interval = setInterval(() => {
    progress += 10;
    uploadProgress.value = progress;
    if (progress >= 100) {
      clearInterval(interval);
      finishUpload();
    }
  }, 200);
};

const finishUpload = () => {
  setTimeout(() => {
    // 1. Mover de Pendientes a Historial
    const newHistoryItem = {
      id: selectedActivity.value.id,
      title: selectedActivity.value.title,
      subject: selectedActivity.value.subject,
      deadline: selectedActivity.value.deadline,
      status: 'sent',
      score: null,
      feedback: null,
      file_sent: fileToUpload.value[0].name,
      date_sent: new Date().toLocaleString()
    };

    historyActivities.value.unshift(newHistoryItem);

    // 2. Eliminar de Pendientes
    pendingActivities.value = pendingActivities.value.filter(a => a.id !== selectedActivity.value.id);

    // 3. Resetear UI
    loadingUpload.value = false;
    showUploadModal.value = false;
    currentTab.value = 'history'; // Cambiar de pestaña automáticamente

    alert("¡Tarea enviada con éxito!"); // O tu toast preferido
  }, 500);
};

// Ver Feedback
const openFeedback = (activity: any) => {
  selectedActivity.value = activity;
  showFeedbackModal.value = true;
};

// Helper: Calcular días restantes
const getTimeRemaining = (deadlineStr: string) => {
  const deadline = new Date(deadlineStr);
  const now = new Date();
  const diffTime = deadline.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return { text: "Vencida", color: "error" };
  if (diffDays === 0) return { text: "Vence Hoy", color: "error" };
  if (diffDays === 1) return { text: "Vence Mañana", color: "warning" };
  return { text: `Vence en ${diffDays} días`, color: "success" };
};

</script>

<template>
  <div>
    <VRow class="mb-2 align-center">
      <VCol cols="12" md="8">
        <h2 class="text-h4 font-weight-bold">🎒 Mis Actividades</h2>
        <p class="text-body-1 text-medium-emphasis">Gestiona tus tareas y visualiza tus calificaciones.</p>
      </VCol>
    </VRow>

    <VTabs v-model="currentTab" class="mb-6">
      <VTab value="pending">
        <VIcon icon="tabler-bell" class="me-2" /> Por Hacer ({{ pendingActivities.length }})
      </VTab>
      <VTab value="history">
        <VIcon icon="tabler-history" class="me-2" /> Historial y Notas
      </VTab>
    </VTabs>

    <VWindow v-model="currentTab">

      <VWindowItem value="pending">
        <VRow v-if="pendingActivities.length > 0">
          <VCol v-for="item in pendingActivities" :key="item.id" cols="12" md="6" lg="4">
            <VCard class="h-100 border card-hover border-start-primary">
              <VCardItem>
                <div class="d-flex justify-space-between align-start mb-2">
                  <VChip size="small" color="primary" variant="tonal">{{ item.subject }}</VChip>
                  <VChip size="small" :color="getTimeRemaining(item.deadline).color" variant="flat">
                    {{ getTimeRemaining(item.deadline).text }}
                  </VChip>
                </div>

                <VCardTitle class="text-h6 mb-1">{{ item.title }}</VCardTitle>
                <div class="text-caption text-disabled mb-3">Asignado por: {{ item.teacher }}</div>

                <p class="text-body-2 mb-0">{{ item.description }}</p>
              </VCardItem>

              <VDivider />

              <VCardActions class="pa-3">
                <div class="text-caption text-medium-emphasis ms-2">
                  <VIcon icon="tabler-file-type-doc" size="14" /> {{ item.file_types }}
                </div>
                <VSpacer />
                <VBtn color="primary" variant="elevated" prepend-icon="tabler-upload" @click="openUploadModal(item)">
                  Entregar Tarea
                </VBtn>
              </VCardActions>
            </VCard>
          </VCol>
        </VRow>

        <div v-else class="text-center pa-10 bg-var-theme-background rounded">
          <VIcon icon="tabler-confetti" size="48" color="success" class="mb-3" />
          <h3 class="text-h6">¡Estás al día!</h3>
          <p>No tienes tareas pendientes por ahora.</p>
        </div>
      </VWindowItem>

      <VWindowItem value="history">
        <VRow>
          <VCol v-for="item in historyActivities" :key="item.id" cols="12">
            <VCard class="border">
              <div class="d-flex flex-wrap align-center pa-4">

                <VAvatar :color="item.status === 'graded' ? 'success' : 'info'" variant="tonal" class="me-4">
                  <VIcon :icon="item.status === 'graded' ? 'tabler-check' : 'tabler-send'" />
                </VAvatar>

                <div class="flex-grow-1">
                  <div class="d-flex align-center gap-2 mb-1">
                    <h4 class="text-subtitle-1 font-weight-bold mb-0">{{ item.title }}</h4>
                    <VChip size="x-small" variant="outlined">{{ item.subject }}</VChip>
                  </div>
                  <div class="text-body-2 text-medium-emphasis">
                    Enviado el: {{ item.date_sent }} • Archivo: {{ item.file_sent }}
                  </div>
                </div>

                <div class="text-end ms-4">
                  <div v-if="item.status === 'graded'">
                    <div class="text-h5 font-weight-bold text-success">{{ item.score }} pts</div>
                    <VBtn size="small" variant="text" color="primary" class="px-0" @click="openFeedback(item)">
                      Ver Corrección
                    </VBtn>
                  </div>
                  <div v-else>
                    <VChip color="info" size="small">Esperando Corrección</VChip>
                  </div>
                </div>

              </div>
            </VCard>
          </VCol>
        </VRow>
      </VWindowItem>
    </VWindow>

    <VDialog v-model="showUploadModal" max-width="500px" persistent>
      <VCard>
        <VCardTitle class="pa-4">Entregar: {{ selectedActivity?.title }}</VCardTitle>
        <VDivider />
        <VCardText class="pa-4">
          <p class="mb-4 text-body-2">Sube tu archivo para completar la actividad.</p>

          <VFileInput label="Seleccionar Archivo" v-model="fileToUpload" prepend-icon="tabler-paperclip"
            variant="outlined" show-size :disabled="loadingUpload" />

          <div v-if="loadingUpload" class="mt-4">
            <div class="d-flex justify-space-between mb-1">
              <span class="text-caption">Subiendo...</span>
              <span class="text-caption font-weight-bold">{{ uploadProgress }}%</span>
            </div>
            <VProgressLinear :model-value="uploadProgress" color="primary" height="6" rounded striped />
          </div>

        </VCardText>
        <VCardActions class="pa-4">
          <VSpacer />
          <VBtn variant="text" color="secondary" @click="showUploadModal = false" :disabled="loadingUpload">Cancelar
          </VBtn>
          <VBtn color="primary" @click="submitHomework" :loading="loadingUpload">Enviar</VBtn>
        </VCardActions>
      </VCard>
    </VDialog>

    <VDialog v-model="showFeedbackModal" max-width="500px">
      <VCard>
        <VCardTitle class="pa-4 bg-success text-white">
          <VIcon icon="tabler-award" class="me-2" /> Calificación
        </VCardTitle>
        <VCardText class="pa-6 text-center">
          <div class="text-h2 font-weight-bold text-primary mb-2">{{ selectedActivity?.score }} / 20</div>
          <p class="text-overline mb-4">Nota Final</p>

          <VAlert color="success" variant="tonal" class="text-start" border="start">
            <strong>Comentario del Profesor:</strong><br>
            "{{ selectedActivity?.feedback }}"
          </VAlert>
        </VCardText>
        <VCardActions class="pa-4">
          <VBtn block variant="elevated" @click="showFeedbackModal = false">Cerrar</VBtn>
        </VCardActions>
      </VCard>
    </VDialog>

  </div>
</template>

<style scoped>
.border-start-primary {
  border-left: 4px solid rgb(var(--v-theme-primary)) !important;
}

.card-hover {
  transition: transform 0.2s;
}

.card-hover:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}
</style>
