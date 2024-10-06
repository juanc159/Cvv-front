<script lang="ts" setup type="module">
definePage({
  name: "Grade-Index",
});

import { useCrudGradeStore } from "@/pages/Grade/Store/useCrudGradeStore";
import { useAuthenticationStore } from "@/stores/useAuthenticationStore";
import Swal from "sweetalert2";

const crudGradeStore = useCrudGradeStore();
const authenticationStore = useAuthenticationStore();
const router = useRouter();


const changeScreen = async (action: string = "create", id?: number) => {
  router.push({ name: "Grade-Form", params: { action: action, id: id } });
};

// Accion cambio de estado
const changeState = async (obj: any, field: string) => {
  const state = !obj[field];
  const promise = await crudGradeStore.changeState({
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
      await crudGradeStore.fetchDelete(id);
      await filterTableFull(filterTableFullNew.value);
    } else if (result.isDenied) {
    }
  });
};

//TABLE 
const tableFullNew = ref();
const optionsTable = {
  url: "/grade-list",
  params: {
    company_id: authenticationStore.company.id,
  },
  headers: [
    { title: "Acciones", key: "actions" },
    { title: "Tipo", key: "type_education_name" },
    { title: "Nombre", key: "name" },
  ],
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
      all: ["name"],
      typeEducation: ["name"],
    },
  },
})

</script>

<template>
  <div>
    <VCard>
      <VCardTitle class="d-flex justify-space-between">
        <div>
          Listado de grados
        </div>
        <div class="app-teacher-search-filter d-flex align-center flex-wrap gap-4">
          <VBtn color="primary" @click="changeScreen()">
            Crear Grado
          </VBtn>
        </div>
      </VCardTitle>

      <VCardText>
        <FilterDialogNew ref="filterDialogNewRef" :optionsFilter="optionsFilter" @sendFilter="filterTableFull" />
      </VCardText>

      <TableFullNew ref="tableFullNew" :optionsTable="optionsTable">
        <template #item.path="{ item }">
          <div class="d-flex align-center py-2" style="inline-size: 10rem">
            <VImg :src="item.path" class="rounded" />
          </div>
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
      </TableFullNew>
      <VCardText>
      </VCardText>
    </VCard>
  </div>
</template>
