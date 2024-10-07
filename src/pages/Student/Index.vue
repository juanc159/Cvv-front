<script lang="ts" setup type="module">
definePage({
  name: "Student-Index",
});

import { useCrudStudentStore } from "@/pages/Student/Store/useCrudStudentStore";
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
    { title: "Cédula ", key: "identity_document" },
    { title: "Nombre", key: "full_name" },
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
    },
  },
})

</script>


<template>
  <div>
    <VCard>
      <VCardTitle class="d-flex justify-space-between">
        <div>
          Listado de estudiantes
        </div>
      </VCardTitle>

      <VCardText>
        <FilterDialogNew ref="filterDialogNewRef" :optionsFilter="optionsFilter" @sendFilter="filterTableFull" />
      </VCardText>


      <TableFullNew ref="tableFullNew" :optionsTable="optionsTable">
        <template #item.actions="{ item }">
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
