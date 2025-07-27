import { computed, ref } from "vue"

declare const echo: any

interface ImportProcess {
  batch_id: string
  file_name: string
  progress: number
  current_student: string
  current_action: string
  status: "active" | "completed" | "error" | "queued"
  started_at?: string
  completed_at?: string
  websocket_channel?: any
  // ✅ METADATA DETALLADA
  metadata?: {
    total_records?: number
    processed_records?: number
    current_sheet?: number
    total_sheets?: number
    errors_count?: number
    warnings_count?: number
    processing_speed?: number // registros por segundo
    estimated_time_remaining?: number // en segundos
    file_size?: number // en bytes
    connection_status?: "connected" | "connecting" | "reconnecting" | "error" | "disconnected"
    last_activity?: string
    memory_usage?: number
    cpu_usage?: number
  }
}

// Variables reactivas globales
const isLoading = ref(false)
const currentProcess = ref<ImportProcess | null>(null)
const isMinimized = ref(false)
const showProcessList = ref(false)

// ✅ LISTA COMPLETA DE PROCESOS (activos, en cola, completados)
const allProcesses = ref<ImportProcess[]>([])
const processQueue = ref<Array<{ batch_id: string; fileName: string }>>([])

// Callbacks
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

const startWebSocket = (batchId: string) => {
  console.log(`🔌 [WEBSOCKET] Iniciando para batch: ${batchId}`)

  const echoInstance = getEcho()
  if (!echoInstance) {
    console.error(`❌ [WEBSOCKET] Echo no disponible`)
    return
  }

  try {
    const channelName = `import.progress.${batchId}`
    console.log(`🔌 [WEBSOCKET] Creando canal: ${channelName}`)

    const channel = echoInstance.channel(channelName)

    if (currentProcess.value) {
      currentProcess.value.websocket_channel = channel
      // ✅ ACTUALIZAR ESTADO DE CONEXIÓN
      if (currentProcess.value.metadata) {
        currentProcess.value.metadata.connection_status = "connecting"
      }
    }

    // Escuchar eventos de progreso
    channel.listen(".progress.update", (data: any) => {
      console.log(`🔥 [WEBSOCKET] EVENTO RECIBIDO:`, data)
      handleProgressUpdate(batchId, data)
    })

    channel.subscribed(() => {
      console.log(`✅ [WEBSOCKET] Conectado al canal ${channelName}`)
      // ✅ ACTUALIZAR ESTADO DE CONEXIÓN
      if (currentProcess.value?.metadata) {
        currentProcess.value.metadata.connection_status = "connected"
        currentProcess.value.metadata.last_activity = new Date().toISOString()
      }
    })

    channel.error((error: any) => {
      console.error(`❌ [WEBSOCKET] Error en canal:`, error)
      // ✅ ACTUALIZAR ESTADO DE CONEXIÓN
      if (currentProcess.value?.metadata) {
        currentProcess.value.metadata.connection_status = "error"
      }
      callbacks.error.forEach((callback) => callback(batchId, error))
    })
  } catch (error) {
    console.error(`❌ [WEBSOCKET] Error creando canal:`, error)
  }
}

const handleProgressUpdate = (batchId: string, data: any) => {
  const process = currentProcess.value
  if (!process || process.batch_id !== batchId) {
    console.warn(`⚠️ [UPDATE] Batch no coincide: ${batchId}`)
    return
  }

  console.log(`📊 [UPDATE] Datos recibidos:`, data)

  // Extraer progreso
  let progress = 0
  if (data.metadata?.general_progress !== undefined) {
    progress = data.metadata.general_progress
  } else if (data.progress !== undefined) {
    progress = data.progress
  }

  progress = Math.min(100, Math.max(0, progress))

  // Actualizar proceso actual
  process.progress = progress
  process.current_student = data.current_student || "Procesando..."
  process.current_action = data.current_action || "Importando datos"

  // ✅ ACTUALIZAR METADATA DETALLADA
  if (!process.metadata) {
    process.metadata = {}
  }

  // Actualizar metadata con datos del servidor
  process.metadata = {
    ...process.metadata,
    total_records: data.total_records || process.metadata.total_records || 0,
    processed_records: data.processed_records || process.metadata.processed_records || 0,
    current_sheet: data.current_sheet || process.metadata.current_sheet || 1,
    total_sheets: data.total_sheets || process.metadata.total_sheets || 1,
    errors_count: data.errors_count || process.metadata.errors_count || 0,
    warnings_count: data.warnings_count || process.metadata.warnings_count || 0,
    connection_status: "connected",
    last_activity: new Date().toISOString(),
    // ✅ CALCULAR VELOCIDAD DE PROCESAMIENTO
    processing_speed: calculateProcessingSpeed(process),
    // ✅ CALCULAR TIEMPO ESTIMADO
    estimated_time_remaining: calculateEstimatedTime(process, progress),
  }

  // ✅ ACTUALIZAR EN LA LISTA COMPLETA TAMBIÉN
  const processInList = allProcesses.value.find((p) => p.batch_id === batchId)
  if (processInList) {
    processInList.progress = progress
    processInList.current_student = process.current_student
    processInList.current_action = process.current_action
    processInList.metadata = { ...process.metadata }
  }

  console.log(`✅ [UPDATE] Progreso actualizado a ${progress}%`)

  // Ejecutar callbacks
  callbacks.progressUpdated.forEach((callback) => callback(batchId, progress))

  // Verificar si completó
  if (progress >= 100) {
    console.log(`🎉 [UPDATE] ¡COMPLETADO! ${batchId}`)
    process.status = "completed"
    process.completed_at = new Date().toISOString()

    // ✅ ACTUALIZAR EN LA LISTA COMPLETA
    if (processInList) {
      processInList.status = "completed"
      processInList.completed_at = process.completed_at
    }

    stopWebSocket(batchId)

    setTimeout(() => {
      callbacks.completed.forEach((callback) => callback(batchId))
      processNextInQueue()
    }, 500)
  }
}

