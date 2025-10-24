<script setup lang="ts">
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Title,
  Tooltip
} from 'chart.js';
import { Bar } from 'vue-chartjs';
ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, PointElement, LineElement);

import { useAuthenticationStore } from "@/stores/useAuthenticationStore";
const authenticationStore = useAuthenticationStore();

definePage({
  name: "Dashboard-StudentByTypeEducation",
  meta: {
    redirectIfLoggedIn: true,
    requiresAuth: true,
  },
});

const componentData = reactive({
  isDialogVisible: false,
  isLoading: false,
});

const labels = ref<Array<string>>([])
const datasets = ref<Array<object>>([])

onMounted(async () => {
  await fetchData()
})

const fetchData = async () => {
  componentData.isLoading = true
  const { data, response } = await useApi<any>(
    createUrl(`/dashboard/studentByTypeEducation`, {
      query: {
        company_id: authenticationStore.company.id,
      },
    })
  );
  componentData.isLoading = false

  if (response.value?.ok && data.value) {
    labels.value = data.value.labels;
    datasets.value = data.value.datasets;
  }
}

const chartOptions = {
  responsive: true,
}

const chartData = computed(() => {
  return {
    labels: labels.value,
    datasets: datasets.value
  }
})


</script>

<template>
  <div>
    <AppCardActions title="Estudiantes por tipo de educación" noActions v-model:loading="componentData.isLoading">
      <VCardText>
        <Bar ref="chartInstance" :data="chartData" :options="chartOptions" />
      </VCardText>
    </AppCardActions>
  </div>
</template>
