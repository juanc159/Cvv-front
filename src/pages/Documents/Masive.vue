<script setup lang="ts">
import { useAuthenticationStore } from "@/stores/useAuthenticationStore";
import { computed, ref } from 'vue';
import type { VForm } from 'vuetify/components';
const authenticationStore = useAuthenticationStore();
const { toast } = useToast()

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

interface Student {
  id: number;
  full_name: string;
  identity_document: string;
  literal?: string;
}

const searchQuery = ref('');
const loading = ref(false);
const selectedCertificate = ref<CertificateType | null>(null);
const students = ref<Student[]>([]);

// Add form validation ref
const formValid = ref(true);
const form = ref<VForm | null>(null);
const formValidateStudents = ref<VForm>();

// Additional info refs
const showAdditionalInfoModal = ref(false);
const showStudentsModal = ref(false);

// Search query for filtering students
const studentSearchQuery = ref('');

// Computed property to filter students
const filteredStudents = computed(() => {
  if (!studentSearchQuery.value.trim()) return students.value;

  const query = studentSearchQuery.value.trim().toLowerCase();
  return students.value.filter(student =>
    student.full_name.toLowerCase().includes(query) ||
    student.identity_document.toLowerCase().includes(query)
  );
});

const handleIsDialogVisible = (isVisible: boolean = false) => {
  clearForm();
  showAdditionalInfoModal.value = isVisible;
  if (!isVisible) {
    clearSelection();
  }
};

// Additional info interfaces
interface ProsecutionInfo {
  grade_id: string | null;
  section_id: string | null;
  ordering: string | null;
}

const prosecutionInfo = ref<ProsecutionInfo>({
  grade_id: null,
  section_id: null,
  ordering: null,
});

const clearForm = () => {
  prosecutionInfo.value = {
    grade_id: null,
    section_id: null,
    ordering: null,
  };
  form.value?.resetValidation();
};

// Secciones
const sections = [
  { value: 1, title: 'A' },
  { value: 2, title: 'B' },
  { value: 3, title: 'C' },
  { value: 4, title: 'D' },
  { value: 5, title: 'E' }
];

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

// Ordenamiento
const ordering = [
  { value: "full_name", title: 'Apellidos y nombres' },
  { value: "identity_document", title: 'Documento' }
];

// Validation rule for literal (single character)
const literalValidator = (value: string) => {
  if (!value) return 'El literal es requerido';
  if (value.length !== 1) return 'El literal debe ser un solo carácter';
  return true;
};

// Generic certificate download function with error handling
const downloadCertificate = async (route: string): Promise<void> => {
  try {
    const params: any = {
      grade_id: prosecutionInfo.value.grade_id,
      section_id: prosecutionInfo.value.section_id,
      ordering: prosecutionInfo.value.ordering,
      company_id: authenticationStore.company.id,
    };

    if (route === '/documents/searchStudentFor') {
      const { data, response } = await useAxios(route).get({ params });
      if (response.status === 200 && data?.students) {
        students.value = data.students.map((student: Student) => ({
          ...student,
          literal: student.literal || '',
        }));
        showAdditionalInfoModal.value = false; // Close the additional info modal
        showStudentsModal.value = true; // Open the students modal
      } else {
        throw new Error('Invalid response format');
      }
    } else {
      const { data, response } = await useAxios(route).get({ params });
      if (response.status === 200 && data?.pdf) {
        openPdfBase64(data.pdf);
      } else {
        throw new Error('Invalid response format');
      }
    }
  } catch (error) {
    console.error(`Error downloading certificate from ${route}:`, error);
  }
};

