<script setup lang="ts">
import SchoolData from "@/layouts/SchoolData.vue";
import ContactArea from "@/pages/Pw/ContactArea.vue";
import AditionalService from "@/views/front-pages/landing-page/AditionalService.vue";
import GradeSection from "@/views/front-pages/landing-page/grade-section.vue";
import OurTeam from "@/views/front-pages/landing-page/our-team.vue";


import { register } from "swiper/element/bundle";

register();

definePage({
  name: "Pw-school",
  path: "/school/:school_id",
  meta: {
    requiresAuth: false,
    layout: "blank",
  },
});


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
  <SchoolData>

    <!--Activity Area Start-->
    <AditionalService id="servicioData" />

    <VContainer v-if="school" style="margin-block: 5.25rem;">
      <VCard class="mt-6">
        <VTabs v-model="currentTab" grow stacked>
          <VTab v-for="(item, index) in typeEducations" :key="index">
            <!-- <VIcon icon="tabler-phone" class="mb-2" /> -->
            <span>{{ item.title }}</span>
          </VTab>
        </VTabs>


        <VCardText>
          <VWindow v-model="currentTab">
            <VWindowItem>
              <div :style="{ 'background-color': 'rgb(var(--v-theme-surface))' }">
                <GradeSection :data="generalSecondaryEducation" />
              </div>
            </VWindowItem>
            <VWindowItem v-for="(item, key) in typeEducations" :key="key">

              <div :style="{ 'background-color': 'rgb(var(--v-theme-surface))' }">
                <OurTeam v-if="item" :data="school.teachers[item.title]" />
              </div>
            </VWindowItem>
          </VWindow>
        </VCardText>
      </VCard>
    </VContainer>


    <ContactArea v-if="school" :data="school" id="contactData" />

  </SchoolData>
</template>
 