// ✅ FUNCIÓN PARA CALCULAR VELOCIDAD DE PROCESAMIENTO
const calculateProcessingSpeed = (process: ImportProcess): number => {
  if (!process.metadata?.processed_records || !process.started_at) return 0

  const startTime = new Date(process.started_at).getTime()
  const currentTime = new Date().getTime()
  const elapsedSeconds = (currentTime - startTime) / 1000

  if (elapsedSeconds === 0) return 0

  return Math.round(process.metadata.processed_records / elapsedSeconds)
}

// ✅ FUNCIÓN PARA CALCULAR TIEMPO ESTIMADO
const calculateEstimatedTime = (process: ImportProcess, progress: number): number => {
  if (progress === 0 || !process.started_at) return 0

  const startTime = new Date(process.started_at).getTime()
  const currentTime = new Date().getTime()
  const elapsedSeconds = (currentTime - startTime) / 1000

  const remainingProgress = 100 - progress
  const estimatedTotalTime = (elapsedSeconds * 100) / progress
  const estimatedRemaining = estimatedTotalTime - elapsedSeconds

  return Math.max(0, Math.round(estimatedRemaining))
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
    // ✅ ACTUALIZAR ESTADO DE CONEXIÓN
    if (process.metadata) {
      process.metadata.connection_status = "disconnected"
    }
  } catch (error) {
    console.error(`❌ [WEBSOCKET] Error deteniendo:`, error)
  }
}

const processNextInQueue = () => {
  console.log(`🔄 [QUEUE] Procesando siguiente en cola...`)

  if (processQueue.value.length > 0) {
    const nextProcess = processQueue.value.shift()
    if (nextProcess) {
      console.log(`▶️ [QUEUE] Iniciando siguiente proceso: ${nextProcess.batch_id}`)

      // ✅ CAMBIAR ESTADO DE QUEUED A ACTIVE
      const queuedProcess = allProcesses.value.find((p) => p.batch_id === nextProcess.batch_id)
      if (queuedProcess) {
        queuedProcess.status = "active"
        queuedProcess.started_at = new Date().toISOString()
        // ✅ ACTUALIZAR METADATA
        if (queuedProcess.metadata) {
          queuedProcess.metadata.connection_status = "connecting"
        }
      }

      startLoadingInternal(nextProcess.batch_id, nextProcess.fileName)
    }
  } else {
    console.log(`✅ [QUEUE] Cola vacía, deteniendo loading`)
    isLoading.value = false
    currentProcess.value = null
  }
}

const startLoadingInternal = (batchId: string, fileName?: string) => {
  console.log(`🚀 [START-INTERNAL] Iniciando carga para batch: ${batchId}`)

  // Crear nuevo proceso
  currentProcess.value = {
    batch_id: batchId,
    file_name: fileName || "Archivo",
    progress: 0,
    current_student: "Iniciando proceso...",
    current_action: "Preparando importación",
    status: "active",
    started_at: new Date().toISOString(),
    // ✅ INICIALIZAR METADATA
    metadata: {
      total_records: 0,
      processed_records: 0,
      current_sheet: 1,
      total_sheets: 1,
      errors_count: 0,
      warnings_count: 0,
      processing_speed: 0,
      estimated_time_remaining: 0,
      connection_status: "connecting",
      last_activity: new Date().toISOString(),
    },
  }

  isLoading.value = true
  isMinimized.value = false

  console.log(`✅ [START-INTERNAL] Proceso creado para ${batchId}`)

  // Iniciar WebSocket
  startWebSocket(batchId)
}

// ✅ COMPUTED PROPERTIES PARA LA LISTA
const activeProcesses = computed(() => {
  return allProcesses.value.filter((p) => p.status === "active")
})

const queuedProcesses = computed(() => {
  return allProcesses.value.filter((p) => p.status === "queued")
})

const completedProcesses = computed(() => {
  return allProcesses.value.filter((p) => p.status === "completed")
})

const hasMultipleProcesses = computed(() => {
  return allProcesses.value.length > 1
})

