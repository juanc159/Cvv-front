<script setup lang="ts">
import { useToast } from '@/composables/useToast';

// 1. Configuración de Ruta
definePage({
  name: "Student-Activity-Submit",
  path: "/student/activities/:id/submit",
  meta: {
    requiresAuth: true,
  },
})

const { toast } = useToast()
const router = useRouter()
const route = useRoute()

// 2. Estado Reactivo
const refModalQuestion = ref()
const loading = ref(false)
const submitting = ref(false)

// NUEVO: Control de las pestañas
const activeTab = ref('info')

// Objeto principal que almacenará TODA la respuesta del API
const activityData = ref<{
  activity: any,
  current_state: any,
  history: any[]
} | null>(null)

// Formulario reactivo
const form = reactive({
  comments: '',
  links: [] as string[],
})

const tempLink = ref('')

// Computed para facilitar acceso al estado actual
const state = computed(() => activityData.value?.current_state || { can_edit: false })

// ----------------------------------------------------------------
// 3. CARGA DE DATOS (GET)
// ----------------------------------------------------------------
const fetchActivityDetails = async () => {
  loading.value = true
  try {
    const { data, response } = await useAxios(`/student/activity/${route.params.id}`).get()

    if (response.status === 200 && data.code === 200) {
      activityData.value = data.data

      const serverData = data.data.current_state.data;

      form.comments = serverData.comments || '';
      form.links = Array.isArray(serverData.links) ? serverData.links : [];
    }
  } catch (e) {
    console.error(e)
    toast('Error al cargar la actividad', '', 'danger')
    router.back()
  } finally {
    loading.value = false
  }
}

// ----------------------------------------------------------------
// 4. LÓGICA DEL FORMULARIO
// ----------------------------------------------------------------

