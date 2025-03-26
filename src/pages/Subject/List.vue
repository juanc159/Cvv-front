<script setup lang="ts">
import { router } from '@/plugins/1.router';
import { useAuthenticationStore } from "@/stores/useAuthenticationStore";

definePage({
  name: "Subject-List",
  meta: {
    redirectIfLoggedIn: true,
    requiresAuth: true,
    requiredPermission: "subject.list",
  },
});

const authenticationStore = useAuthenticationStore();

//TABLE
const refTableFull = ref()

const optionsTable = {
  url: "/subject/list",
  paramsGlobal: {
    company_id: authenticationStore.company.id,
  },
  headers: [
    { key: 'type_education_name', title: 'Tipo de educación' },
    { key: 'name', title: 'Nombre' },
    { key: 'code', title: 'Código' },
    { key: 'actions', title: 'Acciones', sortable: false },
  ],
  actions: {
    changeStatus: {
      url: "/subject/changeStatus"
    },
    view: {
      show: false,
    },
    delete: {
      url: "/subject/delete"
    },
  }
}

//FILTER
const optionsFilter = ref({
  dialog: {
    width: 400,
    inputs: [
      {
        type: "selectApi",
        label: "Tipo de educación",
        name: "type_education_id",
        arrayInfo: "typeEducation",
        multiple: true,
        url: "selectInifiniteTypeEducation"
      },
    ],
  },
  filterLabels: { inputGeneral: 'Buscar en todo', is_active: 'Estado' }
})

const goViewEdit = (data: any) => {
  router.push({ name: "Subject-Form", params: { action: "edit", id: data.id } })
}

const goViewCreate = () => {
  router.push({ name: "Subject-Form", params: { action: "create" } })
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
          Materias
        </span>

        <div class="d-flex justify-end gap-3 flex-wrap ">
          <VBtn @click="goViewCreate()">
            Agregar materia
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
