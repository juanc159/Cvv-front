<script setup lang="ts">
import { router } from '@/plugins/1.router';
import { useAuthenticationStore } from "@/stores/useAuthenticationStore";

definePage({
  name: "Banner-List",
  meta: {
    redirectIfLoggedIn: true,
    requiresAuth: true,
    requiredPermission: "banner.list",
  },
});

const authenticationStore = useAuthenticationStore();


//TABLE
const refTableFull = ref()

const optionsTable = {
  url: "/banner/list",
  params: {
    company_id: authenticationStore.company.id,
  },
  headers: [
    { key: 'path', title: 'Imagen', sortable: false },
    { key: "is_active", title: 'Estado', sortable: false },
    { key: 'actions', title: 'Acciones', sortable: false },
  ],
  actions: {
    changeStatus: {
      url: "/banner/changeStatus"
    },
    view: {
      show: false,
    },
    delete: {
      url: "/banner/delete"
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
        title: "Estado",
      },
    ],
  },
  filterLabels: { inputGeneral: 'Buscar en todo', is_active: 'Estado' }
})



const goViewEdit = (data: any) => {
  router.push({ name: "Banner-Form", params: { action: "edit", id: data.id } })
}

const goViewCreate = () => {
  router.push({ name: "Banner-Form", params: { action: "create" } })
}


</script>

<template>
  <div>

    <VCard>
      <VCardTitle class="d-flex justify-space-between">
        <span>
          Banners
        </span>

        <div class="d-flex justify-end gap-3 flex-wrap ">
          <VBtn @click="goViewCreate()">
            Agregar banner
          </VBtn>
        </div>
      </VCardTitle>

      <VCardText>
        <FilterDialogNew :options-filter="optionsFilter">
        </FilterDialogNew>
      </VCardText>

      <VCardText class=" mt-2">
        <TableFullNew ref="refTableFull" :options="optionsTable" @edit="goViewEdit">

          <template #item.path="{ item }">
            <div class="my-2">
              <VImg style="width: 80px;" :src="storageBack(item.path)"></VImg>
            </div>
          </template>

        </TableFullNew>
      </VCardText>
    </VCard>
  </div>
</template>