const currentProgress = computed(() => {
  return currentProcess.value?.progress || 0
})

// ✅ COMPUTED PARA DEBUG INFO MEJORADO
const debugInfo = computed(() => {
  const process = currentProcess.value
  if (!process) return {}

  return {
    batchId: process.batch_id,
    progress: process.progress,
    status: process.status,
    currentStudent: process.current_student,
    currentAction: process.current_action,
    queueLength: processQueue.value.length,
    totalProcesses: allProcesses.value.length,
    // ✅ METADATA PARA DEBUG
    ...process.metadata,
    // ✅ FORMATEAR ALGUNOS VALORES
    fileSize: process.metadata?.file_size ? formatFileSize(process.metadata.file_size) : "N/A",
    processingSpeedFormatted: process.metadata?.processing_speed ? `${process.metadata.processing_speed} reg/s` : "N/A",
    estimatedTimeFormatted: process.metadata?.estimated_time_remaining
      ? formatTime(process.metadata.estimated_time_remaining)
      : "N/A",
  }
})

// ✅ FUNCIONES DE UTILIDAD
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes"
  const k = 1024
  const sizes = ["Bytes", "KB", "MB", "GB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
}

const formatTime = (seconds: number): string => {
  if (seconds < 60) return `${seconds}s`
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return `${minutes}m ${remainingSeconds}s`
}

// Funciones principales
const startLoading = (batchId: string, fileName?: string) => {
  console.log(`🚀 [START] Iniciando carga para batch: ${batchId}`)

  const file_name = fileName || "Archivo"

  // ✅ AGREGAR A LA LISTA COMPLETA SIEMPRE
  const newProcess: ImportProcess = {
    batch_id: batchId,
    file_name: file_name,
    progress: 0,
    current_student: "Iniciando proceso...",
    current_action: "Preparando importación",
    status: "queued", // Inicialmente en cola
    started_at: new Date().toISOString(),
    // ✅ INICIALIZAR METADATA PARA PROCESOS EN COLA
    metadata: {
      total_records: 0,
      processed_records: 0,
      current_sheet: 1,
      total_sheets: 1,
      errors_count: 0,
      warnings_count: 0,
      processing_speed: 0,
      estimated_time_remaining: 0,
      connection_status: "disconnected",
      last_activity: new Date().toISOString(),
    },
  }

  allProcesses.value.push(newProcess)

  // ✅ SI HAY UN PROCESO ACTIVO, AGREGAR A LA COLA
  if (currentProcess.value && currentProcess.value.status === "active") {
    console.log(`📋 [QUEUE] Agregando a cola: ${batchId}`)
    processQueue.value.push({ batch_id: batchId, fileName: file_name })
    return true
  }

  // ✅ SI NO HAY PROCESO ACTIVO, INICIAR INMEDIATAMENTE
  newProcess.status = "active"
  startLoadingInternal(batchId, file_name)
  return true
}

const stopLoading = () => {
  console.log(`🛑 [STOP] Deteniendo carga`)
  const process = currentProcess.value
  if (process) {
    stopWebSocket(process.batch_id)
  }
  isLoading.value = false
  currentProcess.value = null
  processQueue.value = []
}

const minimize = () => {
  isMinimized.value = true
}

const restore = () => {
  isMinimized.value = false
}

const hasActiveProcess = () => {
  return currentProcess.value && currentProcess.value.status === "active"
}

// ✅ FUNCIONES PARA LA LISTA DE PROCESOS
const showProcessListModal = () => {
  console.log(`📋 [LIST] Mostrando lista de procesos`)
  showProcessList.value = true
}

const hideProcessListModal = () => {
  console.log(`📋 [LIST] Ocultando lista de procesos`)
  showProcessList.value = false
}

const removeProcess = (batchId: string) => {
  console.log(`🗑️ [REMOVE] Eliminando proceso: ${batchId}`)

  const index = allProcesses.value.findIndex((p) => p.batch_id === batchId)
  if (index !== -1) {
    allProcesses.value.splice(index, 1)
  }

  // Si era el proceso activo, detener
  if (currentProcess.value?.batch_id === batchId) {
    stopLoading()
  }
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
  processQueue.value = []
  allProcesses.value = []
  showProcessList.value = false
}

// Event listeners
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
    // Estado reactivo
    isLoading,
    currentProcess,
    currentProgress,
    debugInfo,
    isMinimized,
    showProcessList,

    // ✅ NUEVAS PROPIEDADES PARA LA LISTA
    allProcesses,
    activeProcesses,
    queuedProcesses,
    completedProcesses,
    hasMultipleProcesses,

    // Funciones principales
    startLoading,
    stopLoading,
    minimize,
    restore,
    hasActiveProcess,
    cleanup,

    // ✅ NUEVAS FUNCIONES PARA LA LISTA
    showProcessListModal,
    hideProcessListModal,
    removeProcess,

    // Event listeners
    onCompleted,
    onError,
    onProgressUpdated,
  }
}
