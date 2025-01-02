<script setup lang="ts">
import FormModal from "@/pages/Project/Component/FormModal.vue";
import { router } from "@/plugins/1.router";
import { useAuthenticationStore } from "@/stores/useAuthenticationStore";

definePage({
  name: "Project-List",
  meta: {
    redirectIfLoggedIn: true,
    requiresAuth: true,
    requiredPermission: "project.list",
  },
});

const authenticationStore = useAuthenticationStore();

const goViewMiroBoard = (data: { action: string, id: number | null, code: null | string }) => {
  router.push({ name: "Miro-Board", params: { action: data.action, id: data.id, code: data.code } })
}


//TABLE
const tableFull = ref()

const optionsTable = {
  url: "/project/list",
  params: {
    company_id: authenticationStore.company.id,
  },
  headers: [
    { key: 'name', title: 'Nombre', sortable: false },
    { key: 'actions', title: 'Acciones', sortable: false },
  ],
  actions: {
    delete: {
      url: "/project/delete"
    },
  }
}

//FILTER
const optionsFilter = ref({
  inputGeneral: {
    relationsGeneral: {
      all: ["name"],
    },
  },
})

const reloadTable = () => {
  tableFull.value.executeFetchTable()
}

//ModalForm
const refModalForm = ref()
const openModalForm = (data: { action: string, id: number | null } = { action: "create", id: null }) => {
  refModalForm.value.openDialog(data)
}
</script>

<template>
  <div>

    <VCard>
      <VCardTitle class="d-flex justify-space-between">
        <span>
          Proyectos
        </span>

        <div class="d-flex justify-end gap-3 flex-wrap ">
          <VBtn @click="openModalForm()">
            Agregar proyecto
          </VBtn>
        </div>
      </VCardTitle>

      <VCardText class=" mt-2">
        <TableFull ref="tableFull" :optionsTable="optionsTable" :optionsFilter="optionsFilter" @goView="openModalForm">

          <template #item.actions2="{ item }">
            <VListItem @click="goViewMiroBoard({ action: 'miro', id: item.id, code: item.code })">
              <template #prepend>
                <VIcon icon="tabler-brand-amigo" />
              </template>
              <span>Miro</span>
            </VListItem>
          </template>
        </TableFull>
      </VCardText>
    </VCard>

    <FormModal ref="refModalForm" @reloadTable="reloadTable" />

  </div>
</template>
