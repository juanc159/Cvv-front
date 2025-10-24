<script lang="ts" setup>
import { useToast } from '@/composables/useToast';
import IErrorsBack from "@/interfaces/Axios/IErrorsBack";
import { router } from '@/plugins/1.router';
import { useAuthenticationStore } from "@/stores/useAuthenticationStore";
import type { VForm } from 'vuetify/components/VForm';

definePage({
  path: "teacher-form/:action/:id?",
  name: "Teacher-Form",
  meta: {
    redirectIfLoggedIn: true,
    requiresAuth: true,
    requiredPermission: "teacher.list",
  },
});

const authenticationStore = useAuthenticationStore();

const { toast } = useToast()
const errorsBack = ref<IErrorsBack>({});
const disabledFiledsView = ref<boolean>(false);
const route = useRoute()
const formValidation = ref<VForm>()
const complementaryValidation = ref<VForm>();
const loading = reactive({
  form: false,
})

const typeEducations = ref<Array<{
  value: string,
  title: string,
}>>([])
const jobPositions = ref<Array<{
  value: string,
  title: string,
}>>([])
const sections = ref<Array<{
  value: string,
  title: string,
}>>([])

const form = ref({
  id: null as string | null,
  type_education_id: null as string | null,
  job_position_id: null as string | null,
  name: null as string | null,
  last_name: null as string | null,
  email: null as string | null,
  password: null as string | null,
  phone: null as string | null,
  photo: null as string | null | File,
  company_id: null as string | null,
  complementaries: [] as Array<object>,
});

const clearForm = () => {
  for (const key in form.value) {
    form.value[key] = null
  }
  form.value.complementaries = []
}

const fetchDataForm = async () => {

  form.value.id = route.params.id || null

  const url = form.value.id ? `/teacher/${form.value.id}/edit` : `/teacher/create`

  loading.form = true
  const { data, response } = await useApi<any>(
    createUrl(url, {
      query: {
        company_id: authenticationStore.company.id
      },
    })
  );

  loading.form = false

  if (response.value?.ok && data.value) {
    typeEducations.value = data.value.typeEducations
    jobPositions.value = data.value.jobPositions
    sections.value = data.value.sections

    //formulario 
    if (data.value.form) {
      form.value = data.value.form
    }
  }
}

const submitForm = async () => {
  const validation = await formValidation.value?.validate()
  if (validation?.valid) {

    form.value.company_id = authenticationStore.company.id;

    const formData = new FormData();
    for (const key in form.value) {
      if (!["complementaries"].includes(key)) {
        formData.append(key, form.value[key])
      }
    }
    formData.append("complementaries", JSON.stringify(form.value.complementaries))

    const url = form.value.id ? `/teacher/update/${form.value.id}` : `/teacher/store`

    loading.form = true;
    const { data, response } = await useApi(url).post(formData);
    loading.form = false;

    if (response.value?.ok && data.value) {

      if (data.value.code == 200) {
        router.push({ name: 'Teacher-List' })
      }
    }
    if (data.value.code === 422) errorsBack.value = data.value.errors ?? {};

  }
  else {
    toast('Faltan Campos Por Diligenciar', '', 'danger')
  }
}

if (route.params.action == 'view') disabledFiledsView.value = true

onMounted(async () => {
  clearForm()
  await fetchDataForm()
})


// Computed que verifica si al menos uno de los valores es true
const isLoading = computed(() => {
  return Object.values(loading).some(value => value);
});



const arrayValidation = ref<Array<string | boolean>>([]);
// File
const archive = ref(useFileUpload());
const aExtImage = ["jpg", "jpeg", "png"];
archive.value.allowedExtensions = aExtImage;


const addPhoto = (e: Event) => {
  archive.value.handleImageSelected(e);
  setTimeout(() => {
    form.value.photo = archive.value.imageFile;
  }, 1000);
};

watch(
  form,
  (newValue, oldValue) => {
    if (!newValue.id) {
      arrayValidation.value.photo = [requiredValidator(archive.value.imageUrl)]
      arrayValidation.value.password = [requiredValidator]
    }
    else {
      arrayValidation.value["photo"] = []
      arrayValidation.value["password"] = []
    }
  },
  { deep: true }
);


//Información complementaria
const headers = [
  { title: "Grado o nivel", key: "grade_name" },
  { title: "Sección", key: "section_name" },
  { title: "Materias", key: "subjects" },
  { title: "Acciones", key: "actions" },
];

const formComplementary = ref<{
  grade_id: null | number
  section_id: null | number
  subjects: Array<number>
}>({
  grade_id: null,
  section_id: null,
  subjects: [],
})

const clearFormComplementary = () => {
  formComplementary.value = {
    grade_id: null,
    section_id: null,
    subjects: [],
  }
}

const addInfo = async () => {
  const validation = await complementaryValidation.value?.validate();
  if (validation?.valid) {
    const searchGrade = gradesFilter.value.find(ele => ele.value == formComplementary.value.grade_id)
    const searchSection = sections.value.find(ele => ele.value == formComplementary.value.section_id)
    const subjectsData = subjectsFilter.value.filter(ele => formComplementary.value.subjects.includes(ele.value))

    form.value.complementaries.push({
      id: null,
      grade_id: formComplementary.value.grade_id,
      grade_name: searchGrade.title,
      section_id: formComplementary.value.section_id,
      section_name: searchSection.title,
      subjects: subjectsData,
      delete: 0,
    })

    clearFormComplementary()
  } else {
    toast("Faltan Campos Por Diligenciar", "", "danger");
  }

}
const deleteInfo = (index: number) => {
  form.value.complementaries.splice(index, 1)
}

