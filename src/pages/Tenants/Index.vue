<script setup lang="ts">
definePage({
  name: "Tenants-Index",
  meta: {
    redirectIfLoggedIn: true,
    requiresAuth: true,
    requiredPermission: "tenants.index",
  },
});
import ModalStore from "@/pages/Tenants/components/ModalStore.vue";
import { VDataTable } from "vuetify/labs/VDataTable";

import { useTenantStore } from "@/pages/Tenants/Store/useTenantStore";
const tenantStore = useTenantStore();
const { tenants } = storeToRefs(tenantStore);
const isDialogDetailVisible = ref<boolean>(false);
const setHost = (text: string) => {
  tenantStore.setHost(text);
};

const headers = [
  { title: "Nombre", key: "id", sortable: false },
  { title: "Acciones", key: "action", sortable: false },
];

onMounted(async () => {
  await tenantStore.fetchList();
});
</script>

<template>
  <div>
    <VDataTable
      :headers="headers"
      :items="tenants"
      :items-per-page="999999"
      fixed-header
      class="mt-5"
    >
      <template #item.action="{ item }">
        <div class="d-flex align-center">
          <VBtn @click="setHost(item.id)">
            <VIcon icon="tabler-list" size="22" />
          </VBtn>
        </div>
      </template>
      <template #top>
        <div class="d-flex justify-end mb-6 mt-3 mr-3">
          <VBtn @click="isDialogDetailVisible = true"> Nuevo subdominio </VBtn>
        </div>
      </template>
      <template #bottom> </template>
    </VDataTable>
 
    <ModalStore v-model:isDialogDetailVisible="isDialogDetailVisible" />
  </div>
</template>


 