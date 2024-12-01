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

const goView = (data: { action: string, id: number | null } = { action: "create", id: null }) => {

  if (data.action == 'order') {
    router.push({ name: "Teacher-Order" });
    return false
  }
  if (data.action == 'planning') {
    router.push({ name: "Teacher-Planning", params: { id: data.id } });
    return false
  }
  router.push({ name: "Teacher-Form", params: { action: data.action, id: data.id } })
}

//TABLE
const tableFull = ref()

const optionsTable = {
  url: "/teacher/list",
  params: {
    company_id: authenticationStore.company.id,
  },
  headers: [
    { title: "Acciones", key: "actions", sortable: false, width: 50 },
    { title: "Estado", key: "is_active", sortable: false },
    { title: "Foto", key: "photo", sortable: false },
    { title: "Tipo de educación", key: "type_education_name", sortable: false },
    { title: "Cargo", key: "job_position_name", sortable: false },
    { title: "Nombre(s)", key: "name", sortable: false },
    { title: "Apellido(s)", key: "last_name", sortable: false },
    { title: "Correo", key: "email", sortable: false },
    { title: "Telefono", key: "phone", sortable: false },
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
        input_type: "selectInfinite",
        title: "Tipo de educación",
        key: "typeEducation",
        relation: "typeEducation",
        relation_key: "type_education_id",
        multiple: true,
        api: "selectInifiniteTypeEducation"
      },
    ],
  }
})


//EXCEL
const loading = reactive({ excel: false })
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

const resetPassword = async (id: number) => {
  const { data, response } = await useApi("/teacher-resetPassword/" + id).get()
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
          <VBtn color="primary" @click="goView({ action: 'order', id: null })">
            Ordenar Docentes
          </VBtn>
          <VBtn @click="goView()">
            Agregar docente
          </VBtn>
        </div>
      </VCardTitle>

      <VCardText class="mt-2">
        <TableFull ref="tableFull" :optionsTable="optionsTable" :optionsFilter="optionsFilter" @goView="goView">

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

            <VListItem @click="goView({ action: 'planning', id: item.id })">
              <template #prepend>
                <VIcon icon="tabler-file" />
              </template>
              <span>Planificación</span>
            </VListItem>

          </template>




        </TableFull>
      </VCardText>
    </VCard>

    <ModalQuestion ref="refModalQuestion" @success="resetPassword" />

  </div>
</template>
