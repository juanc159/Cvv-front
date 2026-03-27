<script lang="ts" setup>
definePage({
  name: "ActivitiesTeacher2",
  path: "/dashboard/teacher/activities2",
  meta: {
    redirectIfLoggedIn: true,
    requiresAuth: true,
  },
});

import { computed, reactive, ref } from 'vue';

// --- 1. MOCK DATA (DATOS QUEMADOS) ---

// Actividades
const activities = ref([
  {
    id: 1,
    title: "Resolución de Ecuaciones Cuadráticas",
    subject: "Matemáticas",
    grade: "4to Año",
    section: "A",
    deadline: "2025-10-15T23:59",
    status: "active",
    submissions_count: 3,
    total_students: 20,
    description: "Resolver los ejercicios de la página 45 del libro guía. Subir en PDF.",
    file_type: ['PDF']
  },
  {
    id: 2,
    title: "Ensayo sobre la Guerra Federal",
    subject: "Historia",
    grade: "4to Año",
    section: "A",
    deadline: "2025-09-30T18:00",
    status: "closed",
    submissions_count: 20,
    total_students: 20,
    description: "Ensayo de mínimo 3 cuartillas. Cuidar ortografía.",
    file_type: ['Word']
  },
  {
    id: 3,
    title: "Dibujo Técnico: Proyecciones",
    subject: "Matemáticas",
    grade: "5to Año",
    section: "B",
    deadline: "2025-11-01T12:00",
    status: "active",
    submissions_count: 0,
    total_students: 15,
    description: "Realizar lámina Nro 4 con proyecciones ortogonales.",
    file_type: ['Imagen']
  }
]);

// Entregas (Simuladas para cuando entras a "Ver Entregas")
const mockSubmissions = [
  { id: 101, student: "Juan Pérez", date: "2025-10-14 10:00", file: "ejercicios_juan.pdf", status: "pending", score: null },
  { id: 102, student: "Maria Garcia", date: "2025-10-14 11:30", file: "matematica_maria.pdf", status: "graded", score: 18 },
  { id: 103, student: "Carlos Lopez", date: "2025-10-15 09:00", file: "tarea_carlos.pdf", status: "pending", score: null },
];

// Listas para Selects
const mockSubjects = ['Matemáticas', 'Historia', 'Física', 'Castellano', 'Inglés'];
const mockGrades = ['1er Año', '2do Año', '3er Año', '4to Año', '5to Año'];
const mockSections = ['A', 'B', 'C'];

// --- 2. ESTADOS DE LA VISTA ---
const currentView = ref('list'); // 'list' | 'details'
const selectedActivity = ref<any>(null); // Actividad seleccionada para ver entregas
const currentSubmissions = ref<any[]>([]); // Lista de entregas actual

// --- 3. ESTADOS DEL FORMULARIO (CRUD) ---
const showCreateModal = ref(false);
const showGradeModal = ref(false); // Modal para calificar alumno
const isEditing = ref(false);
const loading = ref(false);

const formActivity = reactive({
  id: null as number | null,
  title: '',
  subject_id: null,
  grade_id: null,
  section_id: null,
  description: '',
  deadline: '',
  file_type: [] as string[],
});

const formGrade = reactive({
  submissionId: null,
  studentName: '',
  score: null,
  feedback: ''
});

// --- 4. COMPUTED PROPERTIES (KPIs DASHBOARD) ---
const kpiTotal = computed(() => activities.value.length);
const kpiActive = computed(() => activities.value.filter(a => a.status === 'active').length);
const kpiClosed = computed(() => activities.value.filter(a => a.status === 'closed').length);
// Calculamos cuantas entregas faltan por calificar (mock logic)
const kpiPendingGrades = computed(() => 5); // Valor quemado para ejemplo

// --- 5. FUNCIONES CRUD ACTIVIDADES ---

const openCreateModal = () => {
  isEditing.value = false;
  // Reset Form
  formActivity.id = null;
  formActivity.title = '';
  formActivity.subject_id = null;
  formActivity.grade_id = null;
  formActivity.section_id = null;
  formActivity.description = '';
  formActivity.deadline = '';
  formActivity.file_type = ['PDF'];

  showCreateModal.value = true;
};

const openEditModal = (item: any) => {
  isEditing.value = true;
  // Llenar form con datos del item
  formActivity.id = item.id;
  formActivity.title = item.title;
  formActivity.subject_id = item.subject; // En mock usamos string directo
  formActivity.grade_id = item.grade;
  formActivity.section_id = item.section;
  formActivity.description = item.description;
  formActivity.deadline = item.deadline;
  formActivity.file_type = item.file_type || ['PDF'];

  showCreateModal.value = true;
};

