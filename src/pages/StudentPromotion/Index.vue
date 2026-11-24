<script setup lang="ts">
import { useAuthenticationStore } from "@/stores/useAuthenticationStore";
import { downloadExcelBase64 } from "@core/utils/helpers";

definePage({
  name: "StudentPromotion-Index",
  meta: {
    redirectIfLoggedIn: true,
    requiresAuth: true,
    requiredPermission: "studentPromotion.list",
  },
});

const authenticationStore = useAuthenticationStore();
const { toast } = useToast();

interface Row {
  id: string
  row_number: number | null
  action: string
  action_label: string
  match_type: string | null
  identity_document: string
  identity_document_raw: string
  previous_identity_document: string | null
  full_name: string
  origin: string | null
  messages: string[]
  needs_review: boolean
  is_approved: boolean
  is_applied: boolean
}

interface HistoryItem {
  id: string
  status: string
  status_label: string
  file_name: string
  term: string
  type_education: string
  grade: string
  section: string
  total_rows: number
  applied_rows: number
  user: string | null
  created_at: string
  applied_at: string | null
}

interface Batch {
  id: string
  status: 'preview' | 'applied' | 'discarded' | 'reverted'
  status_label: string
  file_name: string
  total_rows: number
  applied_rows: number
  applied_at: string | null
  destination: { type_education: string; grade: string; section: string; term: string }
  summary: Record<string, number>
  rows: Row[]
}

const form = reactive({
  term_id: null as string | null,
  type_education_id: null as string | null,
  grade_id: null as string | null,
  section_id: null as string | null,
  entry_date: null as string | null,
  file: null as File | null,
});

const options = reactive({
  terms: [] as any[],
  typeEducations: [] as any[],
  grades: [] as any[],
  sections: [] as any[],
});

const loading = reactive({ preview: false, apply: false, revert: false, history: false, open: '' });
const fileKey = ref(0);
const batch = ref<Batch | null>(null);
const history = ref<HistoryItem[]>([]);

// Los grados dependen del tipo de educación: no tiene sentido ofrecer "Quinto Año"
// cuando se está cargando un archivo de primaria.
const gradesOfType = computed(() =>
  options.grades.filter(grade => grade.type_education_id === form.type_education_id)
);

const canPreview = computed(() =>
  !!form.term_id && !!form.type_education_id && !!form.grade_id && !!form.section_id && !!form.file
);

// Al cambiar el tipo de educación el grado elegido deja de ser válido.
watch(() => form.type_education_id, () => { form.grade_id = null; });

const loadDataForm = async () => {
  const { data, response } = await useApi<any>(
    `/studentPromotion/dataForm?company_id=${authenticationStore.company.id}`
  ).get();

  if (response.value?.ok && data.value) {
    options.terms = data.value.terms ?? [];
    options.typeEducations = data.value.typeEducations ?? [];
    options.grades = data.value.grades ?? [];
    options.sections = data.value.sections ?? [];

    const active = data.value.activeTerm;
    if (active) {
      form.term_id = active.id;
      // La fecha de ingreso de los alumnos nuevos se propone como el inicio del período.
      form.entry_date = active.start_date;
    }
  }
};

const preview = async () => {
  loading.preview = true;

  const payload = new FormData();
  payload.append('company_id', authenticationStore.company.id);
  payload.append('term_id', form.term_id!);
  payload.append('type_education_id', form.type_education_id!);
  payload.append('grade_id', form.grade_id!);
  payload.append('section_id', form.section_id!);
  if (form.entry_date) payload.append('entry_date', form.entry_date);
  payload.append('file', form.file!);

  const { data, response } = await useApi<any>('/studentPromotion/preview').post(payload);

  loading.preview = false;

  if (response.value?.ok && data.value?.batch) {
    batch.value = data.value.batch;
    toast("Archivo analizado", "Revise los casos marcados antes de confirmar", "success");
    loadHistory();
  }
};

const apply = async () => {
  if (!batch.value) return;
  loading.apply = true;

  const decisions: Record<string, boolean> = {};
  batch.value.rows.forEach(row => { decisions[row.id] = row.is_approved; });

  const { data, response } = await useApi<any>(`/studentPromotion/${batch.value.id}/apply`).post({ decisions });

  loading.apply = false;

  if (response.value?.ok && data.value?.batch) {
    batch.value = data.value.batch;
    toast("Promoción aplicada", data.value.message, "success");
    loadHistory();
  }
};

