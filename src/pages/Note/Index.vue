<script lang="ts" setup type="module">
import IErrorsBack from "@/interfaces/Axios/IErrorsBack";
import { useAuthenticationStore } from "@/stores/useAuthenticationStore";
import { VForm } from "vuetify/components";

definePage({
  name: "Note-Index",
});



const authenticationStore = useAuthenticationStore();
const { toast } = useToast();
const globalLoading = useGlobalLoading();
const archive = ref(useFileUpload());
archive.value.allowedExtensions = ["xls", "xlsx"];

const loading = reactive({
  form: false,
  download_notes: false,
  block_uploading_of_grades_to_teachers: false,
  viewing_notes: false,
});

const form = ref<{
  company_id: null | number;
  type_education_id: null | number;
  teacher_id: null | string;
  archive: null | File;
}>({
  company_id: null,
  type_education_id: null,
  teacher_id: null,
  archive: null,
});

const errorsBack = ref<IErrorsBack>({});
const formValidation = ref<VForm>();
const formValidationDownload = ref<VForm>();
const typeEducations = ref<Array<object>>([]);
const teachers = ref<Array<object>>([]);
const selectedSwitch = ref<boolean>(false);
const selectedNotes = ref({});
const requiredValidator = (value: any) => !!value || 'Campo requerido';

const hasActiveProcess = computed(() => {
  return globalLoading.hasActiveProcess();
});

const submitForm = async () => {
  form.value.archive = archive.value.imageFile;
  form.value.company_id = authenticationStore.company.id;
  const validation = await formValidation.value?.validate();

  if (validation?.valid) {
    const formData = new FormData();
    formData.append('company_id', String(form.value.company_id));
    formData.append('type_education_id', String(form.value.type_education_id));
    formData.append('teacher_id', String(form.value.teacher_id || ''));
    formData.append('archive', form.value.archive);

    loading.form = true;
    try {
      console.log('📤 [FORM] Enviando formulario...');
      const { data, response } = await useApi('note-store').post(formData);
      console.log('📥 [FORM] Respuesta del servidor:', data.value);

      if (response.value?.ok && data.value) {
        if (data.value.status === 'success') {
          console.log(`🚀 [FORM] Iniciando loading para batch_id:`, data.value.batch_id);

          const fileName = archive.value.imageFile?.name || 'Archivo desconocido';
          const success = globalLoading.startLoading(data.value.batch_id, fileName);

          if (success) {
            toast("Importación iniciada correctamente", "", "success");

            // Limpiar formulario para permitir nueva carga
            form.value = {
              company_id: authenticationStore.company.id,
              type_education_id: null,
              teacher_id: null,
              archive: null,
            };
            archive.value.clearData();

          } else {
            toast("Error iniciando la importación", "", "danger");
          }

        } else if (data.value.status === 'error') {
          toast("Error en la importación", data.value.message, "danger");
          if (data.value.errors) {
            errorsBack.value = data.value.errors;
          }
        }
      } else {
        toast("Error en la respuesta del servidor", "", "danger");
      }
    } catch (error) {
      console.error('❌ [FORM] Error en submitForm:', error);
      toast("Error al procesar el archivo", "", "danger");
    } finally {
      loading.form = false;
    }
  } else {
    toast("Faltan Campos Por Diligenciar", "", "danger");
  }
};



const loadTypeEducationsAndTeachers = async () => {
  loading.form = true;
  const { data, response } = await useApi('note-dataForm').get();
  if (response.value?.ok && data.value) {
    typeEducations.value = data.value.typeEducations;
    selectedSwitch.value = data.value.blockData;
    teachers.value = data.value.teachers;
  }
  loading.form = false;
};

const hasPermission = (permission: string) => {
  return true;
};

const loadDataVisualizeNotes = async () => {
  const { data, response } = await useApi('/type_educations/visualization/show').get()
  if (response.value?.ok && data.value) {
    selectedNotes.value = data.value.selectedNotes
  }

}



