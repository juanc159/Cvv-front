<script lang="ts" setup>
import { useToast } from '@/composables/useToast';
import IErrorsBack from "@/interfaces/Axios/IErrorsBack";
import { useAuthenticationStore } from "@/stores/useAuthenticationStore";
import { computed, onMounted, reactive, ref } from 'vue';
import type { VForm } from 'vuetify/components/VForm';

definePage({
  path: "pendingRegistration-notes/:id",
  name: "PendingRegistration-Notes",
  meta: {
    redirectIfLoggedIn: true,
    requiresAuth: true,
    requiredPermission: "pendingRegistration.list",
  },
});

const authenticationStore = useAuthenticationStore();
const route = useRoute();
const { toast } = useToast();
const errorsBack = ref<IErrorsBack>({});
const formValidation = ref<VForm>();
const loading = reactive({
  form: false,
  attempts: false,
  submit: false,
});

const form = ref({
  id: null as string | null,
  term_id: null as string | null,
  term_name: null as string | null,
  type_education_id: null as string | null,
  type_education_name: null as string | null,
  grade_name: null as string | null,
  grade_id: null as string | null,
  students: [] as any[],
});

const attempts = ref<any[]>([]); // Almacena los intentos cargados
const selectedAttempt = ref<any>(null); // Para agregar/editar intento
const showModal = ref(false); // Controla el modal

const selectedSubjects = computed(() => {
  const subjectMap = new Map<string, { value: string; title: string }>();
  form.value.students.forEach(student => {
    student.subjects.forEach((subject: { id: string; name: string }) => {
      if (!subjectMap.has(subject.id)) {
        subjectMap.set(subject.id, {
          value: subject.id,
          title: subject.name,
        });
      }
    });
  });
  return Array.from(subjectMap.values());
});

const fetchDataForm = async () => {
  const pendingRegistrationId = route.params.id as string;
  const url = `/pendingRegistration/${pendingRegistrationId}/show`;
  loading.form = true;
  const { data, response } = await useApi<any>(createUrl(url, {
    query: { company_id: authenticationStore.company.id },
  }));

  loading.form = false;

  if (response.value?.ok && data.value) {
    if (data.value.form) {
      form.value = {
        id: data.value.form.id || null,
        term_id: data.value.form.term_id || null,
        term_name: data.value.form.term_name || null,
        type_education_id: data.value.form.type_education_id || null,
        type_education_name: data.value.form.type_education_name || null,
        grade_name: data.value.form.grade_name || null,
        grade_id: data.value.form.grade_id || null,
        students: data.value.form.students || [],
      };
    }
  } else {
    toast('Error al cargar la sección', '', 'danger');
  }
};

const fetchAttempts = async () => {
  const pendingRegistrationId = route.params.id as string;
  const url = `/pendingRegistration/attempts/${pendingRegistrationId}`;
  loading.attempts = true;
  const { data, response } = await useApi<any>(createUrl(url, {
    query: { company_id: authenticationStore.company.id },
  }));

  loading.attempts = false;

  if (response.value?.ok && data.value) {

    // Transformar los datos de la API al formato esperado por el frontend
    console.log("data.value.data", data.value.data);
    attempts.value = (data.value.data || [])
    console.log('Intentos transformados:', attempts.value);
  } else {
    toast('Error al cargar los intentos', '', 'danger');
    console.log('Error en fetchAttempts:', response.value, data.value);
  }
};

// Método para agregar un nuevo intento
const addAttempt = async (attemptData: any) => {
  loading.submit = true;
  const { data, response } = await useApi('/pendingRegistration/attempts/store').post(attemptData);
  loading.submit = false;

  if (response.value?.ok && data.value) {
    if (data.value.code === 200) {
      await fetchAttempts(); // Recarga los intentos
      showModal.value = false;
      toast('Intento creado exitosamente', '', 'success');
    }
  } else if (data.value?.code === 422) {
    errorsBack.value = data.value.errors ?? {};
    toast('Error al crear el intento', '', 'danger');
  } else {
    console.log('Respuesta inesperada al crear intento:', response.value, data.value);
  }
};

// Método para actualizar un intento
const updateAttempt = async (id: string, attemptData: any) => {
  loading.submit = true;
  const { data, response } = await useApi(`/pendingRegistration/attempts/update/${id}`).post(attemptData);
  loading.submit = false;

  if (response.value?.ok && data.value) {
    if (data.value.code === 200) {
      await fetchAttempts(); // Recarga los intentos
      showModal.value = false;
    }
  } else if (data.value?.code === 422) {
    errorsBack.value = data.value.errors ?? {};
  } else {
    console.log('Respuesta inesperada al actualizar intento:', response.value, data.value);
  }
};

// Abrir modal para agregar o editar
const openModal = (student: any, subject: any, attempt: any = null) => {
  const studentId = student.student_id.value;
  const subjectId = subject.value;
  const existingAttempts = attempts.value.filter(a => a.student_id.value === studentId && a.subject_id.value === subjectId);

  selectedAttempt.value = attempt ? { ...attempt } : {
    pending_registration_id: route.params.id,
    student_id: { value: student.student_id.value, title: student.student_id.title },
    subject_id: { value: subjectId, title: subject.title },
    attempt_number: existingAttempts.length + 1,
    note: null,
    attempt_date: null,
  };
  showModal.value = true;
};

