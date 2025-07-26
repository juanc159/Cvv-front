<template>
  <LoadingV2Enhanced :is-loading="globalLoading.isLoading.value" :progress="globalLoading.currentProgress.value"
    :show-debug-toggle="true" :debug-data="globalLoading.debugInfo.value"
    :title="globalLoading.progressData.value.current_action" :subtitle="getSubtitle()" :steps="loadingSteps"
    :tips="loadingTips" @minimized="globalLoading.minimize" @restored="globalLoading.restore"
    @completed="handleCompleted" />
</template>

<script setup lang="ts">
import { getGlobalLoadingInstance } from '@/composables/useGlobalLoading';
import { computed, onBeforeUnmount } from 'vue';
import LoadingV2Enhanced from './LoadingV2Enhanced.vue';

// Obtener la instancia global
const globalLoading = getGlobalLoadingInstance();

// Pasos dinámicos basados en el progreso
const loadingSteps = computed(() => [
  'Validando archivo Excel',
  'Procesando estructura de datos',
  'Importando registros de estudiantes',
  'Guardando notas en base de datos',
  'Finalizando importación'
]);

// Tips personalizados
const loadingTips = [
  '📊 Asegúrate de que el archivo Excel tenga el formato correcto',
  '👥 Los estudiantes se crean automáticamente si no existen',
  '📝 Las notas se actualizan si ya existen registros previos',
  '🔄 El proceso puede tomar varios minutos dependiendo del tamaño',
  '✅ Puedes minimizar esta ventana y continuar navegando',
  '📈 El progreso se actualiza en tiempo real',
  '🎯 Cada hoja del Excel se procesa por separado',
  '⚡ El proceso continuará aunque cambies de página'
];

// Función para obtener subtítulo dinámico
const getSubtitle = () => {
  const meta = globalLoading.progressData.value.metadata;
  const progress = globalLoading.currentProgress.value;

  if (progress === 0) {
    return 'Iniciando proceso de importación...';
  }

  if (progress < 10) {
    return 'Validando estructura del archivo...';
  }

  if (progress < 100) {
    return `Procesando ${meta.processed_records || 0} de ${meta.total_records || 0} registros`;
  }

  return '¡Importación completada exitosamente!';
};

const handleCompleted = () => {
  console.log('✅ Loading completed globally');
};

// Cleanup al desmontar
onBeforeUnmount(() => {
  globalLoading.cleanup();
});
</script>
