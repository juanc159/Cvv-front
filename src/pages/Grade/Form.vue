<script lang="ts" setup>
definePage({
  name: "Grade-Form",
  path: "/grade-form/:action/:id?",
  meta: {
    redirectIfLoggedIn: true,
    requiresAuth: true,
    requiredPermission: "grade.index",
  },
});

import IErrorsBack from "@/interfaces/Axios/IErrorsBack";
import { useCrudGradeStore } from "@/pages/Grade/Store/useCrudGradeStore";
import { router } from "@/plugins/1.router";
import { useAuthenticationStore } from "@/stores/useAuthenticationStore";
import { VForm } from "vuetify/components";
const route = useRoute();
const { toast } = useToast();
const formValidation = ref<VForm>();
const storeGrade = useCrudGradeStore();
const authenticationStore = useAuthenticationStore();
const { form, loading, typeEducations } = storeToRefs(storeGrade);

const errorsBack = ref<IErrorsBack>({});


const submitForm = async () => {
  form.value.company_id = authenticationStore.company.id;
  const validation = await formValidation.value?.validate();
  if (validation?.valid) {
    const data = await storeGrade.fetchSave();
    if (data?.code === 200) {
      errorsBack.value = {};
      await formValidation.value?.resetValidation();
      router.push({ name: "Grade-Index" })

    }
    if (data?.code === 422) errorsBack.value = data.errors ?? {}; // muestra error del back
  } else {
    toast("Faltan Campos Por Diligenciar", "", "danger");
  }
};


onMounted(async () => {
  storeGrade.clearForm();

  await storeGrade.fetchDataForm(
    Number(route.params.id),
    route.params.action
  );

  const info = JSON.parse(JSON.stringify(form.value))
  await chageTypeEducation(info.type_education_id)
  form.value.subjects = info.subjects




});

const subjects = ref<Array<object>>([])

const chageTypeEducation = async (event: any) => {
  subjects.value = []
  form.value.subjects = []
  if (event) {
    const search = await typeEducations.value.find(ele => ele.value == event)
    subjects.value = search.subjects
  }

}



</script>

<template>
  <div>
    <VCard>
      <VCardText>
        <VRow>
          <VCol>
            <HeaderAlertView sub-title="Formulario Grado" :action="String($route.params.action)" btn-action="list"
              :validate-crud="true" :btn-back="true" @changeScreenBack="$router.back" />
          </VCol>
        </VRow>
        <VForm ref="formValidation" lazy-validation>
          <VRow>
            <VCol cols="12" sm="3">
              <AppSelect clearable v-model="form.type_education_id" :rules="[requiredValidator]"
                :error-messages="errorsBack.type_education_id" label="Tipo" @change="errorsBack.type_education_id = ''"
                :requiredField="true" :items="typeEducations" @update:model-value="chageTypeEducation($event)">
              </AppSelect>
            </VCol>
            <VCol cols="12" sm="3">
              <AppTextField clearable v-model="form.name" :rules="[requiredValidator]" :error-messages="errorsBack.name"
                label="Nombre" @keypress="errorsBack.name = ''" :requiredField="true">
              </AppTextField>
            </VCol>

            <VCol cols="12" sm="3">
              <AppSelect clearable v-model="form.subjects" item-value="id" item-title="name" label="Materias" multiple
                :requiredField="true" :items="subjects" :rules="[requiredValidator]">
              </AppSelect>
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
