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
    processing_start_time?: string
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
      console.log(`📊 [WEBSOCKET] METADATA RECIBIDA:`, data.metadata)
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

  console.log(`📊 [UPDATE] Datos recibidos para ${batchId}:`, data)
  console.log(`🔍 [UPDATE] Metadata del backend:`, data.metadata)

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

  // ✅ ACTUALIZAR METADATA COMPLETA CON DATOS DEL BACKEND
  if (!process.metadata) {
    process.metadata = {}
  }

  // ✅ MAPEAR TODOS LOS DATOS DEL BACKEND CON ACTUALIZACIÓN CORRECTA
  if (data.metadata) {
    console.log(`🔄 [UPDATE] Actualizando metadata:`)
    console.log(`   - Total records: ${data.metadata.total_records}`)
    console.log(`   - Processed records: ${data.metadata.processed_records}`)
    console.log(`   - Current sheet: ${data.metadata.current_sheet}`)
    console.log(`   - Total sheets: ${data.metadata.total_sheets}`)
    console.log(`   - Errors: ${data.metadata.errors_count}`)
    console.log(`   - Warnings: ${data.metadata.warnings_count}`)
    console.log(`   - File size: ${data.metadata.file_size}`)
    console.log(`   - Memory usage: ${data.metadata.memory_usage}`)
    console.log(`   - Processing speed: ${data.metadata.processing_speed}`)
    console.log(`   - Estimated time: ${data.metadata.estimated_time_remaining}`)

    // ✅ OBTENER VALORES DIRECTOS DEL BACKEND (NO CALCULAR EN FRONTEND)
    const backendSpeed = data.metadata.processing_speed || 0
    const backendETA = data.metadata.estimated_time_remaining || 0

    console.log(`📊 [UPDATE] Valores del backend - Speed: ${backendSpeed}, ETA: ${backendETA}`)

    // ✅ ACTUALIZAR METADATA COMPLETA CON VALORES DEL BACKEND
    process.metadata = {
      ...process.metadata, // Mantener valores existentes
      // ✅ DATOS DIRECTOS DEL BACKEND - SIEMPRE ACTUALIZAR
      total_records: data.metadata.total_records || process.metadata.total_records || 0,
      processed_records: data.metadata.processed_records || process.metadata.processed_records || 0,
      current_sheet: data.metadata.current_sheet || process.metadata.current_sheet || 1,
      total_sheets: data.metadata.total_sheets || process.metadata.total_sheets || 1,
      errors_count: data.metadata.errors_count || process.metadata.errors_count || 0,
      warnings_count: data.metadata.warnings_count || process.metadata.warnings_count || 0,
      file_size: data.metadata.file_size || process.metadata.file_size || 0,
      processing_start_time: data.metadata.processing_start_time || process.metadata.processing_start_time,
      memory_usage: data.metadata.memory_usage || process.metadata.memory_usage || 0,
      cpu_usage: data.metadata.cpu_usage || process.metadata.cpu_usage || 0,
      connection_status: "connected",
      last_activity: new Date().toISOString(),
      // ✅ USAR VALORES DEL BACKEND DIRECTAMENTE (NO CALCULAR)
      processing_speed: backendSpeed,
      estimated_time_remaining: backendETA,
    }

    console.log(`✅ [UPDATE] Metadata actualizada con valores del backend:`)
    console.log(`   - Processing Speed: ${process.metadata.processing_speed}`)
    console.log(`   - Estimated Time: ${process.metadata.estimated_time_remaining}`)
    console.log(`   - Memory Usage: ${process.metadata.memory_usage}`)
    console.log(`   - CPU Usage: ${process.metadata.cpu_usage}`)
  }

  // ✅ ACTUALIZAR EN LA LISTA COMPLETA TAMBIÉN
  const processInList = allProcesses.value.find((p) => p.batch_id === batchId)
  if (processInList) {
    processInList.progress = progress
    processInList.current_student = process.current_student
    processInList.current_action = process.current_action
    processInList.metadata = { ...process.metadata }

    console.log(`🔄 [UPDATE] Proceso en lista actualizado:`, processInList.metadata)
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

// ✅ FUNCIÓN MEJORADA PARA CALCULAR VELOCIDAD DE PROCESAMIENTO
const calculateProcessingSpeed = (process: ImportProcess, backendMetadata?: any): number => {
  const processedRecords = backendMetadata?.processed_records || process.metadata?.processed_records || 0
  const startTime = backendMetadata?.processing_start_time || process.metadata?.processing_start_time

  if (!processedRecords || !startTime) return 0

  const startTimeMs = new Date(startTime).getTime()
  const currentTimeMs = new Date().getTime()
  const elapsedSeconds = (currentTimeMs - startTimeMs) / 1000

  if (elapsedSeconds <= 0) return 0

  const speed = Math.round(processedRecords / elapsedSeconds)
  console.log(
    `📈 [SPEED] Calculando velocidad: ${processedRecords} registros / ${elapsedSeconds.toFixed(1)}s = ${speed} reg/s`,
  )

  return speed
}

// ✅ FUNCIÓN MEJORADA PARA CALCULAR TIEMPO ESTIMADO
const calculateEstimatedTimeImproved = (
  progress: number,
  startTime: string | undefined,
  processedRecords: number,
  totalRecords: number,
): number => {
  if (!startTime || progress === 0 || totalRecords === 0) {
    console.log(
      `⏱️ [ETA] No se puede calcular: startTime=${startTime}, progress=${progress}, totalRecords=${totalRecords}`,
    )
    return 0
  }

  const startTimeMs = new Date(startTime).getTime()
  const currentTimeMs = new Date().getTime()
  const elapsedSeconds = (currentTimeMs - startTimeMs) / 1000

  if (elapsedSeconds <= 0) return 0

  // Método 1: Basado en progreso porcentual
  const remainingProgress = 100 - progress
  const estimatedTotalTime = (elapsedSeconds * 100) / progress
  const estimatedRemainingByProgress = estimatedTotalTime - elapsedSeconds

  // Método 2: Basado en registros procesados
  let estimatedRemainingByRecords = 0
  if (processedRecords > 0) {
    const recordsPerSecond = processedRecords / elapsedSeconds
    const remainingRecords = totalRecords - processedRecords
    estimatedRemainingByRecords = remainingRecords / recordsPerSecond
  }

  // Usar el promedio de ambos métodos si ambos están disponibles
  let finalEstimate = estimatedRemainingByProgress
  if (estimatedRemainingByRecords > 0) {
    finalEstimate = (estimatedRemainingByProgress + estimatedRemainingByRecords) / 2
  }

  const result = Math.max(0, Math.round(finalEstimate))

  console.log(`⏱️ [ETA] Cálculo detallado:`)
  console.log(`   - Tiempo transcurrido: ${elapsedSeconds.toFixed(1)}s`)
  console.log(`   - Progreso: ${progress}%`)
  console.log(`   - Registros: ${processedRecords}/${totalRecords}`)
  console.log(`   - ETA por progreso: ${estimatedRemainingByProgress.toFixed(1)}s`)
  console.log(`   - ETA por registros: ${estimatedRemainingByRecords.toFixed(1)}s`)
  console.log(`   - ETA final: ${result}s`)

  return result
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
          queuedProcess.metadata.processing_start_time = new Date().toISOString()
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
      file_size: 0,
      connection_status: "connecting",
      last_activity: new Date().toISOString(),
      processing_start_time: new Date().toISOString(),
      memory_usage: 0,
      cpu_usage: 0,
    },
  }

  isLoading.value = true

  // ✅ SOLO MOSTRAR MODAL SI NO ESTÁ ABIERTA LA LISTA DE PROCESOS
  if (!showProcessList.value) {
    isMinimized.value = false
  } else {
    isMinimized.value = true // Mantener minimizado si la lista está abierta
  }

  console.log(`✅ [START-INTERNAL] Proceso creado para ${batchId}`)

  // Iniciar WebSocket
  startWebSocket(batchId)
}

