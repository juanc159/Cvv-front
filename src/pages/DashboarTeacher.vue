<script lang="ts" setup>
definePage({
  name: "DashboardTeacher",
  path: "/dashboard/teacher",
  meta: {
    redirectIfLoggedIn: true,
    requiresAuth: true,
  },
});

import { useAuthenticationStore } from "@/stores/useAuthenticationStore";

const authenticationStore = useAuthenticationStore();
const { user } = storeToRefs(authenticationStore);

// --- Computed & Helpers ---
const avatarData = computed(() => {
  const fullName = user.value?.full_name || '';
  if (fullName) return fullName;
  return 'D'; // D de Docente
});

const headersFile = [
  { title: "Archivo", key: "name", sortable: false },
  { title: "Acción", key: "actions", sortable: false, align: 'end' },
];

// --- Estados ---
const loading = reactive({
  form: false,
  excel: false,
  download: false
});

const teacherData = ref(null);

// --- Carga Inicial ---
onMounted(async () => {
  loading.form = true;
  // OJO: Aquí enviamos el ID. Si el backend espera user_id o teacher_id es crucial.
  // Por ahora enviamos el ID que tiene el store (que debería ser el del perfil según tu login)
  const { data, response } = await useApi('/teacher-planningShow/' + user.value?.id).get();
  loading.form = false;

  if (response.value?.ok && data.value) {
    teacherData.value = data.value.data;
  }
});

// --- Funciones ---

// Descargar Nómina Consolidada
const downloadConsolidated = async () => {
  loading.excel = true;
  const { data, response } = await useApi("/teacher-downloadConsolidated/" + user.value.id).get();
  loading.excel = false;

  if (response.value?.ok && data.value) {
    const nameExcel = "Nomina_" + user.value.full_name;
    downloadExcelBase64(data.value.excel, nameExcel);
  }
};

// Descargar archivo individual
const downloadFile = (path: string, name: string) => {
  // Asumiendo que tienes una función global o composable para esto
  descargarArchivo(storageBack(path), name);
};

// --- Modales ---
const refModalUploadExcelNomina = ref();
const openModalUploadExcelNomina = () => {
  refModalUploadExcelNomina.value.openDialog();
};

const refModalChangePassword = ref();
const openModalPassword = () => {
  refModalChangePassword.value.openDialog(user.value.id, false);
};
</script>

