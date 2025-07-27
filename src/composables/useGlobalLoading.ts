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

interface ImportProcess {
  batch_id: string
  progress_data: ProgressData
  strategy: Strategy
  status: "active" | "completed" | "error" | "paused"
  started_at: string
  completed_at?: string
  file_name?: string
  user_id?: string
  connection_status: string
  event_source?: EventSource
  polling_interval?: NodeJS.Timeout
  reconnect_attempts?: number // NUEVO: Contador de reconexiones
}

type Strategy = "polling" | "sse"

// Estado global para múltiples procesos
const activeProcesses = ref<Map<string, ImportProcess>>(new Map())
const currentActiveProcess = ref<string | null>(null)
const isMinimized = ref(false)
const showProcessList = ref(false)

// Variables para reconexión mejoradas
const maxReconnectAttempts = 3 // REDUCIDO: de 5 a 3
let saveInterval: NodeJS.Timeout | null = null

// Variables de control de inicialización
let isInitialized = false
let autoLoadEnabled = false

// Callbacks para eventos
const callbacks = {
  completed: [] as Array<(batchId: string) => void>,
  error: [] as Array<(batchId: string, error: any) => void>,
  progressUpdated: [] as Array<(batchId: string, progress: number) => void>,
  strategyChanged: [] as Array<(strategy: Strategy) => void>,
  processAdded: [] as Array<(batchId: string) => void>,
  processRemoved: [] as Array<(batchId: string) => void>,
}

// Función para obtener BASE_BACK_API
const getBaseApi = () => {
  return BASE_BACK_API
}

// ==================== POLLING STRATEGY ====================
const pollProgress = async (batchId: string) => {
  const process = activeProcesses.value.get(batchId)
  if (!process) return

  try {
    process.connection_status = "connecting"

    const url = `${getBaseApi()}/batch-status/${batchId}`
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
    process.connection_status = "connected"
    process.reconnect_attempts = 0 // Reset contador

    if (data.progress_data) {
      updateProgressData(batchId, data.progress_data)
    }
  } catch (error) {
    console.error(`❌ Error polling progress for ${batchId}:`, error)
    process.connection_status = "error"

    if (process.status === "active") {
      setTimeout(() => {
        if (activeProcesses.value.has(batchId)) {
          pollProgress(batchId)
        }
      }, 5000)
    }
  }
}

const startPolling = (batchId: string) => {
  const process = activeProcesses.value.get(batchId)
  if (!process) return

  console.log(`🔄 [POLLING] Starting for batch: ${batchId}`)
  process.connection_status = "connecting"
  process.reconnect_attempts = 0

  pollProgress(batchId)
  process.polling_interval = setInterval(() => {
    if (activeProcesses.value.has(batchId) && process.status === "active") {
      pollProgress(batchId)
    }
  }, 2000)
}

const stopPolling = (batchId: string) => {
  const process = activeProcesses.value.get(batchId)
  if (!process) return

  if (process.polling_interval) {
    console.log(`🛑 [POLLING] Stopping for ${batchId}`)
    clearInterval(process.polling_interval)
    process.polling_interval = undefined
    process.connection_status = "disconnected"
  }
}

