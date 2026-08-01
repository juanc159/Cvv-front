<script setup lang="ts">
import { useAuthenticationStore } from "@/stores/useAuthenticationStore";

definePage({
  name: "Maintenance-Data",
  meta: {
    redirectIfLoggedIn: true,
    requiresAuth: true,
    requiredPermission: "maintenance.data",
  },
});

const authenticationStore = useAuthenticationStore();
const { toast } = useToast();

interface Check {
  key: string
  label: string
  description: string
  severity: 'error' | 'warning'
  count: number
  truncated: boolean
  items: Array<Record<string, string | number>>
  hint: string
}

interface Audit {
  id: string
  status: 'pending' | 'running' | 'completed' | 'failed'
  summary: {
    total_checks: number
    with_findings: number
    errors: number
    total_cases: number
  } | null
  error: string | null
  finished_at: string | null
  created_at: string | null
  is_finished: boolean
  findings?: { checks: Check[] } | null
}

const loading = reactive({ run: false });
const audit = ref<Audit | null>(null);
const history = ref<Audit[]>([]);

let pollTimer: ReturnType<typeof setInterval> | null = null;

const stopPolling = () => {
  if (pollTimer) {
    clearInterval(pollTimer);
    pollTimer = null;
  }
};

const isRunning = computed(() => audit.value !== null && !audit.value.is_finished);

// Los chequeos con hallazgos van primero, y dentro de esos los errores antes que los avisos.
const checks = computed<Check[]>(() => {
  const list = audit.value?.findings?.checks ?? [];
  return [...list].sort((a, b) => {
    if ((a.count > 0) !== (b.count > 0)) return a.count > 0 ? -1 : 1;
    if (a.severity !== b.severity) return a.severity === 'error' ? -1 : 1;
    return b.count - a.count;
  });
});

const loadData = async () => {
  const { data, response } = await useApi<any>('/maintenance/data-audit/data').get();
  if (response.value?.ok && data.value) {
    audit.value = data.value.last;
    history.value = data.value.history ?? [];
    if (audit.value && !audit.value.is_finished) startPolling();
  }
};

const startPolling = () => {
  stopPolling();
  pollTimer = setInterval(async () => {
    if (!audit.value?.id) return;
    const { data, response } = await useApi<any>(`/maintenance/data-audit/${audit.value.id}`).get();
    if (response.value?.ok && data.value?.audit) {
      audit.value = data.value.audit;
      if (audit.value?.is_finished) {
        stopPolling();
        loading.run = false;
        loadData();
      }
    }
  }, 3000);
};

const runAudit = async () => {
  loading.run = true;
  const { data, response } = await useApi<any>('/maintenance/data-audit/run').post({
    company_id: authenticationStore.company.id,
  });

  if (response.value?.ok && data.value?.audit) {
    audit.value = data.value.audit;
    toast("Revisión iniciada", "Se está ejecutando en segundo plano", "success");
    startPolling();
  } else {
    loading.run = false;
    toast("No se pudo iniciar la revisión", "", "danger");
  }
};

onMounted(loadData);
onBeforeUnmount(stopPolling);

// Las claves de cada caso varían según el chequeo, así que las columnas se arman solas.
const columnsOf = (check: Check) => Object.keys(check.items[0] ?? {});

const columnLabel = (key: string) =>
  key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, ' ');
</script>

