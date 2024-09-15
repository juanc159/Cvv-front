<script setup lang="ts">
import SchoolData from "@/layouts/SchoolData.vue";
import ContactArea from "@/pages/Pw/ContactArea.vue";
import AditionalService from "@/views/front-pages/landing-page/AditionalService.vue";
import Teachers from "@/views/front-pages/landing-page/teachers.vue";


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
                <Teachers v-if="school.teachers['Educación Inicial']" :data="school.teachers['Educación Inicial']" />
              </div>
            </VWindowItem>

            <VWindowItem>
              <div :style="{ 'background-color': 'rgb(var(--v-theme-surface))' }">
                <Teachers v-if="school.teachers['Educación Primaria']" :data="school.teachers['Educación Primaria']" />
              </div>
            </VWindowItem>

            <VWindowItem>
              <div :style="{ 'background-color': 'rgb(var(--v-theme-surface))' }">
                <Teachers v-if="school.teachers['Educación Media General']"
                  :data="school.teachers['Educación Media General']" />
              </div>
            </VWindowItem>
          </VWindow>
        </VCardText>
      </VCard>
    </VContainer>


    <ContactArea v-if="school" :data="school" id="contactData" />

  </SchoolData>
</template>
