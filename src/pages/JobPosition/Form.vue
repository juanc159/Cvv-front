<script lang="ts" setup>
definePage({
  name: "JobPosition-Form",
  path: "/jobPosition-form/:action/:id?",
  meta: {
    redirectIfLoggedIn: true,
    requiresAuth: true,
    requiredPermission: "jobPosition.index",
  },
});

import IErrorsBack from "@/interfaces/Axios/IErrorsBack";
import { useCrudJobPositionStore } from "@/pages/JobPosition/Store/useCrudJobPositionStore";
import { router } from "@/plugins/1.router";
import { useAuthenticationStore } from "@/stores/useAuthenticationStore";
import { VForm } from "vuetify/components";
const route = useRoute();
const { toast } = useToast();
const formValidation = ref<VForm>();
const storeJobPosition = useCrudJobPositionStore();
const authenticationStore = useAuthenticationStore();
const { form, loading, typeEducations } = storeToRefs(storeJobPosition);

const errorsBack = ref<IErrorsBack>({});


const submitForm = async () => {
  const validation = await formValidation.value?.validate();
  if (validation?.valid) {
    const data = await storeJobPosition.fetchSave();
    if (data?.code === 200) {
      errorsBack.value = {};
      await formValidation.value?.resetValidation();
      router.push({ name: "JobPosition-Index" })

    }
    if (data?.code === 422) errorsBack.value = data.errors ?? {}; // muestra error del back
  } else {
    toast("Faltan Campos Por Diligenciar", "", "danger");
  }
};


onMounted(async () => {
  storeJobPosition.clearForm();

  await storeJobPosition.fetchDataForm(
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
            <HeaderAlertView sub-title="Formulario JobPosition" :action="String($route.params.action)" btn-action="list"
              :validate-crud="true" :btn-back="true" @changeScreenBack="$router.back" />
          </VCol>
        </VRow>
        <VForm ref="formValidation" lazy-validation>
          <VRow>
            <VCol cols="12" sm="3">
              <AppTextField clearable v-model="form.name" :rules="[requiredValidator]" :error-messages="errorsBack.name"
                label="Nombre" @keypress="errorsBack.name = ''" :requiredField="true">
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
