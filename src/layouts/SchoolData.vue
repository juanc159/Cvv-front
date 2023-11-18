<script setup lang="ts">
import Footer from "@/views/front-pages/front-page-footer.vue";
import Navbar from "@/views/front-pages/front-page-navbar.vue";


import { register } from "swiper/element/bundle";

register();

definePage({
  name: "Pw-school",
  path: "/school/:id",
  meta: {
    requiresAuth: false,
    layout: "blank",
  },
});

const activeSectionId = ref();

const route = useRoute();
const currentTab = ref();
const school = ref();
const typeEducations = ref();
const generalSecondaryEducation = ref<Array<object>>([]);
onMounted(async () => {

  const response = await useApi("pw-dataSchool/" + route.params.school_id).get();
  if (response.data) {
    school.value = response.data.value.company;
    typeEducations.value = response.data.value.typeEducations;
    generalSecondaryEducation.value = response.data.value.generalSecondaryEducation;
  }
});
</script>

<template>
  <div class="landing-page-wrapper">
    <Navbar :active-id="activeSectionId" :school="school" />

    <swiper-container style="margin-block-start: 6rem" v-if="school?.banners.length > 0" navigation="true"
      events-prefix="swiper-">
      <swiper-slide pagination="true" v-for="(item, index) in school.banners" :key="index">
        <VImg :src="item.path" />
      </swiper-slide>
    </swiper-container>

    <slot></slot>


    <!-- 👉 Footer -->
    <Footer v-if="school" :data="school" />
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