// ==================== SERVER-SENT EVENTS STRATEGY (MEJORADO) ====================
const startSSE = (batchId: string) => {
  const process = activeProcesses.value.get(batchId)
  if (!process) return

  console.log(`📡 [SSE] Starting for batch: ${batchId}`)
  process.connection_status = "connecting"
  process.reconnect_attempts = process.reconnect_attempts || 0

  const url = `${getBaseApi()}/progress/${batchId}`
  console.log(`📡 SSE URL for ${batchId}:`, url)

  try {
    const eventSource = new EventSource(url)
    process.event_source = eventSource

    eventSource.addEventListener("message", (event) => {
      handleSSEMessage(batchId, event)
    })

    eventSource.addEventListener("progress", (event) => {
      handleSSEMessage(batchId, event)
    })

    eventSource.addEventListener("heartbeat", (event) => {
      console.log(`💓 [SSE] Heartbeat for ${batchId}`)
      process.connection_status = "connected"
      process.reconnect_attempts = 0
    })

    eventSource.addEventListener("timeout", (event) => {
      console.log(`⏰ [SSE] Timeout event for ${batchId}, switching to polling`)
      stopSSE(batchId)
      // Cambiar automáticamente a polling si SSE tiene problemas
      process.strategy = "polling"
      startPolling(batchId)
    })

    eventSource.addEventListener("error", (event) => {
      console.log(`❌ [SSE] Error event for ${batchId}`)
      handleSSEError(batchId)
    })

    eventSource.onopen = (event) => {
      console.log(`✅ [SSE] Connection opened for ${batchId}`)
      process.connection_status = "connected"
      process.reconnect_attempts = 0
    }

    eventSource.onerror = (error) => {
      console.error(`❌ [SSE] Connection error for ${batchId}:`, error)
      handleSSEError(batchId)
    }
  } catch (error) {
    console.error(`❌ [SSE] Error creating EventSource for ${batchId}:`, error)
    process.connection_status = "error"
    handleSSEError(batchId)
  }
}

const handleSSEError = (batchId: string) => {
  const process = activeProcesses.value.get(batchId)
  if (!process) return

  if (process.event_source?.readyState === EventSource.CLOSED) {
    console.log(`🔒 [SSE] Connection closed by server for ${batchId}`)
    process.connection_status = "disconnected"
    return
  }

  process.connection_status = "error"
  process.reconnect_attempts = (process.reconnect_attempts || 0) + 1

  // Solo reconectar si el loading sigue activo y no hemos excedido los intentos
  if (process.status === "active" && process.reconnect_attempts <= maxReconnectAttempts) {
    const delay = Math.min(1000 * Math.pow(2, process.reconnect_attempts), 10000) // Max 10 segundos

    console.log(
      `🔄 [SSE] Attempting reconnect ${process.reconnect_attempts}/${maxReconnectAttempts} for ${batchId} in ${delay}ms`,
    )
    process.connection_status = "reconnecting"

    setTimeout(() => {
      if (activeProcesses.value.has(batchId) && process.status === "active") {
        stopSSE(batchId)
        startSSE(batchId)
      }
    }, delay)
  } else {
    // Si excedemos los intentos, cambiar a polling
    console.log(`🔄 [SSE] Max reconnect attempts reached for ${batchId}, switching to polling`)
    stopSSE(batchId)
    process.strategy = "polling"
    process.connection_status = "switching"
    startPolling(batchId)
  }
}

const handleSSEMessage = (batchId: string, event: MessageEvent) => {
  const process = activeProcesses.value.get(batchId)
  if (!process) return

  try {
    process.connection_status = "connected"
    process.reconnect_attempts = 0

    if (!event.data) return

    const data = JSON.parse(event.data)

    if (data.type === "heartbeat") {
      console.log(`💓 [SSE] Heartbeat received for ${batchId}`)
      return
    }

    if (data.type === "progress" || !data.type) {
      updateProgressData(batchId, data)
    }

    if (data.type === "completed") {
      if (data.final_progress) {
        updateProgressData(batchId, data.final_progress)
      }
    }

    if (data.type === "timeout") {
      console.log(`⏰ [SSE] Server timeout for ${batchId}, switching to polling`)
      stopSSE(batchId)
      process.strategy = "polling"
      startPolling(batchId)
    }
  } catch (error) {
    console.error(`❌ [SSE] Error handling message for ${batchId}:`, error)
  }
}

const stopSSE = (batchId: string) => {
  const process = activeProcesses.value.get(batchId)
  if (!process || !process.event_source) return

  console.log(`🛑 [SSE] Stopping for ${batchId}`)
  process.event_source.close()
  process.event_source = undefined
  process.connection_status = "disconnected"
}

