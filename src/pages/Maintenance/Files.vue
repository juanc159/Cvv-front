<script setup lang="ts">
import { useAuthenticationStore } from "@/stores/useAuthenticationStore";

definePage({
  name: "Maintenance-Files",
  meta: {
    redirectIfLoggedIn: true,
    requiresAuth: true,
    requiredPermission: "maintenance.files",
  },
});

const authenticationStore = useAuthenticationStore();
const { toast } = useToast();

interface Summary {
  // Resumen de una auditoría
  disk_files: number
  referenced: number
  ignored: number
  orphans: number
  orphan_bytes: number
  missing: number
  skipped_sources?: string[]
  detail_truncated?: boolean
  // Resumen de una limpieza
  dry_run?: boolean
  targets?: string[]
  orphans_deleted?: number
  orphans_bytes?: number
  orphans_skipped_recent?: number
  references_nullified?: number
  rows_deleted?: number
}

interface Audit {
  id: string
  type?: 'files' | 'cleanup'
  status: 'pending' | 'running' | 'completed' | 'failed'
  summary: Summary | null
  error: string | null
  started_at: string | null
  finished_at: string | null
  created_at: string | null
  is_finished: boolean
  // El detalle cambia según el tipo: la auditoría lista rutas, la limpieza lista
  // lo que hizo en cada origen.
  findings?: {
    orphans?: Array<{ path: string; size: number; folder?: string; modified_at?: string | null }>
    missing?: Array<{
      path?: string; source: string
      label?: string; action?: string; count?: number
    }>
    byFolder?: Array<{ folder: string; count: number; bytes: number }>
  } | null
}

const loading = reactive({ data: false, run: false });
const audit = ref<Audit | null>(null);
const history = ref<Audit[]>([]);
const registry = ref<Array<{ table: string; column: string; label: string }>>([]);
const ignoredPrefixes = ref<string[]>([]);

// Mientras el job corre en la cola se consulta el estado cada pocos segundos.
let pollTimer: ReturnType<typeof setInterval> | null = null;

const stopPolling = () => {
  if (pollTimer) {
    clearInterval(pollTimer);
    pollTimer = null;
  }
};

const humanBytes = (bytes: number | undefined) => {
  if (!bytes) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  let value = bytes;
  let i = 0;
  while (value >= 1024 && i < units.length - 1) {
    value /= 1024;
    i++;
  }
  return `${Math.round(value * 100) / 100} ${units[i]}`;
};

const statusLabel = computed(() => {
  switch (audit.value?.status) {
    case 'pending': return 'En cola';
    case 'running': return 'Ejecutándose';
    case 'completed': return 'Completada';
    case 'failed': return 'Falló';
    default: return '';
  }
});

const statusColor = computed(() => {
  switch (audit.value?.status) {
    case 'pending':
    case 'running': return 'info';
    case 'completed': return 'success';
    case 'failed': return 'error';
    default: return 'secondary';
  }
});

const isRunning = computed(() => audit.value !== null && !audit.value.is_finished);

const loadData = async () => {
  loading.data = true;
  const { data, response } = await useApi<any>('/maintenance/file-audit/data').get();
  if (response.value?.ok && data.value) {
    audit.value = data.value.last;
    history.value = data.value.history ?? [];
    registry.value = data.value.registry ?? [];
    ignoredPrefixes.value = data.value.ignoredPrefixes ?? [];

    // Si al entrar hay una corrida sin terminar, se retoma el seguimiento.
    if (audit.value && !audit.value.is_finished) startPolling();
  }
  loading.data = false;
};

const fetchAudit = async (id: string) => {
  const { data, response } = await useApi<any>(`/maintenance/file-audit/${id}`).get();
  if (response.value?.ok && data.value?.audit) {
    audit.value = data.value.audit;
    if (audit.value?.is_finished) {
      stopPolling();
      loading.run = false;
      // Se recarga para refrescar el historial con la corrida recién terminada.
      loadData();
    }
  }
};

const startPolling = () => {
  stopPolling();
  pollTimer = setInterval(() => {
    if (audit.value?.id) fetchAudit(audit.value.id);
  }, 3000);
};

