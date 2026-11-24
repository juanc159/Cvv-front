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
const { toast } = useToast()

// TABLE
const refTableFull = ref()
const refModalQuestion = ref()

// Vigentes: aún no vence la fecha límite. Histórico: ya venció.
// El docente trabaja en vigentes; al histórico va a consultar y a limpiar por períodos.
const tab = ref<'vigentes' | 'historico'>('vigentes')
const isHistorico = computed(() => tab.value === 'historico')

// El componente de tabla copia las opciones una sola vez al montarse, así que al cambiar de
// pestaña se remonta con :key. De paso se reinicia la paginación, que es lo deseable.
const optionsTable = computed(() => ({
  url: "/activity/list",
  paramsGlobal: {
    company_id: authenticationStore.company.id,
    user_id: authenticationStore.user.id, // IMPORTANTE: tu backend lo usa en create y validaciones
    'filter[vigencia]': tab.value,
  },
  // Solo en el histórico se seleccionan varias para borrarlas de una vez.
  showSelect: isHistorico.value,
  headers: [
    { key: 'title', title: 'Título' },
    { key: 'deadline_at', title: 'Fecha límite' },
    { key: 'status', title: 'Estado' },
    { key: 'actions', title: 'Acciones', sortable: false },
  ],
  actions: {
    // Una actividad vencida ya no se edita ni cambia de estado; el backend también lo rechaza.
    changeStatus: {
      show: !isHistorico.value,
      url: "/activity/changeStatus",
    },
    edit: {
      show: !isHistorico.value,
    },
    view: {
      show: true,
    },
    delete: {
      url: "/activity/delete",
    },
  },
}))

// BORRADO MASIVO (solo histórico)
const selected = ref<any[]>([])
const deletePreview = ref<Record<string, number> | null>(null)
const loadingDelete = ref(false)

// Antes de confirmar se consulta qué se va a destruir: el docente tiene que saber cuántas
// entregas de alumnos se lleva por delante, porque esto no se puede deshacer.
const askDeleteSelected = async () => {
  if (!selected.value.length) return

  const { data, response } = await useApi<any>('/activity/deletePreview').post({
    ids: selected.value,
    company_id: authenticationStore.company.id,
  })

  if (!response.value?.ok || !data.value?.preview) return

  deletePreview.value = data.value.preview

  // El modal se configura por componentData: no acepta slots.
  const modal = refModalQuestion.value
  modal.componentData.title = '¿Eliminar las actividades seleccionadas?'
  modal.componentData.subTitle = deleteSubtitle.value
  modal.componentData.principalIcon = 'tabler-alert-triangle'
  modal.componentData.btnSuccessText = 'Sí, eliminar'
  modal.openModal()
}

const deleteSelected = async () => {
  loadingDelete.value = true

  const { data, response } = await useApi<any>('/activity/deleteMasive').post({
    ids: selected.value,
    company_id: authenticationStore.company.id,
  })

  loadingDelete.value = false

  if (response.value?.ok && data.value?.code === 200) {
    toast("Actividades eliminadas", data.value.message, "success")
    selected.value = []
    deletePreview.value = null
    refTableFull.value?.clearSelection?.()
    refreshTable()
  }
}

// Texto de la confirmación, con el detalle de lo que se destruye.
const deleteSubtitle = computed(() => {
  const p = deletePreview.value
  if (!p) return ''

  const partes = [`${p.activities} actividad(es)`]
  if (p.submissions) partes.push(`${p.submissions} entrega(s) de alumnos`)
  if (p.comments) partes.push(`${p.comments} comentario(s)`)
  if (p.files) partes.push(`${p.files} archivo(s) adjunto(s)`)

  return `Se eliminará: ${partes.join(', ')}. Esta acción no se puede deshacer.`
})

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
const goViewView = (data: any) => {
  router.push({ name: "ActivitiesTeacher-Form", params: { action: "view", id: data.id } })
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

// Función para ir a la vista de entregas
const goToSubmissions = (activityId: string) => {
  router.push({
    name: 'Teacher-Activity-Submissions', // El nombre que le pusimos en el definePage
    params: { id: activityId }
  });
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

      <VTabs v-model="tab" class="px-4">
        <VTab value="vigentes">
          <VIcon start icon="tabler-clock" size="18" />
          Vigentes
        </VTab>
        <VTab value="historico">
          <VIcon start icon="tabler-archive" size="18" />
          Histórico
        </VTab>
      </VTabs>

      <VCardText>
        <FilterDialogNew :options-filter="optionsFilter" @force-search="refreshTable" :table-loading="tableLoading" />
      </VCardText>

      <VCardText v-if="isHistorico && selected.length" class="pt-0">
        <VAlert type="warning" variant="tonal" density="compact">
          <div class="d-flex align-center flex-wrap gap-3">
            <span><strong>{{ selected.length }}</strong> actividad(es) seleccionada(s)</span>
            <VSpacer />
            <VBtn size="small" color="error" @click="askDeleteSelected">
              <VIcon start icon="tabler-trash" size="18" />
              Eliminar seleccionadas
            </VBtn>
          </div>
        </VAlert>
      </VCardText>

      <VCardText class="mt-2">
        <TableFullNew :key="tab" ref="refTableFull" :options="optionsTable" @edit="goViewEdit" @view="goViewView"
          @update:selected="selected = $event" @update:loading="tableLoading = $event">
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
                  <span class="text-caption font-weight-medium">{{ item.subject.name }}</span>
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
                    {{ item.deadline_at }}
                  </span>
                </div>
              </div>

            </div>
          </template>

          <!-- Opcional: formatear deadline -->
          <template #item.deadline_at="{ item }">
            <span>
              {{ item.deadline_at }}
            </span>
          </template>

          <!-- Opcional: mostrar status más “bonito” -->
          <template #item.status="{ item }">
            <VChip variant="tonal" :color="item.status_color">
              {{ item.status_description }}
            </VChip>
          </template>

          <template #item.actions2="{ item }">

            <VListItem @click="goToSubmissions(item.id)" v-if="item.status != 'ACTIVITY_STATUS_001'">
              <template #prepend>
                <VIcon icon="tabler-users" />
              </template>
              <span>Ver Entregas y Evaluar</span>
            </VListItem>

          </template>
        </TableFullNew>
      </VCardText>
    </VCard>

    <ModalQuestion ref="refModalQuestion" @success="deleteSelected" />
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
