<script setup lang="ts">

interface ITeacher {
  backgroundColor: string,
  photo: string,
  subject_name: string,
  fullName: string,
  jobPosition: string,
  email: string,
  phone: string,
  files: Array<{
    name: string,
    path: string,
  }>,
}

const props = defineProps({
  teachers: {
    type: Object,
    required: true,
  },
});


</script>

<template>

  <VContainer id="team" v-if="props.teachers">
    <div class="our-team">
      <VRow>
        <VCol v-for="(item, index) in props.teachers" :key="index" cols="12" lg="3" sm="6">
          <VCard flat min-width="262" class="position-relative overflow-visible team-card mb-12">
            <div
              :style="{ maxHeight: '185px', minHeight: '185px', borderRadius: '90px 20px 0 0', backgroundColor: `${item.backgroundColor}` }">
              <VImg :src="storageBack(item.photo)" height="240" class="team-image" />
            </div>
            <VCardText class="text-center pa-4"
              :style="{ border: `1px solid ${item.backgroundColor}`, borderBlockStart: 'none', borderRadius: '0 0 6px 6px', boxSizing: 'border-box' }">
              <div class="text-center">
                <span class="text-h3">{{ item.subject_name }} </span><br>
                <span h5 class="text-h5"> {{ item.fullName }} </span><br>
                <span class="text-body-1 ">{{ item.jobPosition }}</span><br>
                <span class="text-body-1 ">{{ item.email }}</span><br>
                <span class="text-body-1 ">{{ item.phone }}</span>
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
  margin-block: 5.25rem;
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
