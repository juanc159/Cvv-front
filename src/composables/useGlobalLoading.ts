import { computed, reactive, ref } from "vue"

declare const echo: any

interface ImportProcess {
  batch_id: string
  progress: number
  current_student: string
  current_action: string
  status: "active" | "completed" | "error"
  websocket_channel?: any
}

// ✅ VARIABLES REACTIVAS SIMPLES
const isLoading = ref(false)
const currentProcess = ref<ImportProcess | null>(null)
const isMinimized = ref(false) // ✅ SIEMPRE EMPIEZA EN FALSE

const loading = reactive({
  form: false,
  download_notes: false,
  block_uploading_of_grades_to_teachers: false,
  viewing_notes: false,
})

const errorsBack = ref({})

const callbacks = {
  completed: [] as Array<(batchId: string) => void>,
  error: [] as Array<(batchId: string, error: any) => void>,
  progressUpdated: [] as Array<(batchId: string, progress: number) => void>,
}

const getEcho = () => {
  if (typeof echo !== "undefined") {
    return echo
  }
  if (typeof window !== "undefined" && (window as any).Echo) {
    return (window as any).Echo
  }
  console.error("❌ Echo no está disponible")
  return null
}

const startWebSocket = async (batchId: string): Promise<boolean> => {
  console.log(`🔌 [WEBSOCKET] Iniciando para batch: ${batchId}`)

  const echoInstance = getEcho()
  if (!echoInstance) {
    console.error(`❌ [WEBSOCKET] Echo no disponible`)
    return false
  }

  try {
    const channelName = `import.progress.${batchId}`
    console.log(`🔌 [WEBSOCKET] Creando canal: ${channelName}`)

    const channel = echoInstance.channel(channelName)

    if (currentProcess.value) {
      currentProcess.value.websocket_channel = channel
    }

    let resolved = false
    let timeoutId: NodeJS.Timeout

    return new Promise((resolve) => {
      channel.listen(".progress.update", (data: any) => {
        console.log(`🔥 [WEBSOCKET] EVENTO RECIBIDO:`, data)
        handleProgressUpdate(batchId, data)
      })

      channel.subscribed(() => {
        console.log(`✅ [WEBSOCKET] Conectado al canal ${channelName}`)
        if (!resolved) {
          resolved = true
          clearTimeout(timeoutId)
          resolve(true)
        }
      })

      channel.error((error: any) => {
        console.error(`❌ [WEBSOCKET] Error en canal:`, error)
        if (!resolved) {
          resolved = true
          clearTimeout(timeoutId)
          callbacks.error.forEach((callback) => callback(batchId, error))
          resolve(false)
        }
      })

      timeoutId = setTimeout(() => {
        if (!resolved) {
          resolved = true
          console.error(`⏰ [WEBSOCKET] Timeout conectando a ${channelName}`)
          resolve(false)
        }
      }, 10000)
    })
  } catch (error) {
    console.error(`❌ [WEBSOCKET] Error creando canal:`, error)
    return false
  }
}

const handleProgressUpdate = (batchId: string, data: any) => {
  const process = currentProcess.value
  if (!process || process.batch_id !== batchId) {
    console.warn(`⚠️ [UPDATE] Batch no coincide: ${batchId}`)
    return
  }

  console.log(`📊 [UPDATE] Datos recibidos:`, data)

  let progress = 0
  if (data.metadata?.general_progress !== undefined) {
    progress = data.metadata.general_progress
  } else if (data.progress !== undefined) {
    progress = data.progress
  }

  progress = Math.min(100, Math.max(0, progress))

  // ✅ ACTUALIZAR PROCESO
  process.progress = progress
  process.current_student = data.current_student || "Procesando..."
  process.current_action = data.current_action || "Importando datos"

  console.log(`✅ [UPDATE] Progreso actualizado a ${progress}%`)
  console.log(`🔧 [UPDATE] Estado actual:`, {
    isLoading: isLoading.value,
    isMinimized: isMinimized.value,
    progress: progress,
  })

  callbacks.progressUpdated.forEach((callback) => callback(batchId, progress))

  if (progress >= 100) {
    console.log(`🎉 [UPDATE] ¡COMPLETADO! ${batchId}`)
    process.status = "completed"
    stopWebSocket(batchId)
    setTimeout(() => {
      callbacks.completed.forEach((callback) => callback(batchId))
    }, 500)
  }
}

