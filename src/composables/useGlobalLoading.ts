import { computed, nextTick, readonly, ref } from "vue"

interface ProgressMetadata {
  sheet: number
  chunk: number
  processed_rows: number
  total_rows: number
  total_records: number
  processed_records: number
  general_progress: number
  subjects_processed: number
}

interface ProgressData {
  batch_id: string
  progress: number
  current_student: string
  current_action: string
  metadata: ProgressMetadata
  timestamp: string
  general_progress: number
}

type Strategy = "polling" | "sse"

// Estado global compartido
const isLoading = ref(false)
const strategy = ref<Strategy>("sse")
const connectionStatus = ref("disconnected")
const lastUpdateTime = ref<string>("")
const messagesReceived = ref(0)
const isMinimized = ref(false)

const progressData = ref<ProgressData>({
  batch_id: "",
  progress: 0,
  current_student: "Iniciando proceso...",
  current_action: "Preparando importación",
  metadata: {
    sheet: 0,
    chunk: 0,
    processed_rows: 0,
    total_rows: 0,
    total_records: 0,
    processed_records: 0,
    general_progress: 0,
    subjects_processed: 0,
  },
  timestamp: "",
  general_progress: 0,
})

// Variables para conexiones
let pollingInterval: NodeJS.Timeout | null = null
let eventSource: EventSource | null = null
let reconnectAttempts = 0
const maxReconnectAttempts = 5
let reconnectTimeout: NodeJS.Timeout | null = null
let saveInterval: NodeJS.Timeout | null = null

// Callbacks para eventos
const callbacks = {
  completed: [] as Array<() => void>,
  error: [] as Array<(error: any) => void>,
  progressUpdated: [] as Array<(progress: number) => void>,
  strategyChanged: [] as Array<(strategy: Strategy) => void>,
}

// Función para obtener BASE_BACK_API dinámicamente
const getBaseApi = () => {
  // Intentar obtener de diferentes fuentes posibles
  if (typeof window !== "undefined") {
    // @ts-ignore - Buscar en window global
    if (window.BASE_BACK_API) return window.BASE_BACK_API

    // @ts-ignore - Buscar en configuración de Vite
    if (import.meta.env?.VITE_API_URL) return import.meta.env.VITE_API_URL

    // Fallback: construir desde la URL actual
    const { protocol, hostname, port } = window.location
    const portSuffix = port && port !== "80" && port !== "443" ? `:${port}` : ""
    return `${protocol}//${hostname}${portSuffix}/api`
  }

  // Fallback para SSR
  return "/api"
}

// ==================== POLLING STRATEGY ====================
const pollProgress = async (batchId: string) => {
  try {
    connectionStatus.value = "connecting"

    const url = `${BASE_BACK_API}/batch-status/${batchId}`
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    connectionStatus.value = "connected"

    if (data.progress_data) {
      updateProgressData(data.progress_data)
    }
  } catch (error) {
    console.error("❌ Error polling progress:", error)
    connectionStatus.value = "error"

    if (isLoading.value) {
      setTimeout(() => {
        if (isLoading.value) {
          pollProgress(batchId)
        }
      }, 5000)
    }
  }
}

const startPolling = (batchId: string) => {
  console.log(`🔄 [POLLING] Starting for batch: ${batchId}`)
  connectionStatus.value = "connecting"

  pollProgress(batchId)
  pollingInterval = setInterval(() => {
    if (isLoading.value) {
      pollProgress(batchId)
    }
  }, 2000)
}

const stopPolling = () => {
  if (pollingInterval) {
    console.log("🛑 [POLLING] Stopping")
    clearInterval(pollingInterval)
    pollingInterval = null
    connectionStatus.value = "disconnected"
  }
}

