<script lang="ts" setup type="module">
import { getGlobalLoadingInstance } from '@/composables/useGlobalLoading';
import IErrorsBack from "@/interfaces/Axios/IErrorsBack";
import { useAuthenticationStore } from "@/stores/useAuthenticationStore";
import { VForm } from "vuetify/components";

definePage({
  name: "Note-Index",
});

const authenticationStore = useAuthenticationStore();
const { toast } = useToast();
const globalLoading = getGlobalLoadingInstance();

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
const archive = ref(useFileUpload());
archive.value.allowedExtensions = ["xls", "xlsx"];

const selectedSwitch = ref<boolean>(false);
const selectedNotes = ref({});

const progressStrategy = ref<'polling' | 'sse'>('sse');

const requiredValidator = (value: any) => !!value || 'Campo requerido';

const formDownload = ref({
  type_education_id: null as null | string,
});

const dowloadNomina = async () => {
  const validation = await formValidationDownload.value?.validate();
  if (validation?.valid) {
    loading.download_notes = true;
    const search = typeEducations.value.find(ele => ele.value == formDownload.value.type_education_id);
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
      downloadExcelBase64(data.value.excel, "Consolidado " + search?.title);
    }
  } else {
    toast("Faltan Campos Por Diligenciar", "", "danger");
  }
};

const changeStatus = async (value: any) => {
  loading.block_uploading_of_grades_to_teachers = true;
  const { data, response } = await useApi(`/note-blockPayrollUpload`).post({
    value: value,
  });
  if (response.value?.ok && data.value) {
    // Handle response if needed
  };
  loading.block_uploading_of_grades_to_teachers = false;
};

const resetOptionDownloadPdf = async () => {
  loading.block_uploading_of_grades_to_teachers = true;
  const { data, response } = await useApi(`/note-resetOptionDownloadPdf`).post({
    company_id: authenticationStore.company.id,
  });
  if (response.value?.ok && data.value) {
    // Handle response if needed
  };
  loading.block_uploading_of_grades_to_teachers = false;
};

const selectValueLabel = computed(() => {
  return selectedSwitch.value ? 'Sí' : 'No';
});

const submitFormVisualization = async () => {
  loading.viewing_notes = true;
  const { data, response } = await useApi('/type_educations/visualization/store').post({
    selectedNotes: selectedNotes.value,
  });
  loading.viewing_notes = false;
  if (response.value?.ok && data.value) {
    // Handle response if needed
  }
};

const refModalQuestion = ref();
const openModalQuestion = () => {
  refModalQuestion.value.openModal();
  refModalQuestion.value.componentData.title = "Esta seguro que desea activar a todos los estudiantes en un estado insolventes";
};

const loadDataVisualizeNotes = async () => {
  const { data, response } = await useApi('/type_educations/visualization/show').get();
  if (response.value?.ok && data.value) {
    selectedNotes.value = data.value.selectedNotes;
  }
};