// Save literals and generate certificate
const saveLiteralsAndGenerate = async () => {
  const validation = await formValidateStudents.value?.validate()
  // console.log('Validation result:', validation);

  if (!validation?.valid) {
    toast('Faltan Campos Por Diligenciar', '', 'danger')
    return
  };

  try {
    loading.value = true;
    const { data, response } = await useAxios('/student/saveLiterals').post({
      students: students.value.map(student => ({
        id: student.id,
        literal: student.literal,
      })),
      company_id: authenticationStore.company.id,
    });

    if (response.status === 200) {
      const { data: pdfData, response: pdfResponse } = await useAxios('/documents/prosecutionPrimaryEducation').get({
        params: {
          grade_id: prosecutionInfo.value.grade_id,
          section_id: prosecutionInfo.value.section_id,
          ordering: prosecutionInfo.value.ordering,
          company_id: authenticationStore.company.id,
        },
      });

      if (pdfResponse.status === 200 && pdfData?.pdf) {
        openPdfBase64(pdfData.pdf);
        showStudentsModal.value = false;
      } else {
        throw new Error('Invalid response format');
      }
    }
  } catch (error) {
    console.error('Error saving literals:', error);
  } finally {
    loading.value = false;
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
    requiresAdditionalInfo: true,
    handler: () => downloadCertificate(`/documents/certificateInitialEducation`)
  },
  {
    id: 3,
    title: 'Constancia de Prosecución - Educación Primaria',
    icon: 'tabler-school',
    description: 'Certificado para estudiantes del Nivel de Educación Primaria que cursan desde 1er hasta 6to grado.',
    requiresAdditionalInfo: true,
    handler: () => downloadCertificate(`/documents/searchStudentFor`)
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
    const isValid = await validateForm();
    if (!isValid) return;
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

// Dedicated function to close students modal
const closeStudentsModal = () => {
  showStudentsModal.value = false;
  students.value = [];
  studentSearchQuery.value = '';
  form.value?.resetValidation();
};

const clearSelection = () => {
  selectedCertificate.value = null;
  searchQuery.value = '';
  showStudentsModal.value = false;
  showAdditionalInfoModal.value = false;
  studentSearchQuery.value = '';
  students.value = [];
  clearForm();
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
              <VCol cols="12" sm="6">
                <AppSelect :rules="[requiredValidator]" clearable :requiredField="true"
                  v-model="prosecutionInfo.grade_id" :items="initialEducationLevels" label="Seleccione el grado "
                  required />
              </VCol>
              <VCol cols="12" sm="6">
                <AppSelect :rules="[requiredValidator]" clearable :requiredField="true"
                  v-model="prosecutionInfo.section_id" :items="sections" label="Seleccione la sección" required />
              </VCol>
              <VCol cols="12" sm="6">
                <AppSelect :rules="[requiredValidator]" clearable :requiredField="true"
                  v-model="prosecutionInfo.ordering" :items="ordering" label="Seleccione el ordenamiento" required />
              </VCol>
            </VRow>
          </VForm>
          <VForm v-if="selectedCertificate?.id === 2" @submit.prevent="generateCertificate" v-model="formValid"
            ref="form">
            <VRow>
              <VCol cols="12" sm="6">
                <AppSelect :rules="[requiredValidator]" clearable :requiredField="true"
                  v-model="prosecutionInfo.section_id" :items="sections" label="Seleccione la sección" required />
              </VCol>
              <VCol cols="12" sm="6">
                <AppSelect :rules="[requiredValidator]" clearable :requiredField="true"
                  v-model="prosecutionInfo.ordering" :items="ordering" label="Seleccione el ordenamiento" required />
              </VCol>
            </VRow>
          </VForm>
          <VForm v-if="selectedCertificate?.id === 3" @submit.prevent="generateCertificate" v-model="formValid"
            ref="form">
            <VRow>
              <VCol cols="12" sm="6">
                <AppSelect :rules="[requiredValidator]" clearable :requiredField="true"
                  v-model="prosecutionInfo.grade_id" :items="primaryEducationGrades" label="Seleccione el grado"
                  required />
              </VCol>
              <VCol cols="12" sm="6">
                <AppSelect :rules="[requiredValidator]" clearable :requiredField="true"
                  v-model="prosecutionInfo.section_id" :items="sections" label="Seleccione la sección" required />
              </VCol>
              <VCol cols="12" sm="6">
                <AppSelect :rules="[requiredValidator]" clearable :requiredField="true"
                  v-model="prosecutionInfo.ordering" :items="ordering" label="Seleccione el ordenamiento" required />
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

    <!-- Modal for Students List -->
    <VDialog v-model="showStudentsModal" width="80rem" persistent>
      <DialogCloseBtn @click="closeStudentsModal()" />

      <VCard>
        <VCardTitle class="bg-primary text-white pa-4">
          <VIcon icon="tabler-users" class="me-2" color="white" />
          Lista de Estudiantes
        </VCardTitle>

        <VCardText class="pa-6">
          <!-- Search Input -->
          <VRow class="mb-4">
            <VCol cols="12">
              <VTextField v-model="studentSearchQuery" label="Buscar por nombre o documento"
                prepend-inner-icon="tabler-search" clearable variant="outlined" />
            </VCol>
          </VRow>

          <VForm ref="formValidateStudents">
            <VTable>
              <thead>
                <tr>
                  <th style="width: 40%">Nombre</th>
                  <th style="width: 30%">Documento</th>
                  <th style="width: 30%">Literal</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="student in filteredStudents" :key="student.id">
                  <td>{{ student.full_name }}</td>
                  <td>{{ student.identity_document }}</td>
                  <td>
                    <VTextField v-model="student.literal" :rules="[requiredValidator]" maxlength="1" label="Literal"
                      required />
                  </td>
                </tr>
              </tbody>
            </VTable>
          </VForm>
        </VCardText>

        <VDivider></VDivider>

        <VCardText class="d-flex align-center justify-center gap-4">
          <VSpacer></VSpacer>
          <VBtn color="error" variant="outlined" @click="closeStudentsModal">
            <VIcon icon="tabler-x" class="me-2" />
            Cancelar
          </VBtn>
          <VBtn color="primary" @click="saveLiteralsAndGenerate" :loading="loading">
            <VIcon icon="tabler-printer" class="me-2" />
            Guardar y Generar
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
