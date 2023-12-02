<script setup lang="ts">
import SchoolData from "@/layouts/SchoolData.vue";
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

const students = ref()
const title = ref()
onMounted(async () => {
  const response = await useApi(`pw-dataGradeSectionNotes/${route.params.school_id}/${route.params.grade_id}/${route.params.section_id}`).get();
  if (response.data) {
    students.value = response.data.value.students;
    title.value = response.data.value.title;
  }
});

const searchStudent = ref<string>("")

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
            <!-- Haga clic sobre la grado/sección de su representado. -->
          </p>
        </div>
        <VRow>
          <VCol cols="6">
            <VTextField label="Estudiante" placeholder="Buscar..." v-model="searchStudent"></VTextField>
          </VCol>
          <VCol cols="12">
            <VList lines="two" border>
              <template v-for="(student, index) of students" :key="student.name">
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
                    <VBtn>
                      Visualizar notas
                    </VBtn>
                  </template>
                </VListItem>
                <VDivider v-if="index !== students.length - 1" />
              </template>
            </VList>
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
