<script setup lang="ts">
import Footer from "@/views/front-pages/front-page-footer.vue";
import AllSchool from "@/views/front-pages/landing-page/all-school.vue";

definePage({
  name: "Pw-home",
  path: "/",
  meta: {
    requiresAuth: false,
    layout: "blank",
  },
});

const banners = ref([]);
const companies = ref([]);
onMounted(async () => {
  const response = await useApi("pw-dataPrincipal").get();
  if (response.data) {
    banners.value = response.data.value.banners;
    companies.value = response.data.value.companies;
  }
});
</script>

<template>
  <div class="landing-page-wrapper">
    <swiper-container navigation="true" events-prefix="swiper-">
      <swiper-slide v-for="swiperImg in banners" :key="swiperImg">
        <VImg :src="storageBack(swiperImg.path)" />
      </swiper-slide>
    </swiper-container>

    <!-- 👉 Our Team -->
    <div :style="{ 'background-color': 'rgb(var(--v-theme-surface))' }">
      <AllSchool :companies="companies" />
    </div>

    <!-- 👉 Footer -->
    <Footer />
  </div>
</template>

<style lang="scss">
@media (max-width: 960px) and (min-width: 600px) {
  .landing-page-wrapper {
    .v-container {
      padding-inline: 2rem !important;
    }
  }
}
</style>
