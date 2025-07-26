<template>
  <v-overlay v-if="!isMinimized && isLoading" :model-value="isLoading"
    class="loading-overlay d-flex align-center justify-center" :persistent="false" :opacity="0.95" :z-index="9999">
    <v-card class="loading-card" elevation="24" rounded="xl" min-width="500" width="90%">
      <v-card-text class="pa-8">
        <!-- Header with animated icon -->
        <div class="text-center mb-6">
          <v-avatar size="80" class="loading-avatar mb-4" :color="theme.current.value.colors.primary">
            <v-icon size="40" :icon="currentIcon" class="loading-icon" color="white" />
          </v-avatar>
          <h2 class="text-h5 font-weight-bold mb-2">
            {{ currentTitle }}
          </h2>
          <p class="text-body-1 text-medium-emphasis">
            {{ currentSubtitle }}
          </p>
        </div>

        <!-- Progress Section -->
        <div class="progress-section mb-6">
          <div class="d-flex justify-space-between align-center mb-2">
            <span class="text-body-2 font-weight-medium">
              Progreso
            </span>
            <div class="d-flex align-center gap-2">
              <span class="text-body-2 font-weight-bold text-primary">
                {{ Math.round(clampedProgress) }}%
              </span>
              <!-- Botón para mostrar/ocultar debug -->
              <v-btn v-if="showDebugToggle" size="x-small" variant="text"
                :icon="showDebugInfo ? 'tabler-eye-off' : 'tabler-eye'" @click="toggleDebugInfo"
                :color="theme.current.value.colors.primary">
              </v-btn>
            </div>
          </div>
          <v-progress-linear :model-value="clampedProgress" height="8" rounded
            :color="theme.current.value.colors.primary" :bg-color="theme.current.value.colors.surface"
            class="loading-progress">
            <template v-slot:default="{ value }">
              <div class="progress-shimmer" :style="{ width: `${value}%` }"></div>
            </template>
          </v-progress-linear>
        </div>

        <!-- Debug Info Section (Integrado) -->
        <v-expand-transition>
          <v-card v-if="showDebugInfo && debugData" variant="outlined" class="mb-6" rounded="lg">
            <v-card-title class="text-body-1 py-3">
              <v-icon icon="tabler-bug" class="me-2" size="20" />
              Información Detallada
            </v-card-title>
            <v-card-text class="py-3">
              <v-row dense>
                <v-col cols="6" sm="4">
                  <div class="text-caption text-medium-emphasis">Estrategia</div>
                  <div class="text-body-2 font-weight-medium">{{ debugData.strategy?.toUpperCase() }}</div>
                </v-col>
                <v-col cols="6" sm="4">
                  <div class="text-caption text-medium-emphasis">Conexión</div>
                  <v-chip size="x-small" :color="getConnectionColor(debugData.connectionStatus)">
                    {{ debugData.connectionStatus }}
                  </v-chip>
                </v-col>
                <v-col cols="6" sm="4">
                  <div class="text-caption text-medium-emphasis">Batch ID</div>
                  <div class="text-body-2 font-weight-medium text-truncate">{{ debugData.batchId || 'N/A' }}</div>
                </v-col>
                <v-col cols="6" sm="4">
                  <div class="text-caption text-medium-emphasis">Procesados</div>
                  <div class="text-body-2 font-weight-medium">{{ debugData.processedRecords || 0 }}</div>
                </v-col>
                <v-col cols="6" sm="4">
                  <div class="text-caption text-medium-emphasis">Total</div>
                  <div class="text-body-2 font-weight-medium">{{ debugData.totalRecords || 0 }}</div>
                </v-col>
                <v-col cols="6" sm="4">
                  <div class="text-caption text-medium-emphasis">Hoja/Chunk</div>
                  <div class="text-body-2 font-weight-medium">{{ debugData.sheet || 0 }}/{{ debugData.chunk || 0 }}
                  </div>
                </v-col>
              </v-row>
              <v-divider class="my-3" />
              <div class="text-caption text-medium-emphasis mb-1">Estudiante Actual</div>
              <div class="text-body-2">{{ debugData.currentStudent || 'N/A' }}</div>
              <div class="text-caption text-medium-emphasis mt-2 mb-1">Última Actualización</div>
              <div class="text-body-2">{{ debugData.lastUpdate || 'Nunca' }}</div>
            </v-card-text>
          </v-card>
        </v-expand-transition>

        <!-- Loading Steps -->
        <div class="loading-steps mb-6">
          <v-list class="pa-0" bg-color="transparent">
            <v-list-item v-for="(step, index) in loadingSteps" :key="index" class="px-0 py-1" density="compact">
              <template v-slot:prepend>
                <v-icon :icon="getStepIcon(index)" :color="getStepColor(index)" size="20" class="step-icon"
                  :class="{ 'spin-animation': index === currentStepIndex }" />
              </template>
              <v-list-item-title class="text-body-2" :class="getStepTextClass(index)">
                {{ step }}
              </v-list-item-title>
            </v-list-item>
          </v-list>
        </div>

        <!-- Tips Section -->
        <v-card v-if="showTips && currentTip" variant="tonal" class="tip-card" rounded="lg">
          <v-card-text class="pa-4">
            <div class="d-flex align-center">
              <v-icon icon="tabler-bulb" :color="theme.current.value.colors.warning" class="me-3" size="20" />
              <span class="text-body-2 tip-text">
                {{ currentTip }}
              </span>
            </div>
          </v-card-text>
        </v-card>

        <!-- Action Buttons -->
        <div class="text-center mt-6">
          <v-btn variant="text" :color="theme.current.value.colors.primary" @click="minimize" class="me-2">
            <v-icon start icon="tabler-window-minimize" />
            Minimizar
          </v-btn>
        </div>
      </v-card-text>
    </v-card>
  </v-overlay>

  <!-- Minimized State -->
  <div v-else-if="isMinimized && isLoading" class="minimized-overlay">
    <v-card class="minimized-card" @click="restore">
      <v-progress-circular :model-value="clampedProgress" :color="theme.current.value.colors.primary" size="40"
        width="3">
        {{ Math.round(clampedProgress) }}%
      </v-progress-circular>
      <div class="minimized-info ms-3">
        <div class="text-caption font-weight-medium">{{ minimizedTitle }}</div>
        <div class="text-caption text-medium-emphasis">{{ debugData?.processedRecords || 0 }}/{{ debugData?.totalRecords
          || 0 }}</div>
      </div>
      <v-icon class="minimize-icon ms-2" icon="tabler-chevron-up" @click.stop="restore" />
    </v-card>
  </div>

  <!-- Notification Snackbar para cuando está minimizado -->
  <v-snackbar v-model="showCompletionNotification" :timeout="5000" color="success" location="top">
    <v-icon start icon="tabler-check" />
    ¡Importación completada exitosamente!
    <template v-slot:actions>
      <v-btn variant="text" @click="showCompletionNotification = false">
        Cerrar
      </v-btn>
    </template>
  </v-snackbar>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue';
