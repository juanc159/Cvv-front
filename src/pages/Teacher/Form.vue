<script lang="ts" setup>
definePage({
  name: "Teacher-Form",
  path: "/teacher-form/:action/:id?",
  meta: {
    redirectIfLoggedIn: true,
    requiresAuth: true,
    requiredPermission: "teacher.index",
  },
});

import { useImageUpload } from "@/composables/useImageUpload";
import IErrorsBack from "@/interfaces/Axios/IErrorsBack";
import { useCrudTeacherStore } from "@/pages/Teacher/Store/useCrudTeacherStore";
import { useAuthenticationStore } from "@/stores/useAuthenticationStore";
import { VForm } from "vuetify/components";
import { VDataTable } from "vuetify/labs/VDataTable";

const route = useRoute();
const { toast } = useToast();
const formValidation = ref<VForm>();
const fileValidation = ref<VForm>();
const complementaryValidation = ref<VForm>();
const storeTeacher = useCrudTeacherStore();
const authenticationStore = useAuthenticationStore();
const { form, loading, jobPositions, typeEducations, subjects, sections, grades } = storeToRefs(storeTeacher);
const errorsBack = ref<IErrorsBack>({});

const arrayValidation = ref<Array<string | boolean>>([]);

// File
const archive = ref(useImageUpload());
const aExtImage = ["jpg", "jpeg", "png"];
archive.value.allowedExtensions = aExtImage;

const submitForm = async () => {
  form.value.company_id = authenticationStore.company.id;
  form.value.complementaries = arrayComplementary.value;
  const validation = await formValidation.value?.validate();
  if (validation?.valid) {
    const data = await storeTeacher.fetchSave();
    if (data?.code === 200) {
      arrayValidation.value = [];
      errorsBack.value = {};
      archive.value.clearData();
      await formValidation.value?.resetValidation();
    }
    if (data?.code === 422) errorsBack.value = data.errors ?? {}; // muestra error del back
  } else {
    toast("Faltan Campos Por Diligenciar", "", "danger");
  }
};

const addPhoto = (e: Event) => {
  archive.value.handleImageSelected(e);
  setTimeout(() => {
    form.value.photo = archive.value.imageFile;
  }, 1000);
};

onMounted(async () => {
  storeTeacher.clearForm();
  if (route.params.id) {
    await storeTeacher.fetchDataForm(
      Number(route.params.id),
      route.params.action
    );

    arrayComplementary.value = JSON.parse(JSON.stringify(form.value.complementaries))
  }
});

watch(
  form,
  (newValue, oldValue) => {
    if (!newValue.id) arrayValidation.value.photo = [requiredValidator(archive.value.imageUrl)]
    else arrayValidation.value["photo"] = []
  },
  { deep: true }
);

//COMPLEMENTARY
const formComplementary = ref<{
  grade_id: null | number
  section_id: null | number
  subjects: Array<number>
}>({
  grade_id: null,
  section_id: null,
  subjects: [],
})
const arrayComplementary = ref<Array<object>>([])

const headers = [
  { title: "Grado o nivel", key: "grade_name" },
  { title: "Sección", key: "section_name" },
  { title: "Materias", key: "subjects" },
  { title: "Acciones", key: "actions" },
];

