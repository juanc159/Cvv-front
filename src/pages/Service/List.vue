<script setup lang="ts">
import { router } from '@/plugins/1.router';
import { useAuthenticationStore } from "@/stores/useAuthenticationStore";

definePage({
  name: "Service-List",
  meta: {
    redirectIfLoggedIn: true,
    requiresAuth: true,
    requiredPermission: "service.list",
  },
});

const authenticationStore = useAuthenticationStore();

const goView = (data: { action: string, id: number | null } = { action: "create", id: null }) => {
  router.push({ name: "Service-Form", params: { action: data.action, id: data.id } })
}

//TABLE
const tableFull = ref()

const optionsTable = {
  url: "/service/list",
  params: {
    company_id: authenticationStore.company.id,
  },
  headers: [
    { key: 'title', title: 'Título', sortable: false },
    { key: 'image', title: 'Imagen', sortable: false },
    { key: "is_active", title: 'Estado', sortable: false },
    { key: 'actions', title: 'Acciones', sortable: false },
  ],
  actions: {
    changeStatus: {
      url: "/service/changeStatus"
    },
    view: {
      show: false,
    },
    delete: {
      url: "/service/delete"
    },
  }
}

//FILTER
const optionsFilter = ref({
  inputGeneral: {
    relationsGeneral: {
      all: ["title"],
    },
  },
  dialog: {
    width: 500,
    inputs: [
      {
        input_type: "booleanActive",
        title: "Estado",
        key: "is_active",
      },
    ],
  }
})


</script>

<template>
  <div>

    <VCard>
      <VCardTitle class="d-flex justify-space-between">
        <span>
          Servicios
        </span>

        <div class="d-flex justify-end gap-3 flex-wrap ">
          <VBtn @click="goView()">
            Agregar servicio
          </VBtn>
        </div>
      </VCardTitle>

      <VCardText class=" mt-2">
        <TableFull ref="tableFull" :optionsTable="optionsTable" :optionsFilter="optionsFilter" @goView="goView">

          <template #item.image="{ item }">
            <div class="my-2">
              <VImg style="width: 80px;" :src="storageBack(item.image)"></VImg>
            </div>
          </template>

        </TableFull>
      </VCardText>
    </VCard>
  </div>
</template>
