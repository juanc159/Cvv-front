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

const goView = (data: { action: string, id: number | null } = { action: "create", id: null }) => {
  router.push({ name: "Subject-Form", params: { action: data.action, id: data.id } })
}

//TABLE
const tableFull = ref()

const optionsTable = {
  url: "/subject/list",
  params: {
    company_id: authenticationStore.company.id,
  },
  headers: [
    { key: 'type_education_name', title: 'Tipo de educación', sortable: false },
    { key: 'name', title: 'Nombre', sortable: false },
    { key: 'code', title: 'Código', sortable: false },
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
  inputGeneral: {
    relationsGeneral: {
      all: ["name", "code"],
      typeEducation: ["name"],
    },
  },
  dialog: {
    width: 500,
    inputs: [
      {
        input_type: "selectInfinite",
        title: "Tipo de educación",
        key: "typeEducation",
        relation: "typeEducation",
        relation_key: "type_education_id",
        multiple: true,
        api: "selectInifiniteTypeEducation"
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
          Materias
        </span>

        <div class="d-flex justify-end gap-3 flex-wrap ">
          <VBtn @click="goView()">
            Agregar materia
          </VBtn>
        </div>
      </VCardTitle>

      <VCardText class=" mt-2">
        <TableFull ref="tableFull" :optionsTable="optionsTable" :optionsFilter="optionsFilter" @goView="goView">

        </TableFull>
      </VCardText>
    </VCard>
  </div>
</template>
