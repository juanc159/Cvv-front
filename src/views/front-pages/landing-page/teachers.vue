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
      <VRow class="mt-6">
        <VCol v-for="(item, index) in data" :key="index" cols="12" lg="3" sm="6">
          <VCard flat min-width="262" class="position-relative overflow-visible team-card mb-12">
            <div
              :style="{ maxHeight: '185px', minHeight: '185px', borderRadius: '90px 20px 0 0', backgroundColor: `${item.backgroundColor}` }">
              <VImg :src="item.photo" height="240" class="team-image" />
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
</style>
