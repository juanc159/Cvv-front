<script setup lang="ts">
import { useAuthenticationStore } from '@/stores/useAuthenticationStore';
const { company } = storeToRefs(useAuthenticationStore());

// Variables reactivas
const statistics = ref([]);
const withdrawnStudents = ref([]);
const entriesStudents = ref([]);

const totals = computed(() => {
  const initial = { male: 0, female: 0, total: 0 };
  const new_entries = { male: 0, female: 0, total: 0 };
  const withdrawals = { male: 0, female: 0, total: 0 };
  const current = { male: 0, female: 0, total: 0 };
  const foreign = { male: 0, female: 0, total: 0 };
  const nationals = { male: 0, female: 0, total: 0 };

  // ¡Usamos statistics.value directamente!
  statistics.value.forEach((stat) => {
    initial.male += Number(stat.initial.male);
    initial.female += Number(stat.initial.female);
    initial.total += Number(stat.initial.total);

    new_entries.male += Number(stat.new_entries.male);
    new_entries.female += Number(stat.new_entries.female);
    new_entries.total += Number(stat.new_entries.total);

    withdrawals.male += Number(stat.withdrawals.male);
    withdrawals.female += Number(stat.withdrawals.female);
    withdrawals.total += Number(stat.withdrawals.total);

    current.male += Number(stat.current.male);
    current.female += Number(stat.current.female);
    current.total += Number(stat.current.total);

    foreign.male += Number(stat.foreign.male);
    foreign.female += Number(stat.foreign.female);
    foreign.total += Number(stat.foreign.total);

    nationals.male += Number(stat.nationals.male);
    nationals.female += Number(stat.nationals.female);
    nationals.total += Number(stat.nationals.total);
  });

  return { initial, new_entries, withdrawals, current, foreign, nationals };
});


// Llama a la API al montar el componente
const getData = async () => {
  loading.fetchData = true;
  try {
    const { data, response } = await useApi<any>(
      createUrl(`/students/statistics`, {
        query: {
          dateInitial: filter.dateInitial,
          dateEnd: filter.dateEnd,
          company_id: company.value.id,
        },
      })
    );

    if (!response.value.ok) {
      throw new Error('Error al obtener datos');
    }
    statistics.value = Object.values(data.value.statistics);
    withdrawnStudents.value = data.value.withdrawnStudents;
    entriesStudents.value = data.value.entriesStudents;

  } catch (error) {
    console.error('Error al obtener datos:', error);
    // Manejo de errores: muestra un mensaje al usuario, etc.
  } finally {
    loading.fetchData = false;
  }
}
onMounted(async () => {
  getData()
});


// Nueva variable computada para agrupar
const groupedStatistics = computed(() => {
  const groups: Record<string, any> = {};

  statistics.value.forEach(stat => {
    const type = stat.type_education_name;
    if (!groups[type]) {
      groups[type] = {
        type,
        items: [],
        subtotal: {
          initial: { male: 0, female: 0, total: 0 },
          new_entries: { male: 0, female: 0, total: 0 },
          withdrawals: { male: 0, female: 0, total: 0 },
          current: { male: 0, female: 0, total: 0 },
          foreign: { male: 0, female: 0, total: 0 },
          nationals: { male: 0, female: 0, total: 0 },
        }
      };
    }

    groups[type].items.push(stat);

    // Sumar al subtotal del grupo
    ['initial', 'new_entries', 'withdrawals', 'current', 'foreign', 'nationals'].forEach(key => {
      groups[type].subtotal[key].male += Number(stat[key].male);
      groups[type].subtotal[key].female += Number(stat[key].female);
      groups[type].subtotal[key].total += Number(stat[key].total);
    });
  });

  return Object.values(groups);
});

const filter = reactive({
  dateInitial: null,
  dateEnd: null,
});

const loading = reactive({ excel: false, fetchData: false })

