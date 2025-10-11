<script lang="ts" setup>
definePage({
  path: "pendingRegistration-Files/:id",
  name: "PendingRegistration-Files",
  meta: {
    redirectIfLoggedIn: true,
    requiresAuth: true,
    requiredPermission: "pendingRegistration.list",
  },
});

import { useApi } from "@/composables/useApi";
import { router } from "@/plugins/1.router";
import { useAuthenticationStore } from "@/stores/useAuthenticationStore";
import { onMounted, reactive, ref } from "vue";
import { useRoute } from "vue-router";
import { VForm } from "vuetify/components";

// Tipos
interface PendingRegistration {
  id: string;
  company_name: string;
  term_name: string;
  type_education_name: string;
  grade_name: string;
  section_name: string;
}

interface FileData {
  id: string | null;
  name: string;
  file?: File | null;
}

interface Subject {
  subject: { id: string; name: string };
  value: string; // subject_id
  files: FileData[];
}

const authenticationStore = useAuthenticationStore();
const { company, user } = storeToRefs(authenticationStore);

const route = useRoute();
const formValidation = ref<VForm | null>(null);

const loading = reactive({
  form: false,
});

const pendingRegistration = ref<PendingRegistration | null>(null);
const subjects = ref<Subject[]>([]);
const dynamicVariables: Record<string, FileUpload> = reactive({});

// Definición de headersFile
const headersFile = [
  { title: "Título", key: "name", sortable: false },
  { title: "Acciones", key: "actions", sortable: false },
];

onMounted(async () => {
  loading.form = true;
  const { data, response } = await useApi(`/pendingRegistration/files/${route.params.id}`).get();
  if (response.value?.ok && data.value) {
    pendingRegistration.value = data.value.pendingRegistration;
    subjects.value = data.value.subjects.map((s: any) => ({
      subject: s.subject,
      value: s.subject.id, // Asegúrate de que coincida con tu API
      files: s.files || [], // Inicializa files como array vacío si no existe
    }));
    subjects.value.forEach((element) => {
      dynamicVariables[`file-${element.value}`] = useFileUpload();
      dynamicVariables[`file-${element.value}`].allowedExtensions = ["jpg", "jpeg", "png", "pdf", "ppsx", "pptx"];
    });
  }
  loading.form = false;
});

// Funciones
const submitForm = async () => {

  const formData = new FormData();
  formData.append("company_id", company.value.id);
  formData.append("pending_registration_id", pendingRegistration.value!.id);

  let cant = 0;
  subjects.value.forEach((element) => {
    element.files.forEach((file) => {
      formData.append(`file_id_${cant}`, file.id || "");
      formData.append(`file_subject_id_${cant}`, element.value);
      if (file.file) {
        formData.append(`file_file_${cant}`, file.file);
      }
      formData.append(`file_name_${cant}`, file.name);
      cant++;
    });
  });

  formData.append("files_cant", cant.toString());

  loading.form = true;
  const { data, response } = await useApi("/pendingRegistration/attempts/storeOrUpdate").post(formData);
  loading.form = false;

  if (response.value?.ok && data.value) {
    router.push({ name: 'PendingRegistration-List' });

  }
};

const addFile = async (obj: Subject) => {
  if (!dynamicVariables[`file-${obj.value}`].imageFile) return;

  obj.files.push({
    id: null,
    name: dynamicVariables[`file-${obj.value}`].name || "Nuevo archivo",
    file: dynamicVariables[`file-${obj.value}`].imageFile,
  });

  dynamicVariables[`file-${obj.value}`].clearData();
};

const deleteFile = (obj: Subject, index: number) => {
  obj.splice(index, 1);
};

const descargarArchivo = (path: string, name: string) => {
  const url = `${import.meta.env.VITE_API_URL}/storage/${path}`;
  const link = document.createElement("a");
  link.href = url;
  link.download = name;
  link.click();
};

