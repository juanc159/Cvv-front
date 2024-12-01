<script setup lang="ts">
definePage({
  name: "User-List",
  meta: {
    redirectIfLoggedIn: true,
    requiresAuth: true,
    requiredPermission: "menu.user",
  },
});

import ModalForm from '@/pages/UserAccess/Users/Components/ModalForm.vue';
import { useAuthenticationStore } from "@/stores/useAuthenticationStore";

const authenticationStore = useAuthenticationStore();
const { company, user } = storeToRefs(authenticationStore);


//TABLE
const tableFull = ref()

const optionsTable = {
  url: "/user/list",
  params: {
    company_id: company.value.id
  },
  headers: [
    { key: 'full_name', title: 'Nombre Completo', sortable: false },
    { key: 'email', title: 'Email', sortable: false },
    { key: 'role_name', title: 'Rol', sortable: false },
    { key: "is_active", title: 'Estado', sortable: false },
    { key: 'actions', title: 'Acciones', sortable: false },
  ],
  actions: {
    changeStatus: {
      url: "/user/changeStatus"
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
  inputGeneral: {
    relationsGeneral: {
      all: ["name", "surname", "email", "phone"],
      rol: ["name"],
    },
  },
  dialog: {
    width: 500,
    inputs: [
      {
        input_type: "booleanActive",
        title: "Estado",
        key: "is_active",
      },
    ],
  }
})


//ModalForm
const refModalForm = ref()

const openModalForm = () => {
  refModalForm.value.openModal()
}

const goView = async (data: any = { action: 'created', id: null }) => {
  refModalForm.value.openModal(data.id)
}

const reloadTable = () => {
  tableFull.value.executeFetchTable()

}
</script>

<template>
  <div>

    <VCard>
      <VCardTitle class="d-flex justify-space-between">
        <span>
          Usuarios
        </span>

        <div class="d-flex justify-end gap-3 flex-wrap ">
          <VBtn @click="openModalForm">
            Agregar usuario
          </VBtn>
        </div>
      </VCardTitle>

      <VCardText class=" mt-2">
        <TableFull ref="tableFull" :optionsTable="optionsTable" :optionsFilter="optionsFilter" @goView="goView">
        </TableFull>
      </VCardText>
    </VCard>

    <ModalForm ref="refModalForm" @execute="reloadTable" />
  </div>
</template>
