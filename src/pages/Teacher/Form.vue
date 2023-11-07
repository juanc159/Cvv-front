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
const route = useRoute();
const { toast } = useToast();
const formValidation = ref<VForm>();
const storeTeacher = useCrudTeacherStore();
const authenticationStore = useAuthenticationStore();
const { form, loading, jobPositions, typeEducations, subjects } = storeToRefs(storeTeacher);
const errorsBack = ref<IErrorsBack>({});

const arrayValidation = ref<Array<string | boolean>>([]);

// File
const archive = ref(useImageUpload());
const aExtImage = ["jpg", "jpeg", "png"];
archive.value.allowedExtensions = aExtImage;

const submitForm = async () => {
  form.value.company_id = authenticationStore.company.id;
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

const addFile = (e: Event) => {
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
              <VSelect multiple :items="subjects" v-model="form.subjects" label="Materias"></VSelect>
            </VCol>
            <VCol cols="12" sm="3">
              <VFileInput accept="image/*" :rules="arrayValidation['photo']" :key="archive.key" @change="addFile($event)"
                @click:clear="archive.clearData">
                <template #label>
                  Foto&nbsp;<b class="text-warning">*</b>
                </template>
              </VFileInput>
            </VCol>
          </VRow>
          <VRow>
            <VCol cols="3" class="d-flex justify-center">
              <VImg :src="archive.imageUrl ?? form.photo"></VImg>
            </VCol>
          </VRow>
          <VRow>
            <VCol cols="12" class="d-flex justify-center">
              <VBtn :loading="loading.form" color="primary" @click="submitForm">
                Guardar
              </VBtn>
            </VCol>
          </VRow>
        </VForm>
      </VCardText>
    </VCard>
  </div>
</template>
 