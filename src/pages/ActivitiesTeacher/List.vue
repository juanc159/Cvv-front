<script setup lang="ts">
import { router } from '@/plugins/1.router';
import { useAuthenticationStore } from "@/stores/useAuthenticationStore";
import { ref } from 'vue';

definePage({
  name: "ActivitiesTeacher-List",
  meta: {
    redirectIfLoggedIn: true,
    requiresAuth: true,
    requiredPermission: "activity.list",
  },
})

const authenticationStore = useAuthenticationStore()

// TABLE
const refTableFull = ref()

const optionsTable = {
  url: "/activity/list",
  paramsGlobal: {
    company_id: authenticationStore.company.id,
    user_id: authenticationStore.user.id, // IMPORTANTE: tu backend lo usa en create y validaciones
  },
  headers: [
    { key: 'title', title: 'Título' },
    { key: 'deadline_at', title: 'Fecha límite' },
    { key: 'status', title: 'Estado' },
    { key: 'actions', title: 'Acciones', sortable: false },
  ],
  actions: {
    changeStatus: {
      url: "/activity/changeStatus",
    },
    view: {
      show: false,
    },
    delete: {
      url: "/activity/delete",
    },
  },
}

// FILTER
const optionsFilter = ref({
  dialog: {
    width: 450,
    inputs: [],
  },
  filterLabels: {
    inputGeneral: "Buscar en todo",
    status: "Estado",
  },
})

const goViewEdit = (data: any) => {
  router.push({ name: "ActivitiesTeacher-Form", params: { action: "edit", id: data.id } })
}

const goViewCreate = () => {
  router.push({ name: "ActivitiesTeacher-Form", params: { action: "create" } })
}

// Loading de la tabla
const tableLoading = ref(false)

// Método para refrescar los datos
const refreshTable = () => {
  if (refTableFull.value) {
    refTableFull.value.fetchTableData(null, false, true)
  }
}
</script>

<template>
  <div>
    <VCard>
      <VCardTitle class="d-flex justify-space-between">
        <span>Actividades</span>

        <div class="d-flex justify-end gap-3 flex-wrap">
          <VBtn @click="goViewCreate()">
            Agregar actividad
          </VBtn>
        </div>
      </VCardTitle>

      <VCardText>
        <FilterDialogNew :options-filter="optionsFilter" @force-search="refreshTable" :table-loading="tableLoading" />
      </VCardText>

      <VCardText class="mt-2">
        <TableFullNew ref="refTableFull" :options="optionsTable" @edit="goViewEdit"
          @update:loading="tableLoading = $event">
          <template #item.title="{ item }">
            <div class="py-2">
              <!-- Título -->
              <div class="text-body-1 font-weight-semibold">
                {{ item.title }}
              </div>

              <!-- Meta info en columnas (vertical) -->
              <div class="mt-1 d-flex flex-column gap-1">
                <div v-if="item.subject" class="d-flex align-center">
                  <VIcon icon="tabler-book" size="14" class="me-2" />
                  <span class="text-caption text-medium-emphasis me-2">Materia:</span>
                  <span class="text-caption font-weight-medium">{{ item.subject }}</span>
                </div>

                <div v-if="item.grade" class="d-flex align-center">
                  <VIcon icon="tabler-school" size="14" class="me-2" />
                  <span class="text-caption text-medium-emphasis me-2">Año:</span>
                  <span class="text-caption font-weight-medium">{{ item.grade }}</span>
                </div>

                <div v-if="item.section" class="d-flex align-center">
                  <VIcon icon="tabler-users-group" size="14" class="me-2" />
                  <span class="text-caption text-medium-emphasis me-2">Sección:</span>
                  <span class="text-caption font-weight-medium">{{ item.section }}</span>
                </div>

                <div v-if="item.deadline_at" class="d-flex align-center">
                  <VIcon icon="tabler-calendar-time" size="14" class="me-2" />
                  <span class="text-caption text-medium-emphasis me-2">Entrega:</span>
                  <span class="text-caption font-weight-medium">
                    {{ item.deadline_at.replace('T', ' ').slice(0, 16) }}
                  </span>
                </div>
              </div>

            </div>
          </template>



          <!-- Opcional: formatear deadline -->
          <template #item.deadline_at="{ item }">
            <span>
              {{ item.deadline_at ? item.deadline_at.replace('T', ' ').slice(0, 16) : '—' }}
            </span>
          </template>

          <!-- Opcional: mostrar status más “bonito” -->
          <template #item.status="{ item }">
            <VChip variant="tonal" :color="item.status_color">
              {{ item.status_description }}
            </VChip>
          </template>
        </TableFullNew>
      </VCardText>
    </VCard>
  </div>
</template>
<style scoped>
.text-truncate-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
