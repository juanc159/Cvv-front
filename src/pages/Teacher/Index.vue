<script lang="ts" setup type="module">
definePage({
  name: "Teacher-Index",
});

import { useCrudTeacherStore } from "@/pages/Teacher/Store/useCrudTeacherStore";
import { useAuthenticationStore } from "@/stores/useAuthenticationStore";
import Swal from "sweetalert2";

const crudTeacherStore = useCrudTeacherStore();
const authenticationStore = useAuthenticationStore();
const router = useRouter();

const changeScreen = async (action: string = "create", id?: number) => {

  if (action == 'order') {
    router.push({ name: "Teacher-Order" });
    return false
  }
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
      await filterTableFull(filterTableFullNew.value);
    } else if (result.isDenied) {
    }
  });
};


//TABLE 
const tableFullNew = ref();
const optionsTable = {
  url: "/teacher-list",
  headers: [
    { title: "Acciones", key: "actions" },
    { title: "Estado", key: "state" },
    { title: "Foto", key: "photo" },
    { title: "Tipo de educación", key: "type_education_name" },
    { title: "Cargo", key: "job_position_name" },
    { title: "Nombre(s)", key: "name" },
    { title: "Apellido(s)", key: "last_name" },
    { title: "Correo", key: "email" },
    { title: "Telefono", key: "phone" },
  ],
  params: {
    company_id: authenticationStore.company.id,
  }
}


//FILTRO  
const filterTableFullNew = ref({})
const filterTableFull = (filter: any = {}) => {
  filterTableFullNew.value = filter
  tableFullNew.value.changeFilter(filter);
};

const optionsFilter = ref({
  inputGeneral: {
    relationsGeneral: {
      all: ["name", "last_name", "email", "phone"],
      typeEducation: ["name"],
      jobPosition: ["name"],
    },
  },
  dialog: {
    width: 500,
    inputs: [
      {
        input_type: "booleanActive",
        title: "Estado",
        key: "state",
      },
    ],
  }
})



//EXCEL
const loading = reactive({ excel: false })
const downloadConsolidated = async (id: number) => {

  loading.excel = true;
  const { data, response } = await useApi("/teacher-downloadConsolidated/" + id).get()

  loading.excel = false;

  if (response.value?.ok && data.value) {
    downloadExcelBase64(data.value.excel, "Consolidado")
  }
}



</script>


<template>
  <div>
    <VCard>
      <VCardTitle class="d-flex justify-space-between">
        <div>
          Listado de docentes
        </div>
        <div class="app-teacher-search-filter d-flex align-center flex-wrap gap-4">
          <VBtn color="primary" @click="changeScreen('order')">
            Ordenar Docentes
          </VBtn>
          <VBtn color="primary" @click="changeScreen()">
            Crear Docente
          </VBtn>
        </div>
      </VCardTitle>

      <VCardText>
        <FilterDialogNew ref="filterDialogNewRef" :optionsFilter="optionsFilter" @sendFilter="filterTableFull" />
      </VCardText>


      <TableFullNew ref="tableFullNew" :optionsTable="optionsTable">
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
          <VBtn icon size="x-small" variant="text" @click="downloadConsolidated(item.id)">
            <VIcon size="22" icon="tabler-file-download" />
            <VTooltip location="top" transition="scale-transition" activator="parent" text="Descargar nomina">
            </VTooltip>
          </VBtn>
        </template>
      </TableFullNew>


    </VCard>
  </div>
</template>
