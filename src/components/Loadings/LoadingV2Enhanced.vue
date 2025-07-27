<template>
  <v-overlay v-if="!isMinimized && isLoading" :model-value="isLoading"
    class="loading-overlay d-flex align-center justify-center" :persistent="false" :opacity="0.95" :z-index="9999">
    <v-card class="loading-card" elevation="24" rounded="xl" min-width="400" width="90%">
      <v-card-text class="pa-6">

        <!-- Header -->
        <div class="text-center mb-4">
          <v-avatar size="60" class="loading-avatar mb-3" color="primary">
            <v-icon size="30" icon="tabler-upload" color="white" />
          </v-avatar>
          <h2 class="text-h6 font-weight-bold mb-2">
            {{ title }}
          </h2>
          <p class="text-body-2 text-medium-emphasis">
            {{ subtitle }}
          </p>
        </div>

        <!-- Progress Section -->
        <div class="progress-section mb-4">
          <div class="d-flex justify-space-between align-center mb-2">
            <span class="text-body-2 font-weight-medium">
              Progreso
            </span>
            <span class="text-body-2 font-weight-bold text-primary">
              {{ Math.round(progress) }}%
            </span>
          </div>
          <v-progress-linear :model-value="progress" height="8" rounded color="primary" class="loading-progress">
          </v-progress-linear>
        </div>

        <!-- Action Buttons -->
        <div class="text-center">
          <v-btn variant="text" color="primary" @click="minimize">
            <v-icon start icon="tabler-window-minimize" />
            Minimizar
          </v-btn>
        </div>
      </v-card-text>
    </v-card>
  </v-overlay>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue';

interface DebugData {
  strategy?: string;
  connectionStatus?: string;
  batchId?: string;
  processedRecords?: number;
  totalRecords?: number;
  currentStudent?: string;
  lastUpdate?: string;
  sheet?: number;
  chunk?: number;
}

const props = defineProps({
  progress: {
    type: Number,
    default: 0,
    validator: (value: number) => value >= 0 && value <= 100
  },
  isLoading: {
    type: Boolean,
    default: true
  },
  title: {
    type: String,
    default: 'Procesando'
  },
  subtitle: {
    type: String,
    default: 'Por favor espera mientras completamos la operación'
  },
  showTips: {
    type: Boolean,
    default: true
  },
  showDebugToggle: {
    type: Boolean,
    default: false
  },
  debugData: {
    type: Object as () => DebugData,
    default: () => ({})
  },
  tips: {
    type: Array as () => string[],
    default: () => [
      '💡 Tip: Puedes minimizar esta ventana y continuar navegando',
      '🚀 El proceso continuará ejecutándose en segundo plano',
      '⚡ Recibirás una notificación cuando termine',
      '🎨 Puedes cambiar entre modo claro y oscuro',
      '🔧 El progreso se guarda automáticamente'
    ]
  },
  steps: {
    type: Array as () => string[],
    default: () => [
      'Inicializando componentes',
      'Cargando configuración',
      'Conectando servicios',
      'Preparando interfaz',
      'Finalizando proceso'
    ]
  }
})

const emit = defineEmits(['minimized', 'restored', 'completed'])

// Estado local
const currentTipIndex = ref(0)
const currentStepIndex = ref(0)
const isMinimized = ref(false)
const showDebugInfo = ref(false)
let tipInterval: NodeJS.Timeout | null = null

// Funciones de control
const minimize = () => {
  isMinimized.value = true
  emit('minimized')
}

const restore = () => {
  isMinimized.value = false
  emit('restored')
}

const toggleDebugInfo = () => {
  showDebugInfo.value = !showDebugInfo.value
}

const getConnectionColor = (status?: string) => {
  switch (status) {
    case 'connected': return 'success';
    case 'connecting': return 'warning';
    case 'reconnecting': return 'info';
    case 'error': return 'error';
    default: return 'secondary';
  }
}

// Computed properties
const progress = computed(() => {
  const progressValue = Math.max(0, Math.min(100, props.progress))
  if (progressValue >= 100) {
    emit('completed')
  }
  return progressValue
})

