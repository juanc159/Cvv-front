<script setup lang="ts">

import { ArcElement, CategoryScale, Chart as ChartJS, Legend, Title, Tooltip } from 'chart.js';
import { Pie } from 'vue-chartjs';

ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale)



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
    createUrl(`/dashboard/studentByPhotoStatus`, {
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
    <AppCardActions title="Estudiantes con foto y sin foto" noActions v-model:loading="componentData.isLoading">
      <VCardText>
        <div class="chart-container">
          <Pie ref="chartInstance" :data="chartData" :options="chartOptions" />
        </div>
      </VCardText>
    </AppCardActions>
  </div>
</template>

<style scoped>
.chart-container {
  width: 300px;
  /* Ancho fijo */
  height: 300px;
  /* Alto fijo */
  margin: 0 auto;
  /* Centrar el gráfico */
}
</style>
