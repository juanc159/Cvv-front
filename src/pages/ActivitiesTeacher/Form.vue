<script lang="ts" setup>
import { useToast } from '@/composables/useToast';
import IErrorsBack from "@/interfaces/Axios/IErrorsBack";
import { router } from '@/plugins/1.router';
import { useAuthenticationStore } from "@/stores/useAuthenticationStore";
import { computed, onMounted, reactive, ref, watch } from 'vue';
import { useTheme } from 'vuetify';
import type { VForm } from 'vuetify/components/VForm';

definePage({
  path: "activity-form/:action/:id?",
  name: "ActivitiesTeacher-Form",
  meta: {
    redirectIfLoggedIn: true,
    requiresAuth: true,
    requiredPermission: "activity.list",
  },
});

const authenticationStore = useAuthenticationStore();
const { toast } = useToast();
const { global } = useTheme();
const errorsBack = ref<IErrorsBack>({});
const disabledFiledsView = ref<boolean>(false);
const route = useRoute();
const formValidation = ref<VForm>();
const editorKey = ref<number>(1);
const themeEditor = ref({});

const loading = reactive({
  form: false,
});

const selectOptions = reactive({
  subjects: [] as Array<{ value: string; label: string }>,
  grades: [] as Array<{ value: string; label: string }>,
  sections: [] as Array<{ value: string; label: string }>,
  rules: [] as Array<{ grade_id: string; section_id: string; subject_ids: string[] }>,
});

const filteredSections = ref<Array<{ value: string; label: string }>>([]);
const filteredSubjects = ref<Array<{ value: string; label: string }>>([]);
const activityStatusEnum_arrayInfo = ref<Array<{ value: string; title: string }>>([]);

const form = reactive({
  id: null as string | null,
  title: '',
  description: '',
  subject_id: null as string | null,
  grade_id: null as string | null,
  section_id: null as string | null,
  deadline_at: '' as string,
  status: null as string | null,
  company_id: null as string | null,
  teacher_id: null as string | null,
});

// -------------------- HELPERS --------------------
const clearForm = () => {
  form.id = null;
  form.title = '';
  form.description = '';
  form.subject_id = null;
  form.grade_id = null;
  form.section_id = null;
  form.deadline_at = '';
  form.status = null;
  form.company_id = null;
  form.teacher_id = null;
};

const applyGradeFilter = (keepSelection = false) => {
  const gradeId = form.grade_id

  if (!gradeId) {
    filteredSections.value = selectOptions.sections
    filteredSubjects.value = []
    if (!keepSelection) {
      form.section_id = null
      form.subject_id = null
    }
    return
  }

  const sectionIds = new Set(
    selectOptions.rules.filter(r => r.grade_id === gradeId).map(r => r.section_id)
  )

  filteredSections.value = selectOptions.sections.filter(s => sectionIds.has(s.value))

  if (!keepSelection) {
    form.section_id = null
    form.subject_id = null
    filteredSubjects.value = []
  } else {
    // si la sección actual ya no es válida, resetea
    if (form.section_id && !sectionIds.has(form.section_id)) {
      form.section_id = null
      form.subject_id = null
      filteredSubjects.value = []
    }
  }
}


const applySectionFilter = (keepSelection = false) => {
  const gradeId = form.grade_id
  const sectionId = form.section_id

  if (!gradeId || !sectionId) {
    filteredSubjects.value = []
    if (!keepSelection) form.subject_id = null
    return
  }

  const rule = selectOptions.rules.find(r => r.grade_id === gradeId && r.section_id === sectionId)
  const allowed = new Set(rule?.subject_ids ?? [])

  filteredSubjects.value = selectOptions.subjects.filter(s => allowed.has(s.value))

  // siempre valida: si subject actual no está permitido, se limpia
  if (form.subject_id && !allowed.has(form.subject_id)) {
    form.subject_id = null
  }
}


// -------------------- API: FETCH DATA (TODO EN UNO) --------------------
const fetchDataForm = async () => {
  const action = route.params.action;
  const activityId = route.params.id;

  // Setear IDs básicos
  form.id = activityId as string || null;
  form.company_id = authenticationStore.company.id;
  form.teacher_id = String(authenticationStore.user?.id) || null;

  // Determinar URL según si es creación o edición
  const url = form.id ? `/activity/${form.id}/edit` : '/activity/create';

  loading.form = true;

  try {
    const { response, data } = await useAxios(url).get({
      params: {
        company_id: form.company_id,
        teacher_id: form.teacher_id,
      },
    });


    if (response.status === 200 && data.code === 200) {
      // 1. Cargar opciones de select (vienen en ambos casos)
      if (data.data) {
        selectOptions.grades = data.data?.grades ?? [];
        selectOptions.sections = data.data?.sections ?? [];
        selectOptions.subjects = data.data?.subjects ?? [];
        selectOptions.rules = data.data?.rules ?? [];
        activityStatusEnum_arrayInfo.value = data?.activityStatusEnum_arrayInfo ?? [];

        filteredSections.value = selectOptions.sections;
        filteredSubjects.value = [];
      }


      // 2. Si es edición, cargar datos del formulario
      if (data.form) {
        const formData = data.form;
        form.title = formData.title ?? '';
        form.description = formData.description ?? '';
        form.status = formData.status;
        form.deadline_at = formData.deadline_at
          ? formData.deadline_at.slice(0, 16)
          : '';


        console.log("data.form:", data.form);

        form.grade_id = formData.grade_id ?? null;
        form.section_id = formData.section_id ?? null;
        form.subject_id = formData.subject_id ?? null;
      }

      // 3. Aplicar filtros después de cargar todo
      applyGradeFilter(true);
      applySectionFilter(true);

    }
  } catch (e) {
    console.error('fetchDataForm error:', e);
    toast('Error al cargar los datos', '', 'danger');
  } finally {
    loading.form = false;
  }
};