<template>
  <div>
    <VCard class="mb-6">
      <VCardItem>
        <VCardTitle>Revisión de datos</VCardTitle>
        <VCardSubtitle>
          Busca inconsistencias que normalmente se descubren tarde y por sus síntomas:
          alumnos que no salen en un reporte, secciones sin docente, documentos que fallan.
        </VCardSubtitle>
      </VCardItem>

      <VCardText>
        <VAlert type="info" variant="tonal" density="compact" class="mb-4">
          Es de <strong>solo lectura</strong>. No corrige nada automáticamente: cada caso se
          resuelve desde su módulo, porque la decisión es del colegio.
        </VAlert>

        <div class="d-flex align-center flex-wrap gap-4">
          <VBtn color="primary" :loading="loading.run || isRunning" :disabled="loading.run || isRunning"
            @click="runAudit">
            <VIcon start icon="tabler-refresh" />
            Ejecutar revisión
          </VBtn>

          <span v-if="audit?.finished_at" class="text-body-2 text-medium-emphasis">
            Última revisión: {{ audit.finished_at }}
          </span>
        </div>

        <VProgressLinear v-if="isRunning" indeterminate color="primary" class="mt-4" />
      </VCardText>
    </VCard>

    <VAlert v-if="audit?.status === 'failed'" type="error" variant="tonal" class="mb-6">
      <strong>La revisión falló.</strong>
      <div class="text-body-2 mt-1">{{ audit.error }}</div>
    </VAlert>

    <template v-if="audit?.status === 'completed' && audit.summary">
      <VRow class="mb-2">
        <VCol cols="12" sm="4">
          <VCard>
            <VCardText>
              <div class="text-body-2 text-medium-emphasis">Chequeos ejecutados</div>
              <div class="text-h5 mt-1">{{ audit.summary.total_checks }}</div>
            </VCardText>
          </VCard>
        </VCol>
        <VCol cols="12" sm="4">
          <VCard>
            <VCardText>
              <div class="text-body-2 text-medium-emphasis">Con hallazgos</div>
              <div class="text-h5 mt-1" :class="audit.summary.with_findings ? 'text-warning' : 'text-success'">
                {{ audit.summary.with_findings }}
              </div>
            </VCardText>
          </VCard>
        </VCol>
        <VCol cols="12" sm="4">
          <VCard>
            <VCardText>
              <div class="text-body-2 text-medium-emphasis">Casos en total</div>
              <div class="text-h5 mt-1">{{ audit.summary.total_cases }}</div>
            </VCardText>
          </VCard>
        </VCol>
      </VRow>

      <VAlert v-if="audit.summary.with_findings === 0" type="success" variant="tonal" class="mb-6">
        Todos los chequeos pasaron. No se encontraron inconsistencias.
      </VAlert>

      <VExpansionPanels multiple class="mb-6">
        <VExpansionPanel v-for="check in checks" :key="check.key" :disabled="check.count === 0">
          <VExpansionPanelTitle>
            <div class="d-flex align-center gap-3 flex-wrap">
              <VIcon v-if="check.count === 0" icon="tabler-circle-check" color="success" size="20" />
              <VIcon v-else :icon="check.severity === 'error' ? 'tabler-alert-circle' : 'tabler-alert-triangle'"
                :color="check.severity === 'error' ? 'error' : 'warning'" size="20" />

              <span class="font-weight-medium">{{ check.label }}</span>

              <VChip v-if="check.count > 0" size="x-small" label
                :color="check.severity === 'error' ? 'error' : 'warning'">
                {{ check.count }}
              </VChip>
              <VChip v-else size="x-small" label color="success">Sin hallazgos</VChip>
            </div>
          </VExpansionPanelTitle>

          <VExpansionPanelText>
            <p class="text-body-2 text-medium-emphasis mb-3">{{ check.description }}</p>

            <VAlert type="info" variant="tonal" density="compact" class="mb-4">
              <strong>Cómo se resuelve:</strong> {{ check.hint }}
            </VAlert>

            <VAlert v-if="check.truncated" type="warning" variant="tonal" density="compact" class="mb-3">
              Se muestran los primeros 500 casos. El total de arriba sí es completo.
            </VAlert>

            <div style="overflow-x: auto;">
              <VTable density="compact">
                <thead>
                  <tr>
                    <th v-for="col in columnsOf(check)" :key="col">{{ columnLabel(col) }}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, index) in check.items" :key="index">
                    <td v-for="col in columnsOf(check)" :key="col">{{ item[col] }}</td>
                  </tr>
                </tbody>
              </VTable>
            </div>
          </VExpansionPanelText>
        </VExpansionPanel>
      </VExpansionPanels>
    </template>

    <VCard v-if="history.length">
      <VCardItem>
        <VCardTitle>Revisiones anteriores</VCardTitle>
      </VCardItem>
      <VTable density="compact">
        <thead>
          <tr>
            <th>Fecha</th>
            <th>Estado</th>
            <th class="text-right">Con hallazgos</th>
            <th class="text-right">Casos</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in history" :key="item.id">
            <td>{{ item.finished_at ?? item.created_at }}</td>
            <td>{{ item.status }}</td>
            <td class="text-right">{{ item.summary?.with_findings ?? '-' }}</td>
            <td class="text-right">{{ item.summary?.total_cases ?? '-' }}</td>
          </tr>
        </tbody>
      </VTable>
    </VCard>
  </div>
</template>
