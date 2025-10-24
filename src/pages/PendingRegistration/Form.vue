<script lang="ts" setup>
import { useToast } from '@/composables/useToast';
import IErrorsBack from "@/interfaces/Axios/IErrorsBack";
import { router } from '@/plugins/1.router';
import { useAuthenticationStore } from "@/stores/useAuthenticationStore";
import { computed, onMounted, reactive, ref } from 'vue';
import type { VForm } from 'vuetify/components/VForm';

definePage({
  path: "pendingRegistration-form/:action/:id?",
  name: "PendingRegistration-Form",
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
const disabledFieldsView = ref<boolean>(false);
const formValidation = ref<VForm>();
const loading = reactive({
  form: false,
});

const terms = ref([]);
const typeEducations = ref([]);

const form = ref({
  id: null as string | null,
  term_id: null as string | null,
  type_education_id: null as string | null,
  grade_id: null as string | null,
  code: null as string | null,
  students: [] as { student_id: string | null, subjects: string[] }[],
});

const clearForm = () => {
  form.value = {
    id: null,
    term_id: null,
    type_education_id: null,
    grade_id: null,
    students: [],
  };
};


const fetchDataForm = async () => {
  form.value.id = route.params.id as string | null;

  const url = form.value.id ? `/pendingRegistration/${form.value.id}/edit` : `/pendingRegistration/create`;
  loading.form = true;
  const { data, response } = await useApi<any>(
    createUrl(`${url}`, {
      query: {
        company_id: authenticationStore.company.id,
      },
    })
  );

  loading.form = false;

  if (response.value?.ok && data.value) {
    if (data.value.form) {
      form.value = {
        id: data.value.form.id || null,
        term_id: data.value.form.term_id || null,
        code: data.value.form.code || null,
        type_education_id: data.value.form.type_education_id || null,
        grade_id: data.value.form.grade_id || null,
        students: data.value.form.students || [],
      };
    }
    if (data.value.terms) terms.value = data.value.terms;
    if (data.value.typeEducations) typeEducations.value = data.value.typeEducations;
  }
};

const addStudent = () => {
  form.value.students.push({ student_id: null, subjects: [] });
};

const removeStudent = (index: number) => {
  form.value.students.splice(index, 1);
};

const submitForm = async () => {
  const validation = await formValidation.value?.validate();
  if (validation?.valid) {
    const payload = {
      ...form.value,
      company_id: authenticationStore.company.id,
      students: form.value.students.map(student => ({
        student_id: student.student_id,
        subjects: student.subjects,
      })),
    };

    const url = form.value.id ? `/pendingRegistration/update/${form.value.id}` : `/pendingRegistration/store`;
    loading.form = true;
    const { data, response } = await useAxios(url).post(payload);
    loading.form = false;

    if (response.status == 200 && data) {
      if (data.code === 200) {
        router.push({ name: 'PendingRegistration-List' });
      }
    }
    if (data.code === 422) {
      errorsBack.value = data.errors ?? {};
    }
  } else {
    toast('Faltan campos por diligenciar', '', 'danger');
  }
};

if (route.params.action === 'view') disabledFieldsView.value = true;

onMounted(async () => {
  // await fetchOptions();
  clearForm();
  await fetchDataForm();
});

const isLoading = computed(() => {
  return Object.values(loading).some(value => value);
});

const codeRules = [(v: string) => !!v || 'El código es obligatorio'];
const termRules = [(v: string) => !!v || 'El periodo es obligatorio'];
const gradeRules = [(v: string) => !!v || 'El grado es obligatorio'];
const studentRules = [(v: string) => !!v || 'El estudiante es obligatorio'];
const subjectsRules = [(v: string[]) => v.length > 0 || 'Debe seleccionar al menos una materia'];


const gradesFilter = computed(() => {
  if (form.value.type_education_id) {
    const typeEducation = typeEducations.value.find(ele => ele.value == form.value.type_education_id);
    return typeEducation ? typeEducation.grades : [];
  }
  return []
})

const subjectsFilter = computed(() => {
  if (form.value.grade_id) {
    return gradesFilter.value.find(ele => ele.value == form.value.grade_id).subjects
  }
  return []
})


const selectedSubjects = computed(() => {
  const allSubjects = form.value.students.flatMap(student => student.subjects);
  return [...new Set(allSubjects)].map(subjectId =>
    subjectsFilter.value.find(subject => subject.value === subjectId)
  ).filter(subject => subject !== undefined);
});
</script>

<template>
  <div>
    <VCard :disabled="loading.form" :loading="loading.form">
      <VCardTitle class="d-flex justify-space-between">
        <span>
          Formulario periodo escolar
        </span>
      </VCardTitle>
      <VCardText>
        <VForm ref="formValidation" @submit.prevent="submitForm" :disabled="disabledFieldsView">
          <VRow>
            <VCol cols="12" md="3">
              <AppSelect requiredField="true" clearable v-model="form.term_id" :items="terms" label="Periodo"
                :rules="termRules" :error-messages="errorsBack.term_id" @change="errorsBack.term_id = ''"
                :readonly="disabledFieldsView">
              </AppSelect>
            </VCol>
            <VCol cols="12" md="3">
              <AppTextField requiredField="true" v-model="form.code" :rules="codeRules" label="Código de sección">
              </AppTextField>
            </VCol>
            <VCol cols="12" md="3">
              <AppSelect requiredField="true" clearable v-model="form.type_education_id" :items="typeEducations"
                label="Tipo de educación" :rules="termRules" :error-messages="errorsBack.term_id"
                @change="errorsBack.term_id = ''" :readonly="disabledFieldsView">
              </AppSelect>
            </VCol>
            <VCol cols="12" md="3">
              <AppSelect requiredField="true" clearable v-model="form.grade_id" :items="gradesFilter"
                label="Grados y niveles" :rules="gradeRules" :error-messages="errorsBack.grade_id"
                @change="errorsBack.grade_id = ''" :readonly="disabledFieldsView">
              </AppSelect>
            </VCol>
            <VCol cols="12">
              <VExpansionPanels multiple>
                <VExpansionPanel v-for="(student, index) in form.students" :key="index">
                  <VExpansionPanelTitle>
                    Estudiante {{ index + 1 }}
                    <template v-slot:actions>
                      <VBtn icon="tabler-x" color="error" @click="removeStudent(index)" v-if="!disabledFieldsView">
                      </VBtn>
                    </template>
                  </VExpansionPanelTitle>
                  <VExpansionPanelText>
                    <VRow>
                      <VCol cols="12" md="6">
                        <AppSelectRemote v-model="student.student_id" url="selectInfiniteStudent" arrayInfo="student"
                          :rules="studentRules" label="Estudiante"
                          :error-messages="errorsBack[`students.${index}.student_id`]"
                          @input="errorsBack[`students.${index}.student_id`] = ''" :readonly="disabledFieldsView"
                          :params="{
                            type_education_id: form.type_education_id,
                          }">
                        </AppSelectRemote>
                      </VCol>
                      <VCol cols="12" md="6">
                        <AppAutocomplete v-model="student.subjects" :items="subjectsFilter" label="Materias" multiple
                          chips closable-chips :rules="subjectsRules"
                          :error-messages="errorsBack[`students.${index}.subjects`]"
                          @input="errorsBack[`students.${index}.subjects`] = ''" :readonly="disabledFieldsView">
                        </AppAutocomplete>
                      </VCol>
                    </VRow>
                  </VExpansionPanelText>
                </VExpansionPanel>
              </VExpansionPanels>
              <VBtn v-if="!disabledFieldsView" color="primary" @click="addStudent" class="mt-2">
                Agregar Estudiante
              </VBtn>
            </VCol>
          </VRow>
          <VRow>
            <VCol cols="12">
              <div v-if="Object.keys(errorsBack).length > 0" class="error--text">
                Por favor, corrige los errores indicados.
              </div>
            </VCol>
          </VRow>
        </VForm>
      </VCardText>

      <!-- Nueva sección de previsualización -->
      <VCardText>
        <VRow>
          <VCol cols="12">
            <h2 class="text-center">
              {{ authenticationStore.company.name }}
            </h2>
            <p class="text-center">
              Año Escolar: {{terms.find(term => term.value === form.term_id)?.title || 'N/A'}} | Fecha: {{ new
                Date().toLocaleDateString('es-ES') }}
            </p>
            <p class="text-center">
              Reporte de materia pendiente.
            </p>
          </VCol>
        </VRow>

        <VRow>
          <VCol cols="12">
            <h3>
              Sección:
              {{terms.find(term => term.value === form.term_id)?.title || 'N/A'}} -
              {{typeEducations.find(te => te.value === form.type_education_id)?.title || 'N/A'}} -
              {{gradesFilter.find(grade => grade.value === form.grade_id)?.title || 'N/A'}} -
              {{ form.code || 'N/A' }}
            </h3>
            <VTable class="bordered-table">
              <thead>
                <tr>
                  <th>No.</th>
                  <th>ALUMNO</th>
                  <th v-for="subject in selectedSubjects" :key="subject.value">
                    {{ subject.abbreviation || subject.title }}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(student, index) in form.students" :key="student.student_id?.value">
                  <td>{{ index + 1 }}</td>
                  <td>{{ student.student_id?.title || 'N/A' }}</td>
                  <td v-for="subject in selectedSubjects" :key="subject.value" :class="{
                    'bg-yellow-lighten-3': student.subjects.includes(subject.value),
                    'bg-grey-lighten-3': !student.subjects.includes(subject.value) && selectedSubjects.length > 0
                  }">
                    {{ student.subjects.includes(subject.value) ? '--' : '' }}
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
        <VBtn v-if="!disabledFieldsView" :disabled="isLoading" :loading="isLoading" @click="submitForm" color="primary">
          Guardar
        </VBtn>
      </VCardText>
    </VCard>
  </div>
</template>


<style scoped>
.bordered-table th,
.bordered-table td {
  border: 1px solid #ccc;
  padding: 8px;
  text-align: center;
}
</style>