// -------------------- API: SAVE --------------------
const submitForm = async () => {
  const validation = await formValidation.value?.validate();
  if (validation?.valid) {




    loading.form = true;

    try {
      const payload: any = {
        id: form.id,
        company_id: form.company_id,
        teacher_id: form.teacher_id,
        title: form.title,
        description: form.description,
        deadline_at: form.deadline_at || null,
        status: form.status,
        subject_id: form.subject_id,
        grade_id: form.grade_id,
        section_id: form.section_id,
      };

      const url = form.id ? `/activity/update/${form.id}` : '/activity/store';
      const { data, response } = await useAxios(url).post(payload);

      if (response.status === 200 && data) {
        if (data.code === 200) {
          router.push({ name: 'ActivitiesTeacher-List' });
        } else if (data.code === 422) {
          errorsBack.value = data.errors ?? {};
        }
      }
    } catch (e) {
      console.error('saveActivity error:', e);
      toast('Error al guardar la actividad', '', 'danger');
    } finally {
      loading.form = false;
    }

  }
  else {
    toast('Faltan Campos Por Diligenciar', '', 'danger')
  }


};


// Watch para el tema del editor
watch(() => global.current.value.dark, (newDarkValue) => {
  editorKey.value++;
  const theme = {
    skin: newDarkValue ? 'oxide-dark' : 'oxide',
    content_css: newDarkValue ? 'dark' : 'default',
  };
  themeEditor.value = theme;
}, { immediate: true });

// -------------------- LIFECYCLE --------------------
if (route.params.action === 'view') disabledFiledsView.value = true;

onMounted(async () => {
  clearForm();
  await fetchDataForm();
});

// Computed para loading state
const isLoading = computed(() => {
  return Object.values(loading).some(value => value);
});
</script>

<template>
  <div>
    <VCard :disabled="loading.form" :loading="loading.form">
      <VCardTitle class="d-flex justify-space-between">
        <span>
          {{ route.params.action === 'edit' ? 'Editar Actividad' :
            route.params.action === 'view' ? 'Ver Actividad' : 'Nueva Actividad' }}
        </span>
      </VCardTitle>
      <VCardText>
        <VForm ref="formValidation" @submit.prevent="() => { }" :disabled="disabledFiledsView">
          <VRow>
            <VCol cols="12">
              <AppTextField label="Título de la Actividad" v-model="form.title" placeholder="Ej: Análisis Literario"
                variant="outlined" density="comfortable" :requiredField="true" :rules="[requiredValidator]"
                :disabled="disabledFiledsView" />
            </VCol>

            <!-- Año -->
            <VCol cols="6" sm="4">
              <AppSelect label="Año" :items="selectOptions.grades" v-model="form.grade_id" variant="outlined"
                density="comfortable" clearable :disabled="disabledFiledsView || loading.form" :requiredField="true"
                :rules="[requiredValidator]" @update:model-value="applyGradeFilter()" />
            </VCol>

            <!-- Sección (depende del año) -->
            <VCol cols="6" sm="4">
              <AppSelect label="Sección" :items="filteredSections" v-model="form.section_id" variant="outlined"
                density="comfortable" clearable :disabled="!form.grade_id || disabledFiledsView || loading.form"
                :requiredField="true" :rules="[requiredValidator]" @update:model-value="applySectionFilter()" />
            </VCol>

            <!-- Materia (depende de año+sección) -->
            <VCol cols="12" sm="4">
              <AppSelect label="Materia" :items="filteredSubjects" v-model="form.subject_id" variant="outlined"
                density="comfortable" clearable
                :disabled="!form.grade_id || !form.section_id || disabledFiledsView || loading.form"
                :requiredField="true" :rules="[requiredValidator]" />
            </VCol>

            <VCol cols="12">
              <label class="v-label text-body-2 mb-2 d-block">Instrucciones para el estudiante</label>
              <Editor :key="editorKey" :api-key="API_KEY_EDITOR" :init="{
                ...themeEditor,
                toolbar_mode: 'sliding',
                plugins: 'anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount linkchecker code',
                toolbar: 'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table | align lineheight | numlist bullist indent outdent | emoticons charmap | removeformat',
                readonly: disabledFiledsView,
              }" v-model="form.description" />
            </VCol>

            <VCol cols="12" sm="6">
              <AppTextField type="datetime-local" label="Fecha Límite" v-model="form.deadline_at" variant="outlined"
                density="comfortable" :disabled="disabledFiledsView" :requiredField="true"
                :rules="[requiredValidator]" />
            </VCol>

            <VCol cols="12" sm="6">
              <AppSelect label="Estado" v-model="form.status" :items="activityStatusEnum_arrayInfo" variant="outlined"
                density="comfortable" :disabled="disabledFiledsView || loading.form" :requiredField="true"
                :rules="[requiredValidator]" />
            </VCol>
          </VRow>
        </VForm>
      </VCardText>

      <VCardText class="d-flex justify-end gap-3 flex-wrap mt-5">
        <BtnBack :disabled="isLoading" :loading="isLoading" />
        <VBtn v-if="!disabledFiledsView" :disabled="isLoading" :loading="isLoading" @click="submitForm()"
          color="primary">
          {{ form.id ? 'Guardar Cambios' : 'Crear Actividad' }}
        </VBtn>
      </VCardText>
    </VCard>
  </div>
</template>
