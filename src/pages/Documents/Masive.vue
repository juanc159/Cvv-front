<script setup lang="ts">
import { useAuthenticationStore } from "@/stores/useAuthenticationStore";
import { ref } from 'vue';
const authenticationStore = useAuthenticationStore();

definePage({
  name: "Documents-Masive",
  meta: {
    redirectIfLoggedIn: true,
    requiresAuth: true,
    requiredPermission: "documents.masive",
  },
});

interface CertificateType {
  id: number;
  title: string;
  icon: string;
  description: string;
  requiresAdditionalInfo?: boolean;
  handler: () => Promise<void>;
}

const searchQuery = ref('');
const loading = ref(false);
const selectedCertificate = ref<CertificateType | null>(null);

// Add form validation ref
const formValid = ref(true);
// Import VForm type from Vuetify if available
import type { VForm } from 'vuetify/components';

const form = ref<VForm | null>(null);

// Additional info refs
const showAdditionalInfoModal = ref(false);

const handleIsDialogVisible = (isVisible: boolean = false) => {
  showAdditionalInfoModal.value = isVisible;
  if (!isVisible) {
    clearSelection(); // Limpia la selección al cerrar el modal
  }
};

// Additional info interfaces
interface ProsecutionInfo {
  grade_id: string | null;
}

const prosecutionInfo = ref<ProsecutionInfo>({
  grade_id: null,
});

// Niveles de Educación Inicial
const initialEducationLevels = [
  { value: 1, title: 'Primer Nivel' },
  { value: 2, title: 'Segundo Nivel' }
];

// Grados de Educación Primaria
const primaryEducationGrades = [
  { value: 4, title: '1er Grado' },
  { value: 5, title: '2do Grado' },
  { value: 6, title: '3er Grado' },
  { value: 7, title: '4to Grado' },
  { value: 8, title: '5to Grado' },
  { value: 9, title: '6to Grado' }
];

// Generic certificate download function with error handling
const downloadCertificate = async (route: string): Promise<void> => {
  try {
    const { data, response } = await useAxios(route).get({
      params: {
        additionalInfo: "",
        grade_id: prosecutionInfo.value.grade_id,
        company_id: authenticationStore.company.id,
      }
    });

    if (response.status === 200 && data?.pdf) {
      openPdfBase64(data.pdf);
    } else {
      throw new Error('Invalid response format');
    }
  } catch (error) {
    console.error(`Error downloading certificate from ${route}:`, error);
    // Here you could add user notification of the error
  }
};

const certificateTypes: CertificateType[] = [
  {
    id: 1,
    title: 'Constancia de Prosecución - Educación Inicial (Primer y Segundo Nivel)',
    icon: 'tabler-school',
    description: 'Certificado para estudiantes del Nivel de Educación Inicial que cursan Primer o Segundo Nivel.',
    requiresAdditionalInfo: true,
    handler: () => downloadCertificate(`/documents/prosecutionInitialEducation`)
  },
  {
    id: 2,
    title: 'Certificado de Educación Inicial (Tercer Nivel)',
    icon: 'tabler-school',
    description: 'Certificado para estudiantes del Nivel de Educación Inicial que cursan Tercer Nivel.',
    requiresAdditionalInfo: false,
    handler: () => downloadCertificate(`/documents/certificateInitialEducation`)
  },
  {
    id: 3,
    title: 'Constancia de Prosecución - Educación Primaria',
    icon: 'tabler-school',
    description: 'Certificado para estudiantes del Nivel de Educación Primaria que cursan desde 1er hasta 6to grado.',
    requiresAdditionalInfo: true,
    handler: () => downloadCertificate(`/documents/prosecutionPrimaryEducation`)
  },
];

const validateForm = async () => {
  const formElement = form.value;
  if (!formElement) return false;

  const { valid } = await formElement.validate();
  return valid;
};

const selectCertificate = (cert: CertificateType) => {
  selectedCertificate.value = cert;
  if (cert.requiresAdditionalInfo) {
    showAdditionalInfoModal.value = true;
  }
};

const generateCertificate = async (withValidation: boolean = true) => {
  if (!selectedCertificate.value) return;

  if (withValidation) {
    // Validate form before proceeding
    const isValid = await validateForm();
    if (!isValid) {
      return;
    }
  }

  loading.value = true;
  try {
    await selectedCertificate.value.handler();
  } catch (error) {
    console.error('Error al generar certificado:', error);
  } finally {
    loading.value = false;
  }
};