const runAudit = async () => {
  loading.run = true;
  const { data, response } = await useApi<any>('/maintenance/file-audit/run').post({
    company_id: authenticationStore.company.id,
  });

  if (response.value?.ok && data.value?.audit) {
    audit.value = data.value.audit;
    toast("Auditoría iniciada", "Se está ejecutando en segundo plano", "success");
    startPolling();
  } else {
    loading.run = false;
    toast("No se pudo iniciar la auditoría", "", "danger");
  }
};

// --- Limpieza ---
const cleanup = ref<Audit | null>(null);
const confirmDialog = reactive({
  open: false,
  targets: [] as string[],
  title: '',
  body: '',
});

const askCleanup = (targets: string[], title: string, body: string) => {
  confirmDialog.targets = targets;
  confirmDialog.title = title;
  confirmDialog.body = body;
  confirmDialog.open = true;
};

const runCleanup = async (targets: string[], dryRun: boolean) => {
  confirmDialog.open = false;
  loading.run = true;

  const { data, response } = await useApi<any>('/maintenance/file-audit/cleanup').post({
    company_id: authenticationStore.company.id,
    targets,
    dry_run: dryRun,
  });

  if (response.value?.ok && data.value?.audit) {
    cleanup.value = data.value.audit;
    toast(dryRun ? "Simulación iniciada" : "Limpieza iniciada", "", "success");
    startCleanupPolling();
  } else {
    loading.run = false;
    toast("No se pudo iniciar", (data.value as any)?.message ?? "", "danger");
  }
};

let cleanupTimer: ReturnType<typeof setInterval> | null = null;

const stopCleanupPolling = () => {
  if (cleanupTimer) {
    clearInterval(cleanupTimer);
    cleanupTimer = null;
  }
};

const startCleanupPolling = () => {
  stopCleanupPolling();
  cleanupTimer = setInterval(async () => {
    if (!cleanup.value?.id) return;
    const { data, response } = await useApi<any>(`/maintenance/file-audit/${cleanup.value.id}`).get();
    if (response.value?.ok && data.value?.audit) {
      cleanup.value = data.value.audit;
      if (cleanup.value?.is_finished) {
        stopCleanupPolling();
        loading.run = false;

        // Tras una limpieza real los totales de la auditoría quedan viejos (seguirían
        // mostrando lo que ya se limpió), así que se vuelve a auditar automáticamente.
        if (cleanup.value.status === 'completed' && !cleanup.value.summary?.dry_run) {
          await runAudit();
        } else {
          loadData();
        }
      }
    }
  }, 3000);
};

onMounted(loadData);
onBeforeUnmount(() => { stopPolling(); stopCleanupPolling(); });

const orphanHeaders = [
  { key: 'path', title: 'Ruta' },
  { key: 'size', title: 'Tamaño', width: 120 },
  { key: 'modified_at', title: 'Modificado', width: 180 },
];

const missingHeaders = [
  { key: 'path', title: 'Ruta' },
  { key: 'source', title: 'Usada en', width: 240 },
];

const folderHeaders = [
  { key: 'folder', title: 'Carpeta' },
  { key: 'count', title: 'Archivos', width: 120 },
  { key: 'bytes', title: 'Espacio', width: 140 },
];
</script>

