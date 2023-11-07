<script setup lang="ts">
import ContactArea from "@/pages/Pw/ContactArea.vue";
import Footer from "@/views/front-pages/front-page-footer.vue";
import Navbar from "@/views/front-pages/front-page-navbar.vue";
import AditionalService from "@/views/front-pages/landing-page/AditionalService.vue";
import OurTeam from "@/views/front-pages/landing-page/our-team.vue";


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
onMounted(async () => {

  const response = await useApi("pw-dataSchool/" + route.params.id).get();
  if (response.data) {
    school.value = response.data.value.company;
    typeEducations.value = response.data.value.typeEducations;
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

    <!--Activity Area Start-->
    <AditionalService id="servicioData" />


    <VContainer v-if="school" style="margin-block: 5.25rem;">
      <VCard class="mt-6">
        <VTabs v-model="currentTab" grow stacked>
          <VTab v-for="(item, key) in school.teachers" :key="item">
            <!-- <VIcon icon="tabler-phone" class="mb-2" /> -->
            <span>{{ key }}</span>
          </VTab>
        </VTabs>

        <VCardText>
          <VWindow v-model="currentTab">
            <VWindowItem v-for="(item, key) in school.teachers" :key="item">

              <div :style="{ 'background-color': 'rgb(var(--v-theme-surface))' }">
                <OurTeam v-if="item" ref="refTeam" :data="item" />
              </div>
            </VWindowItem>
          </VWindow>
        </VCardText>
      </VCard>
    </VContainer>


    <ContactArea v-if="school" :data="school" id="contactData" />

    <!-- 👉 Hero Section  -->
    <!-- <HeroSection ref="refHome" /> -->

    <!-- 👉 Useful features  -->
    <!-- <div :style="{ 'background-color': 'rgb(var(--v-theme-surface))' }">
      <Features ref="refFeatures" />
    </div> -->

    <!-- 👉 Customer Review -->
    <!-- <div :style="{ 'background-color': 'rgb(var(--v-theme-surface))' }">
      <CustomersReview />
    </div> -->



    <!-- 👉 Pricing Plans -->
    <!-- <div :style="{ 'background-color': 'rgb(var(--v-theme-surface))' }">
      <PricingPlans />
    </div> -->

    <!-- 👉 Product stats -->
    <!-- <ProductStats /> -->

    <!-- 👉 FAQ Section -->
    <!-- <div :style="{ 'background-color': 'rgb(var(--v-theme-surface))' }">
      <FaqSection ref="refFaq" />
    </div> -->

    <!-- 👉 Banner  -->
    <!-- <Banner /> -->

    <!-- 👉 Contact Us  -->
    <!-- <ContactUs ref="refContact" /> -->

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
