<script lang="ts" setup>
definePage({
  name: "DashboardStudent",
  path: "/dashboard/student",
  meta: {
    redirectIfLoggedIn: true,
    requiresAuth: true,
  },
});

import { useAuthenticationStore } from "@/stores/useAuthenticationStore";

const authenticationStore = useAuthenticationStore();
const { user } = storeToRefs(authenticationStore);

// Lógica para obtener iniciales o nombre
const avatarData = computed(() => {
  const fullName = authenticationStore.user?.full_name || '';
  if (fullName) {
    return fullName;
  }
  return 'S/N';
});

// Estados de carga
const loading = reactive({
  btnPdf: false,
  boletin: false,
  solvencyCertificate: false,
  url_to_download_prosecucion_pdf: false,
});

// --- Funciones de Descarga/Visualización ---

// 1. NOTAS CERTIFICADAS
const openPdfPreview = async (obj: object) => {
  if (!obj.pdf) return;
  loading.btnPdf = true;
  const { data, response } = await useAxios(`/pw-pdfNote/${obj.id}`).get();
  loading.btnPdf = false;

  if (response.status == 200 && data) {
    openPdfBase64(data.pdf);
  }
};

// 2. BOLETÍN (Lógica corregida: usa obj.boletin)
const openBoletinPreview = async (obj: object) => {
  // Validación estricta: si no hay boletín, no hace nada
  if (!obj.boletin) return;

  loading.boletin = true;
  const namePdf = `boletin_${obj.identity_document}.pdf`;

  // Descarga usando la variable correcta
  await downloadFileV2(obj.boletin, namePdf);
  loading.boletin = false;
};

// 3. SOLVENCIA
const openSolvencyCertificatePreview = async (obj: object) => {
  if (!obj.solvencyCertificate) return;
  loading.solvencyCertificate = true;
  const { data, response } = await useAxios(`/pw-pdfSolvencyCertificate/${obj.id}`).get();
  if (response.status == 200 && data) {
    openPdfBase64(data.pdf);
  }
  loading.solvencyCertificate = false;
};

// 4. PROSECUCIÓN
const openProsecutionPdfPreview = async (obj: object) => {
  loading.url_to_download_prosecucion_pdf = true;
  const { data, response } = await useAxios(`${obj.url_to_download_prosecucion_pdf}`).get();
  if (response.status == 200 && data) {
    openPdfBase64(data.pdf);
  }
  loading.url_to_download_prosecucion_pdf = false;
};

// --- Modales ---
const refModalContactanosStudent = ref();
const openModalContactanosStudent = () => {
  refModalContactanosStudent.value.openDialog();
};

const refModalChangePassword = ref();
const openModalPassword = () => {
  refModalChangePassword.value.openDialog(user.value.id, user.value.first_time);
};

const passwordSaved = () => {
  user.value.first_time = 0;
};

onMounted(() => {
  if (user.value.first_time) {
    refModalChangePassword.value.openDialog(user.value.id, user.value.first_time);
  }
});
</script>