const addLink = () => {
  if (!tempLink.value.trim()) return
  let url = tempLink.value.trim()
  if (!/^https?:\/\//i.test(url)) url = 'https://' + url;
  form.links.push(url)
  tempLink.value = ''
}

const removeLink = (index: number) => {
  form.links.splice(index, 1)
}

const saveDraft = async () => {
  submitting.value = true
  try {
    const payload = {
      activity_id: activityData.value?.activity.id,
      comments: form.comments,
      links: form.links,
      is_draft: true
    }

    const { data, response } = await useAxios("/student/activity/submit").post(payload)

    if (response.status === 200 && data.code === 200) {
      await fetchActivityDetails()
    }
  } catch (e) {
    console.error(e)
    toast('Error al guardar borrador', '', 'danger')
  } finally {
    submitting.value = false
  }
}

const handlePreSubmit = () => {
  if (!form.comments && form.links.length === 0) {
    toast('Debes agregar al menos un enlace o un comentario.', '', 'warning')
    return
  }

  if (refModalQuestion.value) {
    const attempt = state.value.next_attempt || 1;

    refModalQuestion.value.componentData.title = `¿Enviar Tarea (Intento #${attempt})?`
    refModalQuestion.value.subTitle = "Una vez enviada, pasará a revisión y no podrás editarla hasta recibir respuesta."
    refModalQuestion.value.btnSuccessText = "Sí, Enviar Definitivo"
    refModalQuestion.value.btnSuccessIcon = "tabler-send"

    refModalQuestion.value.openModal()
  }
}

const handleFinalSubmit = async () => {
  submitting.value = true
  try {
    const payload = {
      activity_id: activityData.value?.activity.id,
      comments: form.comments,
      links: form.links,
      is_draft: false
    }

    const { data, response } = await useAxios("/student/activity/submit").post(payload)

    if (response.status === 200 && data.code === 200) {
      await fetchActivityDetails()
      // Si el envío fue exitoso, movemos al usuario a la pestaña de historial
      activeTab.value = 'history'
    }
  } catch (e: any) {
    console.error(e)
    const errorMsg = e.response?.data?.message || 'Error al enviar tarea';
    toast(errorMsg, '', 'danger')
  } finally {
    submitting.value = false
  }
}

onMounted(() => {
  fetchActivityDetails()
})
</script>

<template>
  <div class="pa-4">

    <div v-if="loading" class="d-flex justify-center align-center h-screen">
      <VProgressCircular indeterminate color="primary" size="64" />
    </div>

    <div v-else-if="activityData">

      <div class="d-flex align-center mb-4">
        <VBtn icon="tabler-arrow-left" variant="text" @click="router.back()" class="me-2" />
        <div>
          <h1 class="text-h5 font-weight-bold">Entrega de Actividad</h1>
          <span class="text-caption text-medium-emphasis">Materia: {{ activityData.activity.subject?.name }}</span>
        </div>
      </div>

      <VTabs v-model="activeTab" bg-color="transparent" color="primary" class="mb-6 border-b">
        <VTab value="info">
          <VIcon start icon="tabler-info-circle" />
          Información y Entrega
        </VTab>
        <VTab value="history">
          <VIcon start icon="tabler-history" />
          Respuestas y Comentarios
          <VChip v-if="activityData.history && activityData.history.length > 0" size="x-small" color="primary"
            class="ms-2">
            {{ activityData.history.length }}
          </VChip>
        </VTab>
      </VTabs>

      <VWindow v-model="activeTab">

        <VWindowItem value="info">
          <VRow>
            <VCol cols="12" md="5">
              <VCard elevation="2" class="mb-4 sticky-card">
                <VCardItem>
                  <VCardTitle class="text-h6 font-weight-bold text-primary mb-1 text-wrap">
                    {{ activityData.activity.title }}
                  </VCardTitle>

                  <div class="d-flex gap-2 mt-2 flex-wrap">
                    <VChip size="small" :color="state.status_color">
                      {{ state.status_label }}
                    </VChip>

                    <VChip size="small" variant="outlined" color="primary">
                      Intento #{{ state.next_attempt }}
                    </VChip>
                  </div>
                </VCardItem>

                <VDivider />

                <VCardText>
                  <div class="bg-grey-100 pa-3 rounded mb-4 border">
                    <div class="d-flex align-center mb-2">
                      <VIcon icon="tabler-user" size="18" class="me-2 text-medium-emphasis" />
                      <span class="text-body-2 font-weight-bold">
                        {{ activityData.activity.teacher?.first_name }} {{ activityData.activity.teacher?.last_name }}
                      </span>
                    </div>
                    <div class="d-flex align-center mb-2">
                      <VIcon icon="tabler-calendar-time" size="18" class="me-2 text-medium-emphasis" />
                      <span class="text-body-2">Vence: {{ activityData.activity.deadline_at }}</span>
                    </div>
                  </div>

                  <div class="text-subtitle-1 font-weight-bold mb-2">Instrucciones:</div>
                  <div class="instruction-content text-body-2" v-html="activityData.activity.description"></div>
                </VCardText>
              </VCard>
            </VCol>

            <VCol cols="12" md="7">
              <VCard elevation="2" class="mb-6">
                <VCardItem>
                  <VCardTitle>Tu Respuesta</VCardTitle>
                  <VCardSubtitle v-if="state.can_edit">
                    Completa la información para el intento #{{ state.next_attempt }}
                  </VCardSubtitle>
                  <VCardSubtitle v-else class="text-warning">
                    Modo solo lectura ({{ state.status_label }})
                  </VCardSubtitle>
                </VCardItem>

                <VDivider />

                <VCardText>
                  <VForm @submit.prevent="handlePreSubmit" :disabled="!state.can_edit">

                    <div class="mb-5">
                      <label class="d-block text-body-2 font-weight-bold mb-1">
                        <VIcon icon="tabler-link" size="16" class="me-1" /> Enlaces de la tarea
                      </label>

                      <div class="d-flex gap-2 align-center" v-if="state.can_edit">
                        <VTextField v-model="tempLink" placeholder="Pegar enlace y presionar Enter..."
                          variant="outlined" density="comfortable" hide-details="auto" @keyup.enter="addLink" clearable
                          :rules="[urlValidator]" />
                        <VBtn color="primary" icon="tabler-plus" variant="tonal" @click="addLink"
                          :disabled="!tempLink" />
                      </div>

                      <div v-if="form.links.length > 0" class="mt-3 d-flex flex-column gap-2">
                        <div v-for="(link, index) in form.links" :key="index"
                          class="d-flex align-center bg-grey-100 px-3 py-2 rounded border">
                          <VIcon icon="tabler-world" size="18" class="me-2 text-medium-emphasis" />
                          <a :href="link" target="_blank"
                            class="text-caption text-primary text-truncate flex-grow-1 text-decoration-none font-weight-medium">
                            {{ link }}
                          </a>
                          <VBtn v-if="state.can_edit" icon="tabler-trash" size="x-small" variant="text" color="error"
                            @click="removeLink(index)" />
                        </div>
                      </div>
                      <div v-else-if="!state.can_edit" class="mt-2 text-caption text-medium-emphasis">
                        No se adjuntaron enlaces.
                      </div>
                    </div>

                    <div class="mb-5">
                      <label class="d-block text-body-2 font-weight-bold mb-1">
                        <VIcon icon="tabler-notes" size="16" class="me-1" /> Comentario / Respuesta
                      </label>
                      <VTextarea v-model="form.comments" placeholder="Escribe aquí tu respuesta..." variant="outlined"
                        rows="6" auto-grow />
                    </div>

                    <div v-if="state.can_edit" class="d-flex justify-end mt-4 gap-3">
                      <VBtn color="secondary" variant="tonal" size="large" :loading="submitting"
                        prepend-icon="tabler-device-floppy" @click="saveDraft">
                        Guardar Borrador
                      </VBtn>

                      <VBtn color="primary" size="large" :loading="submitting" prepend-icon="tabler-send"
                        @click="handlePreSubmit">
                        Entregar Tarea
                      </VBtn>
                    </div>

                    <VAlert v-else type="info" variant="tonal" icon="tabler-lock" class="mt-4">
                      <span class="font-weight-bold">Formulario Bloqueado.</span>
                      Estado actual: {{ state.status_label }}.
                      <span v-if="state.mode === 'locked'">Espera la revisión del docente.</span>
                    </VAlert>

                  </VForm>
                </VCardText>
              </VCard>
            </VCol>
          </VRow>
        </VWindowItem>

        <VWindowItem value="history">
          <VCard v-if="activityData.history && activityData.history.length > 0" elevation="2">
            <VCardItem>
              <VCardTitle class="text-subtitle-1">Historial de Entregas</VCardTitle>
            </VCardItem>
            <VDivider />
            <VCardText>
              <div class="d-flex flex-column gap-4">
                <div v-for="item in activityData.history" :key="item.id" class="border rounded pa-3 bg-grey-50">

                  <div class="d-flex justify-space-between align-center mb-2">
                    <span class="font-weight-bold text-body-2">Intento #{{ item.attempt_number }}</span>
                    <VChip size="x-small" :color="item.status_color">
                      {{ item.status_label }}
                    </VChip>
                  </div>
                  <div class="text-caption text-medium-emphasis mb-2">
                    Enviado el: {{ item.submitted_at }}
                  </div>

                  <div v-if="item.comments" class="text-body-2 mb-2 pa-2 bg-white border rounded">
                    {{ item.comments }}
                  </div>
                  <div v-if="item.links && item.links.length > 0" class="d-flex gap-2 flex-wrap mb-3">
                    <VChip v-for="(link, i) in item.links" :key="i" size="x-small" prepend-icon="tabler-link"
                      :href="link" target="_blank" link>
                      Enlace {{ i + 1 }}
                    </VChip>
                  </div>

                  <VDivider class="my-3 border-dashed" />

                  <div class="mt-2">
                    <div class="text-caption font-weight-bold mb-2 text-primary d-flex align-center">
                      <VIcon icon="tabler-message-circle" size="16" class="me-1" />
                      Comentarios del Intento #{{ item.attempt_number }}
                    </div>

                    <div class="bg-white border rounded">
                      <TimelineFeed v-if="item.id" :record-id="item.id.toString()"
                        record-type="App\Models\ActivitySubmission" :allow-internal="false" :allow-files="false" />
                    </div>
                  </div>

                </div>
              </div>
            </VCardText>
          </VCard>

          <VCard v-else elevation="2" class="text-center pa-10">
            <VIcon icon="tabler-inbox" size="64" class="text-grey-lighten-2 mb-4" />
            <h3 class="text-h6 font-weight-medium text-medium-emphasis">Sin entregas previas</h3>
            <p class="text-body-2 text-medium-emphasis">Aún no has enviado ninguna respuesta para esta actividad. Ve a
              la pestaña de "Información y Entrega" para comenzar.</p>
          </VCard>

        </VWindowItem>

      </VWindow>
    </div>

    <ModalQuestion ref="refModalQuestion" @success="handleFinalSubmit" />

  </div>
</template>

<style scoped>
.instruction-content {
  line-height: 1.6;
  color: rgba(var(--v-theme-on-surface), 0.87);
}

.instruction-content :deep(p) {
  margin-bottom: 0.8rem;
}

.instruction-content :deep(ul),
.instruction-content :deep(ol) {
  margin-bottom: 0.8rem;
  padding-left: 1.5rem;
}

.sticky-card {
  position: sticky;
  top: 20px;
}
</style>
