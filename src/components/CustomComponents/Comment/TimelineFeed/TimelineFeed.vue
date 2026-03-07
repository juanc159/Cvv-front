<script setup lang="ts">
import { useToast } from '@/composables/useToast';
import { useAuthenticationStore } from "@/stores/useAuthenticationStore";
/*  */import { nextTick, onMounted, ref, watch } from 'vue';

// --- PROPS GLOBALES ---
const props = defineProps({
  // El ID del registro (Activity ID, Lead ID, Ticket ID, etc.)
  recordId: { type: String, required: true },

  // El modelo asociado (ej: 'Activity', 'Lead', 'Provider')
  // Nota: Debe coincidir con lo que tu Backend espera en 'commentable_type' o tu MorphMap
  recordType: { type: String, required: true },

  // Opcional: Para ocultar la opción de nota privada si no aplica
  allowInternal: { type: Boolean, default: true },

  allowFiles: { type: Boolean, default: true }
});

const { toast } = useToast();
const authStore = useAuthenticationStore();

// --- ESTADO ---
const comments = ref<any[]>([]);
const isLoading = ref(false);
const isLoadingMore = ref(false);
const isSubmitting = ref(false);

// Filtros y Paginación
const searchQuery = ref('');
const currentPage = ref(1);
const lastPage = ref(1);
const totalData = ref(0);

// Formulario
const newComment = ref('');
const isInternal = ref(false);
const selectedFiles = ref<File[]>([]);
const fileInputRef = ref<HTMLInputElement | null>(null);
 

// --- API: LISTAR COMENTARIOS ---
const fetchComments = async (page = 1, reset = false) => {
  if (reset) {
    isLoading.value = true;
    comments.value = [];
    currentPage.value = 1;
  } else {
    isLoadingMore.value = true;
  }

  try {
    const params = new URLSearchParams();
    // Usamos los props dinámicos
    params.append('commentable_type', props.recordType);
    params.append('commentable_id', props.recordId);
    params.append('page', page.toString());

    if (searchQuery.value) {
      params.append('filter[inputGeneral]', searchQuery.value);
    }

    const { data, response } = await useAxios(`/comment/paginate?${params.toString()}`).get();

    if (response?.status === 200 && data) {
      // Manejo robusto de la respuesta (por si cambia la estructura del paginador)
      const result = data.tableData ? data : data.data; // Soporte para Resource collection o Paginator standard
      const newItems = data.tableData || data.data || [];

      currentPage.value = data.currentPage || data.current_page || 1;
      lastPage.value = data.lastPage || data.last_page || 1;
      totalData.value = data.totalData || data.total || 0;

      if (reset) {
        comments.value = newItems;
      } else {
        // Al cargar más, los comentarios antiguos se añaden al PRINCIPIO de la lista.
        comments.value = [...newItems, ...comments.value];
      }
    }
  } catch (error) {
    console.error(error);
    toast('Error cargando la bitácora', '', 'danger');
  } finally {
    isLoading.value = false;
    isLoadingMore.value = false;
  }
};

// --- WATCHERS ---

// 1. Buscador con Debounce
let timeout: NodeJS.Timeout;
watch(searchQuery, () => {
  clearTimeout(timeout);
  timeout = setTimeout(() => { fetchComments(1, true); }, 500);
});

// 2. Si cambia el registro padre (ej: navegación rápida), recargar.
watch(() => props.recordId, () => {
  fetchComments(1, true);
});

const loadMore = () => {
  if (currentPage.value < lastPage.value) {
    fetchComments(currentPage.value + 1, false);
  }
};

// --- API: ENVIAR COMENTARIO ---
const submitComment = async () => {
  if (!newComment.value.trim() && selectedFiles.value.length === 0) return;

  isSubmitting.value = true;
  try {
    const formData = new FormData();
    formData.append('company_id', authStore.company.id);

    // Datos Dinámicos
    formData.append('commentable_type', props.recordType);
    formData.append('commentable_id', props.recordId);

    formData.append('body', newComment.value);
    formData.append('is_internal', isInternal.value ? 'true' : 'false');

    selectedFiles.value.forEach((file) => {
      formData.append('attachments[]', file);
    });

    const { data, response } = await useAxios('/comment/store').post(formData);

    if (response?.status === 200) {
      // Reset Form
      newComment.value = '';
      selectedFiles.value = [];
      // No reseteamos isInternal para comodidad del usuario si está enviando varias notas privadas

      if (data.data) {
        // Añadimos el nuevo comentario al FINAL de la lista.
        comments.value.push(data.data);
        totalData.value++;

        // Esperamos a que Vue actualice el DOM con el nuevo comentario
        await nextTick();

        // Ahora que el comentario está renderizado, hacemos scroll al final.
        const listContainer = document.querySelector('.comments-list');
        if (listContainer) {
          listContainer.scrollTo({ top: listContainer.scrollHeight, behavior: 'smooth' });
        }
      }
    }
  } catch (error) {
    console.error(error);
    toast('Error al enviar comentario', '', 'danger');
  } finally {
    isSubmitting.value = false;
  }
};

