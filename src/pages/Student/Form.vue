<script lang="ts" setup>
definePage({
  name: "Student-Form",
  path: "/student-form/:action/:id?",
  meta: {
    redirectIfLoggedIn: true,
    requiresAuth: true,
    requiredPermission: "student.index",
  },
});

import { useImageUpload } from "@/composables/useImageUpload";
import IErrorsBack from "@/interfaces/Axios/IErrorsBack";
import { useCrudStudentStore } from "@/pages/Student/Store/useCrudStudentStore";
import { router } from "@/plugins/1.router";
import { useAuthenticationStore } from "@/stores/useAuthenticationStore";
import { VForm } from "vuetify/components";

const route = useRoute();
const { toast } = useToast();
const formValidation = ref<VForm>();
const storeStudent = useCrudStudentStore();
const authenticationStore = useAuthenticationStore();
const { form, loading, typeEducations, sections } = storeToRefs(storeStudent);
const errorsBack = ref<IErrorsBack>({});


// File
const archive = ref(useImageUpload());
const aExtImage = ["jpg", "jpeg", "png"];
archive.value.allowedExtensions = aExtImage;

const submitForm = async () => {
  form.value.company_id = authenticationStore.company.id;

  const validation = await formValidation.value?.validate();
  if (validation?.valid) {
    const data = await storeStudent.fetchSave();
    if (data?.code === 200) {
      errorsBack.value = {};
      archive.value.clearData();
      await formValidation.value?.resetValidation();
      router.push({ name: "Student-Index" })

    }
    if (data?.code === 422) errorsBack.value = data.errors ?? {}; // muestra error del back



  } else {
    toast("Faltan Campos Por Diligenciar", "", "danger");
  }
};

const addPhoto = (e: Event) => {
  loading.value.form = true
  archive.value.handleImageSelected(e);
  setTimeout(() => {
    form.value.photo = archive.value.imageFile;
    loading.value.form = false

  }, 1000);
};

onMounted(async () => {
  storeStudent.clearForm();

  await storeStudent.fetchDataForm(
    Number(route.params.id),
    route.params.action
  );

});

const gradesFilter = computed(() => {
  if (form.value.type_education_id) {
    return typeEducations.value.find(ele => ele.value == form.value.type_education_id).grades
  }
  return []
})

</script>

<template>
  <div>
    <VCard :loading="loading.form" :disabled="loading.form">
      <VCardText>
        <VRow>
          <VCol>
            <HeaderAlertView sub-title="Formulario Student" :action="String($route.params.action)" btn-action="list"
              :validate-crud="true" :btn-back="true" @changeScreenBack="$router.back" />
          </VCol>
        </VRow>
        <VForm ref="formValidation" lazy-validation>
          <VRow>
            <VCol cols="12" sm="3">
              <AppSelect :items="typeEducations" clearable :rules="[requiredValidator]" v-model="form.type_education_id"
                label="Tipo de educación"></AppSelect>
            </VCol>

            <VCol cols="12" sm="3">
              <AppSelect clearable :items="gradesFilter" :rules="[requiredValidator]" v-model="form.grade_id"
                label="Grados y niveles">
              </AppSelect>
            </VCol>
            <VCol cols="12" sm="3">
              <AppSelect clearable :items="sections" :rules="[requiredValidator]" v-model="form.section_id"
                label="Secciones"></AppSelect>
            </VCol>


            <VCol cols="12" sm="3">
              <AppTextField clearable v-model="form.identity_document" :rules="[requiredValidator]"
                :error-messages="errorsBack.identity_document" label="Cédula de identidad"
                @keypress="errorsBack.identity_document = ''" :requiredField="true">
              </AppTextField>
            </VCol>

            <VCol cols="12" sm="6">
              <AppTextField clearable v-model="form.full_name" :rules="[requiredValidator]"
                :error-messages="errorsBack.full_name" label="Nombre completo" @keypress="errorsBack.full_name = ''"
                :requiredField="true">
              </AppTextField>
            </VCol>

            <VCol cols="12" sm="3">
              <VFileInput accept="image/*" :key="archive.key" @change="addPhoto($event)"
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

        <VRow>
          <VCol cols="12" class="d-flex justify-center">
            <VBtn :loading="loading.form" color="primary" @click="submitForm()">
              Guardar
            </VBtn>
          </VCol>
        </VRow>
      </VCardText>
    </VCard>
  </div>
</template>