const revert = async () => {
  if (!batch.value) return;
  loading.revert = true;

  const { data, response } = await useApi<any>(`/studentPromotion/${batch.value.id}/revert`).post({});

  loading.revert = false;

  if (response.value?.ok && data.value?.batch) {
    batch.value = data.value.batch;
    toast("Promoción deshecha", "Los alumnos volvieron a su grado y sección anteriores", "success");
    loadHistory();
  }
};

const loadHistory = async () => {
  loading.history = true;

  const { data, response } = await useApi<any>(
    `/studentPromotion/history?company_id=${authenticationStore.company.id}`
  ).get();

  loading.history = false;

  if (response.value?.ok && data.value)
    history.value = data.value.batches ?? [];
};

// Abre una carga anterior sin tener que volver a subir el archivo: así se puede revisar
// lo que se hizo, descargar su Excel o deshacerla días después.
const openBatch = async (id: string) => {
  loading.open = id;

  const { data, response } = await useApi<any>(`/studentPromotion/${id}`).get();

  loading.open = '';

  if (response.value?.ok && data.value?.batch)
    batch.value = data.value.batch;
};

const discard = async (id: string) => {
  const { response } = await useApi<any>(`/studentPromotion/${id}/discard`).post({});

  if (response.value?.ok) {
    toast("Previsualización descartada", "", "success");
    loadHistory();
  }
};

const downloading = ref<string | null>(null);

// Descarga un listado del análisis, o el archivo completo si no se indica cuál.
const downloadExcel = async (action: string | null = null) => {
  if (!batch.value) return;

  downloading.value = action ?? 'all';

  const query = action ? `?action=${action}` : '';
  const { data, response } = await useApi<any>(`/studentPromotion/${batch.value.id}/export${query}`).get();

  downloading.value = null;

  if (response.value?.ok && data.value?.excel)
    downloadExcelBase64(data.value.excel, data.value.fileName ?? 'Promocion de alumnos');
};

const reset = () => {
  batch.value = null;
  form.file = null;
  fileKey.value++;
  loadHistory();
};

// VFileInput devuelve una lista aunque sea de un solo archivo, así que se toma el primero.
const onFileSelected = (event: Event) => {
  const files = (event.target as HTMLInputElement).files;
  form.file = files && files.length ? files[0] : null;
};

const clearFile = () => { form.file = null; };

// Agrupa las filas para revisarlas por tipo de caso en lugar de en una lista larga.
const groups = computed(() => {
  if (!batch.value) return [];

  const order = ['error', 'create', 'reinstate', 'repeat', 'promote', 'stay', 'unassign'];
  const colors: Record<string, string> = {
    error: 'error', create: 'info', reinstate: 'info',
    repeat: 'warning', promote: 'success', stay: 'secondary', unassign: 'warning',
  };

  return order
    .map(action => {
      const rows = batch.value!.rows.filter(row => row.action === action);

      return {
        action,
        // El nombre del grupo viene del backend para que la pantalla y el Excel
        // no puedan terminar diciendo cosas distintas.
        title: rows[0]?.action_label ?? action,
        color: colors[action],
        rows,
      };
    })
    .filter(group => group.rows.length > 0);
});

const reviewCount = computed(() =>
  batch.value?.rows.filter(row => row.needs_review && !row.is_approved).length ?? 0
);

const approvedCount = computed(() =>
  batch.value?.rows.filter(row => row.is_approved && row.action !== 'error').length ?? 0
);

const approveGroup = (action: string, value: boolean) => {
  batch.value?.rows
    .filter(row => row.action === action && row.action !== 'error')
    .forEach(row => { row.is_approved = value; });
};

const statusColor = (status: string) => ({
  preview: 'secondary',
  applied: 'success',
  discarded: 'default',
  reverted: 'warning',
}[status] ?? 'default');

const isPreview = computed(() => batch.value?.status === 'preview');
const isApplied = computed(() => batch.value?.status === 'applied');

onMounted(() => { loadDataForm(); loadHistory(); });
</script>