// ==================== SHARED FUNCTIONS ====================
const updateProgressData = (batchId: string, newData: any) => {
  const process = activeProcesses.value.get(batchId)
  if (!process) return

  const updatedData = {
    batch_id: batchId,
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

  process.progress_data = updatedData

  nextTick(() => {
    const currentProg = updatedData.metadata.general_progress

    // Ejecutar callbacks
    callbacks.progressUpdated.forEach((callback) => callback(batchId, currentProg))

    if (updatedData.metadata.general_progress >= 100) {
      console.log(`✅ [${process.strategy.toUpperCase()}] Process completed for ${batchId}!`)

      process.status = "completed"
      process.completed_at = new Date().toISOString()

      stopConnection(batchId)

      setTimeout(() => {
        callbacks.completed.forEach((callback) => callback(batchId))
      }, 1500)
    }
  })
}

// Funciones de conexión unificadas
const startConnection = (batchId: string) => {
  const process = activeProcesses.value.get(batchId)
  if (!process) return

  console.log(`🚀 Starting connection with ${process.strategy} strategy for ${batchId}`)
  if (process.strategy === "polling") {
    startPolling(batchId)
  } else {
    startSSE(batchId)
  }
}

const stopConnection = (batchId: string) => {
  console.log(`🛑 Stopping connection for ${batchId}`)
  stopPolling(batchId)
  stopSSE(batchId)
}

// ==================== BATCH STATUS VERIFICATION ====================
const verifyBatchStatus = async (batchId: string): Promise<boolean> => {
  try {
    console.log(`🔍 [VERIFY] Checking batch status for: ${batchId}`)

    const url = `${getBaseApi()}/batch-status/${batchId}`
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      console.log(`❌ [VERIFY] Batch ${batchId} not found or error: ${response.status}`)
      return false
    }

    const data = await response.json()

    // Si el batch está completado o no existe, no reconectar
    if (data.status === "completed" || data.status === "not_found") {
      console.log(`✅ [VERIFY] Batch ${batchId} is completed or not found, skipping reconnection`)
      return false
    }

    // Si el progreso está al 100%, no reconectar
    if (data.progress_data?.metadata?.general_progress >= 100) {
      console.log(`✅ [VERIFY] Batch ${batchId} progress is 100%, skipping reconnection`)
      return false
    }

    console.log(`🔄 [VERIFY] Batch ${batchId} is still active, can reconnect`)
    return true
  } catch (error) {
    console.error(`❌ [VERIFY] Error verifying batch ${batchId}:`, error)
    return false
  }
}

// ==================== PERSISTENCE ====================
const saveState = () => {
  if (!autoLoadEnabled) {
    console.log(`🚫 [STORAGE] Auto-load disabled, not saving state`)
    return
  }

  if (activeProcesses.value.size > 0) {
    const state = {
      processes: Array.from(activeProcesses.value.entries()).map(([id, process]) => ({
        batch_id: id,
        progress_data: process.progress_data,
        strategy: process.strategy,
        status: process.status,
        started_at: process.started_at,
        completed_at: process.completed_at,
        file_name: process.file_name,
        user_id: process.user_id,
        connection_status: process.connection_status,
        reconnect_attempts: process.reconnect_attempts,
      })),
      currentActiveProcess: currentActiveProcess.value,
      isMinimized: isMinimized.value,
      showProcessList: showProcessList.value,
      timestamp: Date.now(),
    }
    localStorage.setItem("importProcesses", JSON.stringify(state))
    console.log(`💾 [STORAGE] Saved state with ${activeProcesses.value.size} processes`)
  } else {
    // Si no hay procesos, limpiar el storage
    localStorage.removeItem("importProcesses")
    console.log(`🗑️ [STORAGE] No processes, cleared storage`)
  }
}

