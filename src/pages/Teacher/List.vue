<script setup lang="ts">
import { router } from '@/plugins/1.router';
import { useAuthenticationStore } from "@/stores/useAuthenticationStore";

definePage({
  name: "Teacher-List",
  meta: {
    redirectIfLoggedIn: true,
    requiresAuth: true,
    requiredPermission: "teacher.list",
  },
});

const authenticationStore = useAuthenticationStore();



//TABLE
const refTableFull = ref()

const optionsTable = {
  url: "/teacher/list",
  paramsGlobal: {
    company_id: authenticationStore.company.id,
  },
  headers: [
    { title: "Acciones", key: "actions", sortable: false, width: 50 },
    { title: "Foto", key: "photo", sortable: false, },
    { title: "Estado", key: "is_active" },
    { title: "Tipo de educación", key: "type_education_name" },
    { title: "Cargo", key: "job_position_name" },
    { title: "Nombre(s)", key: "name" },
    { title: "Apellido(s)", key: "last_name" },
    { title: "Correo", key: "email" },
    { title: "Telefono", key: "phone" },
  ],
  actions: {
    changeStatus: {
      url: "/teacher/changeStatus"
    },
    view: {
      show: false,
    },
    delete: {
      url: "/teacher/delete"
    },
  }
}

//FILTER 
const optionsFilter = ref({
  dialog: {
    width: 400,
    inputs: [
      {
        type: "selectApi",
        label: "Tipo de educación",
        name: "type_education_id",
        arrayInfo: "typeEducation",
        multiple: true,
        url: "selectInifiniteTypeEducation"
      },
    ],
  },
  filterLabels: { inputGeneral: 'Buscar en todo', is_active: 'Estado' }
})


//EXCEL
const loading = reactive({ excel: false, resetPlanifications: false })
const downloadConsolidated = async (obj: object) => {

  loading.excel = true;
  const { data, response } = await useApi("/teacher-downloadConsolidated/" + obj.id).get()
  loading.excel = false;

  if (response.value?.ok && data.value) {
    const nameExcel = "Nómina " + obj.name + ' ' + obj.last_name
    downloadExcelBase64(data.value.excel, nameExcel)
  }
}

//ModalQuestion
const refModalQuestion = ref()
const openModalQuestionResetPassword = (id: string) => {
  refModalQuestion.value.componentData.title = "¿Seguro desea reiniciar la contraseña al registro?"
  refModalQuestion.value.openModal(id)
}

const resetPassword = async (id: string) => {
  const { data, response } = await useApi("/teacher-resetPassword/" + id).get()
};

//ModalQuestionResetPlanifications
const refModalQuestionResetPlanifications = ref()
const openModalQuestionResetPlanifications = () => {
  refModalQuestionResetPlanifications.value.componentData.title = "¿Seguro desea reiniciar las planificaciones de todos los profesores?"
  refModalQuestionResetPlanifications.value.componentData.subTitle = "Se eliminarán todas las planificaciones. Tenga en cuenta que esta acción no se puede deshacer."
  refModalQuestionResetPlanifications.value.openModal()
}

const resetPlanifications = async () => {
  loading.resetPlanifications = true;
  const { data, response } = await useApi("/teacher-resetPlanifications").delete({
    company_id: authenticationStore.company.id
  })
  loading.resetPlanifications = false;
};


const goViewEdit = (data: any) => {
  router.push({ name: "Teacher-Form", params: { action: "edit", id: data.id } })
}

const goViewCreate = () => {
  router.push({ name: "Teacher-Form", params: { action: "create" } })
}

const goViewOrder = () => {
  router.push({ name: "Teacher-Order" })
}

const goViewPlanning = (id: string) => {
  router.push({ name: "Teacher-Planning", params: { id: id } })
}


const tableLoading = ref(false); // Estado de carga de la tabla

// Método para refrescar los datos
const refreshTable = () => {
  if (refTableFull.value) {
    refTableFull.value.fetchTableData(null, false, true); // Forzamos la búsqueda
  }
};
</script>

<template>
  <div>

    <VCard>
      <VCardTitle class="d-flex justify-space-between">
        <span>
          Docentes
        </span>

        <div class="d-flex justify-end gap-3 flex-wrap ">
          <VBtn :loading="loading.resetPlanifications" :disabled="loading.resetPlanifications"
            v-if="hasPermission('teacher.reset_planifications')" color="primary"
            @click="openModalQuestionResetPlanifications">
            Reiniciar Planificaciones
          </VBtn>
          <VBtn color="primary" @click="goViewOrder()">
            Ordenar Docentes
          </VBtn>
          <VBtn @click="goViewCreate()">
            Agregar docente
          </VBtn>
        </div>
      </VCardTitle>

      <VCardText>
        <FilterDialogNew :options-filter="optionsFilter" @force-search="refreshTable" :table-loading="tableLoading">
        </FilterDialogNew>
      </VCardText>

      <VCardText class="mt-2">
        <TableFullNew ref="refTableFull" :options="optionsTable" @edit="goViewEdit"
          @update:loading="tableLoading = $event">

          <template #item.photo="{ item }">
            <VAvatar :color="item.photo ? '' : 'primary'" :class="item.photo ? null : 'v-avatar-light-bg primary--text'"
              :variant="!item.photo ? 'tonal' : undefined">
              <VImg v-if="item.photo" style="width: 80px;" :src="storageBack(item.photo)"></VImg>
              <span v-else>{{ avatarText(item.name + ' ' + item.last_name) }}</span>
            </VAvatar>
          </template>

          <template #item.actions2="{ item }">
            <VListItem @click="downloadConsolidated(item)">
              <template #prepend>
                <VIcon icon="tabler-file-download" />
              </template>
              <span>Descargar Nómina</span>
            </VListItem>

            <VListItem @click="openModalQuestionResetPassword(item.id)">
              <template #prepend>
                <VIcon icon="tabler-lock-open" />
              </template>
              <span>Resetear contraseña</span>
            </VListItem>

            <VListItem @click="goViewPlanning(item.id)">
              <template #prepend>
                <VIcon icon="tabler-file" />
              </template>
              <span>Planificación</span>
            </VListItem>

          </template>




        </TableFullNew>
      </VCardText>
    </VCard>

    <ModalQuestion ref="refModalQuestion" @success="resetPassword" />
    <ModalQuestion ref="refModalQuestionResetPlanifications" @success="resetPlanifications" />

  </div>
</template>
