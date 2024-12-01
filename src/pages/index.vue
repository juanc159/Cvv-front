<script setup lang="ts">
definePage({
  path: "/home",
  name: "Home",
  meta: {
    redirectIfLoggedIn: true,
    requiresAuth: true,
    requiredPermission: "menu.home",
  },
})

import { useAuthenticationStore } from '@/stores/useAuthenticationStore';

const { company, user } = storeToRefs(useAuthenticationStore())

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
        </VRow>
      </VCardText>
    </VCard>
  </div>
</template>
