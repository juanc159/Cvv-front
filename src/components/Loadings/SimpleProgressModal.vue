<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';

const emit = defineEmits(["completed", "minimized"])

const props = defineProps({
  batchId: {
    type: String,
    required: true,
  },
  show: {
    type: Boolean,
    default: true
  }
});

const progressValue = ref<number>(0)
const currentStudent = ref<string>('Iniciando...')
const currentAction = ref<string>('Preparando importación')
const isMinimized = ref<boolean>(false)
const isConnected = ref<boolean>(false)
const pollingInterval = ref<NodeJS.Timeout | null>(null)

onMounted(() => {
  console.log(`🔌 [SIMPLE] Iniciando conexión para batch: ${props.batchId}`)

  // ✅ INICIAR POLLING INMEDIATAMENTE
  startPolling()

  // ✅ CONECTAR WEBSOCKET CON DELAY
  setTimeout(() => {
    connectWebSocket()
  }, 1000) // Dar tiempo al backend para crear el batch
})

onUnmounted(() => {
  console.log(`🛑 [SIMPLE] Limpiando conexiones`)
  stopPolling()
  disconnectWebSocket()
})

// ✅ POLLING COMO RESPALDO
const startPolling = () => {
  console.log(`🔄 [POLLING] Iniciando polling para ${props.batchId}`)

  pollingInterval.value = setInterval(async () => {
    try {
      const response = await fetch(`/api/import-progress/${props.batchId}`)
      if (response.ok) {
        const data = await response.json()
        console.log(`📊 [POLLING] Datos recibidos:`, data)

        if (data.progress !== undefined) {
          updateProgress(data)

          // Si WebSocket no está conectado y tenemos datos, seguir con polling
          if (!isConnected.value) {
            console.log(`🔄 [POLLING] WebSocket no conectado, continuando con polling`)
          }
        }
      }
    } catch (error) {
      console.error(`❌ [POLLING] Error:`, error)
    }
  }, 2000) // Cada 2 segundos
}

const stopPolling = () => {
  if (pollingInterval.value) {
    console.log(`🛑 [POLLING] Deteniendo polling`)
    clearInterval(pollingInterval.value)
    pollingInterval.value = null
  }
}

// ✅ WEBSOCKET CON RECONEXIÓN
const connectWebSocket = () => {
  console.log(`🔌 [WEBSOCKET] Conectando a canal: import.progress.${props.batchId}`)

  try {
    const channel = window.Echo.channel(`import.progress.${props.batchId}`)

    channel.listen('.progress.update', (event: any) => {
      console.log(`🔥 [WEBSOCKET] Evento recibido:`, event)
      isConnected.value = true
      updateProgress(event)

      // Si WebSocket funciona, reducir frecuencia de polling
      if (pollingInterval.value) {
        stopPolling()
        // Polling más lento como respaldo
        pollingInterval.value = setInterval(async () => {
          try {
            const response = await fetch(`/api/import-progress/${props.batchId}`)
            if (response.ok) {
              const data = await response.json()
              if (data.progress !== undefined) {
                updateProgress(data)
              }
            }
          } catch (error) {
            console.error(`❌ [POLLING-BACKUP] Error:`, error)
          }
        }, 10000) // Cada 10 segundos como respaldo
      }
    })

    channel.subscribed(() => {
      console.log(`✅ [WEBSOCKET] Conectado al canal import.progress.${props.batchId}`)
      isConnected.value = true
    })

    channel.error((error: any) => {
      console.error(`❌ [WEBSOCKET] Error en canal:`, error)
      isConnected.value = false

      // Si WebSocket falla, intensificar polling
      stopPolling()
      startPolling()
    })

  } catch (error) {
    console.error(`❌ [WEBSOCKET] Error conectando:`, error)
    isConnected.value = false
  }
}

const disconnectWebSocket = () => {
  try {
    window.Echo.leaveChannel(`import.progress.${props.batchId}`)
  } catch (error) {
    console.error(`❌ [WEBSOCKET] Error desconectando:`, error)
  }
}

