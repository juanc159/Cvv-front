<script setup lang="ts">
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

const goView = (data: { action: string, id: number | null } = { action: "create", id: null }) => {
  router.push({ name: "Company-Form", params: { action: data.action, id: data.id } })
}

//TABLE
const tableFull = ref()

const optionsTable = {
  url: "/company/list",
  headers: [
    { key: 'name', title: 'Nombre compañia', sortable: false },
    { key: 'slogan', title: 'Eslogan', sortable: false },
    { key: "is_active", title: 'Estado', sortable: false },
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
  inputGeneral: {
    relationsGeneral: {
      all: ["name", "nit", "email", "phone"],
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


const selectCompany = (company: object) => {
  authenticationStore.company = company;
  router.push({ name: "Home" });
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
          <VBtn @click="goView()">
            Agregar compañia
          </VBtn>
        </div>
      </VCardTitle>

      <VCardText class=" mt-2">
        <TableFull ref="tableFull" :optionsTable="optionsTable" :optionsFilter="optionsFilter" @goView="goView">

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

        </TableFull>
      </VCardText>
    </VCard>
  </div>
</template>