const loadState = async () => {
  if (!autoLoadEnabled) {
    console.log(`🚫 [STORAGE] Auto-load disabled, skipping state load`)
    return
  }

  const saved = localStorage.getItem("importProcesses")
  if (!saved) {
    console.log(`📂 [STORAGE] No saved state found`)
    return
  }

  try {
    const state = JSON.parse(saved)
    const now = Date.now()
    const maxAge = 1800000 // 30 minutos (reducido de 1 hora)

    // Verificar si el estado no es muy antiguo
    if (now - state.timestamp > maxAge) {
      console.log(
        `⏰ [STORAGE] Saved state is too old (${Math.round((now - state.timestamp) / 60000)} minutes), clearing`,
      )
      localStorage.removeItem("importProcesses")
      return
    }

    console.log(`📂 [STORAGE] Loading saved state with ${state.processes.length} processes`)

    // Verificar cada proceso antes de restaurarlo
    const validProcesses = []

    for (const processData of state.processes) {
      // Solo verificar procesos que no estén completados
      if (processData.status === "completed" || processData.progress_data.metadata.general_progress >= 100) {
        console.log(`✅ [STORAGE] Process ${processData.batch_id} is completed, adding to list but not reconnecting`)
        validProcesses.push(processData)
        continue
      }

      // Verificar si el batch aún existe y está activo
      const isActive = await verifyBatchStatus(processData.batch_id)

      if (isActive) {
        console.log(`🔄 [STORAGE] Process ${processData.batch_id} is still active, will reconnect`)
        validProcesses.push(processData)
      } else {
        console.log(`❌ [STORAGE] Process ${processData.batch_id} is no longer active, skipping`)
      }
    }

    // Si no hay procesos válidos, limpiar storage
    if (validProcesses.length === 0) {
      console.log(`🗑️ [STORAGE] No valid processes found, clearing storage`)
      localStorage.removeItem("importProcesses")
      return
    }

    // Restaurar solo procesos válidos
    for (const processData of validProcesses) {
      const process: ImportProcess = {
        batch_id: processData.batch_id,
        progress_data: processData.progress_data,
        strategy: processData.strategy,
        status: processData.status,
        started_at: processData.started_at,
        completed_at: processData.completed_at,
        file_name: processData.file_name,
        user_id: processData.user_id,
        connection_status: "disconnected",
        reconnect_attempts: processData.reconnect_attempts,
      }

      activeProcesses.value.set(processData.batch_id, process)

      // Solo reconectar si el proceso está activo y no completado
      if (process.status === "active" && process.progress_data.metadata.general_progress < 100) {
        console.log(`🔌 [STORAGE] Reconnecting to active process: ${processData.batch_id}`)
        startConnection(processData.batch_id)
      }
    }

    // Restaurar estado de UI solo si hay procesos válidos
    if (validProcesses.length > 0) {
      currentActiveProcess.value = state.currentActiveProcess
      isMinimized.value = state.isMinimized
      showProcessList.value = state.showProcessList

      // Iniciar guardado automático
      startStateSaving()
    }

    console.log(`✅ [STORAGE] Successfully loaded ${validProcesses.length} valid processes`)
  } catch (error) {
    console.error("❌ [STORAGE] Error loading saved state:", error)
    localStorage.removeItem("importProcesses")
  }
}

const clearState = () => {
  localStorage.removeItem("importProcesses")
  console.log(`🗑️ [STORAGE] Cleared saved state`)
}

const startStateSaving = () => {
  if (!saveInterval) {
    saveInterval = setInterval(saveState, 5000)
    console.log(`⏰ [STORAGE] Started auto-save every 5 seconds`)
  }
}

const stopStateSaving = () => {
  if (saveInterval) {
    clearInterval(saveInterval)
    saveInterval = null
    console.log(`⏹️ [STORAGE] Stopped auto-save`)
  }
}

