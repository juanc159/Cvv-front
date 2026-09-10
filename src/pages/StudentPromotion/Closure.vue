<script setup lang="ts">
import { useAuthenticationStore } from "@/stores/useAuthenticationStore";

definePage({
  name: "StudentPromotion-Closure",
  meta: {
    redirectIfLoggedIn: true,
    requiresAuth: true,
    requiredPermission: "studentPromotion.closure",
  },
});

const authenticationStore = useAuthenticationStore();
const { toast } = useToast();

interface UnassignedStudent {
  id: string
  identity_document: string
  full_name: string
  type_education: string | null
  is_active: boolean
  status: 'pending' | 'withdrawal' | 'graduation'
  status_label: string
  date: string | null
  reason: string | null
  origin: string | null
}

const students = ref<UnassignedStudent[]>([]);
const summary = ref<Record<string, number>>({});
const typeEducations = ref<any[]>([]);
const selected = ref<string[]>([]);

const filters = reactive({
  status: null as string | null,
  type_education_id: null as string | null,
  search: '',
});

const loading = reactive({ list: false, save: false });

const dialog = reactive({
  open: false,
  action: 'withdrawal' as 'withdrawal' | 'graduation' | 'clear',
  date: new Date().toISOString().slice(0, 10),
  reason: '',
  deactivate: false,
});

const statusOptions = [
  { title: 'Sin decidir', value: 'pending' },
  { title: 'Retirados', value: 'withdrawal' },
  { title: 'Egresados', value: 'graduation' },
];

const headers = [
  { title: 'Cédula', key: 'identity_document' },
  { title: 'Nombre del alumno', key: 'full_name' },
  { title: 'Venía de', key: 'origin' },
  { title: 'Nivel', key: 'type_education' },
  { title: 'Situación', key: 'status_label' },
  { title: 'Fecha', key: 'date' },
  { title: 'Motivo', key: 'reason' },
  { title: 'Acceso', key: 'is_active' },
];

const loadData = async () => {
  loading.list = true;
  selected.value = [];

  const params = new URLSearchParams({ company_id: authenticationStore.company.id });
  if (filters.status) params.append('status', filters.status);
  if (filters.type_education_id) params.append('type_education_id', filters.type_education_id);
  if (filters.search) params.append('search', filters.search);

  const { data, response } = await useApi<any>(`/schoolYearClosure?${params.toString()}`).get();

  loading.list = false;

  if (response.value?.ok && data.value) {
    students.value = data.value.students ?? [];
    summary.value = data.value.summary ?? {};
    typeEducations.value = data.value.typeEducations ?? [];
  }
};

const openDialog = (action: 'withdrawal' | 'graduation' | 'clear') => {
  dialog.action = action;
  dialog.date = new Date().toISOString().slice(0, 10);
  // El motivo del egreso es siempre el mismo, así que se propone escrito.
  dialog.reason = action === 'graduation' ? 'Culminó su último año escolar' : '';
  dialog.deactivate = false;
  dialog.open = true;
};

const confirm = async () => {
  loading.save = true;

  const { data, response } = await useApi<any>('/schoolYearClosure/classify').post({
    student_ids: selected.value,
    action: dialog.action,
    date: dialog.action === 'clear' ? null : dialog.date,
    reason: dialog.action === 'clear' ? null : dialog.reason,
    deactivate: dialog.deactivate,
  });

  loading.save = false;

  if (response.value?.ok && data.value?.code === 200) {
    dialog.open = false;
    toast("Listo", data.value.message, "success");
    loadData();
  }
};

const dialogTitle = computed(() => ({
  withdrawal: 'Registrar retiro',
  graduation: 'Marcar como egresados',
  clear: 'Devolver a "sin decidir"',
}[dialog.action]));

const statusColor = (status: string) => ({
  pending: 'warning',
  withdrawal: 'error',
  graduation: 'success',
}[status] ?? 'default');

watch(() => [filters.status, filters.type_education_id], loadData);

onMounted(loadData);
</script>