import { useTheme } from 'vuetify';

const theme = useTheme()

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
  showActions: {
    type: Boolean,
    default: false
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

const emit = defineEmits(['minimize', 'minimized', 'restored', 'completed'])

// Estado local
const currentTipIndex = ref(0)
const currentStepIndex = ref(0)
const isMinimized = ref(false)
const showDebugInfo = ref(false)
const showCompletionNotification = ref(false)
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
const clampedProgress = computed(() => {
  return Math.max(0, Math.min(100, props.progress))
})

const currentTitle = computed(() => {
  const progress = clampedProgress.value
  if (progress < 20) return props.title
  if (progress < 40) return 'Cargando recursos...'
  if (progress < 60) return 'Procesando datos...'
  if (progress < 80) return 'Casi terminado...'
  if (progress < 95) return 'Finalizando...'
  return '¡Completado!'
})

const currentSubtitle = computed(() => {
  const progress = clampedProgress.value
  if (progress < 20) return props.subtitle
  if (progress < 40) return 'Descargando componentes necesarios'
  if (progress < 60) return 'Organizando la información'
  if (progress < 80) return 'Aplicando configuraciones finales'
  if (progress < 95) return 'Preparando la experiencia'
  return 'Todo está listo para usar'
})

const currentIcon = computed(() => {
  const progress = clampedProgress.value
  if (progress < 20) return 'tabler-download'
  if (progress < 40) return 'tabler-settings'
  if (progress < 60) return 'tabler-database'
  if (progress < 80) return 'tabler-layers-intersect'
  if (progress < 95) return 'tabler-circle-check'
  return 'tabler-checks'
})

const currentTip = computed(() => {
  return props.tips[currentTipIndex.value] || ''
})

const loadingSteps = computed(() => props.steps)

const minimizedTitle = computed(() => {
  const progress = clampedProgress.value
  if (progress < 50) return 'Procesando...'
  if (progress < 90) return 'Casi listo...'
  return 'Finalizando...'
})

// Métodos para los pasos
const getStepIcon = (index: number) => {
  if (index < currentStepIndex.value) return 'tabler-circle-check'
  if (index === currentStepIndex.value) return 'tabler-loader'
  return 'tabler-circle'
}

const getStepColor = (index: number) => {
  if (index < currentStepIndex.value) return theme.current.value.colors.success
  if (index === currentStepIndex.value) return theme.current.value.colors.primary
  return theme.current.value.colors.secondary
}

const getStepTextClass = (index: number) => {
  if (index < currentStepIndex.value) return 'text-success font-weight-medium'
  if (index === currentStepIndex.value) return 'text-primary font-weight-medium'
  return 'text-medium-emphasis'
}

// Watchers
watch(() => props.progress, (newProgress) => {
  const stepProgress = Math.floor((newProgress / 100) * props.steps.length)
  currentStepIndex.value = Math.min(stepProgress, props.steps.length - 1)

  // Si llega al 100% y está minimizado, mostrar notificación
  if (newProgress >= 100 && isMinimized.value) {
    showCompletionNotification.value = true
    emit('completed')
  }
})

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
let mounted = false

onMounted(() => {
  mounted = true
  startTipRotation()
})

onUnmounted(() => {
  mounted = false
  stopTipRotation()
})

watch(() => props.isLoading, (newValue) => {
  if (mounted) {
    if (newValue) {
      startTipRotation()
    } else {
      stopTipRotation()
    }
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
/* Mantener todos los estilos existentes */
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
  block-size: 100vh !important;
  inline-size: 100vw !important;
  inset-block-start: 0 !important;
  inset-inline-start: 0 !important;
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

.loading-icon {
  animation: bounce 1.5s ease-in-out infinite;
}

.loading-progress {
  position: relative;
  overflow: hidden;
}

.progress-shimmer {
  position: absolute;
  animation: shimmer 2s infinite;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 40%), transparent);
  block-size: 100%;
  inset-block-start: 0;
  inset-inline-start: 0;
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

.minimized-overlay {
  position: fixed;
  z-index: 9999;
  inset-block-end: 20px;
  inset-inline-end: 20px;
}

.minimized-card {
  display: flex;
  align-items: center;
  border-radius: 24px;
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 15%);
  cursor: pointer;
  padding-block: 8px;
  padding-inline: 16px;
  transition: all 0.3s ease;
  min-width: 200px;
}

.minimized-card:hover {
  box-shadow: 0 6px 16px rgba(0, 0, 0, 20%);
  transform: translateY(-3px);
}

.minimize-icon {
  transition: transform 0.3s ease;
}

.minimized-card:hover .minimize-icon {
  transform: translateY(-2px);
}

.minimized-info {
  flex: 1;
}

/* Animations */
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

@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }

  100% {
    transform: translateX(100%);
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

/* Dark/Light mode styles */
.v-theme--dark .loading-card {
  border: 1px solid rgba(255, 255, 255, 5%);
  background: rgba(30, 30, 30, 95%) !important;
}

.v-theme--dark .progress-shimmer {
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 10%), transparent);
}

.v-theme--dark .minimized-card {
  border: 1px solid rgba(255, 255, 255, 10%);
  background: rgba(30, 30, 30, 80%);
}

.v-theme--light .loading-card {
  border: 1px solid rgba(0, 0, 0, 5%);
  background: rgba(255, 255, 255, 95%) !important;
}

.v-theme--light .progress-shimmer {
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 60%), transparent);
}

.v-theme--light .minimized-card {
  border: 1px solid rgba(0, 0, 0, 10%);
  background: rgba(255, 255, 255, 80%);
}
</style>
