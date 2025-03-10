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

//TABLE
const refTableFull = ref()

const optionsTable = {
  url: "/pendingRegistration/paginate",
  params: {
    company_id: authenticationStore.company.id,
  },
  headers: [
    { key: 'term_name', title: 'Periodo' },
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
            Agregar
          </VBtn>
        </div>
      </VCardTitle>

      <VCardText>
        <FilterDialogNew :options-filter="optionsFilter">
        </FilterDialogNew>
      </VCardText>

      <VCardText class=" mt-2">

        <TableFullNew ref="refTableFull" :options="optionsTable" @edit="goViewEdit" @view="goViewView">

          <template #item.actions2="{ item, index }">
            <VListItem @click="goViewNotes(item)">
              <template #prepend>
                <VIcon icon="tabler-plus" />
              </template>
              <span>agregar notas</span>
            </VListItem>
          </template>
        </TableFullNew>

      </VCardText>
    </VCard>
  </div>
</template>
