<script setup lang="ts">
import Miro from '@/components/Miro/Index.vue';

definePage({
  name: "Miro-Board",
  path: "Miro-Board/:action/:id/:code",
  meta: {
    redirectIfLoggedIn: true,
    requiresAuth: true,
    requiredPermission: "project.list",
    layout: "blank",
  },
});

const route = useRoute()


</script>

<template>
  <div>
    <Miro :code="route.params.code" />
  </div>
</template>
