<script setup lang="ts">
import TableFullNew from '@/components/TableNew/TableFullNew.vue';
import { router } from '@/plugins/1.router';
import { useAuthenticationStore } from "@/stores/useAuthenticationStore";

definePage({
  name: "Company-List",
  meta: {
    redirectIfLoggedIn: true,
    requiresAuth: true,
    requiredPermission: "company.list",
  },
});

const authenticationStore = useAuthenticationStore();

//TABLE
const refTableFull = ref()
const optionsTable = {
  url: "/company/list",
  headers: [
    { key: 'name', title: 'Nombre compañia' },
    { key: 'slogan', title: 'Eslogan' },
    { key: "is_active", title: 'Estado' },
    { key: 'actions', title: 'Acciones', sortable: false },
  ],
  actions: {
    changeStatus: {
      url: "/company/changeStatus"
    },
    view: {
      show: false,
    },
    delete: {
      show: false,
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
  router.push({ name: "Company-Form", params: { action: "edit", id: data.id } })
}

const goViewCreate = () => {
  router.push({ name: "Company-Form", params: { action: "create" } })
}


const selectCompany = (company: object) => {
  authenticationStore.company = company;
  router.push({ name: "Home" });
};

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
          Compañias
        </span>

        <div class="d-flex justify-end gap-3 flex-wrap ">
          <VBtn @click="goViewCreate()">
            Agregar compañia
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

          <template #item.logo="{ item }">
            <div class="my-2">
              <VImg style="width: 80px;" :src="storageBack(item.logo)"></VImg>
            </div>
          </template>

          <template #item.actions2="{ item }">

            <VListItem @click="selectCompany(item)">
              <template #prepend>
                <VIcon size="22" icon="tabler-square-rounded-arrow-right" />
              </template>
              <span>Ingresar</span>
            </VListItem>


          </template>

        </TableFullNew>
      </VCardText>
    </VCard>
  </div>
</template>