const saveActivity = () => {
  if (!formActivity.title || !formActivity.deadline) return;

  loading.value = true;

  setTimeout(() => {
    if (isEditing.value && formActivity.id) {
      // --- LÓGICA DE EDICIÓN ---
      const index = activities.value.findIndex(a => a.id === formActivity.id);
      if (index !== -1) {
        activities.value[index] = {
          ...activities.value[index], // Mantener datos viejos (contadores)
          title: formActivity.title,
          subject: formActivity.subject_id || 'Materia',
          grade: formActivity.grade_id || 'Grado',
          section: formActivity.section_id || 'A',
          description: formActivity.description,
          deadline: formActivity.deadline,
          file_type: formActivity.file_type
        };
      }
    } else {
      // --- LÓGICA DE CREACIÓN ---
      activities.value.unshift({
        id: Math.random(),
        title: formActivity.title,
        subject: formActivity.subject_id || 'Matemáticas',
        grade: formActivity.grade_id || '4to Año',
        section: formActivity.section_id || 'A',
        deadline: formActivity.deadline,
        status: 'active',
        submissions_count: 0,
        total_students: 30,
        description: formActivity.description,
        file_type: formActivity.file_type
      });
    }

    loading.value = false;
    showCreateModal.value = false;
  }, 1000);
};

const deleteActivity = (id: number) => {
  if (confirm("¿Está seguro de eliminar esta actividad? Se borrarán las entregas asociadas.")) {
    activities.value = activities.value.filter(a => a.id !== id);
  }
};

// --- 6. FUNCIONES DE GESTIÓN DE ENTREGAS ---

const viewSubmissions = (activity: any) => {
  selectedActivity.value = activity;
  // Simulamos cargar las entregas de esa actividad
  // En la vida real haríamos un API call con activity.id
  currentSubmissions.value = activity.submissions_count > 0
    ? JSON.parse(JSON.stringify(mockSubmissions)) // Clonamos para no afectar referencias
    : [];

  currentView.value = 'details';
};

const backToList = () => {
  currentView.value = 'list';
  selectedActivity.value = null;
  currentSubmissions.value = [];
};

const openGradeModal = (submission: any) => {
  formGrade.submissionId = submission.id;
  formGrade.studentName = submission.student;
  formGrade.score = submission.score;
  formGrade.feedback = '';
  showGradeModal.value = true;
};

const saveGrade = () => {
  // Buscar en la lista local y actualizar
  const sub = currentSubmissions.value.find(s => s.id === formGrade.submissionId);
  if (sub) {
    sub.score = formGrade.score;
    sub.status = 'graded';
  }
  showGradeModal.value = false;
};

// --- HELPERS ---
const getStatusColor = (status: string) => status === 'active' ? 'success' : 'error';
const getStatusText = (status: string) => status === 'active' ? 'Abierta' : 'Cerrada';

</script>

