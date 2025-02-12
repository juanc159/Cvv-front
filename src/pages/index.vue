<script setup lang="ts">
import { useAuthenticationStore } from '@/stores/useAuthenticationStore';

// Configuración de la página (opcional, si usas vite-plugin-vue-pages)
definePage({
  path: "/home",
  name: "Home",
  meta: {
    redirectIfLoggedIn: true,
    requiresAuth: true,
    requiredPermission: "menu.home",
  },
});

// Obtención de datos del usuario (desde Pinia store)
const { company } = storeToRefs(useAuthenticationStore());

</script>

<template>
  <div>
    <VCard class="mb-6">
      <VCardTitle>Bienvenido a: {{ company.name }}</VCardTitle>
      <VCardText>
        <!-- <DataCount /> -->
      </VCardText>
      <VCardText>
        <VRow>
          <VCol cols="12">
            <CountAllData />
          </VCol>
          <VCol cols="12" md="6">
            <StudentByTypeEducation />
          </VCol>
          <VCol cols="12" md="6">
            <StudentPhoto />
          </VCol>
          <VCol cols="12" md="6">
            <StudentLocation />
          </VCol>
          <!-- <VCol cols="12"> -->

          <!-- <StudentStatistics /> -->
          <!-- </VCol> -->
        </VRow>
      </VCardText>
    </VCard>
  </div>
</template>
