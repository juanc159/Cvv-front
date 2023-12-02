<script lang="ts" setup type="module">
definePage({
  name: "Teacher-Index",
});

import { useCrudTeacherStore } from "@/pages/Teacher/Store/useCrudTeacherStore";
import { useAuthenticationStore } from "@/stores/useAuthenticationStore";
import Swal from "sweetalert2";
import { VDataTable } from "vuetify/labs/VDataTable";

const crudTeacherStore = useCrudTeacherStore();
const authenticationStore = useAuthenticationStore();
const router = useRouter();

const { currentPage, totalPage, lastPage, totalData, teachers, loading } =
  storeToRefs(crudTeacherStore);

// menu data paginate
const rowPerPage = ref<number>(10);

const fetchDataTable = async (data: Array<object> = []) => {
  await crudTeacherStore.fetchAll({
    company_id: authenticationStore.company.id,
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
  const firstIndex = teachers.value.length
    ? (currentPage.value - 1) * totalPage.value + 1
    : 0;
  const lastIndex =
    teachers.value.length + (currentPage.value - 1) * totalPage.value;

  return `Mostrando ${firstIndex} a ${lastIndex} de ${totalData.value} registros`;
});

const changeScreen = async (action: string = "create", id?: number) => {

  if (action == 'planning') {
    router.push({ name: "Teacher-Planning", params: { id: id } });
    return false
  }
  router.push({ name: "Teacher-Form", params: { action: action, id: id } });
};

// Accion cambio de estado
const changeState = async (obj: any, field: string) => {
  const state = !obj[field];
  const promise = await crudTeacherStore.changeState({
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
      await crudTeacherStore.fetchDelete(id);
      await fetchDataTable();
    } else if (result.isDenied) {
    }
  });
};

const headers = [
  { title: "Acciones", key: "actions" },
  { title: "Estado", key: "state" },
  { title: "Foto", key: "photo" },
  { title: "Tipo de educación", key: "type_education_name" },
  { title: "Cargo", key: "job_position_name" },
  { title: "Nombre(s)", key: "name" },
  { title: "Apellido(s)", key: "last_name" },
  { title: "Correo", key: "email" },
  { title: "Telefono", key: "phone" },
  { title: "Materias", key: "subjects" },
];
</script>

<template>
  <div>
    <VCard>
      <VCardText>
        <VDataTable :headers="headers" :items="teachers" :items-per-page="rowPerPage">
          <template #top>
            <VContainer fluid class="d-flex flex-wrap py-4 gap-4">
              <div class="me-3" style="inline-size: 80px">
                <VSelect v-model="rowPerPage" density="compact" variant="outlined" :items="[10, 20, 30, 50]" />
              </div>
              <VSpacer />
              <div class="app-teacher-search-filter d-flex align-center flex-wrap gap-4">
                <VBtn color="primary" @click="changeScreen()">
                  Crear Docente
                </VBtn>
              </div>
            </VContainer>
          </template>

          <template #item.photo="{ item }">
            <VAvatar :color="item.photo ? '' : 'primary'" :class="item.photo ? null : 'v-avatar-light-bg primary--text'"
              :variant="!item.photo ? 'tonal' : undefined">
              <VImg v-if="item.photo" :src="item.photo" />
              <span v-else>{{ avatarText(item.name + ' ' + item.last_name) }}</span>
            </VAvatar>
          </template>
          <template #item.subjects="{ item }">
            <VList border>
              <template v-for="(data, index) of item.subjects" :key="data.name">
                <VListItem>
                  <VListItemTitle>
                    {{ data }}
                  </VListItemTitle>
                </VListItem>
                <VDivider v-if="index !== item.subjects.length - 1" />
              </template>
            </VList>
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
            <VBtn icon size="x-small" color="default" variant="text" @click="changeScreen('planning', item.id)">
              <VIcon size="22" icon="tabler-file" />
              <VTooltip location="top" transition="scale-transition" activator="parent" text="Planificación">
              </VTooltip>
            </VBtn>
          </template>

          <template v-if="loading.table" #body>
            <tr>
              <td colspan="10">
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
  