// ==================== PUBLIC API ====================
const useGlobalLoading = () => {
  return {
    // Estado
    hasActiveProcesses: computed(() => activeProcesses.value.size > 0),
    currentProcess: readonly(
      computed(() => {
        if (!currentActiveProcess.value) return null
        return activeProcesses.value.get(currentActiveProcess.value) || null
      }),
    ),
    currentProgress: computed(() => {
      const process = activeProcesses.value.get(currentActiveProcess.value || "")
      if (!process) return 0

      let progress = process.progress_data.metadata?.general_progress || 0

      if (progress === 0) {
        const { processed_records, total_records } = process.progress_data.metadata || {}
        if (total_records && total_records > 0) {
          progress = Math.round((processed_records / total_records) * 100)
        }
      }

      if (progress === 0) {
        progress = process.progress_data.progress || 0
      }

      return Math.min(100, Math.max(0, progress))
    }),
    debugInfo: computed(() => {
      const process = activeProcesses.value.get(currentActiveProcess.value || "")
      if (!process) return {}

      return {
        strategy: process.strategy,
        connectionStatus: process.connection_status,
        batchId: process.batch_id,
        processedRecords: process.progress_data.metadata.processed_records,
        totalRecords: process.progress_data.metadata.total_records,
        currentStudent: process.progress_data.current_student,
        lastUpdate: process.progress_data.timestamp,
        sheet: process.progress_data.metadata.sheet,
        chunk: process.progress_data.metadata.chunk,
        reconnectAttempts: process.reconnect_attempts || 0,
      }
    }),
    isMinimized: readonly(isMinimized),
    showProcessList: readonly(showProcessList),
    processList: computed(() => {
      return Array.from(activeProcesses.value.values()).map((process) => ({
        batch_id: process.batch_id,
        file_name: process.file_name || "Archivo desconocido",
        progress: process.progress_data.metadata.general_progress,
        status: process.status,
        started_at: process.started_at,
        completed_at: process.completed_at,
        connection_status: process.connection_status,
        is_active: currentActiveProcess.value === process.batch_id,
      }))
    }),
    activeProcesses: readonly(activeProcesses),
    currentActiveProcess: readonly(currentActiveProcess),

    // Funciones principales
    startLoading: (batchId: string, selectedStrategy: Strategy = "sse", fileName?: string, userId?: string) => {
      console.log(`🚀 Starting loading with ${selectedStrategy} strategy for batch: ${batchId}`)

      if (!autoLoadEnabled) {
        autoLoadEnabled = true
        console.log(`✅ [INIT] Auto-load enabled due to new process`)
      }

      const newProcess: ImportProcess = {
        batch_id: batchId,
        progress_data: {
          batch_id: batchId,
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
          timestamp: new Date().toISOString(),
          general_progress: 0,
        },
        strategy: selectedStrategy,
        status: "active",
        started_at: new Date().toISOString(),
        file_name: fileName,
        user_id: userId,
        connection_status: "disconnected",
        reconnect_attempts: 0,
      }

      activeProcesses.value.set(batchId, newProcess)
      currentActiveProcess.value = batchId
      isMinimized.value = false

      startConnection(batchId)
      if (!saveInterval) {
        saveInterval = setInterval(() => {
          if (autoLoadEnabled && activeProcesses.value.size > 0) {
            saveState()
          }
        }, 5000)
      }

      callbacks.processAdded.forEach((callback) => callback(batchId))
    },

    stopLoading: (batchId: string) => {
      console.log(`🛑 Stopping loading for ${batchId}`)

      const process = activeProcesses.value.get(batchId)
      if (process) {
        process.status = "completed"
        stopConnection(batchId)
      }

      if (currentActiveProcess.value === batchId) {
        const remainingProcesses = Array.from(activeProcesses.value.keys()).filter((id) => id !== batchId)
        currentActiveProcess.value = remainingProcesses.length > 0 ? remainingProcesses[0] : null
      }

      if (activeProcesses.value.size === 0) {
        if (saveInterval) {
          clearInterval(saveInterval)
          saveInterval = null
        }
        autoLoadEnabled = false
        console.log(`🚫 [INIT] Auto-load disabled - no active processes`)
      }
    },

    // Resto de funciones...
    removeProcess: (batchId: string) => {
      console.log(`🗑️ Removing process: ${batchId}`)
      stopConnection(batchId)
      activeProcesses.value.delete(batchId)

      if (currentActiveProcess.value === batchId) {
        const remainingProcesses = Array.from(activeProcesses.value.keys())
        currentActiveProcess.value = remainingProcesses.length > 0 ? remainingProcesses[0] : null
      }

      callbacks.processRemoved.forEach((callback) => callback(batchId))

      if (activeProcesses.value.size === 0) {
        if (saveInterval) {
          clearInterval(saveInterval)
          saveInterval = null
        }
        autoLoadEnabled = false
        console.log(`🚫 [INIT] Auto-load disabled - no processes remaining`)
      }
    },

    setActiveProcess: (batchId: string) => {
      if (activeProcesses.value.has(batchId)) {
        currentActiveProcess.value = batchId
        isMinimized.value = false
      }
    },

    changeStrategy: (newStrategy: Strategy) => {
      callbacks.strategyChanged.forEach((callback) => callback(newStrategy))
    },

    cleanup: () => {
      console.log(`🧹 [CLEANUP] Cleaning up all processes`)
      activeProcesses.value.forEach((_, batchId) => {
        stopConnection(batchId)
      })
      if (saveInterval) {
        clearInterval(saveInterval)
        saveInterval = null
      }
    },

    // Event listeners
    onCompleted: (callback: (batchId: string) => void) => {
      callbacks.completed.push(callback)
    },
    onError: (callback: (batchId: string, error: any) => void) => {
      callbacks.error.push(callback)
    },
    onProgressUpdated: (callback: (batchId: string, progress: number) => void) => {
      callbacks.progressUpdated.push(callback)
    },
    onStrategyChanged: (callback: (strategy: Strategy) => void) => {
      callbacks.strategyChanged.push(callback)
    },
    onProcessAdded: (callback: (batchId: string) => void) => {
      callbacks.processAdded.push(callback)
    },
    onProcessRemoved: (callback: (batchId: string) => void) => {
      callbacks.processRemoved.push(callback)
    },

    // Control de UI
    minimize: () => {
      isMinimized.value = true
    },
    restore: () => {
      isMinimized.value = false
    },
    toggleProcessList: () => {
      showProcessList.value = !showProcessList.value
    },

    // Control de auto-load
    enableAutoLoad: () => {
      autoLoadEnabled = true
      console.log(`✅ [INIT] Auto-load enabled manually`)
    },
    disableAutoLoad: () => {
      autoLoadEnabled = false
      console.log(`🚫 [INIT] Auto-load disabled manually`)
    },
    isAutoLoadEnabled: () => autoLoadEnabled,

    // Funciones adicionales
    cleanupCompletedProcesses: () => {
      const completedProcesses = Array.from(activeProcesses.value.entries())
        .filter(
          ([_, process]) => process.status === "completed" && process.progress_data.metadata.general_progress >= 100,
        )
        .map(([batchId, _]) => batchId)

      if (completedProcesses.length > 0) {
        console.log(`🧹 [CLEANUP] Removing ${completedProcesses.length} completed processes`)
        completedProcesses.forEach((batchId) => {
          stopConnection(batchId)
          activeProcesses.value.delete(batchId)
          callbacks.processRemoved.forEach((callback) => callback(batchId))
        })
      }
    },

    forceCleanup: () => {
      console.log(`🧹 [FORCE-CLEANUP] Forcing complete cleanup`)
      activeProcesses.value.forEach((_, batchId) => {
        stopConnection(batchId)
      })
      activeProcesses.value.clear()
      currentActiveProcess.value = null
      isMinimized.value = false
      showProcessList.value = false
      if (saveInterval) {
        clearInterval(saveInterval)
        saveInterval = null
      }
      autoLoadEnabled = false
      isInitialized = false
      console.log(`✅ [FORCE-CLEANUP] Complete cleanup finished`)
    },

    loadState: async () => {
      await loadState()
    },
  }
}

// Instancia global singleton
let globalInstance: any = null

export function getGlobalLoadingInstance() {
  if (!globalInstance) {
    globalInstance = useGlobalLoading()
  }
  return globalInstance
}

export function initializeGlobalLoading() {
  if (!isInitialized) {
    isInitialized = true
    console.log(`🚀 [INIT] Global loading system initialized (auto-load: ${autoLoadEnabled})`)
    if (autoLoadEnabled) {
      setTimeout(() => {
        getGlobalLoadingInstance().loadState()
      }, 1000)
    }
  }
}
