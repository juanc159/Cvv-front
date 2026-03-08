<script setup lang="ts">
import { useToast } from '@/composables/useToast';

const emits = defineEmits(['evaluated']); // Para avisarle al padre que recargue la tabla

const { toast } = useToast();

// Estados
const isModalOpen = ref(false);
const isLoadingHistory = ref(false);
const reviewing = ref(false);
const activeTab = ref<string | number>('');

// Datos
const selectedStudent = ref<any>(null);
const activityId = ref<string | number>('');
const history = ref<any[]>([]);

// Referencias
const refModalQuestion = ref();

// Utilidad
const storageBack = (path: string) => {
  if (!path) return '';
  return `${import.meta.env.VITE_API_BASE_URL}/storage/${path}`;
}

// --- MÉTODO PÚBLICO PARA ABRIR EL MODAL ---
const openModal = async (studentData: any, actId: string | number) => {
  selectedStudent.value = studentData;
  activityId.value = actId;
  isModalOpen.value = true;
  history.value = []; // Limpiamos historial previo

  await fetchHistory();
};

const closeModal = () => {
  isModalOpen.value = false;
  setTimeout(() => {
    selectedStudent.value = null;
    history.value = [];
    activeTab.value = '';
  }, 300);
};

// --- API: CARGAR HISTORIAL (Bajo demanda) ---
const fetchHistory = async () => {
  isLoadingHistory.value = true;
  try {
    const { data, response } = await useAxios(`/teacher/activities/${activityId.value}/students/${selectedStudent.value.id}/history`).get();

    if (response.status === 200 && data.code === 200) {
      history.value = data.data;
      // Seleccionar automáticamente la pestaña del intento más reciente (el primero del array)
      if (history.value.length > 0) {
        activeTab.value = history.value[0].id;
      }
    } else {
      toast('Error al cargar el historial', '', 'danger');
    }
  } catch (error) {
    console.error(error);
    toast('Error de conexión', '', 'danger');
  } finally {
    isLoadingHistory.value = false;
  }
};

// --- ACCIONES DE EVALUACIÓN ---
const confirmChangeStatus = (newStatus: string) => {
  if (refModalQuestion.value) {
    const isApproved = newStatus === 'ACTIVITY_SUBMISSION_STATUS_004';
    refModalQuestion.value.componentData.title = isApproved ? "¿Aprobar entrega?" : "¿Devolver entrega?";
    refModalQuestion.value.componentData.subTitle = isApproved
      ? "El alumno ya no podrá modificar esta entrega."
      : "El alumno deberá realizar correcciones.";
    refModalQuestion.value.componentData.btnSuccessText = isApproved ? "Sí, Aprobar" : "Sí, Devolver";
    refModalQuestion.value.componentData.btnSuccessIcon = isApproved ? "tabler-check" : "tabler-arrow-back-up";
    refModalQuestion.value.openModal(newStatus);
  }
};

const changeStatus = async (newStatus: string) => {
  // Necesitamos el ID del último intento para actualizarlo
  const latestSubmissionId = history.value[0]?.id;
  if (!latestSubmissionId) return;

  reviewing.value = true;
  try {
    const payload = { status: newStatus };
    const { data, response } = await useAxios(`/teacher/submissions/${latestSubmissionId}/status`).put(payload);

    if (response.status === 200 && data.code === 200) {
      toast(data.message || 'Evaluación guardada', '', 'success');
      emits('evaluated'); // Avisamos al componente padre
      closeModal();
    } else {
      toast(data.message || 'Error al guardar', '', 'danger');
    }
  } catch (error: any) {
    toast(error.response?.data?.message || 'Ocurrió un error', '', 'danger');
  } finally {
    reviewing.value = false;
  }
};

// Exponemos el método para que el padre lo pueda llamar
defineExpose({ openModal });
</script>