<template>
  <div>
    <VRow class="match-height mb-6">

      <VCol cols="12" md="4" lg="3">
        <VCard class="h-100 text-center pa-4">
          <div class="d-flex flex-column align-center justify-center">
            <VAvatar v-if="authenticationStore.user?.photo" color="primary" variant="tonal" size="120" class="mb-4">
              <VImg :src="storageBack(authenticationStore.user?.photo)" />
            </VAvatar>
            <VAvatar v-else color="primary" variant="tonal" size="120" class="mb-4">
              <span class="text-h2">{{ avatarText(avatarData) }}</span>
            </VAvatar>

            <h3 class="text-h5 font-weight-bold mb-1">{{ user.full_name }}</h3>
            <span class="text-body-2 text-medium-emphasis">Estudiante</span>

            <VBtn size="small" variant="text" color="primary" class="mt-4" @click="openModalPassword()">
              <VIcon icon="tabler-lock" start /> Cambiar Clave
            </VBtn>
          </div>
        </VCard>
      </VCol>

      <VCol cols="12" md="8" lg="9">
        <VCard class="h-100">
          <VCardItem>
            <VCardTitle class="text-h5">¡Hola, {{ user.full_name }}! 👋</VCardTitle>
            <VCardSubtitle class="mt-1">
              Bienvenido a tu panel estudiantil. Aquí tienes tus documentos a la mano.
            </VCardSubtitle>
          </VCardItem>

          <VCardText class="mt-4">
            <h4 class="text-base font-weight-medium mb-4">📄 Mis Documentos</h4>

            <VRow>
              <VCol cols="6" sm="4" md="3">
                <VCard variant="outlined" class="text-center pa-3 card-hover cursor-pointer"
                  @click="!user.pdf ? null : openPdfPreview(user)" :disabled="!user.pdf || loading.btnPdf"
                  :loading="loading.btnPdf" :class="{ 'card-disabled': !user.pdf }" v-ripple>
                  <VIcon icon="tabler-file-analytics" size="32" color="primary" class="mb-2" />
                  <div class="text-body-2 font-weight-medium">Notas Cert.</div>
                </VCard>
              </VCol>

              <VCol cols="6" sm="4" md="3">
                <VCard variant="outlined" class="text-center pa-3 card-hover cursor-pointer"
                  @click="!user.boletin ? null : openBoletinPreview(user)" :disabled="!user.boletin || loading.boletin"
                  :loading="loading.boletin" :class="{ 'card-disabled': !user.boletin }" v-ripple>
                  <VIcon icon="tabler-report" size="32" color="info" class="mb-2" />
                  <div class="text-body-2 font-weight-medium">Boletín</div>
                </VCard>
              </VCol>

              <VCol cols="6" sm="4" md="3">
                <VCard variant="outlined" class="text-center pa-3 card-hover cursor-pointer"
                  @click="!user.solvencyCertificate ? null : openSolvencyCertificatePreview(user)"
                  :disabled="!user.solvencyCertificate || loading.solvencyCertificate"
                  :loading="loading.solvencyCertificate" :class="{ 'card-disabled': !user.solvencyCertificate }"
                  v-ripple>
                  <VIcon icon="tabler-circle-check" size="32" color="success" class="mb-2" />
                  <div class="text-body-2 font-weight-medium">Solvencia</div>
                </VCard>
              </VCol>

              <VCol cols="6" sm="4" md="3" v-if="user.url_to_download_prosecucion_pdf">
                <VCard variant="outlined" class="text-center pa-3 card-hover cursor-pointer"
                  @click="openProsecutionPdfPreview(user)" :loading="loading.url_to_download_prosecucion_pdf" v-ripple>
                  <VIcon icon="tabler-certificate" size="32" color="warning" class="mb-2" />
                  <div class="text-body-2 font-weight-medium">Constancia</div>
                </VCard>
              </VCol>

              <VCol cols="6" sm="4" md="3">
                <VCard variant="outlined" class="text-center pa-3 card-hover cursor-pointer"
                  @click="openModalContactanosStudent()" v-ripple>
                  <VIcon icon="tabler-headset" size="32" color="secondary" class="mb-2" />
                  <div class="text-body-2 font-weight-medium">Soporte</div>
                </VCard>
              </VCol>
            </VRow>
          </VCardText>
        </VCard>
      </VCol>
    </VRow>

    <VCard outlined class="mt-4">
      <VCardItem class="pb-0">
        <div class="d-flex justify-space-between align-center">
          <div>
            <VCardTitle class="text-h5">📚 Planificaciones Académicas</VCardTitle>
            <VCardSubtitle class="mb-2">
              {{ user.type_education_name }} - {{ user.grade_name }} "{{ user.section_name }}"
            </VCardSubtitle>
          </div>
        </div>
      </VCardItem>

      <VCardText class="mt-4">
        <div v-if="user.teacherPlannings?.length > 0">
          <PlanningGradeSectionTeachers :school_id="user.company_id" :grade_id="user.grade_id"
            :section_id="user.section_id" />
        </div>
        <div v-else class="text-center pa-10">
          <VIcon icon="tabler-notebook-off" size="40" class="text-disabled mb-2" />
          <p class="text-body-1 text-disabled">No hay planificaciones cargadas para tu sección aún.</p>
        </div>
      </VCardText>
    </VCard>

    <ModalChangePassword ref="refModalChangePassword" @execute="passwordSaved" />
    <ModalContactanosStudent ref="refModalContactanosStudent" />
  </div>
</template>

<style lang="scss" scoped>
/* Estilos para el efecto Hover de las tarjetas */
.card-hover {
  transition: all 0.2s ease-in-out;
  border: 1px solid rgba(var(--v-theme-on-surface), 0.12);

  &:not(.card-disabled):hover {
    border-color: rgb(var(--v-theme-primary));
    transform: translateY(-4px);
    /* Se levanta un poco más */
    box-shadow: 0 4px 18px -4px rgba(var(--v-theme-primary), 0.15);
    background-color: rgba(var(--v-theme-primary), 0.04);
  }
}

/* Estilo para tarjetas deshabilitadas (grisaceas y sin click) */
.card-disabled {
  opacity: 0.5;
  filter: grayscale(100%);
  cursor: not-allowed !important;
  pointer-events: none;
  /* Bloquea el click totalmente */
}
</style>