const stopWebSocket = (batchId: string) => {
  const process = currentProcess.value
  if (!process || !process.websocket_channel) return

  console.log(`🛑 [WEBSOCKET] Deteniendo para ${batchId}`)

  try {
    const echoInstance = getEcho()
    if (echoInstance) {
      echoInstance.leaveChannel(`import.progress.${batchId}`)
    }
    process.websocket_channel = undefined
  } catch (error) {
    console.error(`❌ [WEBSOCKET] Error deteniendo:`, error)
  }
}

const currentProgress = computed(() => {
  return currentProcess.value?.progress || 0
})

const debugInfo = computed(() => {
  const process = currentProcess.value
  if (!process) return {}

  return {
    batchId: process.batch_id,
    progress: process.progress,
    status: process.status,
    currentStudent: process.current_student,
    currentAction: process.current_action,
  }
})

// ✅ FUNCIÓN PRINCIPAL SIMPLIFICADA
const startLoading = async (batchId: string, fileName?: string): Promise<boolean> => {
  console.log(`🚀 [START] Iniciando carga para batch: ${batchId}`)

  if (currentProcess.value && currentProcess.value.status === "active") {
    console.warn(`⚠️ [START] Ya hay un proceso activo`)
    return false
  }

  // ✅ CREAR PROCESO Y ACTIVAR LOADING
  currentProcess.value = {
    batch_id: batchId,
    progress: 0,
    current_student: "Iniciando proceso...",
    current_action: "Preparando importación",
    status: "active",
  }

  isLoading.value = true
  isMinimized.value = false // ✅ SIEMPRE EMPEZAR VISIBLE

  console.log(`✅ [START] Proceso creado - Estado:`, {
    isLoading: isLoading.value,
    isMinimized: isMinimized.value,
    batchId: batchId,
  })

  const connected = await startWebSocket(batchId)

  if (connected) {
    console.log(`✅ [START] WebSocket conectado exitosamente para ${batchId}`)
    return true
  } else {
    console.error(`❌ [START] No se pudo conectar WebSocket para ${batchId}`)
    currentProcess.value = null
    isLoading.value = false
    return false
  }
}

const stopLoading = () => {
  console.log(`🛑 [STOP] Deteniendo carga`)
  const process = currentProcess.value
  if (process) {
    stopWebSocket(process.batch_id)
  }
  isLoading.value = false
  isMinimized.value = false
  currentProcess.value = null
}

const minimize = () => {
  console.log(`📦 [MINIMIZE] Minimizando modal`)
  isMinimized.value = true
}

const restore = () => {
  console.log(`📤 [RESTORE] Restaurando modal`)
  isMinimized.value = false
}

const hasActiveProcess = () => {
  return currentProcess.value && currentProcess.value.status === "active"
}

const cleanup = () => {
  console.log(`🧹 [CLEANUP] Limpiando`)
  const process = currentProcess.value
  if (process) {
    stopWebSocket(process.batch_id)
  }
  currentProcess.value = null
  isLoading.value = false
  isMinimized.value = false
}

const onCompleted = (callback: (batchId: string) => void) => {
  callbacks.completed.push(callback)
}

const onError = (callback: (batchId: string, error: any) => void) => {
  callbacks.error.push(callback)
}

const onProgressUpdated = (callback: (batchId: string, progress: number) => void) => {
  callbacks.progressUpdated.push(callback)
}

export function useGlobalLoading() {
  return {
    isLoading,
    currentProcess,
    currentProgress,
    debugInfo,
    isMinimized,
    loading,
    errorsBack,
    startLoading,
    stopLoading,
    minimize,
    restore,
    hasActiveProcess,
    cleanup,
    onCompleted,
    onError,
    onProgressUpdated,
  }
}
