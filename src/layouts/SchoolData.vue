<script setup lang="ts">
import SwiperBanners from "@/components/SwiperBanners.vue";
import Footer from "@/views/front-pages/front-page-footer.vue";
import Navbar from "@/views/front-pages/front-page-navbar.vue";

const props = defineProps({
  swiperBanners: {
    type: Boolean,
    default: true,
  },
});


const activeSectionId = ref();
const route = useRoute();
const school_id = computed(() => {
  return route.params.school_id
});


</script>

<template>
  <div class="landing-page-wrapper">
    <Navbar :active-id="activeSectionId" :school_id="school_id" />
    <SwiperBanners v-if="props.swiperBanners" :school_id="school_id" />

    <slot></slot>

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