// ==================== SERVER-SENT EVENTS STRATEGY ====================
const startSSE = (batchId: string) => {
  console.log(`📡 [SSE] Starting for batch: ${batchId}`)
  connectionStatus.value = "connecting"
  messagesReceived.value = 0

  const url = `${BASE_BACK_API}/progress/${batchId}`
  console.log("📡 SSE URL:", url)

  try {
    eventSource = new EventSource(url)

    eventSource.addEventListener("message", (event) => {
      handleSSEMessage(event)
    })

    eventSource.addEventListener("progress", (event) => {
      handleSSEMessage(event)
    })

    eventSource.addEventListener("heartbeat", (event) => {
      console.log("💓 [SSE] Heartbeat event:", event)
      messagesReceived.value++
      connectionStatus.value = "connected"
    })

    eventSource.onopen = (event) => {
      console.log("✅ [SSE] Connection opened:", event)
      connectionStatus.value = "connected"
      reconnectAttempts = 0
      messagesReceived.value++
    }

    eventSource.onerror = (error) => {
      console.error("❌ [SSE] Connection error:", error)

      if (eventSource?.readyState === EventSource.CLOSED) {
        console.log("🔒 [SSE] Connection closed by server")
        connectionStatus.value = "disconnected"
        return
      }

      connectionStatus.value = "error"

      if (isLoading.value && reconnectAttempts < maxReconnectAttempts) {
        reconnectAttempts++
        const delay = Math.min(1000 * Math.pow(2, reconnectAttempts), 30000)

        console.log(`🔄 [SSE] Attempting reconnect ${reconnectAttempts}/${maxReconnectAttempts} in ${delay}ms`)
        connectionStatus.value = "reconnecting"

        reconnectTimeout = setTimeout(() => {
          if (isLoading.value) {
            stopSSE()
            startSSE(batchId)
          }
        }, delay)
      }
    }
  } catch (error) {
    console.error("❌ [SSE] Error creating EventSource:", error)
    connectionStatus.value = "error"
  }
}

const handleSSEMessage = (event: MessageEvent) => {
  try {
    messagesReceived.value++
    connectionStatus.value = "connected"
    reconnectAttempts = 0

    if (!event.data) return

    const data = JSON.parse(event.data)

    if (data.type === "heartbeat") {
      console.log("💓 [SSE] Heartbeat received")
      return
    }

    if (data.type === "progress" || !data.type) {
      updateProgressData(data)
    }

    if (data.type === "completed") {
      if (data.final_progress) {
        updateProgressData(data.final_progress)
      }
    }
  } catch (error) {
    console.error("❌ [SSE] Error handling message:", error)
  }
}

const stopSSE = () => {
  if (eventSource) {
    console.log("🛑 [SSE] Stopping")
    eventSource.close()
    eventSource = null
  }

  if (reconnectTimeout) {
    clearTimeout(reconnectTimeout)
    reconnectTimeout = null
  }

  connectionStatus.value = "disconnected"
  reconnectAttempts = 0
}

// ==================== SHARED FUNCTIONS ====================
const updateProgressData = (newData: any) => {
  const updatedData = {
    batch_id: newData.batch_id || progressData.value.batch_id,
    progress: newData.progress || 0,
    current_student: newData.current_student || "Procesando...",
    current_action: newData.current_action || "Importando datos",
    metadata: {
      sheet: newData.metadata?.sheet || 0,
      chunk: newData.metadata?.chunk || 0,
      processed_rows: newData.metadata?.processed_rows || 0,
      total_rows: newData.metadata?.total_rows || 0,
      total_records: newData.metadata?.total_records || 0,
      processed_records: newData.metadata?.processed_records || 0,
      general_progress: newData.metadata?.general_progress || 0,
      subjects_processed: newData.metadata?.subjects_processed || 0,
    },
    timestamp: newData.timestamp || new Date().toISOString(),
    general_progress: newData.metadata?.general_progress || 0,
  }

  progressData.value = updatedData
  lastUpdateTime.value = new Date().toLocaleTimeString()

  nextTick(() => {
    const currentProg = updatedData.metadata.general_progress

    // Ejecutar callbacks
    callbacks.progressUpdated.forEach((callback) => callback(currentProg))

    if (updatedData.metadata.general_progress >= 100) {
      console.log(`✅ [${strategy.value.toUpperCase()}] Progress completed!`)
      setTimeout(() => {
        stopLoading()
        callbacks.completed.forEach((callback) => callback())
      }, 1500)
    }
  })
}

// Funciones de conexión unificadas
const startConnection = (batchId: string) => {
  console.log(`🚀 Starting connection with ${strategy.value} strategy`)
  if (strategy.value === "polling") {
    startPolling(batchId)
  } else {
    startSSE(batchId)
  }
}

const stopConnection = () => {
  console.log("🛑 Stopping all connections")
  stopPolling()
  stopSSE()
}

// ==================== PERSISTENCE ====================
const saveState = () => {
  if (isLoading.value && progressData.value.batch_id) {
    const state = {
      batchId: progressData.value.batch_id,
      strategy: strategy.value,
      isMinimized: isMinimized.value,
      progressData: progressData.value,
      timestamp: Date.now(),
    }
    localStorage.setItem("importProgress", JSON.stringify(state))
  }
}

