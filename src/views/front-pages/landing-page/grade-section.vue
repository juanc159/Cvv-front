<script setup lang="ts">

const route = useRoute()
const { data } = defineProps({
  data: {
    type: Array<Object>,
    required: true,
  },
});
</script>

<template>
  <VContainer id="team">
    <div class="our-team">
      <div class="headers d-flex justify-center flex-column align-center">
        <div class="d-flex align-center text-h3 mb-1 flex-wrap justify-center">
          <div class="position-relative me-2">
            <h3 class="section-title">
              Grados y secciónes.
            </h3>
          </div>
        </div>
        <p class="text-center">
          Haga clic sobre la grado/sección de su representado.
        </p>
      </div>
      <VRow>
        <VCol cols="12" v-for="(grade, indexG) in data" :key="indexG">
          <template v-for="(section, indexS) in grade" :key="indexS">
            <VCard class="my-3">
              <VCardTitle primary-title>
                <router-link :to="{
                  name: 'Pw-GradeSectionTeachers', params: {
                    school_id: route.params.id,
                    grade_id: section.grade_id,
                    section_id: section.section_id,
                  }
                }">

                  {{ section.grade_name + ' ' + section.section_name }}
                </router-link>
              </VCardTitle>
              <VCardText>
                <router-link :to="{
                  name: 'Pw-GradeSectionNotes', params: {
                    school_id: route.params.id,
                    grade_id: section.grade_id,
                    section_id: section.section_id,
                  }
                }">

                  Nomina de estudiantes
                </router-link>
                <!-- <h3>Docente guia: xxxxx</h3> -->
              </VCardText>
            </VCard>
          </template>
        </VCol>
      </VRow>
    </div>
  </VContainer>
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
  margin-block: 0;
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