const currentTitle = computed(() => {
  const progressValue = progress.value
  if (progressValue < 20) return props.title
  if (progressValue < 40) return 'Cargando recursos...'
  if (progressValue < 60) return 'Procesando datos...'
  if (progressValue < 80) return 'Casi terminado...'
  if (progressValue < 95) return 'Finalizando...'
  return '¡Completado!'
})

const currentSubtitle = computed(() => {
  const progressValue = progress.value
  if (progressValue < 20) return props.subtitle
  if (progressValue < 40) return 'Descargando componentes necesarios'
  if (progressValue < 60) return 'Organizando la información'
  if (progressValue < 80) return 'Aplicando configuraciones finales'
  if (progressValue < 95) return 'Preparando la experiencia'
  return 'Todo está listo para usar'
})

const currentIcon = computed(() => {
  const progressValue = progress.value
  if (progressValue < 20) return 'tabler-download'
  if (progressValue < 40) return 'tabler-settings'
  if (progressValue < 60) return 'tabler-database'
  if (progressValue < 80) return 'tabler-layers-intersect'
  if (progressValue < 95) return 'tabler-circle-check'
  return 'tabler-checks'
})

const currentTip = computed(() => {
  return props.tips[currentTipIndex.value] || ''
})

const loadingSteps = computed(() => props.steps)

// Métodos para los pasos
const getStepIcon = (index: number) => {
  if (index < currentStepIndex.value) return 'tabler-circle-check'
  if (index === currentStepIndex.value) return 'tabler-loader'
  return 'tabler-circle'
}

const getStepColor = (index: number) => {
  if (index < currentStepIndex.value) return 'success'
  if (index === currentStepIndex.value) return 'primary'
  return 'secondary'
}

const getStepTextClass = (index: number) => {
  if (index < currentStepIndex.value) return 'text-success font-weight-medium'
  if (index === currentStepIndex.value) return 'text-primary font-weight-medium'
  return 'text-medium-emphasis'
}

// Funciones de control de tips
const startTipRotation = () => {
  if (props.showTips && props.tips.length > 1) {
    tipInterval = setInterval(() => {
      currentTipIndex.value = (currentTipIndex.value + 1) % props.tips.length
    }, 4000)
  }
}

const stopTipRotation = () => {
  if (tipInterval) {
    clearInterval(tipInterval)
    tipInterval = null
  }
}

// Lifecycle
onMounted(() => {
  startTipRotation()
})

onUnmounted(() => {
  stopTipRotation()
})

watch(() => props.isLoading, (newValue) => {
  if (newValue) {
    startTipRotation()
  } else {
    stopTipRotation()
  }
})

// Exponer funciones
defineExpose({
  minimize,
  restore,
  toggleDebugInfo,
  isMinimized
})
</script>

<style scoped>
.spin-animation {
  animation: spin 1s linear infinite !important;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

.loading-overlay {
  position: fixed !important;
  backdrop-filter: blur(12px) !important;
  height: 100vh !important;
  width: 100vw !important;
  top: 0 !important;
  left: 0 !important;
}

.loading-card {
  border: 1px solid rgba(255, 255, 255, 10%) !important;
  backdrop-filter: blur(20px) !important;
  box-shadow: 0 32px 64px rgba(0, 0, 0, 20%) !important;
}

.loading-avatar {
  animation: pulse 2s ease-in-out infinite;
  box-shadow: 0 0 20px rgba(25, 118, 210, 30%);
}

.loading-progress {
  position: relative;
  overflow: hidden;
}

.step-icon {
  transition: all 0.3s ease;
}

.tip-card {
  animation: fadeInUp 0.5s ease-out;
}

.tip-text {
  animation: typewriter 0.5s ease-out;
}

@keyframes pulse {

  0%,
  100% {
    box-shadow: 0 0 20px rgba(25, 118, 210, 30%);
    transform: scale(1);
  }

  50% {
    box-shadow: 0 0 30px rgba(25, 118, 210, 50%);
    transform: scale(1.05);
  }
}

@keyframes bounce {

  0%,
  20%,
  50%,
  80%,
  100% {
    transform: translateY(0);
  }

  40% {
    transform: translateY(-5px);
  }

  60% {
    transform: translateY(-3px);
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes typewriter {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}
</style>
