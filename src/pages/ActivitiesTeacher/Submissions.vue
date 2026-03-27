<script setup lang="ts">
import { useToast } from '@/composables/useToast';
import { computed, onMounted, ref } from 'vue'; // Aseguramos importar computed
import { useRoute, useRouter } from 'vue-router';
// Importamos el nuevo componente hijo
import ReviewModal from '@/pages/ActivitiesTeacher/Components/ReviewModal.vue';

definePage({
  name: "Teacher-Activity-Submissions",
  path: "/teacher/activities/:id/submissions",
  meta: { requiresAuth: true }
})

const router = useRouter();
const route = useRoute();
const { toast } = useToast();

const loading = ref(true);

// Referencia al componente hijo (Modal)
const reviewModalRef = ref();

const dataStore = ref({
  activity: { id: '', title: '', subject: '', grade: '', section: '', deadline_at: '' },
  stats: { total: 0, submitted: 0, reviewed: 0, pending: 0 },
  studentsList: [] as any[]
});

const storageBack = (path: string) => {
  if (!path) return '';
  return `${import.meta.env.VITE_API_BASE_URL}/storage/${path}`;
}

// --- LÓGICA DE FILTROS ---
const searchQuery = ref('');
const statusFilter = ref('ALL'); // Valor por defecto

// Opciones para el select de estados
const statusOptions = [
  { title: 'Todos los estados', value: 'ALL' },
  { title: 'Entregados (Por revisar)', value: 'ACTIVITY_SUBMISSION_STATUS_002' },
  { title: 'Devueltos (Corrección)', value: 'ACTIVITY_SUBMISSION_STATUS_003' },
  { title: 'Aprobados (Revisado)', value: 'ACTIVITY_SUBMISSION_STATUS_004' },
  { title: 'Sin Entregar / Borrador', value: 'PENDING' } // Agrupa nulos y borradores
];

// Lista filtrada reactiva
const filteredStudentsList = computed(() => {
  // Aplicamos filtros primero
  let list = dataStore.value.studentsList.filter(student => {
    // 1. Filtro por nombre
    const matchesSearch = student.student_name.toLowerCase().includes(searchQuery.value.toLowerCase());

    // 2. Filtro por estado
    let matchesStatus = true;
    if (statusFilter.value !== 'ALL') {
      if (statusFilter.value === 'PENDING') {
        // PENDING agrupa a los que no tienen status (null) o son borrador (001)
        matchesStatus = student.status === null || student.status === 'ACTIVITY_SUBMISSION_STATUS_001';
      } else {
        matchesStatus = student.status === statusFilter.value;
      }
    }

    return matchesSearch && matchesStatus;
  });

  // Luego ordenamos alfabéticamente por nombre completo antes de devolver
  return list.sort((a, b) => a.student_name.localeCompare(b.student_name));
});

const fetchSubmissionsList = async () => {
  loading.value = true;
  try {
    const { data, response } = await useAxios(`/teacher/activities/${route.params.id}/submissions`).get();
    if (response.status === 200 && data.code === 200) {
      dataStore.value = data.data;
    } else {
      toast('Error al cargar la lista', '', 'danger');
    }
  } catch (error) {
    console.error(error);
    toast('Ocurrió un error de conexión', '', 'danger');
  } finally {
    loading.value = false;
  }
};

// --- ABRIR LA MODAL HIJA ---
const openReviewModal = (student: any) => {
  if (reviewModalRef.value) {
    reviewModalRef.value.openModal(student, dataStore.value.activity.id);
  }
};

onMounted(() => {
  fetchSubmissionsList();
});
</script>