// ✅ COMPUTED PROPERTIES PARA LA LISTA ORDENADA
const activeProcesses = computed(() => {
  return allProcesses.value.filter((p) => p.status === "active")
})

const queuedProcesses = computed(() => {
  return allProcesses.value.filter((p) => p.status === "queued")
})

const completedProcesses = computed(() => {
  return allProcesses.value.filter((p) => p.status === "completed")
})

// ✅ LISTA ORDENADA: ACTIVOS -> EN COLA -> COMPLETADOS
const sortedProcesses = computed(() => {
  const active = activeProcesses.value
  const queued = queuedProcesses.value
  const completed = completedProcesses.value.sort((a, b) => {
    // Ordenar completados por fecha de finalización (más recientes primero)
    const dateA = new Date(a.completed_at || a.started_at || "").getTime()
    const dateB = new Date(b.completed_at || b.started_at || "").getTime()
    return dateB - dateA
  })

  console.log(
    `📋 [SORT] Procesos ordenados: ${active.length} activos, ${queued.length} en cola, ${completed.length} completados`,
  )

  return [...active, ...queued, ...completed]
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

  console.log(`🔍 [DEBUG] Generando debug info para:`, process.batch_id)
  console.log(`🔍 [DEBUG] Metadata actual:`, process.metadata)
  console.log(`🔍 [DEBUG] Processing speed actual:`, process.metadata?.processing_speed)
  console.log(`🔍 [DEBUG] ETA actual:`, process.metadata?.estimated_time_remaining)

  return {
    batchId: process.batch_id,
    progress: process.progress,
    status: process.status,
    currentStudent: process.current_student,
    currentAction: process.current_action,
    queueLength: processQueue.value.length,
    totalProcesses: allProcesses.value.length,
    // ✅ METADATA PARA DEBUG - USAR DATOS REALES ACTUALIZADOS
    total_records: process.metadata?.total_records || 0,
    processed_records: process.metadata?.processed_records || 0,
    current_sheet: process.metadata?.current_sheet || 1,
    total_sheets: process.metadata?.total_sheets || 1,
    errors_count: process.metadata?.errors_count || 0,
    warnings_count: process.metadata?.warnings_count || 0,
    connection_status: process.metadata?.connection_status || "disconnected",
    // ✅ VALORES CRÍTICOS QUE DEBEN ACTUALIZARSE
    processing_speed: process.metadata?.processing_speed || 0,
    estimated_time_remaining: process.metadata?.estimated_time_remaining || 0,
    memory_usage: process.metadata?.memory_usage || 0,
    cpu_usage: process.metadata?.cpu_usage || 0,
    file_size: process.metadata?.file_size || 0,
    last_activity: process.metadata?.last_activity || "N/A",
    processing_start_time: process.metadata?.processing_start_time || "N/A",
    // ✅ FORMATEAR ALGUNOS VALORES CON VALORES ACTUALIZADOS
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
      file_size: 0,
      connection_status: "disconnected",
      last_activity: new Date().toISOString(),
      processing_start_time: new Date().toISOString(),
      memory_usage: 0,
      cpu_usage: 0,
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

// ✅ NUEVA FUNCIÓN PARA LIMPIAR COMPLETADOS
const clearCompletedProcesses = () => {
  console.log(`🧹 [CLEAR] Limpiando procesos completados`)

  const beforeCount = allProcesses.value.length
  allProcesses.value = allProcesses.value.filter((p) => p.status !== "completed")
  const afterCount = allProcesses.value.length

  console.log(`✅ [CLEAR] Eliminados ${beforeCount - afterCount} procesos completados`)
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
    sortedProcesses, // ✅ NUEVA: Lista ordenada
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
    clearCompletedProcesses, // ✅ NUEVA: Limpiar completados

    // Event listeners
    onCompleted,
    onError,
    onProgressUpdated,
  }
}