const storageBack = (path: string) => path; // Ajusta según tu lógica de rutas
</script>

<template>
  <div>
    <VCard>
      <VCardText>
        <VRow>
          <VCol>
            <HeaderAlertView sub-title="Formulario archivos de materias pendientes" btn-action="list"
              :validate-crud="true" :btn-back="true" @changeScreenBack="$router.back" />
          </VCol>
        </VRow>

        <VCardText>
          <VSkeletonLoader type="image, list-item-two-line" :loading="loading.form" class="mt-5">
            <VRow v-if="pendingRegistration">
              <VCol cols="12">
                <VCard class="elevation-2" outlined>
                  <VCardText class="pa-4">
                    <VRow no-gutters align="center" class="header-info">
                      <VCol cols="12">
                        <h2 class="text-h5 font-weight-bold mb-2">
                          {{ pendingRegistration?.company_name }}
                        </h2>
                        <p class="text-subtitle-1 text--secondary">
                          Sección: {{
                            pendingRegistration?.section_name }}
                        </p>
                      </VCol>
                    </VRow>
                  </VCardText>
                </VCard>
              </VCol>
            </VRow>
            <VRow>
              <VCol cols="12" v-for="(element, index) in subjects" :key="index">
                <VCard>
                  <VCardTitle primary-title>
                    <h4>{{ element.subject.name }}</h4>
                  </VCardTitle>
                  <VCardText>
                    <VForm ref="formValidation" lazy-validation>
                      <VRow>
                        <VCol cols="12" sm="6">
                          <AppTextField clearable v-model="dynamicVariables[`file-${element.value}`].name"
                            :rules="[requiredValidator]" label="Título" :requiredField="true" />
                        </VCol>
                        <VCol cols="12" sm="5">
                          <VLabel>Archivo <b class="text-warning">*</b></VLabel>
                          <VFileInput :rules="[requiredValidator]"
                            @change="dynamicVariables[`file-${element.value}`].handleImageSelected"
                            :key="dynamicVariables[`file-${element.value}`].key"
                            @click:clear="dynamicVariables[`file-${element.value}`].clearData" />
                        </VCol>
                        <VCol cols="12" sm="1">
                          <VBtn size="30" class="mt-6" icon color="success" @click="addFile(element)">
                            <VIcon icon="tabler-plus"></VIcon>
                          </VBtn>
                        </VCol>

                        <VCol cols="12">
                          <VDataTable :headers="headersFile" :items="element.files" :items-per-page="999">
                            <template #item.actions="{ item, index }">
                              <div>
                                <VBtn v-if="item.file" icon size="x-small" color="primary" variant="text"
                                  @click="descargarArchivo(storageBack(item.file), item.name)">
                                  <VIcon size="22" icon="tabler-eye" />
                                  <VTooltip location="top" transition="scale-transition" activator="parent"
                                    text="Visualizar" />
                                </VBtn>
                                <VBtn icon size="x-small" color="error" variant="text"
                                  @click="deleteFile(element.files, index)">
                                  <VIcon size="22" icon="tabler-trash" />
                                  <VTooltip location="top" transition="scale-transition" activator="parent"
                                    text="Eliminar" />
                                </VBtn>
                              </div>
                            </template>
                            <template #bottom>
                            </template>
                          </VDataTable>
                        </VCol>
                      </VRow>
                    </VForm>
                  </VCardText>
                </VCard>
              </VCol>
            </VRow>
          </VSkeletonLoader>
        </VCardText>

        <VRow>
          <VCol cols="12" class="d-flex justify-center">
            <VBtn :loading="loading.form" color="primary" @click="submitForm">
              Guardar
            </VBtn>
          </VCol>
        </VRow>
      </VCardText>
    </VCard>
  </div>
</template>

<style scoped>
.green-background {
  background-color: rgb(252, 231, 231);
}

.red-background {
  background-color: rgb(236, 247, 255);
}
</style>
