<script setup lang="ts">
import { ArcElement, CategoryScale, Chart as ChartJS, Legend, Title, Tooltip } from 'chart.js';
import { computed, onMounted, reactive, ref } from 'vue';
import { Pie } from 'vue-chartjs';

ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale)

// Importamos el store de autenticación
import { useAuthenticationStore } from "@/stores/useAuthenticationStore";
const authenticationStore = useAuthenticationStore();

// Definición de la página
definePage({
  name: "Dashboard-StudentByTypeEducation",
  meta: {
    redirectIfLoggedIn: true,
    requiresAuth: true,
  },
});

// Variables reactivas para el estado del componente y datos de la gráfica
const componentData = reactive({
  isDialogVisible: false,
  isLoading: false,
});

const labels = ref<Array<string>>([]);
const datasets = ref<Array<object>>([]);

// Variables para los detalles existentes
const missingCountry = ref<number>(0);
const missingState = ref<number>(0);
const missingCity = ref<number>(0);

// Nuevas variables para nacionales y extranjeros
const nacionales = ref<number>(0);
const extranjeros = ref<number>(0);
const incompletos = ref<number>(0);

onMounted(async () => {
  await fetchData();
});

const fetchData = async () => {
  componentData.isLoading = true;
  const { data, response } = await useApi<any>(
    createUrl(`/dashboard/students-location`, {
      query: {
        company_id: authenticationStore.company.id,
      },
    })
  );
  componentData.isLoading = false;

  if (response.value?.ok && data.value) {
    // Configuración de la gráfica
    labels.value = data.value.pie_chart.labels;
    datasets.value = data.value.pie_chart.datasets;

    // Asignar valores de detalles
    missingCountry.value = data.value.detalles?.sin_pais || 0;
    missingState.value = data.value.detalles?.sin_departamento || 0;
    missingCity.value = data.value.detalles?.sin_ciudad || 0;

    // Asignar nuevos detalles: nacionales, extranjeros y incompletos
    nacionales.value = data.value.detalles?.nacionales || 0;
    extranjeros.value = data.value.detalles?.extranjeros || 0;
    incompletos.value = data.value.detalles?.incompletos || 0;
  }
};

const chartOptions = {
  responsive: true,
};

const chartData = computed(() => {
  return {
    labels: labels.value,
    datasets: datasets.value
  };
});
</script>

<template>
  <div>
    <AppCardActions title="Ubicación de estudiantes" actionRefresh @refresh="fetchData"
      v-model:loading="componentData.isLoading">
      <VCardText>
        <div class="chart-container">
          <Pie ref="chartInstance" :data="chartData" :options="chartOptions" />
        </div>

        <!-- Sección de detalles -->
        <div class="details-section mt-4">
          <VList density="compact">
            <!-- Estudiantes nacionales -->
            <VListItem>
              <VListItemTitle class="d-flex justify-space-between">
                <span>Nacionales:</span>
                <span class="font-weight-bold">{{ nacionales }}</span>
              </VListItemTitle>
            </VListItem>

            <!-- Estudiantes extranjeros -->
            <VListItem>
              <VListItemTitle class="d-flex justify-space-between">
                <span>Extranjeros:</span>
                <span class="font-weight-bold">{{ extranjeros }}</span>
              </VListItemTitle>
            </VListItem>

            <!-- Datos incompletos -->
            <VListItem>
              <VListItemTitle class="d-flex justify-space-between">
                <span>Datos incompletos:</span>
                <span class="font-weight-bold">{{ incompletos }}</span>
              </VListItemTitle>
            </VListItem>

            <!-- Detalles por cada dato faltante -->
            <VListItem>
              <VListItemTitle class="d-flex justify-space-between">
                <span>Sin país:</span>
                <span class="font-weight-bold">{{ missingCountry }}</span>
              </VListItemTitle>
            </VListItem>
            <VListItem>
              <VListItemTitle class="d-flex justify-space-between">
                <span>Sin departamento:</span>
                <span class="font-weight-bold">{{ missingState }}</span>
              </VListItemTitle>
            </VListItem>
            <VListItem>
              <VListItemTitle class="d-flex justify-space-between">
                <span>Sin ciudad:</span>
                <span class="font-weight-bold">{{ missingCity }}</span>
              </VListItemTitle>
            </VListItem>
          </VList>
        </div>
      </VCardText>
    </AppCardActions>
  </div>
</template>

<style scoped>
.chart-container {
  width: 300px;
  height: 300px;
  margin: 0 auto;
}

.details-section {
  max-width: 400px;
  margin: 20px auto 0;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 16px;
}

.v-list {
  background: transparent;
}
</style>
