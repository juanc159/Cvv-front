<script lang="ts" setup type="module">
definePage({
  name: "Note-Index",
});
import IErrorsBack from "@/interfaces/Axios/IErrorsBack";
import { useAuthenticationStore } from "@/stores/useAuthenticationStore";
import { VForm } from "vuetify/components";
const authenticationStore = useAuthenticationStore();

const { toast } = useToast();
const loading = reactive({ form: false, excel: false })
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
const formValidationDownload = ref<VForm>();
const typeEducations = ref<Array<object>>([])
const archive = ref(useFileUpload());
archive.value.allowedExtensions = ["xls", "xlsx"]
const selectedSwitch = ref<boolean>(false)
const selectedNotes = ref({});


onMounted(async () => {
  await loadDataVisualizeNotes()

  loading.form = true
  const { data, response } = await useApi('note-dataForm').get()

  if (response.value?.ok && data.value) {
    typeEducations.value = data.value.typeEducations

    selectedSwitch.value = data.value.blockData
  }
  loading.form = false
})

const loadDataVisualizeNotes = async () => {
  const { data, response } = await useApi('/type_educations/visualization/show').get()
  if (response.value?.ok && data.value) {
    selectedNotes.value = data.value.selectedNotes


    // typeEducations.value.forEach(element => {
    //   selectedNotes[element.value] = {}
    //   for (let index = 1; index <= element.cantNotes; index++) {

    //     selectedNotes[element.value]["note_" + index] = false
    //   }
    // });
  }

}

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

  } else {
    toast("Faltan Campos Por Diligenciar", "", "danger");
  }
};


const formDownload = ref({
  type_education_id: null as null | string
})
const dowloadNomina = async () => {

  const validation = await formValidationDownload.value?.validate();

  if (validation?.valid) {
    loading.excel = true;

    const search = typeEducations.value.find(ele => ele.value == formDownload.value.type_education_id)
    const { data, response } = await useApi<any>(
      createUrl(`/note-downloadAllConsolidated`, {
        query: {
          type_education_id: formDownload.value.type_education_id,
          company_id: authenticationStore.company.id,
        },
      })
    );

    loading.excel = false;

    if (response.value?.ok && data.value) {
      downloadExcelBase64(data.value.excel, "Consolidado " + search?.title)
    }
  } else {
    toast("Faltan Campos Por Diligenciar", "", "danger");
  }
}




const changeStatus = async (
  value: any
) => {
  const { data, response } = await useApi(`/note-blockPayrollUpload`).post({
    value: value,
  });
  // if (data.value.code === 200) toast("Éxito", data.value.message, "success");
  if (response.value?.ok && data.value) {
  };
};

const selectValueLabel = computed(() => {

  return selectedSwitch.value ? 'Sí' : 'No';
});


const submitFormVisualization = async () => {

  loading.form = true
  const { data, response } = await useApi('/type_educations/visualization/store').post({
    selectedNotes: selectedNotes.value
  })
  loading.form = false


};
</script>

<template>
  <div>


    <!-- <VCard :disabled="loading.form" :loading="loading.form">
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
              <VBtn :loading="loading.form" :disabled="loading.form" color="primary" @click="submitForm()">
                Cargar
              </VBtn>
            </VCol>
          </VRow>
        </VForm>
      </VCardText>
    </VCard>

    <VCard :disabled="loading.form" :loading="loading.form" class="mt-3">
      <VCardTitle primary-title>Descargar Notas</VCardTitle>
      <VCardText>
        <VForm ref="formValidationDownload" lazy-validation>
          <VRow>
            <VCol cols="12" sm="4">
              <AppSelect clearable v-model="formDownload.type_education_id" :rules="[requiredValidator]"
                :error-messages="errorsBack.type_education_id" label="Tipo" @change="errorsBack.type_education_id = ''"
                :requiredField="true" :items="typeEducations">
              </AppSelect>
            </VCol>
          </VRow>
          <VRow>
            <VCol cols="12" class="d-flex justify-center">
              <VBtn :loading="loading.excel" :disabled="loading.excel" color="primary" @click="dowloadNomina()">
                Descargar
              </VBtn>
            </VCol>
          </VRow>
        </VForm>
      </VCardText>
    </VCard>

    <VCard :disabled="loading.form" :loading="loading.form" class="mt-3">
      <VCardTitle primary-title>Bloquear carga de notas a los profesores</VCardTitle>
      <VCardText>
        <VRow>
          <VCol cols="12" sm="4">
            <div class="demo-space-x">
              <VSwitch v-model="selectedSwitch" @update:model-value="changeStatus($event)" :label="selectValueLabel"
                color="success" />
            </div>

          </VCol>
        </VRow>
      </VCardText>
    </VCard> -->

    <VCard :disabled="loading.form" :loading="loading.form" class="mt-3" title="Visualización de las notas">
      <VCardText v-for="typeEducation in typeEducations" :key="typeEducation.value">
        <VDivider />
        <VRow>
          <VCol>
            <span>{{ typeEducation.title }}</span>
          </VCol>
        </VRow>
        <VRow>
          <VCol cols="12" sm="4" v-for="(note, index) in typeEducation.cantNotes" :key="index">
            <div class="demo-space-x">
              <VSwitch v-model="selectedNotes[typeEducation.value]['note_' + note]" :label="'Nota ' + note"
                color="success" />
            </div>
          </VCol>
        </VRow>
      </VCardText>
      <VCardText>
        <VRow>
          <VCol cols="12" class="d-flex justify-center">
            <VBtn :loading="loading.form" :disabled="loading.form" color="primary" @click="submitFormVisualization()">
              Guardar Visualización
            </VBtn>
          </VCol>
        </VRow>
      </VCardText>


      <!-- <VCardText>
        <VRow>
          <VCol cols="12" sm="4">
            <div class="demo-space-x">
              <VSwitch v-model="selectedSwitch" @update:model-value="changeStatus($event)" :label="selectValueLabel"
                color="success" />
            </div>

          </VCol>
        </VRow>
      </VCardText> -->
    </VCard>
  </div>
</template>