<template>
  <VDialog v-model="isModalOpen" max-width="100rem" persistent scrollable>
    <DialogCloseBtn @click="closeModal()" />

    <VCard v-if="selectedStudent" class="h-100 d-flex flex-column">

      <div>
        <VToolbar color="primary">
          <VToolbarTitle>Respuestas y comentarios</VToolbarTitle>
        </VToolbar>
      </div>

      <VCardItem class="pa-4 bg-grey-lighten-4 border-b">
        <div class="d-flex align-center justify-space-between w-100">
          <div class="d-flex align-center">
            <VAvatar size="48" color="primary" variant="tonal" class="me-3">
              <VImg v-if="selectedStudent.avatar" :src="storageBack(selectedStudent.avatar)" />
              <span v-else class="text-h6 font-weight-bold">{{ selectedStudent.initials }}</span>
            </VAvatar>
            <div>
              <h2 class="text-h6 font-weight-bold mb-0">{{ selectedStudent.student_name }}</h2>
              <VChip size="x-small" :color="selectedStudent.status_color" variant="flat">
                Estado Actual: {{ selectedStudent.status_label }}
              </VChip>
            </div>
          </div>
        </div>
      </VCardItem>

      <div v-if="isLoadingHistory" class="d-flex flex-column align-center justify-center py-10"
        style="min-height: 400px;">
        <VProgressCircular indeterminate color="primary" size="48" class="mb-3" />
        <span class="text-medium-emphasis">Cargando historial de entregas...</span>
      </div>

      <template v-else-if="history.length > 0">
        <VTabs v-model="activeTab" bg-color="white" color="primary" class="border-b px-4">
          <VTab v-for="attempt in history" :key="attempt.id" :value="attempt.id">
            <VIcon start icon="tabler-file-upload" size="18" />
            Intento #{{ attempt.attempt_number }}
          </VTab>
        </VTabs>

        <VCardText class="pa-0 bg-grey-50" style="height: 60vh;">
          <VWindow v-model="activeTab">
            <VWindowItem v-for="attempt in history" :key="attempt.id" :value="attempt.id">
              <div class="pa-6">
                <VRow>
                  <VCol cols="12" md="6">
                    <VCard variant="flat" class="border h-100">
                      <VCardItem class="bg-white border-b py-3">
                        <VCardTitle class="text-subtitle-1">Datos Enviados</VCardTitle>
                        <VCardSubtitle>Enviado el: {{ attempt.submitted_at }}</VCardSubtitle>
                      </VCardItem>
                      <VCardText class="pa-4 bg-white">
                        <div v-if="attempt.comments" class="text-body-2 mb-4 pa-3 bg-grey-50 rounded border">
                          {{ attempt.comments }}
                        </div>
                        <div v-if="attempt.links && attempt.links.length > 0">
                          <div class="text-caption font-weight-bold mb-2">
                            <VIcon icon="tabler-link" size="14" /> Enlaces:
                          </div>
                          <div class="d-flex flex-column gap-2">
                            <VChip v-for="(link, i) in attempt.links" :key="i" :href="link" target="_blank"
                              color="primary" variant="tonal" link>
                              Enlace {{ i + 1 }}
                            </VChip>
                          </div>
                        </div>
                        <div v-if="!attempt.comments && (!attempt.links || attempt.links.length === 0)"
                          class="text-caption text-medium-emphasis italic">
                          El alumno no adjuntó texto ni enlaces.
                        </div>
                      </VCardText>
                    </VCard>
                  </VCol>

                  <VCol cols="12" md="6">
                    <VCard variant="flat" class="border h-100 d-flex flex-column">
                      <VCardItem class="bg-primary text-white py-3">
                        <VCardTitle class="text-subtitle-1 text-white">
                          <VIcon start icon="tabler-message-circle" color="white" />
                          Feedback del Intento #{{ attempt.attempt_number }}
                        </VCardTitle>
                      </VCardItem>
                      <VCardText class="pa-0 flex-grow-1">
                        <TimelineFeed v-if="attempt.id" :record-id="attempt.id.toString()"
                          record-type="App\Models\ActivitySubmission" :allow-internal="false" :allow-files="false" />
                      </VCardText>
                    </VCard>
                  </VCol>
                </VRow>
              </div>
            </VWindowItem>
          </VWindow>
        </VCardText>

        <VCardActions class="pa-4 border-t bg-white d-flex justify-end">

          <div v-if="selectedStudent.status === 'ACTIVITY_SUBMISSION_STATUS_001'"
            class="text-center w-100 text-warning font-weight-bold">
            <VIcon start icon="tabler-pencil" /> El alumno aún está editando un borrador. Espera a que entregue la
            tarea.
          </div>

          <div v-else-if="selectedStudent.status !== 'ACTIVITY_SUBMISSION_STATUS_004' && activeTab === history[0]?.id"
            class="d-flex gap-3 w-100">
            <div class="d-flex align-center flex-grow-1 text-caption text-medium-emphasis">¿Decisión sobre esta entrega?
            </div>
            <VBtn color="warning" variant="tonal" prepend-icon="tabler-arrow-back-up" :loading="reviewing"
              @click="confirmChangeStatus('ACTIVITY_SUBMISSION_STATUS_003')">
              Devolver
            </VBtn>
            <VBtn color="success" variant="flat" prepend-icon="tabler-check" :loading="reviewing"
              @click="confirmChangeStatus('ACTIVITY_SUBMISSION_STATUS_004')">
              Aprobar
            </VBtn>
          </div>

          <div v-else-if="selectedStudent.status === 'ACTIVITY_SUBMISSION_STATUS_004'"
            class="text-center w-100 text-info font-weight-bold">
            <VIcon start icon="tabler-circle-check-filled" /> Entrega Aprobada.
          </div>

          <div v-else class="text-center w-100 text-medium-emphasis text-caption">
            Estás viendo un intento antiguo.
          </div>
        </VCardActions>
      </template>

      <div v-else class="pa-10 text-center text-medium-emphasis">
        <VIcon icon="tabler-file-x" size="48" class="mb-3 opacity-50" />
        <p>Este alumno no tiene entregas registradas.</p>
      </div>

    </VCard>
  </VDialog>

  <ModalQuestion ref="refModalQuestion" @success="changeStatus" />
</template>
