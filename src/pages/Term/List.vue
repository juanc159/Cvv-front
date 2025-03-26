<script setup lang="ts">
import { router } from '@/plugins/1.router';
import { useAuthenticationStore } from "@/stores/useAuthenticationStore";

definePage({
  name: "Term-List",
  meta: {
    redirectIfLoggedIn: true,
    requiresAuth: true,
    requiredPermission: "term.list",
  },
});

const authenticationStore = useAuthenticationStore();

//TABLE
const refTableFull = ref()

const optionsTable = {
  url: "/term/paginate",
  paramsGlobal: {
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
      url: "/term/changeStatus"
    },
    view: {
      show: false,
    },
    delete: {
      url: "/term/delete"
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
  router.push({ name: "Term-Form", params: { action: "edit", id: data.id } })
}

const goViewCreate = () => {
  router.push({ name: "Term-Form", params: { action: "create" } })
}

const tableLoading = ref(false); // Estado de carga de la tabla

// Método para refrescar los datos
const refreshTable = () => {
  if (refTableFull.value) {
    refTableFull.value.fetchTableData(null, false, true); // Forzamos la búsqueda
  }
};
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
        <FilterDialogNew :options-filter="optionsFilter" @force-search="refreshTable" :table-loading="tableLoading">
        </FilterDialogNew>
      </VCardText>

      <VCardText class=" mt-2">

        <TableFullNew ref="refTableFull" :options="optionsTable" @edit="goViewEdit"
          @update:loading="tableLoading = $event">

        </TableFullNew>

      </VCardText>
    </VCard>
  </div>
</template>