const downloadExcel = async () => {
  loading.excel = true;
  const { data, response } = await useApi("/students/statisticsExcelExport").post({
    dateInitial: filter.dateInitial,
    dateEnd: filter.dateEnd,
    company_id: company.value.id,
  })

  loading.excel = false;

  if (response.value?.ok && data.value) {
    downloadExcelBase64(data.value.excel, "Estadisticas de Estudiantes");
  }
}
</script>

<template>
  <div>
    <AppCardActions title="Estadísticas de Estudiantes" actionRefresh @refresh="getData"
      v-model:loading="loading.fetchData">

      <VCardText>
        <VRow>
          <VCol cols="12" md="3">
            <AppDateTimePicker clearable v-model="filter.dateInitial" label="Fecha inicio" placeholder="Desde" />
          </VCol>
          <VCol cols="12" md="3">
            <AppDateTimePicker clearable v-model="filter.dateEnd" label="Fecha fin" placeholder="Hasta" />
          </VCol>
          <VCol cols="12" md="3" class="d-flex gap-3 flex-wrap  ">
            <VBtn class="mt-6" @click="getData" :loading="loading.fetchData" :disabled="loading.fetchData">
              <template #prepend>
                <VIcon icon="tabler-search"></VIcon>
              </template>
              Buscar
            </VBtn>
            <VBtn class="mt-6" @click="downloadExcel" :loading="loading.excel" :disabled="loading.excel">
              <template #prepend>
                <VIcon icon="tabler-file-type-xls"></VIcon>
              </template>
              Exportar
            </VBtn>
          </VCol>
        </VRow>
      </VCardText>
      <VCardText>
        <VTable class="stats-table">
          <thead>
            <tr class="header-row">
              <th class="header-cell" rowspan="2">Tipo de Educación</th>
              <th class="header-cell" rowspan="2">Grado y Sección</th>
              <th class="header-cell initial-header" colspan="3">Matrícula Inicial</th>
              <th class="header-cell entries-header" colspan="3">Ingresos</th>
              <th class="header-cell withdrawals-header" colspan="3">Egresos</th>
              <th class="header-cell current-header" colspan="3">Matrícula Actual</th>
              <th class="header-cell foreign-header" colspan="3">Extranjeros</th>
              <th class="header-cell nationals-header" colspan="3">Nacionales</th>
            </tr>
            <tr class="header-row">
              <th class="header-cell">M</th>
              <th class="header-cell">F</th>
              <th class="header-cell">T</th>
              <th class="header-cell">M</th>
              <th class="header-cell">F</th>
              <th class="header-cell">T</th>
              <th class="header-cell">M</th>
              <th class="header-cell">F</th>
              <th class="header-cell">T</th>
              <th class="header-cell">M</th>
              <th class="header-cell">F</th>
              <th class="header-cell">T</th>
              <th class="header-cell">M</th>
              <th class="header-cell">F</th>
              <th class="header-cell">T</th>
              <th class="header-cell">M</th>
              <th class="header-cell">F</th>
              <th class="header-cell">T</th>
            </tr>
          </thead>
          <tbody>
            <template v-for="(group, groupIndex) in groupedStatistics" :key="groupIndex">
              <!-- Filas de datos por tipo -->
              <tr v-for="(stat, statIndex) in group.items" :key="statIndex" class="data-row">
                <td v-if="statIndex === 0" :rowspan="group.items.length + 1" class="type-cell">
                  {{ group.type }}
                </td>
                <td class="grade-cell">{{ stat.grade_name }} - {{ stat.section_name }}</td>
                <td class="initial-cell">{{ stat.initial.male }}</td>
                <td class="initial-cell">{{ stat.initial.female }}</td>
                <td class="initial-cell">{{ stat.initial.total }}</td>
                <td class="entries-cell">{{ stat.new_entries.male }}</td>
                <td class="entries-cell">{{ stat.new_entries.female }}</td>
                <td class="entries-cell">{{ stat.new_entries.total }}</td>
                <td class="withdrawals-cell">{{ stat.withdrawals.male }}</td>
                <td class="withdrawals-cell">{{ stat.withdrawals.female }}</td>
                <td class="withdrawals-cell">{{ stat.withdrawals.total }}</td>
                <td class="current-cell">{{ stat.current.male }}</td>
                <td class="current-cell">{{ stat.current.female }}</td>
                <td class="current-cell">{{ stat.current.total }}</td>
                <td class="foreign-cell">{{ stat.foreign.male }}</td>
                <td class="foreign-cell">{{ stat.foreign.female }}</td>
                <td class="foreign-cell">{{ stat.foreign.total }}</td>
                <td class="nationals-cell">{{ stat.nationals.male }}</td>
                <td class="nationals-cell">{{ stat.nationals.female }}</td>
                <td class="nationals-cell">{{ stat.nationals.total }}</td>
              </tr>
              <!-- Fila de subtotal por tipo -->
              <tr class="subtotal-row">
                <td class="subtotal-cell">Subtotal</td>
                <td v-for="value in group.subtotal.initial" class="initial-cell">
                  {{ value }}
                </td>
                <td v-for="value in group.subtotal.new_entries" class="entries-cell">
                  {{ value }}
                </td>
                <td v-for="value in group.subtotal.withdrawals" class="withdrawals-cell">
                  {{ value }}
                </td>
                <td v-for="value in group.subtotal.current" class="current-cell">
                  {{ value }}
                </td>
                <td v-for="value in group.subtotal.foreign" class="current-cell">
                  {{ value }}
                </td>
                <td v-for="value in group.subtotal.nationals" class="current-cell">
                  {{ value }}
                </td>
              </tr>
            </template>
            <!-- Total general -->
            <tr class="total-row">
              <td colspan="2" class="total-cell">Total General</td>
              <td v-for="value in totals.initial" class="initial-cell">
                {{ value }}
              </td>
              <td v-for="value in totals.new_entries" class="entries-cell">
                {{ value }}
              </td>
              <td v-for="value in totals.withdrawals" class="withdrawals-cell">
                {{ value }}
              </td>
              <td v-for="value in totals.current" class="current-cell">
                {{ value }}
              </td>
              <td v-for="value in totals.foreign" class="current-cell">
                {{ value }}
              </td>
              <td v-for="value in totals.nationals" class="current-cell">
                {{ value }}
              </td>
            </tr>
          </tbody>
        </VTable>

        <v-container style="margin-top: 40px;">
          <h2 class="text-h4 font-weight-bold mb-4">Estudiantes Retirados</h2>
          <v-table fixed-header>
            <thead>
              <tr>
                <th>Documento</th>
                <th>Apellidos y Nombres</th>
                <th>Fecha Nacimiento</th>
                <th>Grado</th>
                <th>Sección</th>
                <th>Sexo</th>
                <th>Fecha Retiro</th>
                <th>Motivo</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(student, index) in withdrawnStudents" :key="index">
                <td>{{ student.identity_document }}</td>
                <td>{{ student.full_name }}</td>
                <td>
                  {{ formatDate(student.birthday) }}
                </td>
                <td>{{ student.grade_name }}</td>
                <td>{{ student.section_name }}</td>
                <td>{{ student.gender === 'M' ? 'Masculino' : 'Femenino' }}</td>
                <td>{{ formatDate(student.withdrawal_date) }}</td>
                <td>{{ student.reason }}</td>
              </tr>
              <tr v-if="withdrawnStudents.length === 0">
                <td colspan="8" class="text-center">No hay estudiantes retirados registrados</td>
              </tr>
            </tbody>
          </v-table>
        </v-container>
        <v-container style="margin-top: 40px;">
          <h2 class="text-h4 font-weight-bold mb-4">Estudiantes Ingresados</h2>
          <v-table fixed-header>
            <thead>
              <tr>
                <th>Documento</th>
                <th>Apellidos y Nombres</th>
                <th>Fecha Nacimiento</th>
                <th>Grado</th>
                <th>Sección</th>
                <th>Sexo</th>
                <th>Fecha Ingreso</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(student, index) in entriesStudents" :key="index">
                <td>{{ student.identity_document }}</td>
                <td>{{ student.full_name }}</td>
                <td>
                  {{ formatDate(student.birthday) }}
                </td>
                <td>{{ student.grade_name }}</td>
                <td>{{ student.section_name }}</td>
                <td>{{ student.gender === 'M' ? 'Masculino' : 'Femenino' }}</td>
                <td>{{ formatDate(student.real_entry_date) }}</td>
              </tr>
              <tr v-if="entriesStudents.length === 0">
                <td colspan="8" class="text-center">No hay estudiantes retirados registrados</td>
              </tr>
            </tbody>
          </v-table>
        </v-container>
      </VCardText>
    </AppCardActions>
  </div>
