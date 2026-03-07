<script setup lang="ts">
import { useAxios } from '@/composables/useAxios';
import { useToast } from '@/composables/useToast';
import { computed } from 'vue';

definePage({
  name: "ActivitiesStudent",
  path: "/dashboard/student/activities",
  meta: {
    redirectIfLoggedIn: true,
    requiresAuth: true,
  },
});

import { ref } from 'vue';
import { useRouter } from 'vue-router';

const loading = ref(false)
const allActivities = ref<any[]>([])
const tab = ref('pending')

// --- COMPUTED PROPERTIES ---
const pendingActivities = computed(() => {
  // "Por Hacer": No están revisadas (004) Y no están vencidas.
  return allActivities.value.filter(act =>
    act.submission_status !== 'ACTIVITY_SUBMISSION_STATUS_004' && !act.is_overdue
  );
});

const historyActivities = computed(() => {
  // "Historial": Están revisadas (004) O están vencidas.
  return allActivities.value.filter(act =>
    act.submission_status === 'ACTIVITY_SUBMISSION_STATUS_004' || act.is_overdue
  );
});

const router = useRouter();
const { toast } = useToast();

const fetchActivities = async () => {
  loading.value = true
  try {
    const { data, response } = await useAxios("/activity/pending").get();
    if (response.status === 200 && data.code === 200) {
      allActivities.value = data.data
    }
  } catch (e) {
    console.error(e)
    toast('Error al cargar actividades', '', 'danger')
  } finally {
    loading.value = false
  }
};

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

    // historyActivities.value.unshift(newHistoryItem); // Esto se manejará con la data real

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

const goToSubmission = (activityId: number | string) => {
  router.push({ name: 'ActivitySubmission', params: { id: activityId } });
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
        <VIcon start icon="tabler-bell" /> Por Hacer
        <VChip size="small" color="primary" class="ms-2">{{ pendingActivities.length }}</VChip>
      </VTab>
      <VTab value="history">
        <VIcon start icon="tabler-history" /> Historial
        <VChip size="small" color="primary" class="ms-2">{{ historyActivities.length }}</VChip>
      </VTab>
    </VTabs>

    <VWindow v-model="currentTab">

      <VWindowItem value="pending">
        <div v-if="loading" class="d-flex justify-center py-10">
          <VProgressCircular indeterminate color="primary" size="64" />
        </div>

        <div v-else-if="pendingActivities.length === 0" class="text-center py-10">
          <VIcon icon="tabler-clipboard-check" size="64" color="success" class="mb-4" />
          <h3 class="text-h5">¡Estás al día!</h3>
          <p class="text-body-1 text-medium-emphasis mt-2">No tienes tareas pendientes.</p>
        </div>

        <VRow v-else>
          <VCol v-for="item in pendingActivities" :key="item.id" cols="12" md="6">
            <VCard class="activity-card h-100 d-flex flex-column" elevation="2">

              <div class="status-border" :class="`bg-${item.status_color}`"></div>

              <VCardText class="flex-grow-1">
                <div class="d-flex justify-space-between align-start mb-2">
                  <VChip size="small" color="primary" variant="tonal" class="font-weight-bold">
                    {{ item.subject?.name }}
                  </VChip>

                  <VChip size="small" :color="item.submission_status_color" variant="flat">
                    {{ item.submission_status_description }}
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

                  <div class="text-body-2 text-truncate-2 mb-4" v-html="item.description"></div>

                  <VDivider class="mb-3" />

                  <div class="d-flex align-center text-caption mb-4">
                    <VIcon icon="tabler-calendar-time" size="16" class="me-2" />
                    <span class="font-weight-medium">Vence: </span>
                    <span class="ms-1">
                      {{ item.deadline_at || 'Sin fecha' }}
                    </span>
                  </div>
              </VCardText>

              <VCardActions class="pa-4 pt-0">
                <VBtn block color="warning" variant="flat" prepend-icon="tabler-upload"
                  @click="goToSubmission(item.id)">
                  Entregar Tarea
                </VBtn>
              </VCardActions>
            </VCard>
          </VCol>
        </VRow>

        <!-- <div v-else class="text-center pa-10 bg-var-theme-background rounded">
          <VIcon icon="tabler-confetti" size="48" color="success" class="mb-3" />
          <h3 class="text-h6">¡Estás al día!</h3>
          <p>No tienes tareas pendientes por ahora.</p>
        </div> -->
      </VWindowItem>

      <VWindowItem value="history">
        <div v-if="loading" class="d-flex justify-center py-10">
          <VProgressCircular indeterminate color="primary" size="64" />
        </div>

        <div v-else-if="historyActivities.length === 0" class="text-center py-10">
          <VIcon icon="tabler-history-off" size="64" color="grey-lighten-1" class="mb-4" />
          <h3 class="text-h5">Sin historial</h3>
          <p class="text-body-1 text-medium-emphasis mt-2">Aún no tienes actividades finalizadas.</p>
        </div>

        <VRow v-else>
          <VCol v-for="item in historyActivities" :key="`hist-${item.id}`" cols="12" md="6">
            <VCard class="activity-card h-100 d-flex flex-column" elevation="2">

              <div class="status-border" :class="`bg-${item.submission_status_color}`"></div>

              <VCardText class="flex-grow-1">
                <div class="d-flex justify-space-between align-start mb-2">
                  <VChip size="small" color="primary" variant="tonal" class="font-weight-bold">
                    {{ item.subject?.name }}
                  </VChip>

                  <VChip size="small" :color="item.submission_status_color" variant="flat">
                    {{ item.submission_status_description }}
                  </VChip>
                </div>

                <h3 class="text-h6 font-weight-bold mb-1">{{ item.title }}</h3>

                <div class="d-flex align-center text-caption text-medium-emphasis mb-3">
                  <VIcon icon="tabler-user" size="14" class="me-1" />
                  <span>Prof. {{ item.teacher?.full_name }}</span>
                </div>

                <div class="text-body-2 text-truncate-2 mb-4" v-html="item.description"></div>

                <VDivider class="mb-3" />

                <div class="d-flex align-center text-caption mb-4">
                  <VIcon icon="tabler-calendar-time" size="16" class="me-2" />
                  <span class="font-weight-medium">Vence: </span>
                  <span class="ms-1">{{ item.deadline_at || 'Sin fecha' }}</span>
                </div>
              </VCardText>

              <VCardActions class="pa-4 pt-0">
                <VBtn block color="info" variant="tonal" prepend-icon="tabler-eye" @click="goToSubmission(item.id)">
                  Visualizar Entrega
                </VBtn>
              </VCardActions>
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
