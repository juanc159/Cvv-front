<script setup lang="ts">
import ModalUnsubscribe from "@/pages/Student/ModalUnsubscribe.vue";
import { router } from '@/plugins/1.router';
import ModalImportStudents from '@/pages/Student/ModalImportStudents.vue';
import { useAuthenticationStore } from "@/stores/useAuthenticationStore";

definePage({
  name: "Student-List",
  meta: {
    redirectIfLoggedIn: true,
    requiresAuth: true,
    requiredPermission: "student.list",
  },
});

const route = useRoute()
const authenticationStore = useAuthenticationStore();

//TABLE
const refTableFull = ref()

const optionsTable = {
  url: "/student/list",
  paramsGlobal: {
    company_id: authenticationStore.company.id,
  },
  headers: [
    { title: "Acciones", key: "actions", sortable: false },
    { title: "Foto ", key: "photo", sortable: false },
    { title: "Grado ", key: "grade_name" },
    { title: "Sección ", key: "section_name" },
    { title: "Tipo de documento ", key: "type_document_name" },
    { title: "Documento ", key: "identity_document" },
    { title: "Nombre", key: "full_name" },
    { title: "Tipo de educación", key: "type_education_name" },


  ],
  actions: {
    changeStatus: {
      show: false,
    },
    view: {
      show: false,
    },
    delete: {
      url: "/student/delete"
    },
  }
}


//FILTER
const optionsFilter = ref({
  dialog: {
    cols: 4,
    width: 800,
    inputs: [
      {
        type: "selectApi",
        label: "Tipo de educación",
        name: "type_education_id",
        url: "selectInifiniteTypeEducation",
        arrayInfo: "typeEducation",
        multiple: true,
      },
      {
        type: "selectApi",
        label: "Sección",
        name: "section_id",
        url: "selectInfiniteSection",
        arrayInfo: "section",
        multiple: true,
      },
      {
        type: "selectApi",
        label: "Tipo de documento",
        name: "type_document_id",
        url: "selectInfiniteTypedocument",
        arrayInfo: "typeDocument",
        multiple: true,
      },
      {
        type: "select",
        name: "photo",
        label: "Foto",
        value: null,
        options: [
          {
            value: 1,
            title: "Con foto"
          },
          {
            value: 0,
            title: "Sin foto"
          }],
      },
    ],
  },
  filterLabels: { inputGeneral: 'Buscar en todo', is_active: 'Estado' }
})



const loading = reactive({
  table: false,
  btnPdf: false,
  excel: false,
})

const resetPassword = async (id: number) => {

  loading.table = true
  const { data, response } = await useApi("/student-resetPassword/" + id).get()
  loading.table = false
};


//ModalQuestion
const refModalQuestion = ref()

const openModalQuestion = (id: number) => {
  refModalQuestion.value.openModal(id)
  refModalQuestion.value.componentData.title = "¿Seguro desea reiniciar la contraseña al registro?"
}


const isDialogVisibleShowPicture = ref<boolean>(false)
const dataStudent = ref<string | null>(null)
const openModalShowPicture = (data: string | null = null) => {
  isDialogVisibleShowPicture.value = true
  dataStudent.value = data
}
const closeModalShowPicture = () => {
  dataStudent.value = null
  isDialogVisibleShowPicture.value = false
}


//ModalUnsubscribe
const refModalUnsubscribe = ref()

const openModalUnsubscribe = (id: number) => {
  refModalUnsubscribe.value.openModal(id)

}


const goViewEdit = (data: any) => {
  router.push({ name: "Student-Form", params: { action: "edit", id: data.id } })
}

const goViewCreate = () => {
  router.push({ name: "Student-Form", params: { action: "create" } })
}

const tableLoading = ref(false); // Estado de carga de la tabla

// Método para refrescar los datos
const refreshTable = () => {
  if (refTableFull.value) {
    refTableFull.value.fetchTableData(null, false, true); // Forzamos la búsqueda
  }
};


const downloadExcel = async () => {
  loading.excel = true;

  const { data, response } = await useAxios("/students/excelExport").get({
    params: {
      ...route.query,
      company_id: authenticationStore.company.id
    }
  })

  loading.excel = false;

  if (response.status == 200 && data) {
    downloadExcelBase64(data.excel, "Lista de estudiantes")
  }
}

//ModalImportStudents
const refModalImportStudents = ref()
const openModalImportStudents = () => {
  refModalImportStudents.value.openModal()
}

</script>

<template>
  <div>

    <VCard>
      <VCardTitle class="d-flex justify-space-between">
        <span>
          Estudiantes
        </span>

        <div class="d-flex justify-end gap-3 flex-wrap ">
          <VBtn :loading="loading.excel" :disabled="loading.excel" size="38" color="primary" icon
            @click="downloadExcel()">
            <VIcon icon="tabler-file-spreadsheet"></VIcon>
            <VTooltip location="top" transition="scale-transition" activator="parent" text="Descargar Excel">
            </VTooltip>
          </VBtn>
          <VBtn  size="38" color="primary" icon
            @click="openModalImportStudents()">
            <VIcon icon="tabler-upload"></VIcon>
            <VTooltip location="top" transition="scale-transition" activator="parent" text="Importar Excel">
            </VTooltip>
          </VBtn>

          <VBtn @click="goViewCreate()">
            Agregar estudiante
          </VBtn>
        </div>
      </VCardTitle>

      <VCardText>
        <FilterDialogNew :options-filter="optionsFilter" @force-search="refreshTable" :table-loading="tableLoading">
        </FilterDialogNew>
      </VCardText>
      <VCardText class=" mt-2">


        <TableFullNew ref="refTableFull" :options="optionsTable" @edit="goViewEdit"
          @update:loading="tableLoading = $event">

          <template #item.photo="{ item }">
            <div class="my-3 ">
              <VAvatar rounded size="120" v-if="item.photo" color="primary" variant="tonal"
                class="user-profile-avatar mx-auto" style="cursor: pointer;" @click="openModalShowPicture(item)">
                <VImg :src="storageBack(item.photo)" />
              </VAvatar>

              <VAvatar v-else color="primary" variant="tonal" size="50">
                {{ avatarText(item.full_name) }}
              </VAvatar>
            </div>
          </template>

          <template #item.actions2="{ item }">
            <VListItem @click="openModalQuestion(item.id)">
              <template #prepend>
                <VIcon size="22" icon="tabler-lock-open" />
              </template>
              <span>Resetear contraseña</span>
            </VListItem>
            <VListItem @click="openModalUnsubscribe(item.id)">
              <template #prepend>
                <VIcon size="22" icon="tabler-user-down" />
              </template>
              <span>Dar de baja</span>
            </VListItem>

          </template>

        </TableFullNew>
      </VCardText>
    </VCard>

    <ModalQuestion ref="refModalQuestion" @success="resetPassword" />


    <VDialog v-model="isDialogVisibleShowPicture" max-width="40rem">
      <DialogCloseBtn @click="closeModalShowPicture()" />
      <VCard v-if="dataStudent">
        <VCardText class="text-center">
          <h3>{{ dataStudent.full_name }}</h3>
          <VAvatar rounded size="520" color="primary" variant="tonal" class="user-profile-avatar mx-auto">
            <VImg :src="storageBack(dataStudent.photo)" />
          </VAvatar>
        </VCardText>
      </VCard>
    </VDialog>

    <ModalUnsubscribe ref="refModalUnsubscribe" @execute="refreshTable" />

    <ModalImportStudents ref="refModalImportStudents" :maxFileSizeMB="200" />


  </div>
</template>
