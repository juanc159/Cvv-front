<script setup lang="ts">

const { data } = defineProps({
  data: {
    type: Array<Object>,
    required: true,
  },
});
</script>

<template>
  <VContainer id="team" v-if="data.length > 0">
    <div class="our-team">
      <div class="headers d-flex justify-center flex-column align-center">

        <div class="d-flex align-center text-h3 mb-1 flex-wrap justify-center">
          <div class="position-relative me-2">
            <h3 class="section-title">
              Nuestro gran equipo docentes
            </h3>
          </div>

        </div>

        <p class="text-center">
          Educadores comprometidos con el éxito de tus hijosaa
        </p>
      </div>
      <VRow>
        <VCol v-for="(item, index) in data" :key="index" cols="12" lg="4" sm="4">
          <VCard flat min-width="262" class="position-relative overflow-visible team-card mb-12">
            <div
              :style="{ maxHeight: '185px', minHeight: '185px', borderRadius: '90px 20px 0 0', backgroundColor: `${item.backgroundColor}` }">
              <VImg :src="item.photo" height="240" class="team-image" />
            </div>
            <VCardText class="pa-4"
              :style="{ border: `1px solid ${item.backgroundColor}`, borderBlockStart: 'none', borderRadius: '0 0 6px 6px', boxSizing: 'border-box' }">

              <div class="text-center">
                <span class="text-h3">{{ item.grade_name + ' ' + item.section_name }}</span><br>
                <span class="text-h5">{{ item.fullName }} </span><br>
                <span class="text-body-1 text-disabled">{{ item.jobPosition }}</span><br>
                <span class="text-body-1 text-disabled">{{ item.email }}</span><br>
                <span class="text-body-1 text-disabled">{{ item.phone }}</span>
              </div>

              <VDivider />
              <div v-if="item.files.length > 0">
                <span class="text-h4 mb-6">Planificación</span>
                <div v-for="(file, indexF) of item.files" :key="indexF" class="d-flex flex-column">
                  <span>{{ file }}</span>
                </div>
              </div>

            </VCardText>
          </VCard>
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
  margin-block-end: 7rem;
}

.our-team {
  margin-block: 0;

  // margin-block: 5.25rem;
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