// --- MANEJO DE ARCHIVOS ---
const triggerFileInput = () => { fileInputRef.value?.click(); };

const handleFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files) {
    const newFiles = Array.from(target.files);
    // Filtro 10MB
    const validFiles = newFiles.filter(file => file.size <= 10 * 1024 * 1024);

    if (validFiles.length < newFiles.length) toast('Archivos > 10MB ignorados', '', 'warning');

    // Evitar duplicados visuales (opcional)
    const uniqueFiles = validFiles.filter(vf => !selectedFiles.value.some(sf => sf.name === vf.name));

    selectedFiles.value = [...selectedFiles.value, ...uniqueFiles];
  }
  if (fileInputRef.value) fileInputRef.value.value = '';
};

const removeFile = (index: number) => { selectedFiles.value.splice(index, 1); };
const downloadAttachment = (path: string) => { window.open(storageBack(path), '_blank'); }

onMounted(async () => {
  await fetchComments(1, true);

  // Esperamos a que Vue renderice los comentarios cargados
  await nextTick();

  // Ahora que están en el DOM, hacemos scroll hasta el final
  const listContainer = document.querySelector('.comments-list');
  if (listContainer) {
    listContainer.scrollTop = listContainer.scrollHeight;
  }
});
</script>

<template>
  <div class="comments-container">
    <div class="filter-section">
      <VTextField v-model="searchQuery" placeholder="Buscar en la bitácora..." density="compact" variant="outlined"
        hide-details prepend-inner-icon="tabler-search" bg-color="white" clearable />
    </div>

    <div class="comments-list">
      <div v-if="isLoading && !searchQuery" class="loading-state">
        <VProgressCircular indeterminate color="primary" size="40" />
        <div class="text-body-2 text-medium-emphasis mt-3">Cargando comentarios...</div>
      </div>

      <div v-else-if="comments.length === 0" class="empty-state">
        <VIcon icon="tabler-message-2-off" size="56" color="grey-lighten-1" />
        <div class="text-body-1 font-weight-medium text-medium-emphasis mt-3">Bitácora vacía</div>
        <div class="text-caption text-disabled mt-1">Los comentarios aparecerán aquí</div>
      </div>

      <div v-else class="comments-content">
        <div v-if="currentPage < lastPage" class="load-more-section">
          <VBtn variant="tonal" size="small" :loading="isLoadingMore" @click="loadMore" color="primary"
            prepend-icon="tabler-arrow-up">
            Cargar comentarios anteriores
          </VBtn>
        </div>

        <VCard v-for="comment in comments" :key="comment.id" variant="flat" class="comment-card" elevation="0">
 
          <div class="comment-header">
            <VAvatar size="32" :color="comment.is_mine ? 'primary' : 'secondary'" class="me-2" variant="tonal" :title="comment.user_data">
              <VImg v-if="comment.user_avatar" :src="storageBack(comment.user_avatar)" />
              <span v-else class="text-body-2 font-weight-bold">{{ comment.initials }}</span>
            </VAvatar>
            <div class="flex-grow-1 overflow-hidden">
              <div class="text-body-2 font-weight-bold text-truncate">{{ comment.user_data }}</div>
              <div class="text-caption text-medium-emphasis">{{ comment.created_at }}</div>
            </div>
            <VChip v-if="comment.is_internal" size="small" color="warning" variant="tonal" prepend-icon="tabler-lock">
              Privado
            </VChip>
          </div>

          <VCardText class="comment-body">
            {{ comment.body }}
          </VCardText>

          <div v-if="comment.attachments?.length" class="comment-attachments">
            <VDivider class="mb-3" />
            <div class="d-flex flex-wrap gap-2">
              <VChip v-for="file in comment.attachments" :key="file.id" size="small" variant="tonal" color="primary"
                prepend-icon="tabler-paperclip" @click="downloadAttachment(file.file_path)" class="attachment-chip">
                {{ file.file_name }}
              </VChip>
            </div>
          </div>
        </VCard>
      </div>
    </div>

    <div class="form-section">

      <VExpandTransition>
        <div v-if="selectedFiles.length > 0" class="files-preview">
          <div class="text-caption font-weight-bold text-medium-emphasis mb-2">
            <VIcon icon="tabler-paperclip" size="14" class="me-1" />
            Archivos adjuntos ({{ selectedFiles.length }})
          </div>
          <div class="d-flex flex-wrap gap-2">
            <VChip v-for="(file, index) in selectedFiles" :key="index" size="small" closable
              @click:close="removeFile(index)" color="primary" variant="tonal">
              {{ file.name }}
            </VChip>
          </div>
        </div>
      </VExpandTransition>

      <div class="input-wrapper">

        <input v-if="allowFiles" type="file" multiple ref="fileInputRef" class="d-none"
          accept="image/*,.pdf,.doc,.docx,.xls,.xlsx" @change="handleFileChange" />

        <VBtn v-if="allowFiles" icon variant="text" color="primary" size="small" @click="triggerFileInput"
          class="attach-btn">
          <VIcon icon="tabler-paperclip" />
          <VTooltip activator="parent" location="top">Adjuntar archivos</VTooltip>
        </VBtn>
 
        <VTextarea v-model="newComment" rows="1" auto-grow max-rows="5" placeholder="Escribir un comentario..."
          variant="outlined" density="comfortable" hide-details class="flex-grow-1 comment-input"
          :loading="isSubmitting" bg-color="white" @keydown.enter.prevent="submitComment" />
        <VBtn icon="tabler-send" color="primary" variant="flat" size="small"
          :disabled="(!newComment.trim() && selectedFiles.length === 0) || isSubmitting" @click="submitComment"
          class="send-btn" />
      </div>

      <div v-if="allowInternal" class="d-flex align-center mt-2">
        <VSwitch v-model="isInternal" color="warning" density="compact" hide-details class="internal-switch">
          <template #label>
            <span class="text-caption text-medium-emphasis d-flex align-center">
              <VIcon icon="tabler-lock" size="14" class="me-1" /> Nota interna
            </span>
          </template>
        </VSwitch>
        <VSpacer />
        <div class="text-caption text-disabled">
          {{ totalData }} {{ totalData === 1 ? 'comentario' : 'comentarios' }}
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.comments-container {
  display: grid;
  grid-template-rows: auto 1fr auto;
  height: 500px;
  max-height: 70vh;
  background-color: rgb(var(--v-theme-grey-lighten-5));
  overflow: hidden;
}

