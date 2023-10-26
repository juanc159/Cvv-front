<script setup lang="ts">
import banner1 from "@/assets/cvv-central/banner1.png";
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
const activeSectionId = ref();

const refHome = ref();
const refFeatures = ref();
const refTeam = ref();
const refContact = ref();
const refFaq = ref();

useIntersectionObserver(
  [refHome, refFeatures, refTeam, refContact, refFaq],
  ([{ isIntersecting, target }]) => {
    if (isIntersecting) activeSectionId.value = target.id;
  },
  {
    threshold: 0.25,
  }
);
</script>

<template>
  <div class="landing-page-wrapper">
    <swiper-container navigation="true" events-prefix="swiper-">
      <swiper-slide v-for="swiperImg in [banner1]" :key="swiperImg">
        <VImg :src="swiperImg" />
      </swiper-slide>
    </swiper-container>

    <!-- 👉 Our Team -->
    <div :style="{ 'background-color': 'rgb(var(--v-theme-surface))' }">
      <AllSchool ref="refTeam" />
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
