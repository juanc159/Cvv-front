<script setup lang="ts">
import { router } from '@/plugins/1.router';
import { useAuthenticationStore } from "@/stores/useAuthenticationStore";

definePage({
  name: "Grade-List",
  meta: {
    redirectIfLoggedIn: true,
    requiresAuth: true,
    requiredPermission: "grade.list",
  },
});

const authenticationStore = useAuthenticationStore();

const goView = (data: { action: string, id: number | null } = { action: "create", id: null }) => {
  router.push({ name: "Grade-Form", params: { action: data.action, id: data.id } })
}

//TABLE
const tableFull = ref()

const optionsTable = {
  url: "/grade/list",
  params: {
    company_id: authenticationStore.company.id,
  },
  headers: [
    { key: 'type_education_name', title: 'Tipo de educación', sortable: false },
    { key: 'name', title: 'Nombre', sortable: false },
    { key: 'actions', title: 'Acciones', sortable: false },
  ],
  actions: {
    changeStatus: {
      url: "/grade/changeStatus"
    },
    view: {
      show: false,
    },
    delete: {
      url: "/grade/delete"
    },
  }
}

//FILTER
const optionsFilter = ref({
  inputGeneral: {
    relationsGeneral: {
      all: ["name"],
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
          Grados
        </span>

        <div class="d-flex justify-end gap-3 flex-wrap ">
          <VBtn @click="goView()">
            Agregar grado
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