<template>
  <div>
    <VCard class="mb-6">
      <VCardItem>
        <VCardTitle>Promoción de alumnos</VCardTitle>
        <VCardSubtitle>
          Cargue el listado de un grado y sección para el año nuevo. El sistema le muestra
          primero qué haría con cada alumno y no cambia nada hasta que usted lo confirme.
        </VCardSubtitle>
      </VCardItem>

      <VCardText>
        <VAlert type="info" variant="tonal" density="compact" class="mb-4">
          Un archivo por grado y sección. Los alumnos que hoy están en ese grado y sección y
          <strong>no aparezcan en el archivo</strong> quedarán sin grado ni sección, activos,
          para que los revise después.
        </VAlert>

        <VRow>
          <VCol cols="12" md="4">
            <VSelect v-model="form.term_id" :items="options.terms" item-title="name" item-value="id"
              label="Período escolar" :disabled="!!batch" />
          </VCol>

          <VCol cols="12" md="4">
            <VSelect v-model="form.type_education_id" :items="options.typeEducations" item-title="name"
              item-value="id" label="Tipo de educación" :disabled="!!batch" />
          </VCol>

          <VCol cols="12" md="4">
            <VSelect v-model="form.grade_id" :items="gradesOfType" item-title="name" item-value="id"
              label="Grado destino" :disabled="!!batch || !form.type_education_id"
              :hint="!form.type_education_id ? 'Elija primero el tipo de educación' : ''" persistent-hint />
          </VCol>

          <VCol cols="12" md="4">
            <VSelect v-model="form.section_id" :items="options.sections" item-title="name" item-value="id"
              label="Sección destino" :disabled="!!batch" />
          </VCol>

          <VCol cols="12" md="4">
            <VTextField v-model="form.entry_date" type="date" label="Fecha de ingreso"
              hint="Solo se usa para los alumnos que se creen" persistent-hint :disabled="!!batch" />
          </VCol>

          <VCol cols="12" md="4">
            <VFileInput :key="fileKey" label="Archivo del listado" accept=".xlsx,.xls,.csv"
              prepend-icon="tabler-file-spreadsheet" :disabled="!!batch" @change="onFileSelected"
              @click:clear="clearFile" hint="Debe tener columnas de cédula y nombre" persistent-hint />
          </VCol>
        </VRow>

        <div class="d-flex align-center flex-wrap gap-4 mt-4">
          <VBtn v-if="!batch" color="primary" :loading="loading.preview" :disabled="!canPreview" @click="preview">
            <VIcon start icon="tabler-search" />
            Analizar archivo
          </VBtn>

          <VBtn v-else variant="outlined" @click="reset">
            <VIcon start icon="tabler-arrow-left" />
            Cargar otro archivo
          </VBtn>
        </div>
      </VCardText>
    </VCard>

    <template v-if="batch">
      <VCard class="mb-6">
        <VCardItem>
          <VCardTitle>
            {{ batch.destination.grade }} — Sección {{ batch.destination.section }}
          </VCardTitle>
          <VCardSubtitle>
            {{ batch.file_name }} · {{ batch.destination.term }}
          </VCardSubtitle>
        </VCardItem>

        <VCardText>
          <VAlert v-if="isApplied" type="success" variant="tonal" class="mb-4">
            <strong>Promoción aplicada.</strong>
            Se actualizaron {{ batch.applied_rows }} alumnos el {{ batch.applied_at }}.
          </VAlert>

          <VAlert v-else-if="batch.status === 'reverted'" type="warning" variant="tonal" class="mb-4">
            <strong>Esta promoción fue deshecha.</strong>
            Los alumnos volvieron a su grado y sección anteriores.
          </VAlert>

          <VAlert v-else-if="reviewCount > 0" type="warning" variant="tonal" class="mb-4">
            Hay <strong>{{ reviewCount }}</strong> caso(s) que necesitan su confirmación.
            Marque la casilla de los que estén correctos; los que deje sin marcar no se aplicarán.
          </VAlert>

          <VRow class="mb-2">
            <VCol v-for="group in groups" :key="group.action" cols="6" sm="4" md="2">
              <VCard variant="tonal" :color="group.color">
                <VCardText class="py-3">
                  <div class="text-h5">{{ group.rows.length }}</div>
                  <div class="text-caption">{{ group.title }}</div>
                </VCardText>
              </VCard>
            </VCol>
          </VRow>

          <div class="d-flex align-center flex-wrap gap-4">
            <VBtn v-if="isPreview" color="primary" :loading="loading.apply" :disabled="approvedCount === 0"
              @click="apply">
              <VIcon start icon="tabler-check" />
              Confirmar promoción ({{ approvedCount }})
            </VBtn>

            <VBtn color="success" variant="outlined" :loading="downloading === 'all'" @click="downloadExcel()">
              <VIcon start icon="tabler-file-spreadsheet" />
              Descargar análisis completo
            </VBtn>
          </div>

          <div v-if="isApplied" class="d-flex align-center flex-wrap gap-4">
            <VBtn color="error" variant="outlined" :loading="loading.revert" @click="revert">
              <VIcon start icon="tabler-arrow-back-up" />
              Deshacer esta promoción
            </VBtn>
            <span class="text-body-2 text-medium-emphasis">
              Devuelve a cada alumno al grado y sección que tenía antes.
            </span>
          </div>
        </VCardText>
      </VCard>

      <VExpansionPanels multiple class="mb-6">
        <VExpansionPanel v-for="group in groups" :key="group.action">
          <VExpansionPanelTitle>
            <div class="d-flex align-center gap-3 flex-wrap">
              <span class="font-weight-medium">{{ group.title }}</span>
              <VChip size="x-small" label :color="group.color">{{ group.rows.length }}</VChip>
            </div>
          </VExpansionPanelTitle>

          <VExpansionPanelText>
            <div class="d-flex gap-2 mb-3 flex-wrap">
              <template v-if="isPreview && group.action !== 'error'">
                <VBtn size="small" variant="text" @click="approveGroup(group.action, true)">Marcar todos</VBtn>
                <VBtn size="small" variant="text" @click="approveGroup(group.action, false)">Desmarcar todos</VBtn>
              </template>

              <VSpacer />

              <VBtn size="small" variant="tonal" color="success" :loading="downloading === group.action"
                @click="downloadExcel(group.action)">
                <VIcon start icon="tabler-download" size="18" />
                Descargar este listado en Excel
              </VBtn>
            </div>

            <div style="overflow-x: auto;">
              <VTable density="compact">
                <thead>
                  <tr>
                    <th v-if="isPreview && group.action !== 'error'" style="inline-size: 60px;">Aplicar</th>
                    <th style="inline-size: 60px;">Fila</th>
                    <th>Cédula</th>
                    <th>Nombre</th>
                    <th>Venía de</th>
                    <th>Observaciones</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="row in group.rows" :key="row.id">
                    <td v-if="isPreview && group.action !== 'error'">
                      <VCheckbox v-model="row.is_approved" hide-details density="compact" />
                    </td>
                    <td>{{ row.row_number ?? '—' }}</td>
                    <td>
                      <span :class="row.previous_identity_document ? 'text-warning font-weight-medium' : ''">
                        {{ row.identity_document }}
                      </span>
                      <div v-if="row.previous_identity_document" class="text-caption text-medium-emphasis">
                        antes: {{ row.previous_identity_document }}
                      </div>
                    </td>
                    <td>{{ row.full_name }}</td>
                    <td>{{ row.origin ?? '—' }}</td>
                    <td>
                      <div v-for="(message, index) in row.messages" :key="index" class="text-caption">
                        {{ message }}
                      </div>
                    </td>
                  </tr>
                </tbody>
              </VTable>
            </div>
          </VExpansionPanelText>
        </VExpansionPanel>
      </VExpansionPanels>
    </template>

    <VCard v-if="!batch">
      <VCardItem>
        <VCardTitle>Cargas anteriores</VCardTitle>
        <VCardSubtitle>
          Qué se promovió, cuándo y quién lo hizo. Desde aquí se puede volver a abrir una
          carga para revisarla, descargar su reporte o deshacerla.
        </VCardSubtitle>
      </VCardItem>

      <VCardText>
        <VProgressLinear v-if="loading.history" indeterminate color="primary" class="mb-4" />

        <VAlert v-if="!loading.history && !history.length" type="info" variant="tonal" density="compact">
          Todavía no se ha cargado ningún archivo.
        </VAlert>

        <div v-else style="overflow-x: auto;">
          <VTable density="compact">
            <thead>
              <tr>
                <th>Archivo</th>
                <th>Destino</th>
                <th>Período</th>
                <th>Estado</th>
                <th class="text-end">En el archivo</th>
                <th class="text-end">Alumnos actualizados</th>
                <th>Cargado por</th>
                <th>Fecha</th>
                <th />
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in history" :key="item.id">
                <td>{{ item.file_name }}</td>
                <td>{{ item.grade }} — {{ item.section }}</td>
                <td>{{ item.term }}</td>
                <td>
                  <VChip size="x-small" label :color="statusColor(item.status)">
                    {{ item.status_label }}
                  </VChip>
                </td>
                <td class="text-end">{{ item.total_rows }}</td>
                <td class="text-end">{{ item.status === 'applied' ? item.applied_rows : '—' }}</td>
                <td>{{ item.user ?? '—' }}</td>
                <td>{{ item.applied_at ?? item.created_at }}</td>
                <td class="text-end">
                  <VBtn size="small" variant="text" :loading="loading.open === item.id" @click="openBatch(item.id)">
                    Abrir
                  </VBtn>
                  <VBtn v-if="item.status === 'preview'" size="small" variant="text" color="error"
                    @click="discard(item.id)">
                    Descartar
                  </VBtn>
                </td>
              </tr>
            </tbody>
          </VTable>
        </div>
      </VCardText>
    </VCard>
  </div>
</template>