<template>
  <div>
    <VCard class="mb-6">
      <VCardItem>
        <VCardTitle>Auditoría de archivos</VCardTitle>
        <VCardSubtitle>
          Compara los archivos del servidor contra las rutas registradas en la base de datos.
        </VCardSubtitle>
      </VCardItem>

      <VCardText>
        <VAlert type="info" variant="tonal" density="compact" class="mb-4">
          Esta auditoría es de <strong>solo lectura</strong>: no borra ni mueve ningún archivo.
        </VAlert>

        <div class="d-flex align-center flex-wrap gap-4">
          <VBtn color="primary" :loading="loading.run || isRunning" :disabled="loading.run || isRunning"
            @click="runAudit">
            <VIcon start icon="tabler-player-play" />
            Ejecutar auditoría
          </VBtn>

          <VChip v-if="audit" :color="statusColor" size="small" label>
            {{ statusLabel }}
          </VChip>

          <span v-if="audit?.finished_at" class="text-body-2 text-medium-emphasis">
            Última corrida: {{ audit.finished_at }}
          </span>
        </div>

        <VProgressLinear v-if="isRunning" indeterminate color="primary" class="mt-4" />
      </VCardText>
    </VCard>

    <VAlert v-if="audit?.status === 'failed'" type="error" variant="tonal" class="mb-6">
      <strong>La auditoría falló.</strong>
      <div class="text-body-2 mt-1">{{ audit.error }}</div>
    </VAlert>

    <!-- Aviso crítico: sin estas columnas, archivos en uso aparecen como huérfanos -->
    <VAlert v-if="audit?.summary?.skipped_sources?.length" type="error" variant="tonal" class="mb-6">
      <strong>Atención: hay columnas del registro que no existen en esta base.</strong>
      <ul class="mt-2 ms-4">
        <li v-for="source in audit.summary.skipped_sources" :key="source">{{ source }}</li>
      </ul>
      <div class="text-body-2 mt-2">
        Los archivos de esas columnas figuran abajo como huérfanos sin serlo. No borres nada hasta resolverlo.
      </div>
    </VAlert>

    <template v-if="audit?.status === 'completed' && audit.summary">
      <VRow class="mb-2">
        <VCol cols="12" sm="6" md="3">
          <VCard>
            <VCardText>
              <div class="text-body-2 text-medium-emphasis">Archivos en el disco</div>
              <div class="text-h5 mt-1">{{ audit.summary.disk_files }}</div>
            </VCardText>
          </VCard>
        </VCol>
        <VCol cols="12" sm="6" md="3">
          <VCard>
            <VCardText>
              <div class="text-body-2 text-medium-emphasis">Referenciados en la base</div>
              <div class="text-h5 mt-1">{{ audit.summary.referenced }}</div>
            </VCardText>
          </VCard>
        </VCol>
        <VCol cols="12" sm="6" md="3">
          <VCard>
            <VCardText>
              <div class="text-body-2 text-medium-emphasis">Huérfanos</div>
              <div class="text-h5 mt-1 text-warning">{{ audit.summary.orphans }}</div>
              <div class="text-caption text-medium-emphasis">{{ humanBytes(audit.summary.orphan_bytes) }}</div>
            </VCardText>
          </VCard>
        </VCol>
        <VCol cols="12" sm="6" md="3">
          <VCard>
            <VCardText>
              <div class="text-body-2 text-medium-emphasis">Referencias rotas</div>
              <div class="text-h5 mt-1 text-error">{{ audit.summary.missing }}</div>
              <div class="text-caption text-medium-emphasis">en la base, sin archivo</div>
            </VCardText>
          </VCard>
        </VCol>
      </VRow>

      <VAlert v-if="audit.summary.detail_truncated" type="warning" variant="tonal" density="compact" class="mb-6">
        El detalle está recortado a los primeros 2000 registros de cada tipo. Los totales de arriba sí son completos.
      </VAlert>

      <VCard v-if="audit.findings?.byFolder?.length" class="mb-6">
        <VCardItem>
          <VCardTitle>Huérfanos por carpeta</VCardTitle>
          <VCardSubtitle>
            Si una carpeta entera aparece acá, lo más probable es que falte registrar su columna,
            no que sean archivos basura.
          </VCardSubtitle>
        </VCardItem>
        <VDataTable :headers="folderHeaders" :items="audit.findings.byFolder" :items-per-page="10" density="compact">
          <template #item.bytes="{ item }">{{ humanBytes(item.bytes) }}</template>
        </VDataTable>
      </VCard>

      <VCard v-if="audit.findings?.orphans?.length" class="mb-6">
        <VCardItem>
          <VCardTitle>Archivos huérfanos</VCardTitle>
          <VCardSubtitle>Están en el servidor pero ninguna fila de la base los apunta.</VCardSubtitle>
        </VCardItem>
        <VDataTable :headers="orphanHeaders" :items="audit.findings.orphans" :items-per-page="10" density="compact">
          <template #item.size="{ item }">{{ humanBytes(item.size) }}</template>
          <template #item.modified_at="{ item }">{{ item.modified_at ?? '-' }}</template>
        </VDataTable>
      </VCard>

      <VCard v-if="audit.findings?.missing?.length" class="mb-6">
        <VCardItem>
          <VCardTitle>Referencias rotas</VCardTitle>
          <VCardSubtitle>
            La base apunta a estos archivos pero ya no están en el servidor. Son fotos o boletines
            que el usuario ve rotos.
          </VCardSubtitle>
        </VCardItem>
        <VDataTable :headers="missingHeaders" :items="audit.findings.missing" :items-per-page="10" density="compact" />
      </VCard>
    </template>

    <!-- LIMPIEZA -->
    <VCard v-if="audit?.status === 'completed' && audit.summary" class="mb-6">
      <VCardItem>
        <VCardTitle>Limpiar</VCardTitle>
        <VCardSubtitle>
          Cada acción vuelve a verificar el estado real en el momento de ejecutarse:
          no se confía en el resultado de la auditoría de arriba, que pudo quedar viejo.
        </VCardSubtitle>
      </VCardItem>

      <VCardText>
        <VAlert type="warning" variant="tonal" density="compact" class="mb-4">
          El borrado es <strong>definitivo</strong>: los archivos no se pueden recuperar.
          Solo se tocan archivos de más de <strong>7 días</strong>, para no llevarse una carga en curso.
          Conviene simular antes.
        </VAlert>

        <div class="d-flex flex-wrap gap-3">
          <VBtn variant="tonal" color="info" :loading="loading.run" :disabled="loading.run"
            @click="runCleanup(['orphans', 'missing'], true)">
            <VIcon start icon="tabler-eye" />
            Simular (no toca nada)
          </VBtn>

          <VBtn color="warning" :loading="loading.run" :disabled="loading.run || !audit.summary.orphans"
            @click="askCleanup(['orphans'], 'Borrar archivos huérfanos',
              `Se borrarán del servidor los archivos huérfanos de más de 7 días. Esto NO se puede deshacer.`)">
            <VIcon start icon="tabler-trash" />
            Borrar huérfanos ({{ audit.summary.orphans }})
          </VBtn>

          <VBtn color="error" :loading="loading.run" :disabled="loading.run || !audit.summary.missing"
            @click="askCleanup(['missing'], 'Limpiar referencias rotas',
              `Se vaciará el campo en las filas que apuntan a archivos inexistentes. Los adjuntos de comentarios se eliminan porque su columna no admite vacío. Esto NO se puede deshacer.`)">
            <VIcon start icon="tabler-eraser" />
            Limpiar referencias rotas ({{ audit.summary.missing }})
          </VBtn>

        </div>
      </VCardText>
    </VCard>

    <!-- RESULTADO DE LA LIMPIEZA -->
    <VCard v-if="cleanup" class="mb-6">
      <VCardItem>
        <VCardTitle>
          Resultado de la {{ cleanup.summary?.dry_run ? 'simulación' : 'limpieza' }}
        </VCardTitle>
        <VCardSubtitle v-if="cleanup.summary?.dry_run">
          Modo simulación: no se modificó ningún archivo ni ninguna fila.
        </VCardSubtitle>
      </VCardItem>

      <VCardText>
        <VProgressLinear v-if="!cleanup.is_finished" indeterminate color="primary" class="mb-3" />

        <VAlert v-if="cleanup.status === 'failed'" type="error" variant="tonal">
          {{ cleanup.error }}
        </VAlert>

        <VTable v-else-if="cleanup.status === 'completed' && cleanup.summary" density="compact">
          <tbody>
            <tr v-if="cleanup.summary.orphans_deleted !== undefined">
              <td>Huérfanos {{ cleanup.summary.dry_run ? 'que se borrarían' : 'borrados del servidor' }}</td>
              <td class="text-right">{{ cleanup.summary.orphans_deleted }}</td>
              <td class="text-right">{{ humanBytes(cleanup.summary.orphans_bytes) }}</td>
            </tr>
            <tr v-if="cleanup.summary.orphans_skipped_recent">
              <td class="text-medium-emphasis">Omitidos por ser recientes (menos de 7 días)</td>
              <td class="text-right">{{ cleanup.summary.orphans_skipped_recent }}</td>
              <td></td>
            </tr>
            <tr v-if="cleanup.summary.references_nullified !== undefined">
              <td>Campos vaciados</td>
              <td class="text-right">{{ cleanup.summary.references_nullified }}</td>
              <td></td>
            </tr>
            <tr v-if="cleanup.summary.rows_deleted !== undefined">
              <td>Filas eliminadas (adjuntos sin archivo)</td>
              <td class="text-right">{{ cleanup.summary.rows_deleted }}</td>
              <td></td>
            </tr>
          </tbody>
        </VTable>

        <div v-if="cleanup.findings?.missing?.length" class="mt-4">
          <div class="text-body-2 font-weight-medium mb-2">Detalle por origen</div>
          <VTable density="compact">
            <thead>
              <tr>
                <th>Origen</th>
                <th>Acción</th>
                <th class="text-right">Filas</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="row in cleanup.findings.missing" :key="row.source">
                <td>{{ row.label }} <span class="text-medium-emphasis">({{ row.source }})</span></td>
                <td>{{ row.action === 'delete_row' ? 'Borrar fila' : 'Vaciar campo' }}</td>
                <td class="text-right">{{ row.count }}</td>
              </tr>
            </tbody>
          </VTable>
        </div>
      </VCardText>
    </VCard>

    <!-- CONFIRMACIÓN -->
    <VDialog v-model="confirmDialog.open" max-width="520">
      <VCard>
        <VCardItem>
          <VCardTitle>{{ confirmDialog.title }}</VCardTitle>
        </VCardItem>
        <VCardText>{{ confirmDialog.body }}</VCardText>
        <VCardActions class="justify-end">
          <VBtn variant="text" @click="confirmDialog.open = false">Cancelar</VBtn>
          <VBtn variant="tonal" color="info" @click="runCleanup(confirmDialog.targets, true)">
            Simular primero
          </VBtn>
          <VBtn color="error" @click="runCleanup(confirmDialog.targets, false)">
            Sí, ejecutar
          </VBtn>
        </VCardActions>
      </VCard>
    </VDialog>

    <VCard class="mb-6">
      <VCardItem>
        <VCardTitle>Qué conoce esta auditoría</VCardTitle>
        <VCardSubtitle>
          Un archivo se considera huérfano cuando no aparece en ninguna de estas columnas.
          Si se agrega una carga de archivos nueva al sistema, hay que registrarla acá.
        </VCardSubtitle>
      </VCardItem>
      <VCardText>
        <VChip v-for="source in registry" :key="`${source.table}.${source.column}`" size="small" label class="me-2 mb-2">
          {{ source.label }} — {{ source.table }}.{{ source.column }}
        </VChip>

        <div class="text-body-2 text-medium-emphasis mt-3">
          Carpetas excluidas (temporales):
          <VChip v-for="prefix in ignoredPrefixes" :key="prefix" size="x-small" label class="ms-1">{{ prefix }}</VChip>
        </div>
      </VCardText>
    </VCard>

    <VCard v-if="history.length">
      <VCardItem>
        <VCardTitle>Corridas anteriores</VCardTitle>
      </VCardItem>
      <VTable density="compact">
        <thead>
          <tr>
            <th>Fecha</th>
            <th>Tipo</th>
            <th>Estado</th>
            <th class="text-right">Huérfanos</th>
            <th class="text-right">Espacio</th>
            <th class="text-right">Referencias rotas</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in history" :key="item.id">
            <td>{{ item.finished_at ?? item.created_at }}</td>
            <td>{{ item.type === 'cleanup' ? 'Limpieza' : 'Auditoría' }}</td>
            <td>{{ item.status }}</td>
            <td class="text-right">{{ item.summary?.orphans ?? '-' }}</td>
            <td class="text-right">{{ item.summary ? humanBytes(item.summary.orphan_bytes) : '-' }}</td>
            <td class="text-right">{{ item.summary?.missing ?? '-' }}</td>
          </tr>
        </tbody>
      </VTable>
    </VCard>
  </div>
</template>
