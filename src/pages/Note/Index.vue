<script lang="ts" setup type="module">
definePage({
  name: "Note-Index",
});
import IErrorsBack from "@/interfaces/Axios/IErrorsBack";
import { useAuthenticationStore } from "@/stores/useAuthenticationStore";
import { VForm } from "vuetify/components";
const authenticationStore = useAuthenticationStore();

const { toast } = useToast();
const loading = reactive({ form: false })
const form = ref<{
  company_id: null | number
  type_education_id: null | number
  archive: null | File
}>({
  company_id: null,
  type_education_id: null,
  archive: null,
})
const errorsBack = ref<IErrorsBack>({});
const formValidation = ref<VForm>();
const typeEducations = ref<Array<object>>([])
const archive = ref(useImageUpload());
archive.value.allowedExtensions = ["xls", "xlsx"]


onMounted(async () => {

  loading.form = true
  const { data, response } = await useApi('note-dataForm').get()
  loading.form = false

  if (response.value?.ok && data.value) {
    typeEducations.value = data.value.typeEducations
  }
})


const submitForm = async () => {
  form.value.archive = archive.value.imageFile;
  form.value.company_id = authenticationStore.company.id;

  const validation = await formValidation.value?.validate();
  if (validation?.valid) {

    const formData = new FormData()
    for (const key in form.value)
      formData.append(key, form.value[key])

    loading.form = true
    const { data, response } = await useApi('note-store').post(formData)
    loading.form = false

    // const data = await storeSubject.fetchSave();
    // if (data?.code === 200) {
    //   errorsBack.value = {};
    //   photo.value.clearData();
    //   await formValidation.value?.resetValidation();
    // }
    // if (data?.code === 422) errorsBack.value = data.errors ?? {}; // muestra error del back
  } else {
    toast("Faltan Campos Por Diligenciar", "", "danger");
  }
};

</script>

<template>
  <div>
    <VCard :disabled="loading.form" :loading="loading.form">
      <VCardTitle primary-title>Cargar Notas</VCardTitle>
      <VCardText>
        <VForm ref="formValidation" lazy-validation>
          <VRow>
            <VCol cols="12" sm="4">
              <AppSelect clearable v-model="form.type_education_id" :rules="[requiredValidator]"
                :error-messages="errorsBack.type_education_id" label="Tipo" @change="errorsBack.type_education_id = ''"
                :requiredField="true" :items="typeEducations">
              </AppSelect>
            </VCol>
            <VCol cols="12" sm="4">
              <VLabel>Archivo&nbsp;<b class="text-warning">*</b></VLabel>
              <VFileInput :key="archive.key" @change="archive.handleImageSelected" @click:clear="archive.clearData"
                :rules="[requiredValidator]" />
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
