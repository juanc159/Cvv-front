<script setup lang="ts">
import TableFullNew from '@/components/TableNew/TableFullNew.vue';
import { useAuthenticationStore } from "@/stores/useAuthenticationStore";

definePage({
  name: "Student-Documents",
  meta: {
    requiresAuth: true,
    requiredPermission: "student.list",
  },
});

const route = useRoute();
const authenticationStore = useAuthenticationStore();
const { toast } = useToast();

//TABLE
const refTableFull = ref();
const selectedRows = ref<any[]>([]);

const optionsTable = {
  url: "/student/list",
  showSelect: true,
  paramsGlobal: {
    company_id: authenticationStore.company.id,
  },
  headers: [
    { title: "Grado", key: "grade_name" },
    { title: "Sección", key: "section_name" },
    { title: "Documento", key: "identity_document" },
    { title: "Nombre", key: "full_name" },
    { title: "PDF (Notas)", key: "pdf", sortable: false },
    { title: "Boletín", key: "boletin_active", sortable: false },
    { title: "Solvencia", key: "solvencyCertificate", sortable: false },
  ],
  actions: {
    changeStatus: { show: false },
    view: { show: false },
    delete: { show: false },
  },
};

//FILTER (mismos filtros que el listado, pero renderizados afuera del diálogo)
const optionsFilter = ref({
  dialog: { inputs: [] },
  extraFilters: {
    type_education_id: { value: [], type: "selectApi" },
    section_id: { value: [], type: "selectApi" },
    type_document_id: { value: [], type: "selectApi" },
  },
  filterLabels: {
    inputGeneral: 'Buscar en todo',
    type_education_id: 'Tipo de educación',
    section_id: 'Sección',
    type_document_id: 'Tipo de documento',
  },
});

const tableLoading = ref(false);
const loading = reactive({
  masive: false,
});

const refreshTable = () => {
  if (refTableFull.value) {
    refTableFull.value.fetchTableData(null, false, true);
  }
};

// Limpia la selección (checkboxes de la tabla + estado local)
const deselectAll = () => {
  refTableFull.value?.clearSelection();
  selectedRows.value = [];
};

// --- TOGGLE INDIVIDUAL ---
const toggleField = async (item: any, field: string, val: boolean) => {
  const newValue = val ? 1 : 0;
  const prev = item[field];
  item[field] = newValue; // optimista

  const { data, response } = await useAxios('/student/changeStatus').post({
    id: item.id,
    field,
    value: newValue,
  });

  if (!(response?.status === 200 && data?.code === 200)) {
    item[field] = prev; // revertir si falla
    toast('Error', 'No se pudo actualizar', 'danger');
  }
};

// --- ACCIÓN MASIVA ---
const masiveMode = ref<'filter' | 'selected'>('filter');
const masiveField = ref<'pdf' | 'boletin_active' | 'solvencyCertificate'>('boletin_active');

const fieldItems = [
  { title: "PDF (Notas)", value: "pdf" },
  { title: "Boletín", value: "boletin_active" },
  { title: "Solvencia", value: "solvencyCertificate" },
];

const fieldLabel = computed(() => fieldItems.find(f => f.value === masiveField.value)?.title ?? '');
const filteredTotal = computed(() => refTableFull.value?.options?.pagination?.totalItems ?? 0);
const masiveCount = computed(() =>
  masiveMode.value === 'selected' ? selectedRows.value.length : filteredTotal.value
);

//Confirmación
const confirmDialog = ref(false);
const pendingValue = ref<number>(1);

const askMasive = (value: number) => {
  if (masiveMode.value === 'selected' && selectedRows.value.length === 0) {
    toast('', 'No hay estudiantes seleccionados', 'warning');
    return;
  }
  pendingValue.value = value;
  confirmDialog.value = true;
};

const applyMasive = async () => {
  loading.masive = true;

  const body: any = {
    field: masiveField.value,
    value: pendingValue.value,
    mode: masiveMode.value,
  };
  if (masiveMode.value === 'selected') {
    body.ids = selectedRows.value.map((r: any) => (typeof r === 'object' ? r.id : r));
  }

  const { data, response } = await useAxios('/student/changeStatusMasive').post(body, {
    params: {
      ...route.query,
      company_id: authenticationStore.company.id,
    },
  });

  loading.masive = false;
  confirmDialog.value = false;

  if (response?.status === 200 && data?.code === 200) {
    deselectAll();
    refreshTable();
  }
};
</script>