<template>
  <div>
    <VRow class="match-height mb-6">

      <VCol cols="12" md="4" lg="3">
        <VCard class="h-100 text-center pa-4">
          <div class="d-flex flex-column align-center justify-center h-100">
            <VAvatar v-if="user?.photo" color="primary" variant="tonal" size="120" class="mb-4">
              <VImg :src="storageBack(user?.photo)" />
            </VAvatar>
            <VAvatar v-else color="primary" variant="tonal" size="120" class="mb-4">
              <span class="text-h2">{{ avatarText(avatarData) }}</span>
            </VAvatar>

            <h3 class="text-h5 font-weight-bold mb-1">{{ user.full_name }}</h3>
            <span class="text-body-2 text-medium-emphasis mb-4">Panel Docente</span>

            <VBtn size="small" variant="text" color="primary" @click="openModalPassword()">
              <VIcon icon="tabler-lock" start /> Cambiar Clave
            </VBtn>
          </div>
        </VCard>
      </VCol>

      <VCol cols="12" md="8" lg="9">
        <VCard class="h-100">
          <VCardItem>
            <VCardTitle class="text-h5">Gestión Académica 🍎</VCardTitle>
            <VCardSubtitle class="mt-1">
              Administre sus cargas de notas y planificaciones desde aquí.
            </VCardSubtitle>
          </VCardItem>

          <VCardText class="mt-4">
            <h4 class="text-base font-weight-medium mb-4">Acciones Disponibles</h4>

            <VRow>
              <VCol cols="12" sm="6" md="4">
                <VCard variant="outlined" class="text-center pa-4 card-hover cursor-pointer"
                  @click="downloadConsolidated" :loading="loading.excel" v-ripple>
                  <VIcon icon="tabler-file-spreadsheet" size="32" color="success" class="mb-2" />
                  <div class="text-body-1 font-weight-medium">Descargar Nómina</div>
                  <div class="text-caption text-disabled">Excel Consolidado</div>
                </VCard>
              </VCol>

              <VCol cols="12" sm="6" md="4">
                <VCard variant="outlined" class="text-center pa-4 card-hover cursor-pointer"
                  @click="user.blockData ? null : openModalUploadExcelNomina()"
                  :class="{ 'card-disabled': user.blockData }" v-ripple>
                  <VIcon icon="tabler-upload" size="32" color="primary" class="mb-2" />
                  <div class="text-body-1 font-weight-medium">Cargar Notas</div>
                  <div class="text-caption text-disabled">Subir archivo Excel</div>
                </VCard>
              </VCol>

            </VRow>
          </VCardText>
        </VCard>
      </VCol>
    </VRow>

    <VCard class="mb-6" :loading="loading.form">
      <VCardItem>
        <VCardTitle>📂 Mis Planificaciones Activas</VCardTitle>
      </VCardItem>

      <VCardText v-if="teacherData">
        <div v-if="teacherData.complementaries && teacherData.complementaries.length > 0">

          <VExpansionPanels variant="accordion" multiple>
            <VExpansionPanel v-for="(grade, index) in teacherData.complementaries" :key="index">
              <VExpansionPanelTitle>
                <div class="d-flex align-center">
                  <VAvatar color="primary" variant="tonal" size="32" class="me-3">
                    <span class="text-xs">{{ index + 1 }}</span>
                  </VAvatar>
                  <div>
                    <div class="font-weight-bold">{{ grade.grade_name }} "{{ grade.section_name }}"</div>
                    <div class="text-caption">{{ grade.subjects?.length || 0 }} Materias</div>
                  </div>
                </div>
              </VExpansionPanelTitle>

              <VExpansionPanelText>
                <div v-for="(subject, indexS) in grade.subjects" :key="indexS" class="mb-4">
                  <div class="d-flex align-center mb-2 bg-var-theme-background pa-2 rounded">
                    <VIcon icon="tabler-book" size="20" class="me-2" />
                    <span class="font-weight-medium">{{ subject.title }}</span>
                  </div>

                  <VDataTable :headers="headersFile" :items="subject.files" density="compact" hide-default-footer
                    class="border rounded">
                    <template #item.name="{ item }">
                      <div class="d-flex align-center">
                        <VIcon icon="tabler-file-type-pdf" color="error" size="20" class="me-2" />
                        {{ item.name }}
                      </div>
                    </template>
                    <template #item.actions="{ item }">
                      <VBtn icon variant="text" size="small" color="primary"
                        @click="downloadFile(item.file, item.name)">
                        <VIcon icon="tabler-download" />
                        <VTooltip activator="parent">Descargar</VTooltip>
                      </VBtn>
                    </template>
                    <template #bottom></template>
                  </VDataTable>
                </div>
              </VExpansionPanelText>
            </VExpansionPanel>
          </VExpansionPanels>

        </div>
        <div v-else class="text-center pa-10">
          <VIcon icon="tabler-folder-off" size="40" class="text-disabled mb-2" />
          <p>No tienes cursos asignados o planificaciones cargadas.</p>
        </div>
      </VCardText>
    </VCard>

    <ModalUploadExcelNomina ref="refModalUploadExcelNomina" />
    <ModalChangePassword ref="refModalChangePassword" />

  </div>
</template>

<style lang="scss" scoped>
.card-hover {
  transition: all 0.2s ease-in-out;
  border: 1px solid rgba(var(--v-theme-on-surface), 0.12);

  &:not(.card-disabled):hover {
    border-color: rgb(var(--v-theme-primary));
    background-color: rgba(var(--v-theme-primary), 0.04);
    transform: translateY(-2px);
  }
}

.card-disabled {
  opacity: 0.6;
  filter: grayscale(100%);
  cursor: not-allowed;
  pointer-events: none;
}

.dashed-border {
  border-style: dashed !important;
}
</style>