const formDownload = ref({
  type_education_id: null as null | string
})
const dowloadNomina = async () => {

  const validation = await formValidationDownload.value?.validate();

  if (validation?.valid) {
    loading.download_notes = true;

    const search = typeEducations.value.find(ele => ele.value == formDownload.value.type_education_id)
    const { data, response } = await useApi<any>(
      createUrl(`/note-downloadAllConsolidated`, {
        query: {
          type_education_id: formDownload.value.type_education_id,
          company_id: authenticationStore.company.id,
        },
      })
    );

    loading.download_notes = false;

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
  loading.block_uploading_of_grades_to_teachers = true
  const { data, response } = await useApi(`/note-blockPayrollUpload`).post({
    value: value,
  });
  // if (data.value.code === 200) toast("Éxito", data.value.message, "success");
  if (response.value?.ok && data.value) {
  };
  loading.block_uploading_of_grades_to_teachers = false

};

const resetOptionDownloadPdf = async (
  value: any
) => {
  loading.block_uploading_of_grades_to_teachers = true
  const { data, response } = await useApi(`/note-resetOptionDownloadPdf`).post({
    company_id: authenticationStore.company.id,
  });
  if (response.value?.ok && data.value) {
  };
  loading.block_uploading_of_grades_to_teachers = false

};

const selectValueLabel = computed(() => {

  return selectedSwitch.value ? 'Sí' : 'No';
});


const submitFormVisualization = async () => {

  loading.viewing_notes = true
  const { data, response } = await useApi('/type_educations/visualization/store').post({
    selectedNotes: selectedNotes.value
  })
  loading.viewing_notes = false


};

//ModalQuestion
const refModalQuestion = ref()

const openModalQuestion = () => {
  refModalQuestion.value.openModal()
  refModalQuestion.value.componentData.title = "Esta seguro que desea activar a todos los estudiantes en un estado insolventes"
}

onMounted(async () => {
  await loadDataVisualizeNotes()
  console.log('🚀 [PAGE] Component mounted - Queue system enabled');

  await loadTypeEducationsAndTeachers();

});
</script>

<template>
  <div>
    <!-- ✅ RESUMEN CON BOTÓN VER TODAS -->
    <VCard class="mb-3" v-if="globalLoading.allProcesses.value.length > 0">
      <VCardTitle class="d-flex align-center justify-space-between">
        <div class="d-flex align-center">
          🔄 Importaciones
          <VChip color="primary" size="small" class="ms-2">
            {{ globalLoading.activeProcesses.value.length }} activa{{ globalLoading.activeProcesses.value.length !== 1 ?
              's' : '' }}
          </VChip>
          <VChip v-if="globalLoading.queuedProcesses.value.length > 0" color="warning" size="small" class="ms-2">
            {{ globalLoading.queuedProcesses.value.length }} en cola
          </VChip>
          <VChip v-if="globalLoading.completedProcesses.value.length > 0" color="success" size="small" class="ms-2">
            {{ globalLoading.completedProcesses.value.length }} completada{{
              globalLoading.completedProcesses.value.length !== 1 ? 's' : '' }}
          </VChip>
        </div>
        <VBtn variant="outlined" size="small" @click="globalLoading.showProcessListModal()">
          <VIcon start icon="tabler-list" />
          Ver Todas ({{ globalLoading.allProcesses.value.length }})
        </VBtn>
      </VCardTitle>
      <VCardText>
        <VAlert type="info" variant="tonal">
          <div class="d-flex align-center mb-2">
            <VIcon icon="tabler-info-circle" class="me-2" />
            <strong>Sistema de cola activo</strong>
          </div>
          <div class="text-body-2">
            Puedes subir múltiples archivos. Se procesarán uno después del otro automáticamente.
            Usa el botón "Ver Todas" para gestionar todos los procesos.
          </div>
          <div class="text-body-2 mt-2" v-if="hasActiveProcess">
            <strong>Progreso actual:</strong> {{ Math.round(globalLoading.currentProgress.value || 0) }}%
          </div>
        </VAlert>
      </VCardText>
    </VCard>

    <VCard :disabled="loading.form" :loading="loading.form" v-if="hasPermission('note.upload_notes')">
      <VCardTitle primary-title>
        Cargar Notas
        <VChip v-if="globalLoading.allProcesses.value.length > 0" color="info" size="small" class="ms-2">
          {{ globalLoading.allProcesses.value.length }} proceso{{ globalLoading.allProcesses.value.length !== 1 ? 's' :
            '' }}
        </VChip>
      </VCardTitle>
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
            <VCol cols="12" sm="4">
              <AppAutocomplete clearable v-model="form.teacher_id" :error-messages="errorsBack.teacher_id"
                label="Docente" @change="errorsBack.teacher_id = ''" :items="teachers">
              </AppAutocomplete>
            </VCol>
          </VRow>
          <VRow>
            <VCol cols="12" class="d-flex justify-center">
              <VBtn :loading="loading.form" color="primary" @click="submitForm()">
                <VIcon start icon="tabler-upload" />
                Cargar Archivo
              </VBtn>
            </VCol>
          </VRow>
        </VForm>
      </VCardText>
    </VCard>


    <VCard :disabled="loading.download_notes" :loading="loading.download_notes" class="mt-3"
      v-if="hasPermission('note.download_notes')">
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
              <VBtn :loading="loading.download_notes" :disabled="loading.download_notes" color="primary"
                @click="dowloadNomina()">
                Descargar
              </VBtn>
            </VCol>
          </VRow>
        </VForm>
      </VCardText>
    </VCard>

    <VRow>
      <VCol cols="4">
        <VCard :disabled="loading.block_uploading_of_grades_to_teachers"
          :loading="loading.block_uploading_of_grades_to_teachers" class="mt-3"
          v-if="hasPermission('note.block_uploading_of_grades_to_teachers')">
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
        </VCard>
      </VCol>
      <VCol cols="4">
        <VCard :disabled="loading.block_uploading_of_grades_to_teachers"
          :loading="loading.block_uploading_of_grades_to_teachers" class="mt-3"
          v-if="hasPermission('note.reset_option_download_pdf')">
          <VCardTitle primary-title>Reiniciar opción descarga pdf y boletin</VCardTitle>
          <VCardText>
            <VRow>
              <VCol cols="12" sm="4">
                <div class="demo-space-x">
                  <VBtn color="primary" @click="openModalQuestion">Reiniciar</VBtn>
                </div>

              </VCol>
            </VRow>
          </VCardText>
        </VCard>
      </VCol>
    </VRow>

    <VCard :disabled="loading.viewing_notes" :loading="loading.viewing_notes" class="mt-3"
      title="Visualización de las notas" v-if="hasPermission('note.viewing_notes')">
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
    </VCard>

    <VCard title="Carga de archivos masivos" class="mt-3" v-if="hasPermission('note.bulk_file_upload')">
      <VCardText>
        <DragAndDrop />
      </VCardText>
    </VCard>

    <ModalQuestion ref="refModalQuestion" @success="resetOptionDownloadPdf" />
  </div>
</template>
