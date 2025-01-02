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
    <VRow>
      <VCol cols="12" sm="3">
        <VBtn :to="{ name: 'Project-List' }">Volver</VBtn>
      </VCol>
      <VCol cols="12">
        <Miro :code="route.params.code" />
      </VCol>
    </VRow>
  </div>
</template>
