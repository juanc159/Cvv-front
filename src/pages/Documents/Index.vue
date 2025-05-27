<script setup lang="ts">
import { computed, ref } from 'vue';

// Define interfaces for better type safety
interface Student {
  id: number;
  full_name: string;
  photo: string;
  type_education_name: string;
  grade_name: string;
  section_name: string;
}

interface CertificateType {
  id: number;
  title: string;
  icon: string;
  description: string;
  requiresAdditionalInfo?: boolean;
  handler: (id: number, additionalInfo?: any) => Promise<void>;
}

// Additional info interfaces
interface TransporterInfo {
  name: string;
  documentType: string;
  documentNumber: string;
}

interface RepresentativeInfo {
  name: string;
  documentType: string;
  documentNumber: string;
}

interface AbsenceInfo {
  startDate: string;
  endDate: string;
}

interface RegistrationFeeInfo {
  registrationFee: number;
  monthlyFee: number;
  educationalCouncilFee: number;
  totalAmount: number;
}

definePage({
  name: "Documents-Index",
  meta: {
    redirectIfLoggedIn: true,
    requiresAuth: true,
    requiredPermission: "documents.menu",
  },
});

const searchQuery = ref('');
const selectedStudent = ref<Student | null>(null);
const loading = ref(false);
const selectedCertificate = ref<CertificateType | null>(null);

// Add form validation ref
const formValid = ref(true);
const form = ref(null);

// Additional info refs
const showAdditionalInfoModal = ref(false);
const transporterInfo = ref<TransporterInfo>({
  name: '',
  documentType: 'V',
  documentNumber: ''
});
const representativeInfo = ref<RepresentativeInfo>({
  name: '',
  documentType: 'V',
  documentNumber: ''
});
const absenceInfo = ref<AbsenceInfo>({
  startDate: '',
  endDate: ''
});
const registrationFeeInfo = ref<RegistrationFeeInfo>({
  registrationFee: 68,
  monthlyFee: 68,
  educationalCouncilFee: 25,
  totalAmount: 0
});

// Compute total amount
const calculateTotal = computed(() => {
  return registrationFeeInfo.value.registrationFee +
    registrationFeeInfo.value.monthlyFee +
    registrationFeeInfo.value.educationalCouncilFee;
});

