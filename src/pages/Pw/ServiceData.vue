<script setup lang="ts">
import SchoolData from "@/layouts/SchoolData.vue";

const route = useRoute()


definePage({
  name: "Pw-ServiceData",
  path: "/school/:school_id/service/:service_id",
  meta: {
    requiresAuth: false,
    layout: "blank",
  },
});

interface IService {
  id: string,
  title: string,
  image: string,
  html: string,
}


const service = ref<IService>({
  id: "",
  title: "",
  image: "",
  html: "",
})
const { data, response } = await useApi("pw-service/" + route.params.service_id).get();
if (data.value.code == 200) {
  service.value = data.value.service;
}




</script>

<template>
  <SchoolData :swiperBanners="false">
    <VContainer id="team">
      <div class="our-team">
        <div class="headers d-flex justify-center flex-column align-center">
          <div class="d-flex align-center text-h3 mb-1 flex-wrap justify-center">
            <div class="position-relative me-2">
              <h3 class="section-title">
                {{ service.title }}
              </h3>
            </div>
          </div>
        </div>
        <VRow>
          <VCol>
            <span v-html="service.html"></span>
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