const clearFormComplementary = () => {
  formComplementary.value = {
    grade_id: null,
    section_id: null,
    subjects: [],
  }
}
const addInfo = async () => {
  const validation = await formValidation.value?.validate();
  if (validation?.valid) {
    const searchGrade = grades.value.find(ele => ele.value == formComplementary.value.grade_id)
    const searchSection = sections.value.find(ele => ele.value == formComplementary.value.section_id)

    const subjectsData = subjects.value.filter(ele => formComplementary.value.subjects.includes(ele.value))

    arrayComplementary.value.push({
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
  if (arrayComplementary.value[index].id) arrayComplementary.value[index].delete = 1
  else arrayComplementary.value.splice(index, 1)

}

const arrayElementsComplementaries = computed(() => {
  return arrayComplementary.value.filter(ele => ele.delete != 1);
});



//documentos
const archiveDoc = ref(useImageUpload());
archiveDoc.value.allowedExtensions = ["jpg", "jpeg", "png"];
const headersFile = [
  { title: "Título", key: "name" },
  { title: "Acciones", key: "actions" },
];


const addFile = async () => {
  const validation = await fileValidation.value?.validate();
  console.log(validation);

  if (validation?.valid) {

    form.value.files.push({
      name: archiveDoc.value.name,
      file: archiveDoc.value.imageFile,
    })

    archiveDoc.value.clearData()

  }
};

</script>

<template>
  <div>
    <VCard>
      <VCardText>
        <VRow>
          <VCol>
            <HeaderAlertView sub-title="Formulario Teacher" :action="String($route.params.action)" btn-action="list"
              :validate-crud="true" :btn-back="true" @changeScreenBack="$router.back" />
          </VCol>
        </VRow>
        <VForm ref="formValidation" lazy-validation>
          <VRow>
            <VCol cols="12" sm="3">
              <VSelect :items="typeEducations" v-model="form.type_education_id" label="Tipo de educación"></VSelect>
            </VCol>
            <VCol cols="12" sm="3">
              <VSelect :items="jobPositions" v-model="form.job_position_id" label="Cargo"></VSelect>
            </VCol>
            <VCol cols="12" sm="3">
              <AppTextField clearable v-model="form.name" :rules="[requiredValidator]" :error-messages="errorsBack.name"
                label="Nombre" @keypress="errorsBack.name = ''" :requiredField="true">
              </AppTextField>
            </VCol>
            <VCol cols="12" sm="3">
              <AppTextField clearable v-model="form.last_name" :rules="[requiredValidator]"
                :error-messages="errorsBack.last_name" label="Apellido" @keypress="errorsBack.last_name = ''"
                :requiredField="true">
              </AppTextField>
            </VCol>
            <VCol cols="12" sm="3">
              <AppTextField clearable v-model="form.email" :rules="[requiredValidator]" :error-messages="errorsBack.email"
                label="Correo" @keypress="errorsBack.email = ''" :requiredField="true">
              </AppTextField>
            </VCol>
            <VCol cols="12" sm="3">
              <AppTextField clearable v-model="form.phone" :rules="[requiredValidator]" :error-messages="errorsBack.phone"
                label="Teléfono" @keypress="errorsBack.phone = ''" :requiredField="true">
              </AppTextField>
            </VCol>

            <VCol cols="12" sm="3">
              <VFileInput accept="image/*" :rules="arrayValidation['photo']" :key="archive.key" @change="addPhoto($event)"
                @click:clear="archive.clearData">
                <template #label>
                  Foto&nbsp;<b class="text-warning">*</b>
                </template>
              </VFileInput>
            </VCol>
          </VRow>

          <VRow>
            <VCol cols="12" class="d-flex justify-center ">
              <div style=" block-size: 200px;inline-size: 200px;">
                <VImg :src="archive.imageUrl ?? form.photo"></VImg>
              </div>
            </VCol>
          </VRow>

        </VForm>

        <VForm ref="complementaryValidation" lazy-validation>
          <VRow>
            <VCol cols="12">
              <h3>Información complementaria</h3>
            </VCol>
            <VCol cols="12" sm="3">
              <VSelect :items="grades" v-model="formComplementary.grade_id" label="Grados y niveles"></VSelect>
            </VCol>
            <VCol cols="12" sm="3">
              <VSelect :items="sections" v-model="formComplementary.section_id" label="Secciones"></VSelect>
            </VCol>
            <VCol cols="12" sm="3">
              <VSelect multiple :items="subjects" v-model="formComplementary.subjects" label="Materias"></VSelect>
            </VCol>
            <VCol cols="12" sm="3">
              <VBtn color="success" @click="addInfo()">Agregar</VBtn>
            </VCol>
            <VCol cols="12">
              <VDataTable :headers="headers" :items="arrayElementsComplementaries" :items-per-page="999">
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

        <VForm ref="fileValidation" lazy-validation>
          <VRow>
            <VCol cols="12">
              <h3>Planificación</h3>
            </VCol>
            <VCol cols="12" sm="6">
              <AppTextField clearable v-model="archiveDoc.name" :rules="[requiredValidator]" label="Titulo"
                :requiredField="true">
              </AppTextField>
            </VCol>
            <VCol cols="12" sm="3">
              <VLabel>Archivo&nbsp;<b class="text-warning">*</b></VLabel>
              <VFileInput accept="image/*" :rules="[requiredValidator]" :key="archiveDoc.key"
                @change="archiveDoc.handleImageSelected" @click:clear="archiveDoc.clearData">
              </VFileInput>
            </VCol>
            <VCol cols="12" sm="3">
              <VBtn size="30" class="mt-6" icon color="success" @click="addFile()">
                <VIcon icon="tabler-plus"></VIcon>
              </VBtn>
            </VCol>

            <VCol cols="12">
              <VDataTable :headers="headersFile" :items="form.files" :items-per-page="999">

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

        <VRow>
          <VCol cols="12" class="d-flex justify-center">
            <VBtn :loading="loading.form" color="primary" @click="submitForm">
              Guardar
            </VBtn>
          </VCol>
        </VRow>
      </VCardText>
    </VCard>
  </div>
</template>
 