<template>
  <div>

    <div v-if="currentView === 'list'">

      <VRow class="mb-4">
        <VCol cols="12" md="8">
          <h2 class="text-h4 font-weight-bold">Gestión de Actividades</h2>
          <p class="text-body-1 text-medium-emphasis">Administre tareas, exámenes y asignaciones.</p>
        </VCol>
        <VCol cols="12" md="4" class="text-md-end">
          <VBtn color="primary" prepend-icon="tabler-plus" @click="openCreateModal" size="large">
            Nueva Actividad
          </VBtn>
        </VCol>
      </VRow>

      <VRow class="mb-6">
        <VCol cols="6" md="3">
          <VCard class="d-flex align-center pa-3">
            <VAvatar color="primary" variant="tonal" class="me-3" icon="tabler-folder" />
            <div>
              <div class="text-h6 font-weight-bold">{{ kpiTotal }}</div>
              <div class="text-caption">Total Actividades</div>
            </div>
          </VCard>
        </VCol>
        <VCol cols="6" md="3">
          <VCard class="d-flex align-center pa-3">
            <VAvatar color="success" variant="tonal" class="me-3" icon="tabler-circle-check" />
            <div>
              <div class="text-h6 font-weight-bold">{{ kpiActive }}</div>
              <div class="text-caption">Activas</div>
            </div>
          </VCard>
        </VCol>
        <VCol cols="6" md="3">
          <VCard class="d-flex align-center pa-3">
            <VAvatar color="error" variant="tonal" class="me-3" icon="tabler-lock" />
            <div>
              <div class="text-h6 font-weight-bold">{{ kpiClosed }}</div>
              <div class="text-caption">Cerradas</div>
            </div>
          </VCard>
        </VCol>
        <VCol cols="6" md="3">
          <VCard class="d-flex align-center pa-3">
            <VAvatar color="warning" variant="tonal" class="me-3" icon="tabler-pencil" />
            <div>
              <div class="text-h6 font-weight-bold">{{ kpiPendingGrades }}</div>
              <div class="text-caption">Por Calificar</div>
            </div>
          </VCard>
        </VCol>
      </VRow>

      <VRow>
        <VCol v-for="item in activities" :key="item.id" cols="12" md="6" lg="4">
          <VCard class="h-100 border card-hover">
            <VCardItem>
              <div class="d-flex justify-space-between align-start mb-3">

                <div class="d-flex flex-wrap align-center gap-2" style="gap: 8px;">
                  <VChip size="small" :color="getStatusColor(item.status)" variant="flat" class="font-weight-bold">
                    {{ getStatusText(item.status) }}
                  </VChip>

                  <VChip size="small" color="primary" variant="outlined">
                    {{ item.subject }}
                  </VChip>
                </div>

                <VMenu>
                  <template #activator="{ props }">
                    <VBtn icon="tabler-dots" variant="text" size="small" v-bind="props" class="mt-n2 me-n2" />
                  </template>
                  <VList>
                    <VListItem @click="openEditModal(item)">
                      <template #prepend>
                        <VIcon icon="tabler-edit" size="20" />
                      </template>
                      <VListItemTitle>Editar Actividad</VListItemTitle>
                    </VListItem>
                    <VListItem @click="deleteActivity(item.id)" class="text-error">
                      <template #prepend>
                        <VIcon icon="tabler-trash" size="20" />
                      </template>
                      <VListItemTitle>Eliminar</VListItemTitle>
                    </VListItem>
                  </VList>
                </VMenu>
              </div>

              <VCardTitle class="text-h6 mb-1 text-wrap pe-2" style="line-height: 1.4;">
                {{ item.title }}
              </VCardTitle>

              <VCardSubtitle class="mb-3 d-flex align-center">
                <VIcon icon="tabler-users-group" size="16" class="me-1" />
                {{ item.grade }} sección "{{ item.section }}"
              </VCardSubtitle>

              <p class="text-body-2 text-truncate-2 text-medium-emphasis" style="min-height: 42px;">
                {{ item.description }}
              </p>
            </VCardItem>

            <VDivider />

            <VCardText class="py-3 bg-var-theme-background">
              <div class="d-flex justify-space-between align-center mb-2">
                <span class="text-caption font-weight-bold">Entregas Recibidas</span>
                <span class="text-caption">{{ item.submissions_count }} / {{ item.total_students }}</span>
              </div>
              <VProgressLinear :model-value="(item.submissions_count / item.total_students) * 100" color="primary"
                height="8" rounded />
              <div class="d-flex align-center mt-3 text-caption"
                :class="item.status === 'active' ? 'text-error' : 'text-disabled'">
                <VIcon icon="tabler-calendar-time" size="16" class="me-1" />
                <span>Cierra: {{ item.deadline.replace('T', ' ') }}</span>
              </div>
            </VCardText>

            <VCardActions class="pa-3">
              <VBtn variant="tonal" block color="primary" @click="viewSubmissions(item)">
                <VIcon icon="tabler-list-search" start /> Ver Entregas
              </VBtn>
            </VCardActions>
          </VCard>
        </VCol>
      </VRow>
    </div>

    <div v-else-if="currentView === 'details'">

      <div class="d-flex align-center mb-6">
        <VBtn icon="tabler-arrow-left" variant="text" class="me-3" @click="backToList" />
        <div>
          <h2 class="text-h5 font-weight-bold">{{ selectedActivity?.title }}</h2>
          <div class="text-body-2 text-medium-emphasis">
            {{ selectedActivity?.grade }} "{{ selectedActivity?.section }}" • {{ selectedActivity?.subject }}
          </div>
        </div>
        <VSpacer />
        <VChip :color="getStatusColor(selectedActivity?.status)">
          {{ getStatusText(selectedActivity?.status) }}
        </VChip>
      </div>

      <VCard>
        <VCardTitle class="pa-4 border-bottom">
          Lista de Estudiantes ({{ currentSubmissions.length }} entregas)
        </VCardTitle>
        <VCardText class="pa-0">
          <VTable class="text-no-wrap">
            <thead>
              <tr>
                <th>Estudiante</th>
                <th>Fecha Entrega</th>
                <th>Archivo</th>
                <th>Calificación</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="currentSubmissions.length === 0">
                <td colspan="5" class="text-center pa-10 text-disabled">
                  <VIcon icon="tabler-folder-off" size="30" class="mb-2" /><br>
                  Aún no hay entregas para esta actividad.
                </td>
              </tr>
              <tr v-for="sub in currentSubmissions" :key="sub.id">
                <td>
                  <div class="d-flex align-center">
                    <VAvatar color="primary" variant="tonal" size="30" class="me-2">
                      {{ sub.student.charAt(0) }}
                    </VAvatar>
                    <div class="font-weight-bold">{{ sub.student }}</div>
                  </div>
                </td>
                <td>{{ sub.date }}</td>
                <td>
                  <VChip size="small" prepend-icon="tabler-file" color="info" variant="flat">
                    {{ sub.file }}
                  </VChip>
                </td>
                <td>
                  <VChip v-if="sub.score" color="success" size="small" variant="tonal">
                    {{ sub.score }} pts
                  </VChip>
                  <span v-else class="text-disabled text-caption">--</span>
                </td>
                <td>
                  <VBtn size="small" variant="tonal" :color="sub.score ? 'warning' : 'primary'"
                    @click="openGradeModal(sub)">
                    <VIcon :icon="sub.score ? 'tabler-pencil' : 'tabler-check'" start />
                    {{ sub.score ? 'Editar' : 'Calificar' }}
                  </VBtn>
                </td>
              </tr>
            </tbody>
          </VTable>
        </VCardText>
      </VCard>
    </div>

    <VDialog v-model="showCreateModal" max-width="700px" persistent>
      <VCard>
        <VCardTitle class="pa-4 bg-primary text-white d-flex justify-space-between align-center">
          <span class="text-h6 d-flex align-center">
            <VIcon :icon="isEditing ? 'tabler-edit' : 'tabler-plus'" class="me-2" />
            {{ isEditing ? 'Editar Actividad' : 'Nueva Actividad' }}
          </span>
          <VBtn icon="tabler-x" variant="text" color="white" @click="showCreateModal = false" />
        </VCardTitle>

        <VCardText class="pa-6">
          <VForm @submit.prevent="saveActivity">
            <VRow>
              <VCol cols="12">
                <VTextField label="Título de la Actividad" v-model="formActivity.title"
                  placeholder="Ej: Análisis Literario" variant="outlined" density="comfortable" />
              </VCol>

              <VCol cols="12" sm="6">
                <VSelect label="Materia" :items="mockSubjects" v-model="formActivity.subject_id" variant="outlined"
                  density="comfortable" />
              </VCol>

              <VCol cols="6" sm="3">
                <VSelect label="Año" :items="mockGrades" v-model="formActivity.grade_id" variant="outlined"
                  density="comfortable" />
              </VCol>
              <VCol cols="6" sm="3">
                <VSelect label="Sección" :items="mockSections" v-model="formActivity.section_id" variant="outlined"
                  density="comfortable" />
              </VCol>

              <VCol cols="12">
                <VTextarea label="Instrucciones para el estudiante" v-model="formActivity.description" rows="3"
                  variant="outlined" />
              </VCol>

              <VCol cols="12" sm="6">
                <VTextField type="datetime-local" label="Fecha Límite" v-model="formActivity.deadline"
                  variant="outlined" density="comfortable" />
              </VCol>

              <VCol cols="12" sm="6">
                <VSelect label="Formatos permitidos" multiple chips :items="['PDF', 'Word', 'Imagen', 'Excel']"
                  v-model="formActivity.file_type" variant="outlined" density="comfortable" />
              </VCol>
            </VRow>
          </VForm>
        </VCardText>

        <VDivider />

        <VCardActions class="pa-4">
          <VSpacer />
          <VBtn variant="text" color="secondary" @click="showCreateModal = false">
            Cancelar
          </VBtn>
          <VBtn color="primary" variant="elevated" @click="saveActivity" :loading="loading">
            {{ isEditing ? 'Guardar Cambios' : 'Publicar Actividad' }}
          </VBtn>
        </VCardActions>
      </VCard>
    </VDialog>

    <VDialog v-model="showGradeModal" max-width="400px">
      <VCard>
        <VCardTitle class="pa-4">Calificar a {{ formGrade.studentName }}</VCardTitle>
        <VCardText class="pa-4">
          <VTextField label="Nota (1-20)" v-model="formGrade.score" type="number" variant="outlined" autofocus />
          <VTextarea label="Feedback / Comentario" v-model="formGrade.feedback" variant="outlined" rows="2"
            class="mt-2" />
        </VCardText>
        <VCardActions class="pa-4">
          <VSpacer />
          <VBtn variant="text" @click="showGradeModal = false">Cancelar</VBtn>
          <VBtn color="success" variant="elevated" @click="saveGrade">Asignar Nota</VBtn>
        </VCardActions>
      </VCard>
    </VDialog>

  </div>
</template>

<style scoped>
.text-truncate-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-hover {
  transition: transform 0.2s, box-shadow 0.2s;
}

.card-hover:hover {
  transform: translateY(-4px);
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.1) !important;
  border-color: rgb(var(--v-theme-primary)) !important;
}

.z-index-1 {
  z-index: 1;
}
</style>
