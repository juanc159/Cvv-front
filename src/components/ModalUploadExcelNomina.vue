<script setup lang="ts">
import IErrorsBack from "@/interfaces/Axios/IErrorsBack";
import { useAuthenticationStore } from "@/stores/useAuthenticationStore";
import type { VForm } from "vuetify/components/VForm";
const authenticationStore = useAuthenticationStore();

const errorsBack = ref<IErrorsBack>({});
const emit = defineEmits(["execute"]);
const { toast } = useToast();

const componentData = reactive({
  titleDialog: "Subir Nómina",
  isDialogVisible: false,
  isLoading: false,
});

const handleDialogVisible = () => {
  componentData.isDialogVisible = !componentData.isDialogVisible;
};

const openDialog = async () => {
  handleDialogVisible();
  fetchDataForm()
};

const formValidation = ref<VForm>();


const form = ref({
  company_id: null as null | number,
  type_education_id: null as null | number,
  archive: null as null | File,
})

const archive = ref(useFileUpload());
archive.value.allowedExtensions = ["xls", "xlsx"]

const typeEducations = ref<Array<object>>([])
const loading = reactive({ form: false })


const fetchDataForm = async () => {

  loading.form = true
  const { data, response } = await useApi('note-dataForm').get()
  loading.form = false

  if (response.value?.ok && data.value) {
    typeEducations.value = data.value.typeEducations
  }
}

const submitForm = async () => {
  form.value.archive = archive.value.imageFile;
  form.value.company_id = authenticationStore.user.company_id;

  const validation = await formValidation.value?.validate();
  if (validation?.valid) {

    const formData = new FormData()
    for (const key in form.value)
      formData.append(key, form.value[key])

    loading.form = true
    const { data, response } = await useApi('note-store').post(formData)
    loading.form = false

    if (response.value?.ok && data.value) {
      handleDialogVisible();

    }

  } else {
    toast("Faltan Campos Por Diligenciar", "", "danger");
  }
};

defineExpose({
  openDialog,
});
</script>

<template>
  <div>
    <VDialog v-model="componentData.isDialogVisible" persistent max-width="40rem" transition="dialog-transition">
      <!-- Dialog close btn -->
      <DialogCloseBtn v-if="!loading.form" @click="handleDialogVisible()" />
      <!-- Toolbar -->
      <div>
        <VToolbar color="primary">
          <VToolbarTitle>{{ componentData.titleDialog }}</VToolbarTitle>
        </VToolbar>
      </div>
      <VCard>
        <VCardText>
          <VForm ref="formValidation" lazy-validation>
            <VRow>
              <VCol cols="12" sm="6">
                <AppSelect clearable v-model="form.type_education_id" :rules="[requiredValidator]"
                  :error-messages="errorsBack.type_education_id" label="Tipo"
                  @change="errorsBack.type_education_id = ''" :requiredField="true" :items="typeEducations">
                </AppSelect>
              </VCol>
              <VCol cols="12" sm="6">
                <VLabel>Archivo&nbsp;<b class="text-warning">*</b></VLabel>
                <VFileInput :key="archive.key" @change="archive.handleImageSelected" @click:clear="archive.clearData"
                  :rules="[requiredValidator]" />
              </VCol>
            </VRow>
            <VRow>
              <VCol cols="12" class="d-flex justify-center">
                <VBtn :loading="loading.form" :disbaled="loading.form" color="primary" @click="submitForm()">
                  Cargar información
                </VBtn>
              </VCol>
            </VRow>
          </VForm>
        </VCardText>
      </VCard>
    </VDialog>
  </div>
</template>
