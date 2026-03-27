<script setup lang="ts">
import { useToast } from '@/composables/useToast'
import { computed, onMounted, ref } from 'vue'

definePage({
  name: 'ActivitiesStudent',
  path: '/dashboard/student/activities',
  meta: {
    redirectIfLoggedIn: true,
    requiresAuth: true,
  },
})

type ActivityId = string | number

interface ActivitySubject {
  name?: string
}

interface ActivityTeacher {
  full_name?: string
  first_name?: string
  last_name?: string
  name?: string
}

interface ActivityItem {
  id: ActivityId
  title: string
  description?: string | null
  subject?: ActivitySubject | string | null
  teacher?: ActivityTeacher | string | null
  deadline_at?: string | null
  file_types?: string | null
  submission_status?: string | null
  submission_status_description?: string | null
  submission_status_color?: string | null
  is_overdue?: boolean
}

const REVIEWED_STATUS = 'ACTIVITY_SUBMISSION_STATUS_004'

const { toast } = useToast()
const router = useRouter()

const loading = ref(false)
const allActivities = ref<ActivityItem[]>([])
const currentTab = ref<'pending' | 'history'>('pending')

const pendingActivities = computed(() => {
  return allActivities.value.filter(activity => (
    activity.submission_status !== REVIEWED_STATUS && !activity.is_overdue
  ))
})

const historyActivities = computed(() => {
  return allActivities.value.filter(activity => (
    activity.submission_status === REVIEWED_STATUS || Boolean(activity.is_overdue)
  ))
})

const resolveSubjectName = (subject: ActivityItem['subject']) => {
  if (!subject)
    return 'Sin materia'

  if (typeof subject === 'string')
    return subject

  return subject.name || 'Sin materia'
}

const resolveTeacherName = (teacher: ActivityItem['teacher']) => {
  if (!teacher)
    return 'Docente no disponible'

  if (typeof teacher === 'string')
    return teacher

  const fullName = teacher.full_name?.trim()
  if (fullName)
    return fullName

  const mergedName = [teacher.first_name, teacher.last_name].filter(Boolean).join(' ').trim()
  if (mergedName)
    return mergedName

  return teacher.name || 'Docente no disponible'
}

const goToSubmission = (activityId: ActivityId) => {
  if (!activityId) {
    toast('No se pudo abrir la entrega', 'La actividad no tiene identificador valido.', 'warning')

    return
  }

  router.push({
    name: 'Student-Activity-Submit',
    params: { id: String(activityId) },
  })
}

const fetchActivities = async () => {
  loading.value = true

  try {
    const { data, response } = await useAxios('/activity/pending').get()

    if (response.status === 200 && data.code === 200 && Array.isArray(data.data)) {
      allActivities.value = data.data

      return
    }

    allActivities.value = []
    toast(data?.message || 'No fue posible cargar las actividades.', '', 'warning')
  }
  catch (error) {
    console.error(error)
    allActivities.value = []
    toast('Error al cargar actividades', '', 'danger')
  }
  finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchActivities()
})
</script>

