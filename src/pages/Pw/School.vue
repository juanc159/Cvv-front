<script setup lang="ts">
import ContactArea from "@/pages/Pw/ContactArea.vue";
import Footer from "@/views/front-pages/front-page-footer.vue";
import Navbar from "@/views/front-pages/front-page-navbar.vue";
import AditionalService from "@/views/front-pages/landing-page/AditionalService.vue";

import banner_cucuta_1 from "@/assets/cvv-cucuta/banner1.png";
import banner_pirineos_1 from "@/assets/cvv-pirineos/banner1.png";
import banner_tariba_1 from "@/assets/cvv-tariba/banner1.png";

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

const schools = ref([
  {
    id: 1,
    name: "U.E Colegio Virgen del Valle",
    position: "",
    banner: [banner_tariba_1],
    networkLiks: [
      {
        text: "Sigueme en facebook",
        icon: "tabler-brand-facebook",
        link: "https://www.facebook.com/ColegioVirgenDelValleArjona",
      },
      {
        text: "instagram",
        icon: "tabler-brand-instagram",
        link: "https://www.instagram.com/challenge/?next=https%3A%2F%2Fwww.instagram.com%2Fcvirgendelvalle%2F%3F__coig_challenged%3D1",
      },
      {
        text: "tiktok",
        icon: "tabler-brand-tiktok",
        link: "https://www.tiktok.com/@cvirgendelvalle?_t=8cymV9IJMdJ&_r=1",
      },
      {
        text: "twiter",
        icon: "tabler-brand-x",
        link: "https://twitter.com/CVirgendelValle",
      },
      {
        text: "youtube",
        icon: "tabler-brand-youtube",
        link: "https://www.youtube.com/@unidadeducativacolegiovirg5233",
      },
    ],
    contactArea: [
      {
        title: "Dirección",
        icon: "tabler-current-location",
        color: "primary",
        value:
          "Arjona - Las Vegas de Táriba - Municipio Cardenas - Edo Tachira",
      },
      {
        title: "Telefonos",
        icon: "tabler-phone",
        color: "primary",
        value: ["(0276) 3946955"],
      },
      {
        title: "Correos",
        icon: "tabler-mail",
        color: "primary",
        value: [
          "colegiovirgendelvallearjona@gmail.com",
          "cvvdireccion@hotmail.com",
          "cvvdireccion@gmail.com",
          "colegiovirgendelvalle.adm@gmail.com",
        ],
      },
      {
        title: "Intagram",
        icon: "tabler-brand-instagram",
        color: "primary",
        value: "@cvirgendelvalle",
      },
    ],
    footer: [
      {
        text: "Arjona - Las Vegas de Táriba - Municipio Cardenas - Edo Tachira",
        icon: "tabler-map-pin",
      },
      {
        text: "colegiovirgendelvallearjona@gmail.com",
        icon: "tabler-mail",
      },
      {
        text: "(0276) 3946955",
        icon: "tabler-phone",
      },
    ],
  },
  {
    id: 2,
    name: "Virgen del Valle International School",
    position: "",
    banner: [banner_cucuta_1],
    networkLiks: [
      {
        text: "Sigueme en facebook",
        icon: "tabler-brand-facebook",
        link: "https://www.facebook.com/ColegioVirgenDelValleArjona",
      },
      {
        text: "instagram",
        icon: "tabler-brand-instagram",
        link: "https://www.instagram.com/challenge/?next=https%3A%2F%2Fwww.instagram.com%2Fcvirgendelvalle%2F%3F__coig_challenged%3D1",
      },
      {
        text: "tiktok",
        icon: "tabler-brand-tiktok",
        link: "https://www.tiktok.com/@cvirgendelvalle?_t=8cymV9IJMdJ&_r=1",
      },
      {
        text: "twiter",
        icon: "tabler-brand-x",
        link: "https://twitter.com/CVirgendelValle",
      },
      {
        text: "youtube",
        icon: "tabler-brand-youtube",
        link: "https://www.youtube.com/@unidadeducativacolegiovirg5233",
      },
    ],
    contactArea: [
      {
        title: "Dirección",
        icon: "tabler-current-location",
        color: "primary",
        value:
          "Avenida 10 N°. 10-35 - EDIF Virgen de Fatima -Barrio El Llano, centro de San José de Cúcuta, Departamento Norte de Santander",
      },
      {
        title: "Telefonos",
        icon: "tabler-phone",
        color: "primary",
        value: ["5754290", "(318) 3049840"],
      },
      {
        title: "Correos",
        icon: "tabler-mail",
        color: "primary",
        value: ["virgendelvalle.intl.school@gmail.com"],
      },
      {
        title: "Intagram",
        icon: "tabler-brand-instagram",
        color: "primary",
        value: "@virgendelvalle_intlschool",
      },
    ],
    footer: [
      {
        text: "Avenida 10 N°. 10-35 - EDIF Virgen de Fatima -Barrio El Llano, centro de San José de Cúcuta, Departamento Norte de Santander",
        icon: "tabler-map-pin",
      },
      {
        text: "virgendelvalle.intl.school@gmail.com",
        icon: "tabler-mail",
      },
      {
        text: "5754290 / (318) 3049840",
        icon: "tabler-phone",
      },
    ],
  },
  {
    id: 3,
    name: "U.E Colegio Lolita Robles de Mora",
    position: "",
    banner: [banner_pirineos_1],
    networkLiks: [
      {
        text: "Sigueme en facebook",
        icon: "tabler-brand-facebook",
        link: "https://www.facebook.com/ColegioVirgenDelValleArjona",
      },
      {
        text: "instagram",
        icon: "tabler-brand-instagram",
        link: "https://www.instagram.com/challenge/?next=https%3A%2F%2Fwww.instagram.com%2Fcvirgendelvalle%2F%3F__coig_challenged%3D1",
      },
      {
        text: "tiktok",
        icon: "tabler-brand-tiktok",
        link: "https://www.tiktok.com/@cvirgendelvalle?_t=8cymV9IJMdJ&_r=1",
      },
      {
        text: "twiter",
        icon: "tabler-brand-x",
        link: "https://twitter.com/CVirgendelValle",
      },
      {
        text: "youtube",
        icon: "tabler-brand-youtube",
        link: "https://www.youtube.com/@unidadeducativacolegiovirg5233",
      },
    ],
    contactArea: [
      {
        title: "Dirección",
        icon: "tabler-current-location",
        color: "primary",
        value:
          "Sector el Tamá. Av. Juan Maldonado. N° 126. Frente al parque los Escritores. Pirineos",
      },
      {
        title: "Telefonos",
        icon: "tabler-phone",
        color: "primary",
        value: ["(0424) 7242423", "(0424) 7375276"],
      },
      {
        title: "Correos",
        icon: "tabler-mail",
        color: "primary",
        value: ["ue.colegiololitarobles@gmail.com"],
      },
      {
        title: "Intagram",
        icon: "tabler-brand-instagram",
        color: "primary",
        value: "@colegiololitarobles",
      },
    ],
    footer: [
      {
        text: "Sector el Tamá. Av. Juan Maldonado. N° 126. Frente al parque los Escritores. Pirineos",
        icon: "tabler-map-pin",
      },
      {
        text: "ue.colegiololitarobles@gmail.com",
        icon: "tabler-mail",
      },
      {
        text: "(0424) 7242423 / (0424) 7375276",
        icon: "tabler-phone",
      },
    ],
  },
]);

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

const route = useRoute();
const school = ref();
onMounted(async () => {
  // school.value = schools.value.find((ele) => ele.id == route.params.id);

  const response = await useApi("pw-dataSchool/" + route.params.id).get();
  if (response.data) {
    school.value = response.data.value.company;
  }
});
</script>

<template>
  <div class="landing-page-wrapper">
    <Navbar :active-id="activeSectionId" :school="school" />

    <swiper-container
      style="margin-block-start: 6rem"
      v-if="school?.banners.length > 0"
      navigation="true"
      events-prefix="swiper-"
    >
      <swiper-slide
        pagination="true"
        v-for="(item, index) in school.banners"
        :key="index"
      >
        <VImg :src="item.path" />
      </swiper-slide>
    </swiper-container>

    <!--Activity Area Start-->
    <AditionalService id="servicioData" />

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

    <!-- 👉 Our Team -->
    <!-- <div :style="{ 'background-color': 'rgb(var(--v-theme-surface))' }">
      <OurTeam ref="refTeam" />
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
