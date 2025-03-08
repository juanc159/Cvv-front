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


//TABLE
const refTableFull = ref()

const optionsTable = {
  url: "/service/list",
  params: {
    company_id: authenticationStore.company.id,
  },
  headers: [
    { key: 'title', title: 'Título' },
    { key: 'image', title: 'Imagen', sortable: false },
    { key: "is_active", title: 'Estado' },
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
  dialog: {
    width: 400,
    inputs: [
      {
        type: "booleanActive",
        name: "is_active",
        label: "Estado",
      },
    ],
  },
  filterLabels: { inputGeneral: 'Buscar en todo', is_active: 'Estado' }
})


const goViewEdit = (data: any) => {
  router.push({ name: "Service-Form", params: { action: "edit", id: data.id } })
}

const goViewCreate = () => {
  router.push({ name: "Service-Form", params: { action: "create" } })
}

</script>

<template>
  <div>

    <VCard>
      <VCardTitle class="d-flex justify-space-between">
        <span>
          Servicios
        </span>

        <div class="d-flex justify-end gap-3 flex-wrap ">
          <VBtn @click="goViewCreate()">
            Agregar servicio
          </VBtn>
        </div>
      </VCardTitle>

      <VCardText>
        <FilterDialogNew :options-filter="optionsFilter">
        </FilterDialogNew>
      </VCardText>

      <VCardText class=" mt-2">
        <TableFullNew ref="refTableFull" :options="optionsTable" @edit="goViewEdit">
          <template #item.image="{ item }">
            <div class="my-2">
              <VImg style="width: 80px;" :src="storageBack(item.image)"></VImg>
            </div>
          </template>
        </TableFullNew>

      </VCardText>
    </VCard>
  </div>
</template>
