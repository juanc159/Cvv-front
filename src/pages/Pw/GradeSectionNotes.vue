<script setup lang="ts">
import SchoolData from "@/layouts/SchoolData.vue";
import Swal from "sweetalert2";
// import { descargarArchivo } from "@core/utils/helpers";
const route = useRoute()
definePage({
  name: "Pw-GradeSectionNotes",
  path: "/gradeSectionNotes/:school_id/:grade_id/:section_id",
  meta: {
    requiresAuth: false,
    layout: "blank",
  },
});

const loading = reactive({ form: false })
const students = ref<Array<object>>([])
const title = ref()
onMounted(async () => {
  loading.form = true
  const response = await useApi(`pw-dataGradeSectionNotes/${route.params.school_id}/${route.params.grade_id}/${route.params.section_id}`).get();
  loading.form = false
  if (response.data) {
    students.value = response.data.value.students;
    title.value = response.data.value.title;
  }
});

const searchStudent = ref<string>("")

const listData = computed(() => {
  const data = students.value.filter(ele => ele.full_name.toLowerCase().includes(searchStudent.value.toLowerCase()));
  return data
})


const openPdfPreview = async (obj: object) => {

  const { value: password } = await Swal.fire({
    title: "Ingrese su documento de identidad (Ejem: 12345678)",
    input: "text",
    inputLabel: "Cédula",
    inputPlaceholder: "Ingrese su cédula",
    inputAttributes: {
      maxlength: "10",
      autocapitalize: "off",
      autocorrect: "off"
    }
  });
  if (password != obj.identity_document) {
    Swal.fire(`No coincide el dato suministrado (Ejem: 12345678)`);
    return false
  }


  loading.form = true
  const { data, response } = await useApi(`pw-pdfNote/${obj.id}`).get();
  loading.form = false

  if (response.value?.ok && data.value) {
    openPdfBase64(data.value.pdf)
  }

}

</script>

<template>
  <SchoolData>
    <VContainer id="team">
      <div class="our-team">
        <div class="headers d-flex justify-center flex-column align-center">
          <div class="d-flex align-center text-h3 mb-1 flex-wrap justify-center">
            <div class="position-relative me-2">
              <h3 class="section-title">
                {{ title }}
              </h3>
            </div>
          </div>
          <p class="text-center">
            LISTADO DE ESTUDIANTES:
          </p>
        </div>
        <VRow>
          <VCol cols="6">
            <VLabel>Nombre del estudiante:</VLabel>
            <VTextField clearable placeholder="Buscar..." v-model="searchStudent"></VTextField>
          </VCol>
          <VCol cols="12">
            <VCard :loading="loading.form" :disabled="loading.form">
              <VCardText>
                <VList lines="two" border>
                  <template v-for="(student, index) of listData" :key="student.name">
                    <VListItem>
                      <template #prepend>
                        <VAvatar variant="tonal" color="primary" size="80">
                          <span class="font-weight-medium">{{ avatarText(student.full_name) }}</span>
                        </VAvatar>
                      </template>
                      <VListItemTitle>
                        {{ student.full_name }}
                      </VListItemTitle>

                      <template #append>
                        <VBtn @click="openPdfPreview(student)">
                          Visualizar notas
                        </VBtn>
                      </template>
                    </VListItem>
                    <VDivider v-if="index !== students.length - 1" />
                  </template>
                </VList>
              </VCardText>
            </VCard>
          </VCol>
        </VRow>
      </div>
    </VContainer>
  </SchoolData>
</template>

<style lang="scss" scoped>
.team-image {
  position: absolute;
  inset-block-start: -3.4rem;
  inset-inline: 0;
}

.headers {
  margin-block-end: 1rem;
}

.our-team {
  margin-block: 7rem;
}

.team-card {
  border-radius: 90px 20px 6px 6px;
}

.section-title::after {
  position: absolute;
  background: url('../../../assets/images/front-pages/icons/section-title-icon.png') no-repeat left bottom;
  background-size: contain;
  block-size: 100%;
  content: '';
  font-weight: 700;
  inline-size: 120%;
  inset-block-end: 0;
  inset-inline-start: 0%;
}
</style>
