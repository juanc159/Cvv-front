<script setup lang="ts">
import SchoolData from "@/layouts/SchoolData.vue";
// import { descargarArchivo } from "@core/utils/helpers";
const route = useRoute()
definePage({
  name: "Pw-GradeSectionTeachers",
  path: "/gradeSectionTeachers/:school_id/:grade_id/:section_id",
  meta: {
    requiresAuth: false,
    layout: "blank",
  },
});

const teachers = ref()
const title = ref()
onMounted(async () => {
  const response = await useApi(`pw-dataGradeSection/${route.params.school_id}/${route.params.grade_id}/${route.params.section_id}`).get();
  if (response.data) {
    teachers.value = response.data.value.teachers;
    title.value = response.data.value.title;
  }
});



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
          <VCol cols="4" v-for="(item, index) of teachers" :key="index">

            <VCard flat min-width="262" class="position-relative overflow-visible team-card mb-12">
              <div
                :style="{ maxHeight: '185px', minHeight: '185px', borderRadius: '90px 20px 0 0', backgroundColor: `${item.backgroundColor}` }">
                <VImg :src="item.photo" height="240" class="team-image" />
              </div>
              <VCardText class="pa-4"
                :style="{ border: `1px solid ${item.backgroundColor}`, borderBlockStart: 'none', borderRadius: '0 0 6px 6px', boxSizing: 'border-box' }">

                <div class="text-center">
                  <span class="text-h3">{{ item.subject_name }} </span><br>
                  <span h5 class="text-h5"> {{ item.fullName }} </span><br>
                  <span class="text-body-1 ">{{ item.jobPosition }}</span><br>
                  <span class="text-body-1 ">{{ item.email }}</span><br>
                  <span class="text-body-1 ">{{ item.phone }}</span>
                </div>

                <VDivider />
                <div v-if="item.files.length > 0">
                  <span class="text-h4 mb-6">Planificación</span>
                  <div v-for="(file, indexF) of item.files" :key="indexF" class="d-flex flex-column">
                    <div class="d-flex">
                      <span style="font-size: 20px;">* &nbsp;</span>
                      <a href="#" @click="descargarArchivo(file.path, file.name)">{{ file.name }}</a>
                    </div>
                  </div>
                </div>
              </VCardText>
            </VCard>


            <!-- <VCard>
              <VCardText>
                <VRow>
                  <VCol cols="12" sm="4">
                    <VImg :src="item.photo" alt="alt" />
                  </VCol>
                  <VCol cols="12" sm="8" class="d-flex flex-column">
                    <span class="text-h4">Materia: {{ item.subject_name }}</span>
                    <span class="text-h4">Docente: {{ item.fullName }}</span>
                    <span class="text-h4">Correo: {{ item.email }}</span>
                    <span class="text-h4">Teléfono: {{ item.phone }}</span>
                  </VCol>
                  <VCol cols="12" v-for="(file, indexF) of item.files" :key="indexF" class="d-flex flex-column">
                    <span>{{ file }}</span>
                  </VCol>
                </VRow>
              </VCardText>
            </VCard> -->
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
  margin-block-end: 5rem;
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