const gradesFilter = computed(() => {
  if (form.value.type_education_id) {
    return typeEducations.value.find(ele => ele.value == form.value.type_education_id).grades
  }
  return []
})

const subjectsFilter = computed(() => {
  if (formComplementary.value.grade_id) {
    return gradesFilter.value.find(ele => ele.value == formComplementary.value.grade_id).subjects
  }
  return []
})

</script>


<template>
  <div>
    <VCard :disabled="loading.form" :loading="loading.form">
      <VCardTitle class="d-flex justify-space-between">
        <span>
          Formulario docente
        </span>
      </VCardTitle>
      <VCardText>

        <VForm ref="formValidation" @submit.prevent="() => { }" :disabled="disabledFiledsView">
          <VRow>
            <VCol cols="12" sm="3">
              <AppSelect :items="typeEducations" clearable :rules="[requiredValidator]" v-model="form.type_education_id"
                label="Tipo de educación" :requiredField="true"></AppSelect>
            </VCol>
            <VCol cols="12" sm="3">
              <AppSelect :items="jobPositions" :rules="[requiredValidator]" v-model="form.job_position_id" label="Cargo"
                :requiredField="true">
              </AppSelect>
            </VCol>
            <VCol cols="12" sm="3">
              <AppTextField clearable v-model="form.name" :rules="[requiredValidator]" :error-messages="errorsBack.name"
                label="Nombre" @input="errorsBack.name = ''" :requiredField="true">
              </AppTextField>
            </VCol>
            <VCol cols="12" sm="3">
              <AppTextField clearable v-model="form.last_name" :rules="[requiredValidator]"
                :error-messages="errorsBack.last_name" label="Apellido" @input="errorsBack.last_name = ''"
                :requiredField="true">
              </AppTextField>
            </VCol>
            <VCol cols="12" sm="3">
              <AppTextField clearable v-model="form.email" :rules="[requiredValidator, emailValidator]"
                :error-messages="errorsBack.email" label="Correo" @input="errorsBack.email = ''" :requiredField="true">
              </AppTextField>
            </VCol>
            <VCol cols="12" sm="3">
              <AppTextField clearable v-model="form.password" :error-messages="errorsBack.password" label="Contraseña"
                @input="errorsBack.password = ''" :requiredField="form.id ? false : true"
                :rules="arrayValidation['password']">
              </AppTextField>
            </VCol>
            <VCol cols="12" sm="3">
              <AppTextField clearable v-model="form.phone" :rules="[requiredValidator]"
                :error-messages="errorsBack.phone" label="Teléfono" @input="errorsBack.phone = ''"
                :requiredField="true">
              </AppTextField>
            </VCol>

            <VCol cols="12" sm="3">
              <VFileInput accept="image/*" :rules="arrayValidation['photo']" :key="archive.key"
                @change="addPhoto($event)" @click:clear="archive.clearData">
                <template #label>
                  Foto&nbsp;<b class="text-warning">*</b>
                </template>
              </VFileInput>
            </VCol>
          </VRow>

          <VRow>
            <VCol cols="12" class="d-flex justify-center ">
              <div style=" block-size: 200px;inline-size: 200px;">
                <VImg :src="archive.imageUrl ?? storageBack(form.photo)"></VImg>
              </div>
            </VCol>
          </VRow>

        </VForm>

      </VCardText>

      <VCardText>
        <VForm ref="complementaryValidation" lazy-validation>
          <VRow>
            <VCol cols="12">
              <h3>Información complementaria</h3>
            </VCol>
            <VCol cols="12" sm="3">
              <AppSelect clearable :items="gradesFilter" :rules="[requiredValidator]"
                v-model="formComplementary.grade_id" label="Grados y niveles">
              </AppSelect>
            </VCol>
            <VCol cols="12" sm="3">
              <AppSelect clearable :items="sections" :rules="[requiredValidator]" v-model="formComplementary.section_id"
                label="Secciones"></AppSelect>
            </VCol>
            <VCol cols="12" sm="3">
              <AppSelect clearable multiple :rules="[requiredValidator]" :items="subjectsFilter"
                v-model="formComplementary.subjects" label="Materias">
              </AppSelect>
            </VCol>
            <VCol cols="12" sm="3">
              <VBtn color="success" @click="addInfo()">Agregar</VBtn>
            </VCol>
            <VCol cols="12">
              <VDataTable :headers="headers" :items="form.complementaries" :items-per-page="999">
                <template #item.subjects="{ item }">
                  <VChip color="primary" class="mr-2" v-for="(element, index) in item.subjects" :key="index">{{
                    element.title }}
                  </VChip>
                </template>
                <template #item.actions="{ item, index }">
                  <VBtn icon size="x-small" color="error" variant="text" @click="deleteInfo(index)">
                    <VIcon size="22" icon="tabler-trash" />
                    <VTooltip location="top" transition="scale-transition" activator="parent" text="Eliminar">
                    </VTooltip>
                  </VBtn>
                </template>
                <template #bottom>
                </template>
              </VDataTable>
            </VCol>
          </VRow>
        </VForm>
      </VCardText>

      <VCardText class="d-flex justify-end gap-3 flex-wrap mt-5">
        <BtnBack :disabled="isLoading" :loading="isLoading" />
        <VBtn v-if="!disabledFiledsView" :disabled="isLoading" :loading="isLoading" @click="submitForm()"
          color="primary">
          Guardar
        </VBtn>
      </VCardText>
    </VCard>
  </div>
</template>