.filter-section {
  position: sticky;
  top: 0;
  z-index: 10;
  padding: 16px;
  background-color: rgb(var(--v-theme-surface));
  border-bottom: 1px solid rgba(var(--v-theme-on-surface), 0.12);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.comments-list {
  overflow-y: auto;
  padding: 16px;
  min-height: 0;
}

.comments-list::-webkit-scrollbar {
  width: 8px;
}

.comments-list::-webkit-scrollbar-track {
  background: transparent;
}

.comments-list::-webkit-scrollbar-thumb {
  background-color: rgba(var(--v-theme-on-surface), 0.2);
  border-radius: 4px;
  transition: background-color 0.2s;
}

.comments-list::-webkit-scrollbar-thumb:hover {
  background-color: rgba(var(--v-theme-on-surface), 0.3);
}

.loading-state,
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 300px;
}

.comments-content {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.comment-card {
  border: 1px solid rgba(var(--v-theme-on-surface), 0.12);
  border-radius: 8px;
  background-color: rgb(var(--v-theme-surface));
  transition: box-shadow 0.2s ease;
}

.comment-card:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.comment-header {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  background-color: rgb(var(--v-theme-grey-lighten-4));
  border-bottom: 1px solid rgba(var(--v-theme-on-surface), 0.08);
  border-radius: 8px 8px 0 0;
}

.comment-body {
  padding: 16px;
  white-space: pre-wrap;
  word-wrap: break-word;
  line-height: 1.6;
  color: rgb(var(--v-theme-on-surface));
}

.comment-attachments {
  padding: 0 16px 16px;
}

.attachment-chip {
  cursor: pointer;
  transition: transform 0.2s ease;
}

.attachment-chip:hover {
  transform: translateY(-1px);
}

.load-more-section {
  display: flex;
  justify-content: center;
  padding: 16px 0;
}

.form-section {
  position: sticky;
  bottom: 0;
  z-index: 10;
  padding: 16px;
  background-color: rgb(var(--v-theme-surface));
  border-top: 1px solid rgba(var(--v-theme-on-surface), 0.12);
  box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.05);
}

.files-preview {
  padding: 12px;
  background-color: rgb(var(--v-theme-grey-lighten-4));
  border: 1px dashed rgba(var(--v-theme-on-surface), 0.2);
  border-radius: 6px;
  margin-bottom: 12px;
}

.input-wrapper {
  display: flex;
  align-items: flex-end;
  gap: 8px;
}

.comment-input {
  flex-grow: 1;
}

.attach-btn,
.send-btn {
  flex-shrink: 0;
}

.internal-switch :deep(.v-switch__track) {
  height: 14px;
  width: 28px;
}

.internal-switch :deep(.v-switch__thumb) {
  height: 10px;
  width: 10px;
}

.gap-2 {
  gap: 8px;
}

@media (max-width: 600px) {
  .comments-container {
    height: 500px;
  }

  .filter-section,
  .form-section {
    padding: 12px;
  }

  .comments-list {
    padding: 12px;
  }
}
</style>