// Método para manejar el submit del formulario
const handleSubmit = async () => {
  const validation = await formValidation.value?.validate();
  if (validation?.valid) {
    const attemptData = {
      pending_registration_id: route.params.id,
      student_id: selectedAttempt.value.student_id.value,
      subject_id: selectedAttempt.value.subject_id.value,
      attempt_number: selectedAttempt.value.attempt_number,
      note: selectedAttempt.value.note,
      attempt_date: selectedAttempt.value.attempt_date,
    };

    if (selectedAttempt.value.id) {
      await updateAttempt(selectedAttempt.value.id, attemptData);
    } else {
      await addAttempt(attemptData);
    }
  } else {
    toast('Faltan campos por diligenciar', '', 'danger');
  }
};

// Computeds para organizar datos
const getAttemptsByStudentSubject = (studentId: string, subjectId: string) => {
  return attempts.value.filter(a => a.student_id.value === studentId && a.subject_id.value === subjectId);
};

const isLoading = computed(() => {
  return Object.values(loading).some(value => value);
});

onMounted(async () => {
  await fetchDataForm();
  await fetchAttempts();
});
</script>

<template>
  <div>
    <VCard :disabled="loading.form" :loading="loading.form">
      <VCardTitle class="d-flex justify-space-between">
        <span>Gestionar Notas - {{ route.params.id }}</span>
      </VCardTitle>

      <!-- Nueva sección de previsualización -->
      <VCardText>
        <VRow>
          <VCol cols="12">
            <h2 class="text-center">
              {{ authenticationStore.company.name }}
            </h2>
            <p class="text-center">
              Año Escolar: {{ form.term_name || 'N/A' }} | Fecha: {{ new Date().toLocaleDateString('es-ES') }}
            </p>
            <p class="text-center">
              Resumen de las Evaluaciones - Def. 1er Lap.
            </p>
          </VCol>
        </VRow>

        <VRow>
          <VCol cols="12">
            <h3>
              Sección: {{ form.type_education_name || 'N/A' }} - {{ form.grade_name || 'N/A' }}
            </h3>
            <VTable class="bordered-table">
              <thead>
                <tr>
                  <th>No.</th>
                  <th>ALUMNO</th>
                  <th v-for="subject in selectedSubjects" :key="subject.value">
                    {{ subject.title }}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(student, index) in form.students" :key="student.student_id?.value">
                  <td>{{ index + 1 }}</td>
                  <td>{{ student.student_id?.title || 'N/A' }}</td>
                  <td v-for="subject in selectedSubjects" :key="subject.value" :class="{
                    'bg-yellow-lighten-3': student.subjects.some((s: { id: string }) => s.id === subject.value),
                    'bg-grey-lighten-3': !student.subjects.some((s: { id: string }) => s.id === subject.value) && selectedSubjects.length > 0
                  }">
                    <div v-if="student.subjects.some((s: { id: string }) => s.id === subject.value)"
                      class="d-flex flex-column justify-center align-center">
                      <VBtn v-if="getAttemptsByStudentSubject(student.student_id.value, subject.value).length < 4"
                        icon="tabler-plus" size="small" color="primary" @click="openModal(student, subject)"></VBtn>

                      <VChip v-for="attempt in getAttemptsByStudentSubject(student.student_id.value, subject.value)"
                        :key="attempt.id" :color="attempt.approved ? 'success' : 'warning'" class="ma-1"
                        @click="openModal(student, subject, attempt)">
                        Intento {{ attempt.attempt_number }}: {{ attempt.note }} ({{ attempt.attempt_date }})
                      </VChip>
                    </div>
                  </td>
                </tr>
                <tr v-if="!form.students.length">
                  <td :colspan="selectedSubjects.length + 2" class="text-center">
                    No hay estudiantes seleccionados.
                  </td>
                </tr>
              </tbody>
            </VTable>
          </VCol>
        </VRow>
      </VCardText>

      <VCardText class="d-flex justify-end gap-3 flex-wrap mt-5">
        <BtnBack :disabled="isLoading" :loading="isLoading" />
      </VCardText>

      <!-- Modal para agregar/editar intento -->
      <VDialog v-model="showModal" max-width="500px">
        <VCard>
          <VCardTitle>{{ selectedAttempt?.id ? 'Editar Intento' : 'Agregar Intento' }}</VCardTitle>
          <VCardText>
            <VForm ref="formValidation" @submit.prevent="handleSubmit">
              <VRow>
                <VCol cols="12">
                  <VTextField v-model="selectedAttempt.student_id.title" label="Estudiante" disabled></VTextField>
                </VCol>
                <VCol cols="12">
                  <VTextField v-model="selectedAttempt.subject_id.title" label="Materia" disabled></VTextField>
                </VCol>
                <VCol cols="12" md="6">
                  <VTextField v-model="selectedAttempt.attempt_number" label="Número de Intento" type="number"
                    :disabled="!!selectedAttempt.id"
                    :rules="[(v) => !!v && v >= 1 && v <= 4 || 'Debe ser entre 1 y 4']"></VTextField>
                </VCol>
                <VCol cols="12" md="6">
                  <VTextField v-model="selectedAttempt.note" label="Nota (0-20)" type="number"
                    :rules="[(v) => !!v && v >= 0 && v <= 20 || 'Debe estar entre 0 y 20']"></VTextField>
                </VCol>
                <VCol cols="12" md="6">
                  <VTextField v-model="selectedAttempt.attempt_date" label="Fecha del Intento" type="date"
                    :rules="[(v) => !!v || 'La fecha es obligatoria']"></VTextField>
                </VCol>
              </VRow>
              <VCardActions>
                <VBtn color="error" @click="showModal = false">Cancelar</VBtn>
                <VBtn color="primary" type="submit" :loading="loading.submit">Guardar</VBtn>
              </VCardActions>
            </VForm>
          </VCardText>
        </VCard>
      </VDialog>
    </VCard>
  </div>
</template>

<style scoped>
.bordered-table th,
.bordered-table td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: center;
}
</style>