// Generic certificate download function with error handling
const downloadCertificate = async (route: string, id: number, additionalInfo?: any): Promise<void> => {
  try {
    const { data, response } = await useAxios(route).get({
      params: {
        additionalInfo: additionalInfo
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
    title: 'Constancia de Estudios',
    icon: 'tabler-school',
    description: 'Certifica que el estudiante está inscrito y cursando estudios.',
    handler: (id) => downloadCertificate(`/documents/certificate/${id}`, id)
  },
  {
    id: 2,
    title: 'Constancia de Culminación',
    icon: 'tabler-user-check',
    description: 'Documenta la finalización exitosa de un período académico.',
    handler: (id) => downloadCertificate(`/documents/certificate-completion/${id}`, id)
  },
  {
    id: 3,
    title: 'Constancia de no poseer beca',
    icon: 'tabler-notebook',
    description: 'Confirma que el estudiante no recibe becas institucionales.',
    handler: (id) => downloadCertificate(`/documents/proof-no-scholarship/${id}`, id)
  },
  {
    id: 4,
    title: 'Constancia de Aprobación',
    icon: 'tabler-coin',
    description: 'Certifica la aprobación de materias o cursos específicos.',
    handler: (id) => downloadCertificate(`/documents/certificate-approval/${id}`, id)
  },
  {
    id: 5,
    title: 'Constancia de Buena Conducta',
    icon: 'tabler-shield-check',
    description: 'Atestigua el buen comportamiento del estudiante.',
    handler: (id) => downloadCertificate(`/documents/certificate-good-conduct/${id}`, id)
  },
  {
    id: 6,
    title: 'Constancia de Inscripción',
    icon: 'tabler-calendar-check',
    description: 'Verifica la inscripción del estudiante en la institución.',
    handler: (id) => downloadCertificate(`/documents/certificate-enrollment/${id}`, id)
  },
  {
    id: 7,
    title: 'Constancia de Transportista',
    icon: 'tabler-bus',
    description: 'Certifica al transportista autorizado del estudiante.',
    requiresAdditionalInfo: true,
    handler: (id, additionalInfo) => downloadCertificate(`/documents/certificate-transporter/${id}`, id, additionalInfo)
  },
  {
    id: 8,
    title: 'Constancia de Inscripción por monto',
    icon: 'tabler-receipt',
    description: 'Detalla los montos pagados por inscripción y mensualidades.',
    requiresAdditionalInfo: true,
    handler: (id, additionalInfo) => downloadCertificate(`/documents/certificate-enrollment-amount/${id}`, id, additionalInfo)
  },
  {
    id: 9,
    title: 'Constancia de Retiro',
    icon: 'tabler-logout',
    description: 'Documenta el retiro del estudiante de la institución.',
    requiresAdditionalInfo: true,
    handler: (id, additionalInfo) => downloadCertificate(`/documents/certificate-withdrawal/${id}`, id, additionalInfo)
  },
  // {
  //   id: 10,
  //   title: 'Permiso de Ausencia Escolar',
  //   icon: 'tabler-calendar-off',
  //   description: 'Autoriza la ausencia del estudiante por un período específico.',
  //   requiresAdditionalInfo: true,
  //   handler: (id, additionalInfo) => downloadCertificate(`/documents/absence-permission/${id}`, id, additionalInfo)
  // }
];

const validateForm = async () => {
  const formElement = form.value;
  if (!formElement) return false;

  const { valid } = await formElement.validate();
  return valid;
};

const searchStudent = async () => {
  if (!searchQuery.value) return;

  loading.value = true;
  try {
    const { response, data } = await useAxios(`/documents/${searchQuery.value}/show`).get();
    if (response.status === 200 && data?.student) {
      selectedStudent.value = data.student;
    }
  } catch (error) {
    console.error('Error al buscar estudiante:', error);
  } finally {
    loading.value = false;
  }
};

const selectCertificate = (cert: CertificateType) => {
  selectedCertificate.value = cert;

  // Reset additional info
  transporterInfo.value = { name: '', documentType: 'V', documentNumber: '' };
  representativeInfo.value = { name: '', documentType: 'V', documentNumber: '' };
  absenceInfo.value = { startDate: '', endDate: '' };
  registrationFeeInfo.value = { registrationFee: 0, monthlyFee: 0, educationalCouncilFee: 0, totalAmount: 0 };

  // Show modal if needed
  if (cert.requiresAdditionalInfo) {
    showAdditionalInfoModal.value = true;
  }
};

const generateCertificate = async (withValidation: boolean = true) => {
  if (!selectedStudent.value || !selectedCertificate.value) return;

  if (withValidation) {
    // Validate form before proceeding
    const isValid = await validateForm();
    if (!isValid) {
      return;
    }
  }

  console.log("aaaaaaaaaaa");

  loading.value = true;
  try {
    let additionalInfo = null;
    if (selectedCertificate.value.id === 7) {
      if (!transporterInfo.value.name || !transporterInfo.value.documentNumber) {
        return;
      }
      additionalInfo = transporterInfo.value;
    } else if (selectedCertificate.value.id === 8) {
      registrationFeeInfo.value.totalAmount = calculateTotal.value;
      additionalInfo = registrationFeeInfo.value;
    } else if (selectedCertificate.value.id === 9) {
      if (!representativeInfo.value.name || !representativeInfo.value.documentNumber) {
        return;
      }
      additionalInfo = representativeInfo.value;
    } else if (selectedCertificate.value.id === 10) {
      if (!absenceInfo.value.startDate || !absenceInfo.value.endDate) {
        return;
      }
      additionalInfo = absenceInfo.value;
    }

    await selectedCertificate.value.handler(selectedStudent.value.id, additionalInfo);
    showAdditionalInfoModal.value = false;
  } catch (error) {
    console.error('Error al generar certificado:', error);
  } finally {
    loading.value = false;
  }
};

const clearSelection = () => {
  selectedStudent.value = null;
  selectedCertificate.value = null;
  searchQuery.value = '';
  showAdditionalInfoModal.value = false;
};

// Document type options
const documentTypes = [
  { value: 'V', title: 'V' },
  { value: 'E', title: 'E' },
  { value: 'J', title: 'J' },
  { value: 'P', title: 'P' }
];

const handleIsDialogVisible = (isVisible: boolean = false) => {
  showAdditionalInfoModal.value = isVisible;
};
</script>

<template>
  <div>
    <VCard class="elevation-3" :loading="loading">
      <VCardTitle class="d-flex align-center pa-4 bg-primary">
        <VIcon icon="tabler-certificate" class="me-2" color="white" />
        <span class="text-white text-h5">Generador de Constancias</span>
      </VCardTitle>

      <VCardText class="pa-6">
        <!-- Búsqueda de Estudiante -->
        <div class="search-section mb-6">
          <VRow>
            <VCol cols="12" md="8" class="mx-auto">
              <AppSelectRemote :return-object="false" v-model="searchQuery" url="selectInfiniteStudent"
                arrayInfo="student" label="Estudiante" @update:model-value="searchStudent"
                @click:clear="clearSelection" />
            </VCol>
          </VRow>
        </div>

        <!-- Información del Estudiante -->
        <VSlideYTransition>
          <div v-if="selectedStudent" class="student-info mb-6">
            <VCard class="pa-4 bg-grey-lighten-4">
              <VRow align="center">
                <VCol cols="12" sm="3">
                  <VAvatar size="100" class="elevation-2">
                    <VImg :src="storageBack(selectedStudent.photo)" cover />
                  </VAvatar>
                </VCol>
                <VCol cols="12" sm="9">
                  <h3 class="text-h5 mb-2">{{ selectedStudent.full_name }}</h3>
                  <p class="text-body-1 mb-1">
                    <VIcon icon="tabler-school" class="me-2" />
                    {{ selectedStudent.type_education_name }}, {{ selectedStudent.grade_name }} {{
                      selectedStudent.section_name }}
                  </p>
                </VCol>
              </VRow>
            </VCard>
          </div>
        </VSlideYTransition>

        <!-- Tipos de Constancias -->
        <VSlideYTransition>
          <div v-if="selectedStudent" class="certificates-section">
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
        <VBtn color="error" variant="outlined" @click="clearSelection" :disabled="!selectedStudent">
          <VIcon icon="tabler-x" class="me-2" />
          Cancelar
        </VBtn>
        <VBtn v-if="selectedCertificate && !selectedCertificate.requiresAdditionalInfo" color="primary"
          @click="generateCertificate(false)" :disabled="!selectedStudent || !selectedCertificate" :loading="loading">
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
          <!-- Transportista fields -->
          <VForm v-if="selectedCertificate?.id === 7" @submit.prevent="generateCertificate" v-model="formValid"
            ref="form">
            <VRow>
              <VCol cols="12">
                <AppTextField clearable v-model="transporterInfo.name" label="Nombre del Transportista"
                  :rules="[v => !!v || 'El nombre es requerido']" required :requiredField="true" />
              </VCol>
              <VCol cols="4">
                <AppSelect v-model="transporterInfo.documentType" :items="documentTypes" label="Tipo de Documento"
                  required />
              </VCol>
              <VCol cols="8">
                <AppTextField clearable v-model="transporterInfo.documentNumber" label="Número de Documento"
                  :rules="[v => !!v || 'El número de documento es requerido']" required :requiredField="true" />
              </VCol>
            </VRow>
          </VForm>

          <!-- Inscripción por monto fields -->
          <VForm v-if="selectedCertificate?.id === 8" @submit.prevent="generateCertificate" v-model="formValid"
            ref="form">
            <VRow>
              <VCol cols="6">
                <VLabel>Inscripción:</VLabel>
              </VCol>
              <VCol cols="6">
                <AppTextField :requiredField="true" clearable v-model.number="registrationFeeInfo.registrationFee"
                  prefix="$" type="number" :rules="[
                    v => !!v || 'Este campo es requerido',
                    v => v >= 0 || 'El valor debe ser positivo'
                  ]" required />
              </VCol>
            </VRow>
            <VRow>
              <VCol cols="6">
                <VLabel>Mensualidad Septiembre:</VLabel>
              </VCol>
              <VCol cols="6">
                <AppTextField :requiredField="true" clearable v-model.number="registrationFeeInfo.monthlyFee" prefix="$"
                  type="number" :rules="[
                    v => !!v || 'Este campo es requerido',
                    v => v >= 0 || 'El valor debe ser positivo'
                  ]" required />
              </VCol>
            </VRow>
            <VRow>
              <VCol cols="6">
                <VLabel>Consejo Educativo:</VLabel>
              </VCol>
              <VCol cols="6">
                <AppTextField :requiredField="true" clearable v-model.number="registrationFeeInfo.educationalCouncilFee"
                  prefix="$" type="number" :rules="[
                    v => !!v || 'Este campo es requerido',
                    v => v >= 0 || 'El valor debe ser positivo'
                  ]" required />
              </VCol>
            </VRow>
            <VRow class="mt-4">
              <VCol cols="8">
                <VLabel class="font-weight-bold">TOTAL:</VLabel>
              </VCol>
              <VCol cols="4">
                <div class="text-h6 font-weight-bold">$ {{ calculateTotal }}</div>
              </VCol>
            </VRow>
          </VForm>

          <!-- Constancia de Retiro fields -->
          <VForm v-if="selectedCertificate?.id === 9" @submit.prevent="generateCertificate" v-model="formValid"
            ref="form">
            <VRow>
              <VCol cols="12">
                <AppTextField clearable v-model="representativeInfo.name" label="Nombre del Representante"
                  :rules="[v => !!v || 'El nombre es requerido']" required :requiredField="true" />
              </VCol>
              <VCol cols="4">
                <AppSelect :requiredField="true" clearable v-model="representativeInfo.documentType"
                  :items="documentTypes" label="Tipo de Documento" required />
              </VCol>
              <VCol cols="8">
                <AppTextField clearable v-model="representativeInfo.documentNumber" label="Número de Documento"
                  :rules="[v => !!v || 'El número de documento es requerido']" required :requiredField="true" />
              </VCol>
            </VRow>
          </VForm>

          <!-- Permiso de Ausencia fields -->
          <VForm v-if="selectedCertificate?.id === 10" @submit.prevent="generateCertificate" v-model="formValid"
            ref="form">
            <VRow>
              <VCol cols="6">
                <AppTextField :requiredField="true" clearable type="date" v-model="absenceInfo.startDate"
                  label="Fecha de Inicio" :rules="[v => !!v || 'La fecha de inicio es requerida']" required />
              </VCol>
              <VCol cols="6">
                <AppTextField :requiredField="true" clearable type="date" v-model="absenceInfo.endDate"
                  label="Fecha de Fin" :rules="[
                    v => !!v || 'La fecha de fin es requerida',
                    v => !absenceInfo.startDate || v >= absenceInfo.startDate || 'La fecha de fin debe ser posterior a la fecha de inicio'
                  ]" required />
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
          <VBtn color="primary" @click="generateCertificate" :loading="loading"
            :disabled="!selectedStudent || !selectedCertificate">
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
