<script lang="ts" setup>
definePage({
  name: "Subject-Form",
  path: "/subject-form/:action/:id?",
  meta: {
    redirectIfLoggedIn: true,
    requiresAuth: true,
    requiredPermission: "subject.index",
  },
});

import { useImageUpload } from "@/composables/useImageUpload";
import IErrorsBack from "@/interfaces/Axios/IErrorsBack";
import { useCrudSubjectStore } from "@/pages/Subject/Store/useCrudSubjectStore";
import { useAuthenticationStore } from "@/stores/useAuthenticationStore";
import { VForm } from "vuetify/components";
const route = useRoute();
const { toast } = useToast();
const formValidation = ref<VForm>();
const storeSubject = useCrudSubjectStore();
const authenticationStore = useAuthenticationStore();
const { form, loading, typeEducations } = storeToRefs(storeSubject);
const photo = ref(useImageUpload());

const errorsBack = ref<IErrorsBack>({});


const submitForm = async () => {
  const validation = await formValidation.value?.validate();
  if (validation?.valid) {
    const data = await storeSubject.fetchSave();
    if (data?.code === 200) {
      errorsBack.value = {};
      photo.value.clearData();
      await formValidation.value?.resetValidation();
    }
    if (data?.code === 422) errorsBack.value = data.errors ?? {}; // muestra error del back
  } else {
    toast("Faltan Campos Por Diligenciar", "", "danger");
  }
};


onMounted(async () => {
  storeSubject.clearForm();

  await storeSubject.fetchDataForm(
    Number(route.params.id),
    route.params.action
  );

});
</script>

<template>
  <div>
    <VCard>
      <VCardText>
        <VRow>
          <VCol>
            <HeaderAlertView sub-title="Formulario Subject" :action="String($route.params.action)" btn-action="list"
              :validate-crud="true" :btn-back="true" @changeScreenBack="$router.back" />
          </VCol>
        </VRow>
        <VForm ref="formValidation" lazy-validation>
          <VRow>
            <VCol cols="12" sm="3">
              <AppSelect clearable v-model="form.type_education_id" :rules="[requiredValidator]"
                :error-messages="errorsBack.type_education_id" label="Tipo" @change="errorsBack.type_education_id = ''"
                :requiredField="true" :items="typeEducations">
              </AppSelect>
            </VCol>
            <VCol cols="12" sm="3">
              <AppTextField clearable v-model="form.name" :rules="[requiredValidator]" :error-messages="errorsBack.name"
                label="Nombre" @keypress="errorsBack.name = ''" :requiredField="true">
              </AppTextField>
            </VCol>
            <VCol cols="12" sm="3">
              <AppTextField clearable v-model="form.code" :rules="[requiredValidator]" :error-messages="errorsBack.code"
                label="Codigo" @keypress="errorsBack.code = ''" :requiredField="true">
              </AppTextField>
            </VCol>
          </VRow>
          <VRow>
            <VCol cols="12" class="d-flex justify-center">
              <VBtn :loading="loading.form" color="primary" @click="submitForm()">
                Guardar
              </VBtn>
            </VCol>
          </VRow>
        </VForm>
      </VCardText>
    </VCard>
  </div>
</template>
 