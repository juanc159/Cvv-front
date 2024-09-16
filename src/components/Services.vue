<script setup lang="ts">
import { router } from '@/plugins/1.router';

const props = defineProps({
  school_id: {
    type: [Number, String],
    required: true,
  },
});

interface IServices {
  id: string,
  title: string,
  image: string,
  html: string,
}


const services = ref<IServices[]>([])
const { data, response } = await useApi("pw-services/" + props.school_id).get();
if (data.value.code == 200) {
  services.value = data.value.services;
}


const goView = (id: string) => {
  router.push({
    name: "Pw-ServiceData",
    params: {
      service_id: id,
      school_id: props.school_id
    },
  })
}
</script>

<template>


  <VContainer id="team">
    <div class="our-team">
      <div class="headers d-flex justify-center flex-column align-center">

        <div class="d-flex align-center text-h3 mb-1 flex-wrap justify-center">
          <div class="position-relative me-2">
            <h3 class="section-title text-center">
              Servicios adicionales o complementarios
            </h3>
          </div>
        </div>
        <p class="text-center">
          Además de sus servicios educativos obligatorios, el aprendizaje de danza
          latinoamericana, música...
        </p>
      </div>
    </div>
    <VRow>
      <VCol v-for="(item, index) in services" :key="index" cols="12" md="4" class="d-flex justify-space-around w-100">
        <div class="activity">

          <VAvatar v-if="item.image" color="primary" variant="tonal" size="170" @click="goView(item.id)">
            <VImg :src="item.image" />
          </VAvatar>

          <h3 class="mt-1">{{ item.title }}</h3>
        </div>
      </VCol>
    </VRow>
  </VContainer>
</template>

<style lang="scss" scoped>
.activity {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}
</style>