</template>

<style lang="scss" scoped>
/* Estilos generales */

.stats-title {
  color: rgba(var(--v-theme-text-primary), 1);
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
}

.stats-table {
  border: 2px solid rgba(var(--v-border-color), var(--v-border-opacity));
  border-collapse: collapse;
  width: 100%;
  font-size: 14px;
  border-radius: 8px;
  overflow: hidden;
  background: rgba(var(--v-theme-background), 1);
}

/* Encabezados */
.header-row {
  background-color: rgba(var(--v-theme-background), 0.8);
  color: rgba(var(--v-theme-text-primary), 0.87);
}

.header-cell {
  border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
  padding: 12px;
  text-align: center;
  position: relative;
}


/* Colores temáticos para encabezados */
.initial-header {
  background-color: rgba(var(--v-theme-primary), 0.8);
  color: rgba(var(--v-theme-text-inverse), 1);
}

.entries-header {
  background-color: rgba(var(--v-theme-info), 0.8);
  color: rgba(var(--v-theme-text-inverse), 1);
}

.withdrawals-header {
  background-color: rgba(var(--v-theme-error), 0.8);
  color: rgba(var(--v-theme-text-inverse), 1);
}

.current-header {
  background-color: rgba(var(--v-theme-success), 0.8);
  color: rgba(var(--v-theme-text-inverse), 1);
}