const submitForm = async () => {
  form.value.archive = archive.value.imageFile;
  form.value.company_id = authenticationStore.company.id;

  const validation = await formValidation.value?.validate();
  if (validation?.valid) {
    const formData = new FormData();
    for (const key in form.value) {
      if (form.value[key] !== null) {
        formData.append(key, form.value[key]);
      }
    }

    loading.form = true;

    try {
      console.log('📤 Enviando formulario...');
      const { data, response } = await useApi('note-store').post(formData);

      console.log('📥 Respuesta del servidor:', data.value);

      if (response.value?.ok && data.value) {
        if (data.value.status === 'success') {
          console.log(`🚀 Iniciando loading global con ${progressStrategy.value} para batch_id:`, data.value.batch_id);

          // Obtener nombre del archivo
          const fileName = archive.value.imageFile?.name || 'Archivo desconocido';
          const userId = authenticationStore.user?.id || 'usuario_anonimo';

          // HABILITAR AUTO-LOAD al iniciar un nuevo proceso
          globalLoading.enableAutoLoad();

          // Iniciar el loading global con información adicional
          globalLoading.startLoading(
            data.value.batch_id,
            progressStrategy.value,
            fileName,
            userId
          );

          // Configurar callbacks (solo una vez)
          if (!globalLoading._callbacksConfigured) {
            globalLoading.onCompleted((batchId: string) => {
              console.log(`✅ Import completed for batch: ${batchId}`);
              toast("¡Importación completada exitosamente!", "", "success");
            });

            globalLoading.onError((batchId: string, error: any) => {
              console.error(`❌ Error en importación para batch ${batchId}:`, error);
              toast("Error durante la importación", "", "danger");
            });

            globalLoading.onProgressUpdated((batchId: string, progress: number) => {
              console.log(`📊 Progress updated for ${batchId}: ${progress}%`);
            });

            globalLoading.onProcessAdded((batchId: string) => {
              console.log(`➕ New process added: ${batchId}`);
            });

            globalLoading.onProcessRemoved((batchId: string) => {
              console.log(`➖ Process removed: ${batchId}`);
            });

            globalLoading._callbacksConfigured = true;
          }

          toast("Importación iniciada correctamente", "", "success");

          // Resetear el formulario
          form.value = {
            company_id: null,
            type_education_id: null,
            teacher_id: null,
            archive: null,
          };
          archive.value.clearData();

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
      console.error('❌ Error en submitForm:', error);
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

onMounted(async () => {
  console.log('🚀 Component mounted');
  await loadDataVisualizeNotes();
  await loadTypeEducationsAndTeachers();
});
</script>

<template>
  <div>
    <!-- Selector de estrategia (temporal para testing) -->
    <VCard class="mb-3" v-if="true">
      <VCardTitle>🔧 Configuración de Progreso</VCardTitle>
      <VCardText>
        <VRadioGroup v-model="progressStrategy" inline>
          <VRadio label="📡 Server-Sent Events (SSE)" value="sse" />
          <VRadio label="🔄 Polling" value="polling" />
        </VRadioGroup>
        <VAlert type="info" class="mt-2">
          <strong>SSE:</strong> Más eficiente para archivos grandes, actualizaciones en tiempo real<br>
          <strong>Polling:</strong> Más compatible, consultas cada 2 segundos<br>
          <strong>Múltiples procesos:</strong> Ahora puedes cargar varios archivos simultáneamente<br>
          <strong>Auto-load:</strong> {{ globalLoading.isAutoLoadEnabled() ? 'Habilitado' : 'Deshabilitado' }} - Solo se
          activa al iniciar un proceso
        </VAlert>
      </VCardText>
    </VCard>

    <!-- Indicador de procesos activos -->
    <VCard v-if="globalLoading.hasActiveProcesses.value" class="mb-3" color="info" variant="tonal">
      <VCardText class="d-flex align-center justify-space-between">
        <div class="d-flex align-center">
          <v-icon icon="tabler-loader" class="me-2" />
          <span class="font-weight-medium">
            {{ globalLoading.processList.value.length }} proceso{{ globalLoading.processList.value.length !== 1 ? 's' :
            '' }}
            {{ globalLoading.processList.value.length === 1 ? 'activo' : 'activos' }}
          </span>
        </div>
        <v-btn v-if="globalLoading.processList.value.length > 1" size="small" variant="outlined"
          @click="globalLoading.toggleProcessList()">
          Ver todos
        </v-btn>
      </VCardText>
    </VCard>

    <!-- Tu formulario existente -->
    <VCard :disabled="loading.form" :loading="loading.form" v-if="hasPermission('note.upload_notes')">
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
            <VCol cols="12" sm="4">
              <AppAutocomplete clearable v-model="form.teacher_id" :error-messages="errorsBack.teacher_id"
                label="Docente" @change="errorsBack.teacher_id = ''" :items="teachers">
              </AppAutocomplete>
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

    <!-- Resto de tu template existente... -->
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

    <!-- Resto de tus cards existentes... -->
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
