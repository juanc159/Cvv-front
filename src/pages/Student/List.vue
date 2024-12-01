<script setup lang="ts">
import { router } from '@/plugins/1.router';
import { useAuthenticationStore } from "@/stores/useAuthenticationStore";

definePage({
  name: "Student-List",
  meta: {
    redirectIfLoggedIn: true,
    requiresAuth: true,
    requiredPermission: "student.list",
  },
});

const authenticationStore = useAuthenticationStore();

const goView = (data: { action: string, id: number | null } = { action: "create", id: null }) => {
  router.push({ name: "Student-Form", params: { action: data.action, id: data.id } })
}

//TABLE
const tableFull = ref()

const optionsTable = {
  url: "/student/list",
  params: {
    company_id: authenticationStore.company.id,
  },
  headers: [
    { title: "Acciones", key: "actions", sortable: false },
    { title: "Foto ", key: "photo", sortable: false },
    { title: "Grado ", key: "grade_name", sortable: false },
    { title: "Sección ", key: "section_name", sortable: false },
    { title: "Cédula ", key: "identity_document", sortable: false },
    { title: "Nombre", key: "full_name", sortable: false },
    { title: "Tipo de educación", key: "type_education_name", sortable: false },


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


const loading = reactive({
  table: false,
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

</script>

<template>
  <div>

    <VCard>
      <VCardTitle class="d-flex justify-space-between">
        <span>
          Estudiantes
        </span>

        <div class="d-flex justify-end gap-3 flex-wrap ">
          <VBtn @click="goView()">
            Agregar estudiante
          </VBtn>
        </div>
      </VCardTitle>

      <VCardText class=" mt-2">
        <TableFull ref="tableFull" :optionsTable="optionsTable" :optionsFilter="optionsFilter" @goView="goView">

          <template #item.photo="{ item }">
            <div>
              <VAvatar v-if="item.photo" color="primary" variant="tonal" size="50">
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

          </template>

        </TableFull>
      </VCardText>
    </VCard>

    <ModalQuestion ref="refModalQuestion" @success="resetPassword" />

  </div>
</template>