.foreign-header {
  background-color: rgba(var(--v-theme-warning), 0.8);
  color: rgba(var(--v-theme-text-inverse), 1);
}

.nationals-header {
  background-color: rgba(var(--v-theme-success), 0.8);
  color: rgba(var(--v-theme-text-inverse), 1);
}

/* Celdas de datos */
.data-row td {
  border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
  padding: 12px;
  text-align: center;
  // color: rgba(var(--v-theme-text-primary), 0.87);
  // background-color: rgba(var(--v-theme-background), 1);
}


// /* Celdas de datos */
// .data-row td {
//   border: 1px solid #ccc;
//   /* Borde uniforme para todas las celdas */
//   padding: 12px;
//   text-align: center;
//   /* Centra el texto */
// }

.type-cell {
  font-weight: bold;
  background-color: rgba(var(--v-theme-background), 0.9);
}

.grade-cell {
  background-color: rgba(var(--v-theme-background), 1);

}

.initial-cell {
  background-color: rgba(var(--v-theme-primary), 0.8);
}

.entries-cell {
  background-color: rgba(var(--v-theme-info), 0.8);
}

.withdrawals-cell {
  background-color: rgba(var(--v-theme-error), 0.8);
}

.current-cell {
  background-color: rgba(var(--v-theme-success), 0.8);
}

.foreign-cell {
  background-color: rgba(var(--v-theme-warning), 0.8);
}

.nationals-cell {
  background-color: rgba(var(--v-theme-success), 0.8);
}

/* Subtotales */
.subtotal-row td {
  border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
  padding: 12px;
  text-align: center;
  font-weight: bold;
  background-color: rgba(var(--v-theme-background), 0.8);
}

/* Totales */
.total-row td {
  border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
  padding: 12px;
  text-align: center;
  font-weight: bold;
  background-color: rgba(var(--v-theme-background), 0.9);
}
</style>
