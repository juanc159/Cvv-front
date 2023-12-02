<script lang="ts" setup type="module">
definePage({
  name: "Users-Index",
});

import { useCrudUserStore } from "@/pages/Users/Store/useCrudUserStore";
import { useAuthenticationStore } from "@/stores/useAuthenticationStore";
import Swal from "sweetalert2";
import { VDataTable } from "vuetify/labs/VDataTable";

const crudUserStore = useCrudUserStore();
const auth = useAuthenticationStore();
const router = useRouter();

const { currentPage, totalPage, lastPage, totalData, users, loading } =
  storeToRefs(crudUserStore);

// menu data paginate
const rowPerPage = ref<number>(10);

const fetchDataTable = async (data: Array<object> = []) => {
  await crudUserStore.fetchAll({
    company_id: auth.company.id,
    perPage: rowPerPage.value,
    page: currentPage.value,
    searchQuery: data,
  });
};

onMounted(async () => {
  await fetchDataTable();
});

watch(currentPage, async () => {
  if (currentPage.value > totalPage.value) currentPage.value = totalPage.value;
});
watch(rowPerPage, async () => {
  currentPage.value = 1;
});
watchArray([currentPage, rowPerPage], async () => {
  await fetchDataTable();
});

// 👉 Computing pagination data
const paginationData = computed(() => {
  const firstIndex = users.value.length
    ? (currentPage.value - 1) * totalPage.value + 1
    : 0;
  const lastIndex =
    users.value.length + (currentPage.value - 1) * totalPage.value;

  return `Mostrando ${firstIndex} a ${lastIndex} de ${totalData.value} registros`;
});

const changeScreen = async (action: string = "create", id?: number) => {
  router.push({ name: "Users-Form", params: { action: action, id: id } });
};

// Accion cambio de estado
const changeState = async (obj: any, field: string) => {
  const state = !obj[field];
  const promise = await crudUserStore.changeState({
    id: obj.id,
    value: state,
    field: field,
  });
  if (promise.code == 200) obj.state = state;
};

const deleteData = async (id: number) => {
  Swal.fire({
    title: "¿Desea eliminar el registro?",
    showDenyButton: true,
    showCancelButton: false,
    confirmButtonText: "Si",
    denyButtonText: "No",
  }).then(async (result) => {
    if (result.isConfirmed) {
      await crudUserStore.fetchDelete(id);
      await fetchDataTable();
    } else if (result.isDenied) {
    }
  });
};

const headers = [
  { title: "Nombre", key: "name" },
  { title: "Correo", key: "email" },
  { title: "Rol", key: "role" },
  { title: "Estado", key: "state" },
  { title: "Acciones", key: "actions" },
];
</script>

<template>
  <div>
    <VCard>
      <VCardTitle primary-title>Listado de usuarios</VCardTitle>
      <VCardText>
        <VDataTable :headers="headers" :items="users" :items-per-page="rowPerPage">
          <template #top>
            <VContainer fluid class="d-flex flex-wrap py-4 gap-4">
              <div class="me-3" style="inline-size: 80px">
                <VSelect v-model="rowPerPage" density="compact" variant="outlined" :items="[10, 20, 30, 50]" />
              </div>
              <VSpacer />
              <div class="app-user-search-filter d-flex align-center flex-wrap gap-4">
                <VBtn color="primary" @click="changeScreen()">
                  Crear usuario
                </VBtn>
              </div>
            </VContainer>
          </template>

          <template #item.state="{ item }">
            <VChip :color="item.state == 1 ? 'success' : 'error'" @click="changeState(item, 'state')">
              <VIcon start size="16" :icon="item.state == 1 ? 'tabler-bell' : 'tabler-alert-circle'" />
              <span>{{ item.state == 1 ? "Activo" : "Inactivo" }} </span>
              <VTooltip location="top" transition="scale-transition" activator="parent" text="Cambiar Estado">
              </VTooltip>
            </VChip>
          </template>
          <template #item.actions="{ item }">
            <VBtn icon size="x-small" color="error" variant="text" @click="deleteData(item.id)">
              <VIcon size="22" icon="tabler-trash" />
              <VTooltip location="top" transition="scale-transition" activator="parent" text="Eliminar">
              </VTooltip>
            </VBtn>
            <VBtn icon size="x-small" color="default" variant="text" @click="changeScreen('edit', item.id)">
              <VIcon size="22" icon="tabler-edit" />
              <VTooltip location="top" transition="scale-transition" activator="parent" text="Editar">
              </VTooltip>
            </VBtn>
          </template>

          <template v-if="loading.table" #body>
            <tr>
              <td colspan="4">
                <div style="inline-size: 100" class="d-flex justify-center">
                  <PreloadInterno />
                </div>
              </td>
            </tr>
          </template>
          <template #bottom>
            <VCardText class="pt-2">
              <VRow>
                <VContainer fluid class="d-flex align-center flex-wrap justify-space-between gap-4 py-3 px-5">
                  <span class="text-sm text-disabled">
                    {{ paginationData }}
                  </span>

                  <VPagination v-model="currentPage" size="small" :total-visible="5" :length="lastPage" />
                </VContainer>
              </VRow>
            </VCardText>
          </template>
        </VDataTable>
      </VCardText>
    </VCard>
  </div>
</template>
  