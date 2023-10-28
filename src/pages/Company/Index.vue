<script lang="ts" setup type="module">
definePage({
  name: "Company-Index",
});

import { useCrudCompanyStore } from "@/pages/Company/Store/useCrudCompanyStore";
import { useAuthenticationStore } from "@/stores/useAuthenticationStore";
import { VDataTable } from "vuetify/labs/VDataTable";

const crudCompanyStore = useCrudCompanyStore();
const auth = useAuthenticationStore();
const router = useRouter();

const { currentPage, totalPage, lastPage, totalData, companies, loading } =
  storeToRefs(crudCompanyStore);

// data paginate

const headers = [
  { title: "Nombre", key: "name" },
  { title: "Eslogan", key: "slogan" },
  { title: "Estado", key: "state" },
  { title: "Acciones", key: "actions" },
];

const rowPerPage = ref<number>(10);
const searchQuery = ref<string>();

const paginationData = computed(() => {
  const firstIndex = companies.value.length
    ? (currentPage.value - 1) * totalPage.value + 1
    : 0;
  const lastIndex =
    companies.value.length + (currentPage.value - 1) * totalPage.value;
  return `Mostrando ${firstIndex} a ${lastIndex} de ${totalData.value} registros`;
});

watch(rowPerPage, async () => {
  currentPage.value = 1;
});
watchArray([currentPage, searchQuery, rowPerPage], async () => {
  await fetchDataTable();
});
// data paginate

const fetchDataTable = async (data: Array<object> = []) => {
  await crudCompanyStore.fetchAll({
    company_id: auth.company.id,
    perPage: rowPerPage.value,
    page: currentPage.value,
    searchQuery: data,
  });
};

onMounted(async () => {
  await fetchDataTable();
});

const changeScreen = async (action: string = "create", id?: number) => {
  router.push({ name: "Company-Form", params: { action: action, id: id } });
};

// Accion cambio de estado
const changeState = async (obj: any, field: string) => {
  const state = !obj[field];
  const promise = await crudCompanyStore.changeState({
    id: obj.id,
    value: state,
    field: field,
  });
  if (promise.code == 200) obj.state = state;
};

const selectCompany = (company: object) => {
  auth.company = company;
  router.push({ name: "root" });
};
</script>

<template>
  <div>
    <VCard>
      <VCardText>
        <VDataTable :headers="headers" :items="companies" :items-per-page="5">
          <template #top>
            <VContainer fluid class="d-flex flex-wrap py-4 gap-4">
              <div class="me-3" style="inline-size: 80px">
                <VSelect
                  v-model="rowPerPage"
                  density="compact"
                  variant="outlined"
                  :items="[10, 20, 30, 50]"
                />
              </div>
              <VSpacer />
              <div
                class="app-Company-search-filter d-flex align-center flex-wrap gap-4"
              ></div>
            </VContainer>
          </template>

          <template #item.state="{ item }">
            <VChip
              :color="item.state == 1 ? 'success' : 'error'"
              @click="changeState(item, 'state')"
            >
              <VIcon
                start
                size="16"
                :icon="item.state == 1 ? 'tabler-bell' : 'tabler-alert-circle'"
              />
              <span>{{ item.state == 1 ? "Activo" : "Inactivo" }} </span>
              <VTooltip
                location="top"
                transition="scale-transition"
                activator="parent"
                text="Cambiar Estado"
              >
              </VTooltip>
            </VChip>
          </template>
          <template #item.actions="{ item }">
            <VBtn
              icon
              size="x-small"
              color="default"
              variant="text"
              @click="changeScreen('edit', item.id)"
            >
              <VIcon size="22" icon="tabler-edit" />
              <VTooltip
                location="top"
                transition="scale-transition"
                activator="parent"
                text="Editar"
              >
              </VTooltip>
            </VBtn>

            <VBtn
              v-show="item.state == 1"
              size="x-small"
              color="default"
              icon
              variant="text"
              @click="selectCompany(item)"
            >
              <VTooltip
                location="top"
                transition="scale-transition"
                activator="parent"
                text="Ingresar"
              >
              </VTooltip>
              <VIcon size="22" icon="tabler-square-rounded-arrow-right" />
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
                <VContainer
                  fluid
                  class="d-flex align-center flex-wrap justify-space-between gap-4 py-3 px-5"
                >
                  <span class="text-sm text-disabled">
                    {{ paginationData }}
                  </span>

                  <VPagination
                    v-model="currentPage"
                    size="small"
                    :total-visible="5"
                    :length="lastPage"
                  />
                </VContainer>
              </VRow>
            </VCardText>
          </template>
        </VDataTable>
      </VCardText>
    </VCard>
  </div>
</template>
  