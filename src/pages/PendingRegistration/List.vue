<script setup lang="ts">
import { router } from '@/plugins/1.router';
import { useAuthenticationStore } from "@/stores/useAuthenticationStore";

definePage({
  name: "PendingRegistration-List",
  meta: {
    redirectIfLoggedIn: true,
    requiresAuth: true,
    requiredPermission: "pendingRegistration.list",
  },
});

const authenticationStore = useAuthenticationStore();
const loading = reactive({ excel: false })

//TABLE
const refTableFull = ref()

const optionsTable = {
  url: "/pendingRegistration/paginate",
  paramsGlobal: {
    company_id: authenticationStore.company.id,
  },
  headers: [
    { key: 'term_name', title: 'Periodo 1' },
    { key: 'section_name', title: 'Grado y sección' },
    { key: 'students_count', title: 'Cant estudiantes' },
    { key: 'actions', title: 'Acciones', sortable: false, width: 100 },
  ],
  actions: {
    changeStatus: {
      url: "/pendingRegistration/changeStatus"
    },
    delete: {
      url: "/pendingRegistration/delete"
    },
  }
}

//FILTER
const optionsFilter = ref({
  filterLabels: { inputGeneral: 'Buscar en todo', is_active: 'Estado' }
})


const goViewEdit = (data: any) => {
  router.push({ name: "PendingRegistration-Form", params: { action: "edit", id: data.id } })
}
const goViewView = (data: any) => {
  router.push({ name: "PendingRegistration-Form", params: { action: "view", id: data.id } })
}

const goViewCreate = () => {
  router.push({ name: "PendingRegistration-Form", params: { action: "create" } })
}
const goViewNotes = (item: any) => {
  router.push({ name: "PendingRegistration-Notes", params: { id: item.id } })
}
const goViewFiles = (item: any) => {
  router.push({ name: "PendingRegistration-Files", params: { id: item.id } })
}

const route = useRoute()
const downloadExcel = async () => {
  loading.excel = true;
  const { data, response } = await useApi<any>(
    createUrl(`/pendingRegistration/excelExport`, {
      query: route.query,
    })
  );

  loading.excel = false;

  if (response.value?.ok && data.value) {
    downloadExcelBase64(data.value.excel, "Materias pendientes");
  }
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
          Listado secciones de materia pendiente
        </span>

        <div class="d-flex justify-end gap-3 flex-wrap ">
          <VBtn @click="goViewCreate()">
            Agregar sección
          </VBtn>
          <VBtn @click="downloadExcel" :loading="loading.excel" :disabled="loading.excel">
            <template #prepend>
              <VIcon icon="tabler-file-type-xls"></VIcon>
            </template>
            Exportar
          </VBtn>
        </div>
      </VCardTitle>

      <VCardText>
        <FilterDialogNew :options-filter="optionsFilter" @force-search="refreshTable" :table-loading="tableLoading">
        </FilterDialogNew>
      </VCardText>

      <VCardText class=" mt-2">

        <TableFullNew ref="refTableFull" :options="optionsTable" @edit="goViewEdit" @view="goViewView"
          @update:loading="tableLoading = $event">

          <template #item.actions2="{ item, index }">
            <VListItem @click="goViewNotes(item)">
              <template #prepend>
                <VIcon icon="tabler-plus" />
              </template>
              <span>Agregar notas</span>
            </VListItem>
            <VListItem @click="goViewFiles(item)">
              <template #prepend>
                <VIcon icon="tabler-plus" />
              </template>
              <span>Agregar planificación</span>
            </VListItem>
          </template>
        </TableFullNew>

      </VCardText>
    </VCard>
  </div>
</template>