const loadState = () => {
  const saved = localStorage.getItem("importProgress")
  if (saved) {
    try {
      const state = JSON.parse(saved)
      if (Date.now() - state.timestamp < 3600000) {
        progressData.value = state.progressData
        strategy.value = state.strategy
        isMinimized.value = state.isMinimized

        if (state.progressData.metadata.general_progress < 100) {
          isLoading.value = true
          startConnection(state.batchId)
        }
      } else {
        localStorage.removeItem("importProgress")
      }
    } catch (error) {
      console.error("Error loading saved state:", error)
      localStorage.removeItem("importProgress")
    }
  }
}

const clearState = () => {
  localStorage.removeItem("importProgress")
}

const startStateSaving = () => {
  saveInterval = setInterval(saveState, 5000)
}

const stopStateSaving = () => {
  if (saveInterval) {
    clearInterval(saveInterval)
    saveInterval = null
  }
}

// ==================== PUBLIC API ====================
const startLoading = (batchId: string, selectedStrategy: Strategy = "sse") => {
  console.log(`🚀 Starting loading with ${selectedStrategy} strategy for batch: ${batchId}`)

  strategy.value = selectedStrategy
  isLoading.value = true
  progressData.value.batch_id = batchId

  // Resetear progreso
  progressData.value.metadata.general_progress = 0
  progressData.value.metadata.processed_records = 0
  progressData.value.progress = 0
  lastUpdateTime.value = ""
  messagesReceived.value = 0
  isMinimized.value = false

  startConnection(batchId)
  startStateSaving()
}

const stopLoading = () => {
  console.log("🛑 Stopping loading")
  isLoading.value = false
  stopConnection()
  stopStateSaving()
  clearState()
}

const changeStrategy = (newStrategy: Strategy) => {
  strategy.value = newStrategy
  callbacks.strategyChanged.forEach((callback) => callback(newStrategy))
}

// Event listeners
const onCompleted = (callback: () => void) => {
  callbacks.completed.push(callback)
}

const onError = (callback: (error: any) => void) => {
  callbacks.error.push(callback)
}

const onProgressUpdated = (callback: (progress: number) => void) => {
  callbacks.progressUpdated.push(callback)
}

const onStrategyChanged = (callback: (strategy: Strategy) => void) => {
  callbacks.strategyChanged.push(callback)
}

// Cleanup function
const cleanup = () => {
  saveState()
  stopConnection()
  stopStateSaving()
}

// Computed para debug info
const debugInfo = computed(() => ({
  strategy: strategy.value,
  connectionStatus: connectionStatus.value,
  batchId: progressData.value.batch_id,
  processedRecords: progressData.value.metadata.processed_records,
  totalRecords: progressData.value.metadata.total_records,
  currentStudent: progressData.value.current_student,
  lastUpdate: lastUpdateTime.value,
  sheet: progressData.value.metadata.sheet,
  chunk: progressData.value.metadata.chunk,
}))

// Computed para el progreso actual
const currentProgress = computed(() => {
  let progress = progressData.value.metadata?.general_progress || 0

  if (progress === 0) {
    const { processed_records, total_records } = progressData.value.metadata || {}
    if (total_records && total_records > 0) {
      progress = Math.round((processed_records / total_records) * 100)
    }
  }

  if (progress === 0) {
    progress = progressData.value.progress || 0
  }

  return Math.min(100, Math.max(0, progress))
})

// Instancia global singleton
let globalInstance: any = null

// Función principal del composable
export function useGlobalLoading() {
  return {
    // Estado
    isLoading: readonly(isLoading),
    progressData: readonly(progressData),
    currentProgress,
    debugInfo,
    strategy: readonly(strategy),
    connectionStatus: readonly(connectionStatus),
    isMinimized: readonly(isMinimized),

    // Funciones
    startLoading,
    stopLoading,
    changeStrategy,
    loadState,
    cleanup,

    // Event listeners
    onCompleted,
    onError,
    onProgressUpdated,
    onStrategyChanged,

    // Control de minimizado
    minimize: () => {
      isMinimized.value = true
    },
    restore: () => {
      isMinimized.value = false
    },
  }
}

// Función para obtener la instancia global (CORREGIDA)
export function getGlobalLoadingInstance() {
  if (!globalInstance) {
    globalInstance = useGlobalLoading()
  }
  return globalInstance
}