<template>
  <div class="pa-4">
    <div v-if="loading" class="d-flex justify-center align-center h-screen">
      <VProgressCircular indeterminate color="primary" size="64" />
    </div>

    <div v-else>
      <div class="d-flex align-center justify-space-between mb-6">
        <div class="d-flex align-center">
          <VBtn icon="tabler-arrow-left" variant="text" @click="router.back()" class="me-2" />
          <div>
            <h1 class="text-h5 font-weight-bold">Control de Entregas</h1>
            <span class="text-caption text-medium-emphasis">
              {{ dataStore.activity.subject }} • {{ dataStore.activity.grade }} "{{ dataStore.activity.section }}"
            </span>
          </div>
        </div>
        <div class="text-right d-none d-sm-block">
          <div class="text-subtitle-1 font-weight-bold text-primary">{{ dataStore.activity.title }}</div>
          <div class="text-caption">Vence: {{ dataStore.activity.deadline_at || 'Sin fecha' }}</div>
        </div>
      </div>

      <VRow class="mb-4">
        <VCol cols="6" md="3">
          <VCard elevation="1" class="border">
            <VCardText class="d-flex align-center justify-space-between pa-3">
              <div>
                <div class="text-caption text-medium-emphasis text-uppercase">Total Alumnos</div>
                <div class="text-h5 font-weight-bold">{{ dataStore.stats.total }}</div>
              </div>
              <VAvatar color="grey-lighten-4" rounded>
                <VIcon icon="tabler-users" color="grey-darken-1" />
              </VAvatar>
            </VCardText>
          </VCard>
        </VCol>

        <VCol cols="6" md="3">
          <VCard elevation="1" class="border">
            <VCardText class="d-flex align-center justify-space-between pa-3">
              <div>
                <div class="text-caption text-medium-emphasis text-uppercase">Por Revisar</div>
                <div class="text-h5 font-weight-bold text-success">{{ dataStore.stats.submitted }}</div>
              </div>
              <VAvatar color="success" variant="tonal" rounded>
                <VIcon icon="tabler-inbox" />
              </VAvatar>
            </VCardText>
          </VCard>
        </VCol>

        <VCol cols="6" md="3">
          <VCard elevation="1" class="border">
            <VCardText class="d-flex align-center justify-space-between pa-3">
              <div>
                <div class="text-caption text-medium-emphasis text-uppercase">Faltan/Corrección</div>
                <div class="text-h5 font-weight-bold text-warning">{{ dataStore.stats.pending }}</div>
              </div>
              <VAvatar color="warning" variant="tonal" rounded>
                <VIcon icon="tabler-clock" />
              </VAvatar>
            </VCardText>
          </VCard>
        </VCol>

        <VCol cols="6" md="3">
          <VCard elevation="1" class="border">
            <VCardText class="d-flex align-center justify-space-between pa-3">
              <div>
                <div class="text-caption text-medium-emphasis text-uppercase">Finalizados</div>
                <div class="text-h5 font-weight-bold text-info">{{ dataStore.stats.reviewed }}</div>
              </div>
              <VAvatar color="info" variant="tonal" rounded>
                <VIcon icon="tabler-check" />
              </VAvatar>
            </VCardText>
          </VCard>
        </VCol>
      </VRow>

      <VCard elevation="0" class="mb-4 bg-transparent">
        <VRow>
          <VCol cols="12" md="6">
            <AppTextField v-model="searchQuery" placeholder="Buscar estudiante..." prepend-inner-icon="tabler-search"
              hide-details clearable bg-color="surface" />
          </VCol>
          <VCol cols="12" md="4" offset-md="2">
            <VSelect v-model="statusFilter" :items="statusOptions" item-title="title" item-value="value" hide-details
              bg-color="surface" prepend-inner-icon="tabler-filter" />
          </VCol>
        </VRow>
      </VCard>

      <VCard elevation="2">
        <VTable hover class="text-no-wrap">
          <thead>
            <tr>
              <th class="text-uppercase text-caption font-weight-bold">Estudiante</th>
              <th class="text-uppercase text-caption font-weight-bold">Estado</th>
              <th class="text-uppercase text-caption font-weight-bold">Fecha (Último Envío)</th>
              <th class="text-uppercase text-caption font-weight-bold text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="student in filteredStudentsList" :key="student.id">
              <td>
                <div class="d-flex align-center">
                  <VAvatar size="32" color="primary" variant="tonal" class="me-3">
                    <VImg v-if="student.avatar" :src="storageBack(student.avatar)" />
                    <span v-else class="text-body-2 font-weight-bold">{{ student.initials }}</span>
                  </VAvatar>
                  <span class="font-weight-medium">{{ student.student_name }}</span>
                </div>
              </td>
              <td>
                <VChip size="small" :color="student.status_color">{{ student.status_label }}</VChip>
              </td>
              <td class="text-body-2 text-medium-emphasis">
                {{ student.submitted_at || '---' }}
                <span v-if="student.attempt_number > 1" class="text-caption ms-1 text-primary">
                  (Intento #{{ student.attempt_number }})
                </span>
              </td>
              <td class="text-right">
                <VBtn v-if="student.submission" size="small"
                  :color="student.status === 'ACTIVITY_SUBMISSION_STATUS_002' ? 'primary' : 'secondary'" variant="tonal"
                  @click="openReviewModal(student)">
                  <VIcon start icon="tabler-eye" size="16" />
                  {{ student.status === 'ACTIVITY_SUBMISSION_STATUS_002' ? 'Revisar' : 'Ver' }}
                </VBtn>
                <VBtn v-else size="small" variant="text" disabled>Sin entrega</VBtn>
              </td>
            </tr>

            <tr v-if="filteredStudentsList.length === 0">
              <td colspan="4" class="text-center pa-6 text-medium-emphasis">
                <VIcon icon="tabler-search-off" size="32" class="mb-2" />
                <p class="mb-0">No se encontraron estudiantes que coincidan con la búsqueda.</p>
              </td>
            </tr>
          </tbody>
        </VTable>
      </VCard>

      <ReviewModal ref="reviewModalRef" @evaluated="fetchSubmissionsList" />

    </div>
  </div>
</template>