<template>
  <div>
    <VCard>
      <VCardTitle>
        Gestión de documentos (PDF / Boletín / Solvencia)
      </VCardTitle>

      <!-- Barra de acción masiva -->
      <VCardText>
        <VCard variant="tonal" color="primary">
          <VCardText>
            <VRow align="center">
              <VCol cols="12" md="4">
                <label class="text-body-2 font-weight-medium mb-1 d-block">Aplicar a</label>
                <VRadioGroup v-model="masiveMode" inline hide-details>
                  <VRadio label="Todos los filtrados" value="filter" />
                  <VRadio :label="`Solo seleccionados (${selectedRows.length})`" value="selected" />
                </VRadioGroup>
                <VBtn v-if="selectedRows.length > 0" size="small" variant="text" color="secondary"
                  prepend-icon="tabler-square-off" class="mt-1" @click="deselectAll()">
                  Deseleccionar ({{ selectedRows.length }})
                </VBtn>
              </VCol>

              <VCol cols="12" md="4">
                <AppSelect v-model="masiveField" label="Campo" :items="fieldItems" hide-details />
              </VCol>

              <VCol cols="12" md="4" class="d-flex gap-3 align-center flex-wrap">
                <VBtn color="success" :loading="loading.masive" @click="askMasive(1)">
                  <VIcon start icon="tabler-check" /> Activar
                </VBtn>
                <VBtn color="error" :loading="loading.masive" @click="askMasive(0)">
                  <VIcon start icon="tabler-x" /> Desactivar
                </VBtn>
              </VCol>
            </VRow>
            <div class="text-caption mt-2">
              <VIcon size="16" icon="tabler-info-circle" />
              En modo <b>"Todos los filtrados"</b> se aplica a todos los estudiantes que coincidan con el filtro actual,
              no solo a la página visible.
            </div>
          </VCardText>
        </VCard>
      </VCardText>

      <VCardText>
        <FilterDialogNew :options-filter="optionsFilter" @force-search="refreshTable" :table-loading="tableLoading">
          <template #default="{ extraFilters }">
            <VCol cols="12" sm="4">
              <AppSelectRemote v-model="extraFilters.type_education_id.value" url="selectInifiniteTypeEducation"
                arrayInfo="typeEducation" multiple label="Tipo de educación" />
            </VCol>
            <VCol cols="12" sm="4">
              <AppSelectRemote v-model="extraFilters.section_id.value" url="selectInfiniteSection" arrayInfo="section"
                multiple label="Sección" />
            </VCol>
            <VCol cols="12" sm="4">
              <AppSelectRemote v-model="extraFilters.type_document_id.value" url="selectInfiniteTypedocument"
                arrayInfo="typeDocument" multiple label="Tipo de documento" />
            </VCol>
          </template>
        </FilterDialogNew>
      </VCardText>

      <VCardText class="mt-2">
        <TableFullNew ref="refTableFull" :options="optionsTable" @update:selected="selectedRows = $event"
          @update:loading="tableLoading = $event">

          <template #item.pdf="{ item }">
            <VSwitch :model-value="item.pdf === 1" color="success" hide-details density="compact"
              @update:model-value="toggleField(item, 'pdf', $event)" />
          </template>

          <template #item.boletin_active="{ item }">
            <VSwitch :model-value="item.boletin_active === 1" color="success" hide-details density="compact"
              @update:model-value="toggleField(item, 'boletin_active', $event)" />
          </template>

          <template #item.solvencyCertificate="{ item }">
            <VSwitch :model-value="item.solvencyCertificate === 1" color="success" hide-details density="compact"
              @update:model-value="toggleField(item, 'solvencyCertificate', $event)" />
          </template>

        </TableFullNew>
      </VCardText>
    </VCard>

    <!-- Confirmación de acción masiva -->
    <VDialog v-model="confirmDialog" max-width="480">
      <VCard>
        <VCardTitle>Confirmar acción masiva</VCardTitle>
        <VCardText>
          Vas a <b>{{ pendingValue === 1 ? 'ACTIVAR' : 'DESACTIVAR' }}</b> el campo
          <b>{{ fieldLabel }}</b> en
          <b>{{ masiveCount }}</b>
          estudiante(s)
          <template v-if="masiveMode === 'filter'"> (todos los filtrados)</template>
          <template v-else> (seleccionados)</template>.
          <br><br>
          ¿Deseas continuar?
        </VCardText>
        <VCardText class="d-flex justify-end gap-3">
          <VBtn variant="tonal" color="secondary" @click="confirmDialog = false">Cancelar</VBtn>
          <VBtn :color="pendingValue === 1 ? 'success' : 'error'" :loading="loading.masive" @click="applyMasive()">
            Confirmar
          </VBtn>
        </VCardText>
      </VCard>
    </VDialog>
  </div>
</template>
