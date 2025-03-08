<script setup lang="ts">
import { router } from '@/plugins/1.router';
import { useAuthenticationStore } from "@/stores/useAuthenticationStore";

definePage({
  name: "PendingSubject-List",
  meta: {
    redirectIfLoggedIn: true,
    requiresAuth: true,
    requiredPermission: "pendingSubject.list",
  },
});

const authenticationStore = useAuthenticationStore();

//TABLE
const refTableFull = ref()

const optionsTable = {
  url: "/pendingSubject/paginate",
  params: {
    company_id: authenticationStore.company.id,
  },
  headers: [
    { key: 'name', title: 'Nombre' },
    { key: 'start_date', title: 'Fecha inicio' },
    { key: 'end_date', title: 'Fecha fin' },
    { key: 'is_active', title: 'Estado' },
    { key: 'actions', title: 'Acciones', sortable: false, width: 100 },
  ],
  actions: {
    changeStatus: {
      url: "/pendingSubject/changeStatus"
    },
    view: {
      show: false,
    },
    delete: {
      url: "/pendingSubject/delete"
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
  router.push({ name: "PendingSubject-Form", params: { action: "edit", id: data.id } })
}

const goViewCreate = () => {
  router.push({ name: "PendingSubject-Form", params: { action: "create" } })
}


</script>

<template>
  <div>

    <VCard>
      <VCardTitle class="d-flex justify-space-between">
        <span>
          Periodos escolares
        </span>

        <div class="d-flex justify-end gap-3 flex-wrap ">
          <VBtn @click="goViewCreate()">
            Agregar periodo escolar
          </VBtn>
        </div>
      </VCardTitle>

      <VCardText>
        <FilterDialogNew :options-filter="optionsFilter">
        </FilterDialogNew>
      </VCardText>

      <VCardText class=" mt-2">

        <TableFullNew ref="refTableFull" :options="optionsTable" @edit="goViewEdit">

        </TableFullNew>

      </VCardText>
    </VCard>
  </div>
</template>