<template>
  <div>
    <VCard class="mb-6">
      <VCardItem>
        <VCardTitle>Cierre del período</VCardTitle>
        <VCardSubtitle>
          Alumnos que quedaron sin grado ni sección. Aquí se decide qué es cada uno, para que
          nadie desaparezca de los listados sin que alguien lo haya revisado.
        </VCardSubtitle>
      </VCardItem>

      <VCardText>
        <VAlert type="info" variant="tonal" density="compact" class="mb-4">
          <strong>Sin decidir</strong> es el estado por defecto: el alumno probablemente aún no
          ha venido a inscribirse. Conserva su acceso al sistema mientras no se indique lo contrario.
        </VAlert>

        <VRow class="mb-2">
          <VCol cols="6" md="3">
            <VCard variant="tonal">
              <VCardText class="py-3">
                <div class="text-h5">{{ summary.total ?? 0 }}</div>
                <div class="text-caption">Sin grado ni sección</div>
              </VCardText>
            </VCard>
          </VCol>
          <VCol cols="6" md="3">
            <VCard variant="tonal" color="warning">
              <VCardText class="py-3">
                <div class="text-h5">{{ summary.pending ?? 0 }}</div>
                <div class="text-caption">Sin decidir</div>
              </VCardText>
            </VCard>
          </VCol>
          <VCol cols="6" md="3">
            <VCard variant="tonal" color="error">
              <VCardText class="py-3">
                <div class="text-h5">{{ summary.withdrawal ?? 0 }}</div>
                <div class="text-caption">Retirados</div>
              </VCardText>
            </VCard>
          </VCol>
          <VCol cols="6" md="3">
            <VCard variant="tonal" color="success">
              <VCardText class="py-3">
                <div class="text-h5">{{ summary.graduation ?? 0 }}</div>
                <div class="text-caption">Egresados</div>
              </VCardText>
            </VCard>
          </VCol>
        </VRow>

        <VRow>
          <VCol cols="12" md="3">
            <VSelect v-model="filters.status" :items="statusOptions" label="Situación" clearable />
          </VCol>
          <VCol cols="12" md="3">
            <VSelect v-model="filters.type_education_id" :items="typeEducations" item-title="name"
              item-value="id" label="Nivel" clearable />
          </VCol>
          <VCol cols="12" md="4">
            <VTextField v-model="filters.search" label="Buscar por nombre o cédula"
              append-inner-icon="tabler-search" clearable @keyup.enter="loadData" @click:clear="loadData" />
          </VCol>
          <VCol cols="12" md="2" class="d-flex align-center">
            <VBtn variant="outlined" :loading="loading.list" @click="loadData">Buscar</VBtn>
          </VCol>
        </VRow>
      </VCardText>
    </VCard>

    <VCard>
      <VCardText>
        <VAlert v-if="selected.length" type="warning" variant="tonal" class="mb-4">
          <div class="d-flex align-center flex-wrap gap-3">
            <span><strong>{{ selected.length }}</strong> alumno(s) seleccionado(s)</span>
            <VSpacer />
            <VBtn size="small" color="error" @click="openDialog('withdrawal')">
              <VIcon start icon="tabler-user-minus" size="18" />
              Registrar retiro
            </VBtn>
            <VBtn size="small" color="success" @click="openDialog('graduation')">
              <VIcon start icon="tabler-school" size="18" />
              Marcar como egresados
            </VBtn>
            <VBtn size="small" variant="outlined" @click="openDialog('clear')">
              <VIcon start icon="tabler-arrow-back-up" size="18" />
              Volver a sin decidir
            </VBtn>
          </div>
        </VAlert>

        <VDataTable v-model="selected" :headers="headers" :items="students" :loading="loading.list"
          item-value="id" show-select :items-per-page="25" density="compact">
          <template #item.origin="{ item }">
            {{ item.origin ?? '—' }}
          </template>

          <template #item.status_label="{ item }">
            <VChip size="x-small" label :color="statusColor(item.status)">{{ item.status_label }}</VChip>
          </template>

          <template #item.date="{ item }">
            {{ item.date ?? '—' }}
          </template>

          <template #item.reason="{ item }">
            {{ item.reason ?? '—' }}
          </template>

          <template #item.is_active="{ item }">
            <VChip size="x-small" label :color="item.is_active ? 'success' : 'default'">
              {{ item.is_active ? 'Activo' : 'Inactivo' }}
            </VChip>
          </template>

          <template #no-data>
            <div class="py-6 text-center text-medium-emphasis">
              No hay alumnos sin grado ni sección con estos filtros.
            </div>
          </template>
        </VDataTable>
      </VCardText>
    </VCard>

    <VDialog v-model="dialog.open" max-width="520">
      <VCard>
        <VCardItem>
          <VCardTitle>{{ dialogTitle }}</VCardTitle>
          <VCardSubtitle>{{ selected.length }} alumno(s) seleccionado(s)</VCardSubtitle>
        </VCardItem>

        <VCardText>
          <VAlert v-if="dialog.action === 'clear'" type="info" variant="tonal" density="compact">
            Se elimina la situación registrada y el alumno vuelve a quedar como pendiente de
            inscribirse. Si estaba inactivo, recupera su acceso.
          </VAlert>

          <template v-else>
            <VRow>
              <VCol cols="12" sm="6">
                <VTextField v-model="dialog.date" type="date" label="Fecha" />
              </VCol>
              <VCol cols="12">
                <VTextField v-model="dialog.reason" label="Motivo" counter="255" />
              </VCol>
              <VCol cols="12">
                <VCheckbox v-model="dialog.deactivate" hide-details
                  label="Quitarles el acceso al sistema" />
                <div class="text-caption text-medium-emphasis ms-8">
                  Si no lo marca, conservan su usuario y pueden seguir entrando.
                </div>
              </VCol>
            </VRow>
          </template>
        </VCardText>

        <VCardActions>
          <VSpacer />
          <VBtn variant="text" @click="dialog.open = false">Cancelar</VBtn>
          <VBtn color="primary" :loading="loading.save"
            :disabled="dialog.action !== 'clear' && !dialog.reason" @click="confirm">
            Confirmar
          </VBtn>
        </VCardActions>
      </VCard>
    </VDialog>
  </div>
</template>