// ✅ FUNCIÓN UNIFICADA PARA ACTUALIZAR PROGRESO
const updateProgress = (data: any) => {
  // Extraer progreso
  let progress = 0
  if (data.metadata?.general_progress !== undefined) {
    progress = data.metadata.general_progress
  } else if (data.progress !== undefined) {
    progress = data.progress
  }

  const newProgress = Math.min(100, Math.max(0, progress))

  // Solo actualizar si hay cambio significativo
  if (Math.abs(newProgress - progressValue.value) >= 1 || newProgress === 100) {
    progressValue.value = newProgress
    currentStudent.value = data.current_student || 'Procesando...'
    currentAction.value = data.current_action || 'Importando datos'

    console.log(`✅ [UPDATE] Progreso actualizado: ${progressValue.value}%`)

    if (progressValue.value >= 100) {
      console.log(`🎉 [UPDATE] ¡COMPLETADO!`)
      stopPolling()
      emit("completed")
      setTimeout(() => {
        progressValue.value = 0
      }, 3000);
    }
  }
}

const minimize = () => {
  isMinimized.value = true
  emit("minimized")
}

const restore = () => {
  isMinimized.value = false
}
</script>

<template>
  <!-- Modal Principal -->
  <v-overlay v-if="show && !isMinimized" :model-value="true" class="loading-overlay d-flex align-center justify-center"
    :opacity="0.95" :z-index="9999">
    <v-card class="loading-card" elevation="24" rounded="xl" min-width="400" width="90%">
      <v-card-text class="pa-6">
        <!-- Header -->
        <div class="text-center mb-4">
          <v-avatar size="60" class="loading-avatar mb-3" color="primary">
            <v-icon size="30" icon="tabler-upload" color="white" />
          </v-avatar>
          <h2 class="text-h6 font-weight-bold mb-2">
            {{ currentAction }}
          </h2>
          <p class="text-body-2 text-medium-emphasis">
            {{ currentStudent }}
          </p>
        </div>

        <!-- Progress Section -->
        <div class="progress-section mb-4">
          <div class="d-flex justify-space-between align-center mb-2">
            <span class="text-body-2 font-weight-medium">
              Progreso
            </span>
            <span class="text-body-2 font-weight-bold text-primary">
              {{ Math.round(progressValue) }}%
            </span>
          </div>
          <v-progress-linear :model-value="progressValue" height="8" rounded color="primary" class="loading-progress">
          </v-progress-linear>
        </div>

        <!-- Connection Status -->
        <div class="text-center mb-3">
          <v-chip :color="isConnected ? 'success' : 'warning'" size="small">
            <v-icon start :icon="isConnected ? 'tabler-wifi' : 'tabler-refresh'" />
            {{ isConnected ? 'WebSocket conectado' : 'Usando polling' }}
          </v-chip>
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

  <!-- Estado Minimizado -->
  <div v-else-if="show && isMinimized" class="minimized-overlay">
    <v-card class="minimized-card" @click="restore">
      <v-progress-circular :model-value="progressValue" color="primary" size="40" width="3">
        {{ Math.round(progressValue) }}%
      </v-progress-circular>
      <div class="minimized-info ms-3">
        <div class="text-caption font-weight-medium">Importando...</div>
        <div class="text-caption text-medium-emphasis">
          {{ Math.round(progressValue) }}% completado
        </div>
      </div>
      <v-icon class="minimize-icon ms-2" icon="tabler-chevron-up" @click.stop="restore" />
    </v-card>
  </div>
</template>

<style scoped>
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

.minimized-overlay {
  position: fixed;
  z-index: 9999;
  bottom: 20px;
  right: 20px;
}

.minimized-card {
  display: flex;
  align-items: center;
  border-radius: 24px;
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 15%);
  cursor: pointer;
  padding: 8px 16px;
  transition: all 0.3s ease;
  min-width: 200px;
}

.minimized-card:hover {
  box-shadow: 0 6px 16px rgba(0, 0, 0, 20%);
  transform: translateY(-3px);
}

.minimized-info {
  flex: 1;
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
</style>
