<script setup lang="ts">
import Services from "@/components/Services.vue";
import Teachers from "@/components/Teachers.vue";
import SchoolData from "@/layouts/SchoolData.vue";
import ContactArea from "./ContactArea.vue";

definePage({
  name: "Pw-school",
  path: "/school/:school_id",
  meta: {
    requiresAuth: false,
    layout: "blank",
  },
});

const route = useRoute();
const school_id = computed(() => {
  return route.params.school_id
});


</script>

<template>
  <SchoolData>

    <Services class="mt-6" :school_id="school_id" />

    <Teachers class="mt-6" :school_id="school_id" />

    <ContactArea class="mt-6" :school_id="school_id" />

  </SchoolData>
</template>