const clearSelection = () => {
  selectedCertificate.value = null;
  searchQuery.value = '';
};
</script>

<template>
  <div>
    <VCard class="elevation-3" :loading="loading">
      <VCardTitle class="d-flex align-center pa-4 bg-primary">
        <VIcon icon="tabler-certificate" class="me-2" color="white" />
        <span class="text-white text-h5">Generador de constancias masivas</span>
      </VCardTitle>

      <VCardText class="pa-6">


        <!-- Tipos de Constancias -->
        <VSlideYTransition>
          <div class="certificates-section">
            <h3 class="text-h6 mb-4">Seleccione el tipo de constancia</h3>
            <VRow>
              <VCol v-for="cert in certificateTypes" :key="cert.id" cols="12" sm="6" md="4">
                <VCard :class="[
                  'certificate-card pa-4 cursor-pointer',
                  { 'selected': selectedCertificate?.id === cert.id }
                ]" @click="selectCertificate(cert)" elevation="2" hover>
                  <div class="d-flex align-center mb-3">
                    <VIcon :icon="cert.icon" size="32" class="me-3"
                      :color="selectedCertificate?.id === cert.id ? 'primary' : 'grey'" />
                    <h4 class="text-h6">{{ cert.title }}</h4>
                  </div>
                  <p class="text-body-2 text-grey-darken-1">{{ cert.description }}</p>
                </VCard>
              </VCol>
            </VRow>
          </div>
        </VSlideYTransition>
      </VCardText>

      <VDivider />

      <VCardText class="d-flex justify-end gap-3 flex-wrap mt-5">
        <VBtn color="error" variant="outlined" @click="clearSelection">
          <VIcon icon="tabler-x" class="me-2" />
          Cancelar
        </VBtn>
        <VBtn v-if="selectedCertificate && !selectedCertificate.requiresAdditionalInfo" color="primary"
          @click="generateCertificate(false)" :disabled="!selectedCertificate" :loading="loading">
          <VIcon icon="tabler-printer" class="me-2" />
          Generar Constancia
        </VBtn>
      </VCardText>
    </VCard>



    <!-- Modal for Additional Information -->
    <VDialog v-model="showAdditionalInfoModal" width="600" persistent>
      <DialogCloseBtn @click="handleIsDialogVisible()" />

      <VCard>
        <VCardTitle class="bg-primary text-white pa-4">
          <VIcon :icon="selectedCertificate?.icon" class="me-2" color="white" />
          {{ selectedCertificate?.title }}
        </VCardTitle>

        <VCardText class="pa-6">

          <VForm v-if="selectedCertificate?.id === 1" @submit.prevent="generateCertificate" v-model="formValid"
            ref="form">
            <VRow>
              <VCol>
                <AppSelect :rules="[requiredValidator]" clearable :requiredField="true"
                  v-model="prosecutionInfo.grade_id" :items="initialEducationLevels"
                  label="Seleccione el grado que desea generar" required />
              </VCol>
            </VRow>
          </VForm>


          <VForm v-if="selectedCertificate?.id === 3" @submit.prevent="generateCertificate" v-model="formValid"
            ref="form">
            <VRow>
              <VCol>
                <AppSelect :rules="[requiredValidator]" clearable :requiredField="true"
                  v-model="prosecutionInfo.grade_id" :items="primaryEducationGrades"
                  label="Seleccione el grado que desea generar" required />
              </VCol>
            </VRow>
          </VForm>

        </VCardText>

        <VDivider></VDivider>

        <VCardText class="d-flex align-center justify-center gap-4">
          <VSpacer></VSpacer>
          <VBtn color="error" variant="outlined" @click="showAdditionalInfoModal = false">
            <VIcon icon="tabler-x" class="me-2" />
            Cancelar
          </VBtn>
          <VBtn color="primary" @click="generateCertificate" :loading="loading" :disabled="!selectedCertificate">
            <VIcon icon="tabler-printer" class="me-2" />
            Generar Constancia
          </VBtn>
        </VCardText>
      </VCard>
    </VDialog>
  </div>
</template>

<style scoped>
.certificate-card {
  height: 100%;
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.certificate-card:hover {
  transform: translateY(-2px);
}

.certificate-card.selected {
  border-color: rgb(var(--v-theme-primary));
  background-color: rgb(var(--v-theme-primary), 0.05);
}

.preview-container {
  min-height: 400px;
  background-color: white;
}

.cursor-pointer {
  cursor: pointer;
}
</style>
