<script lang="ts" setup type="module">
definePage({
  name: "Student-Index",
});

import { useCrudStudentStore } from "@/pages/Student/Store/useCrudStudentStore";
import { router } from "@/plugins/1.router";
import { useAuthenticationStore } from "@/stores/useAuthenticationStore";
import Swal from "sweetalert2";

const crudStudentStore = useCrudStudentStore();
const authenticationStore = useAuthenticationStore();

const resetPassword = async (id: number) => {
  Swal.fire({
    title: "¿Seguro desea reiniciar la contraseña al registro?",
    showDenyButton: true,
    showCancelButton: false,
    confirmButtonText: "Si",
    denyButtonText: "No",
  }).then(async (result) => {
    if (result.isConfirmed) {
      await crudStudentStore.fetchResetPassword(id);
    } else if (result.isDenied) {
    }
  });
};


//TABLE 
const tableFullNew = ref();
const optionsTable = {
  url: "/student-list",
  headers: [
    { title: "Acciones", key: "actions" },
    { title: "Foto ", key: "photo" },
    { title: "Grado ", key: "grade_name" },
    { title: "Sección ", key: "section_name" },
    { title: "Cédula ", key: "identity_document" },
    { title: "Nombre", key: "full_name" },
    { title: "Tipo de educación", key: "type_education_name" },
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
      all: ["identity_document", "full_name"],
      typeEducation: ["name"],
      grade: ["name"],
      section: ["name"],
    },
  },
  dialog: {
    width: 500,
    inputs: [
      {
        input_type: "select",
        title: "Foto",
        search_key: "photoPerzonalized",
        type: "null",
        custom_search: true,
        arrayList: [
          {
            value: "1",
            title: "Con foto"
          },
          {
            value: "0",
            title: "Sin foto"
          }],
      },
      {
        input_type: "selectInfinite",
        title: "Sección",
        key: "section",
        api: "selectInfiniteSection",
        search_key: "section_id",
      },

    ],
  }
})

const changeScreen = async (action: string = "create", id?: number) => {
  router.push({ name: "Student-Form", params: { action: action, id: id } });
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
      await crudStudentStore.fetchDelete(id);
      await filterTableFull(filterTableFullNew.value);
    } else if (result.isDenied) {
    }
  });
};


//EXCEL
const loading = reactive({ excel: false })
const downloadExcel = async () => {
  loading.excel = true;

  const { data, response } = await useApi("/student-excelExport").post({
    searchQuery: tableFullNew.value.optionsTable.searchQuery,
  })
  loading.excel = false;

  if (response.value?.ok && data.value) {
    downloadExcelBase64(data.value.excel, "Lista de estudiantes")
  }
}


</script>


<template>
  <div>
    <VCard>
      <VCardTitle class="d-flex justify-space-between">
        <div>
          Listado de estudiantes
        </div>
        <div class="app-teacher-search-filter d-flex align-center flex-wrap gap-4">
          <VBtn :loading="loading.excel" :disabled="loading.excel" size="38" color="primary" icon
            @click="downloadExcel()">
            <VIcon icon="tabler-file-spreadsheet"></VIcon>
            <VTooltip location="top" transition="scale-transition" activator="parent" text="Descargar Excel">
            </VTooltip>
          </VBtn>
          <VBtn color="primary" @click="changeScreen()">
            Crear Estudiante
          </VBtn>
        </div>
      </VCardTitle>

      <VCardText>
        <FilterDialogNew ref="filterDialogNewRef" :optionsFilter="optionsFilter" @sendFilter="filterTableFull" />
      </VCardText>


      <TableFullNew ref="tableFullNew" :optionsTable="optionsTable">

        <template #item.photo="{ item }">
          <div>
            <VAvatar v-if="item.photo" color="primary" variant="tonal" size="50">
              <VImg :src="item.photo" />
            </VAvatar>

            <VAvatar v-else color="primary" variant="tonal" size="50">
              {{ avatarText(item.full_name) }}
            </VAvatar>
          </div>


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
          <VBtn icon size="x-small" variant="text" @click="resetPassword(item.id)">
            <VIcon size="22" icon="tabler-lock-open" />
            <VTooltip location="top" transition="scale-transition" activator="parent" text="Resetear contraseña">
            </VTooltip>
          </VBtn>
        </template>


      </TableFullNew>
    </VCard>
  </div>
</template>