<template>
  <div>
    <VRow class="mb-2 align-center">
      <VCol cols="12" md="8">
        <h2 class="text-h4 font-weight-bold">
          Mis Actividades
        </h2>
        <p class="text-body-1 text-medium-emphasis">
          Gestiona tus tareas y visualiza tus calificaciones.
        </p>
      </VCol>
    </VRow>

    <VTabs v-model="currentTab" class="mb-6">
      <VTab value="pending">
        <VIcon start icon="tabler-bell" />
        Por Hacer
        <VChip size="small" color="primary" class="ms-2">
          {{ pendingActivities.length }}
        </VChip>
      </VTab>
      <VTab value="history">
        <VIcon start icon="tabler-history" />
        Historial
        <VChip size="small" color="primary" class="ms-2">
          {{ historyActivities.length }}
        </VChip>
      </VTab>
    </VTabs>

    <VWindow v-model="currentTab">
      <VWindowItem value="pending">
        <div v-if="loading" class="d-flex justify-center py-10">
          <VProgressCircular indeterminate color="primary" size="64" />
        </div>

        <div v-else-if="pendingActivities.length === 0" class="text-center py-10">
          <VIcon icon="tabler-clipboard-check" size="64" color="success" class="mb-4" />
          <h3 class="text-h5">
            Estas al dia
          </h3>
          <p class="text-body-1 text-medium-emphasis mt-2">
            No tienes tareas pendientes.
          </p>
        </div>

        <VRow v-else>
          <VCol v-for="item in pendingActivities" :key="item.id" cols="12" md="6">
            <VCard class="activity-card h-100 d-flex flex-column" elevation="2">
              <div class="status-border" :class="`bg-${item.submission_status_color || 'warning'}`" />

              <VCardText class="flex-grow-1">
                <div class="d-flex justify-space-between align-start mb-2 gap-2">
                  <VChip size="small" color="primary" variant="tonal" class="font-weight-bold">
                    {{ resolveSubjectName(item.subject) }}
                  </VChip>

                  <VChip size="small" :color="item.submission_status_color || 'warning'" variant="flat">
                    {{ item.submission_status_description || 'Por hacer' }}
                  </VChip>
                </div>

                <h3 class="text-h6 font-weight-bold mb-1">
                  {{ item.title }}
                </h3>

                <div class="d-flex align-center text-caption text-medium-emphasis mb-3">
                  <VIcon icon="tabler-user" size="14" class="me-1" />
                  <span>Asignado por: {{ resolveTeacherName(item.teacher) }}</span>
                </div>

                <!-- <div class="text-body-2 text-truncate-2 mb-4">
                  {{ item.description || 'Sin descripcion.' }}
                </div> -->

                <VDivider class="mb-3" />

                <div class="d-flex align-center text-caption mb-2">
                  <VIcon icon="tabler-file-type-doc" size="14" class="me-2" />
                  <span>{{ item.file_types || 'Sin formato especifico' }}</span>
                </div>

                <div class="d-flex align-center text-caption">
                  <VIcon icon="tabler-calendar-time" size="16" class="me-2" />
                  <span class="font-weight-medium">Vence:</span>
                  <span class="ms-1">{{ item.deadline_at || 'Sin fecha' }}</span>
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
      </VWindowItem>

      <VWindowItem value="history">
        <div v-if="loading" class="d-flex justify-center py-10">
          <VProgressCircular indeterminate color="primary" size="64" />
        </div>

        <div v-else-if="historyActivities.length === 0" class="text-center py-10">
          <VIcon icon="tabler-history-off" size="64" color="grey-lighten-1" class="mb-4" />
          <h3 class="text-h5">
            Sin historial
          </h3>
          <p class="text-body-1 text-medium-emphasis mt-2">
            Aun no tienes actividades finalizadas.
          </p>
        </div>

        <VRow v-else>
          <VCol v-for="item in historyActivities" :key="`history-${item.id}`" cols="12" md="6">
            <VCard class="activity-card h-100 d-flex flex-column" elevation="2">
              <div class="status-border" :class="`bg-${item.submission_status_color || 'info'}`" />

              <VCardText class="flex-grow-1">
                <div class="d-flex justify-space-between align-start mb-2 gap-2">
                  <VChip size="small" color="primary" variant="tonal" class="font-weight-bold">
                    {{ resolveSubjectName(item.subject) }}
                  </VChip>

                  <VChip size="small" :color="item.submission_status_color || 'info'" variant="flat">
                    {{ item.submission_status_description || 'Finalizada' }}
                  </VChip>
                </div>

                <h3 class="text-h6 font-weight-bold mb-1">
                  {{ item.title }}
                </h3>

                <div class="d-flex align-center text-caption text-medium-emphasis mb-3">
                  <VIcon icon="tabler-user" size="14" class="me-1" />
                  <span>Docente: {{ resolveTeacherName(item.teacher) }}</span>
                </div>

                <!-- <div class="text-body-2 text-truncate-2 mb-4">
                  {{ item.description || 'Sin descripcion.' }}
                </div> -->

                <VDivider class="mb-3" />

                <div class="d-flex align-center text-caption mb-2">
                  <VIcon icon="tabler-file-type-doc" size="14" class="me-2" />
                  <span>{{ item.file_types || 'Sin formato especifico' }}</span>
                </div>

                <div class="d-flex align-center text-caption">
                  <VIcon icon="tabler-calendar-time" size="16" class="me-2" />
                  <span class="font-weight-medium">Vence:</span>
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
  </div>
</template>

<style scoped>
.activity-card {
  overflow: hidden;
  position: relative;
}

.status-border {
  height: 100%;
  left: 0;
  position: absolute;
  top: 0;
  width: 4px;
}

.text-truncate-2 {
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  display: -webkit-box;
  overflow: hidden;
}
</style>
