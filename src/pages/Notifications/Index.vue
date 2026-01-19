<script setup lang="ts">
import { useNotificationStore } from '@/components/CustomComponents/Notifications/useNotificationStore';
import { useToast } from '@/composables/useToast';
import type { Notification } from '@layouts/types';
import { storeToRefs } from 'pinia';
import { onMounted, reactive, ref } from 'vue';

const { toast } = useToast();
const notificationStore = useNotificationStore();

// Extraemos estado reactivo del store
const { notifications, unreadCount, nextPageUrl } = storeToRefs(notificationStore);

definePage({
  name: "Notifications-Index",
  meta: {
    redirectIfLoggedIn: true,
    requiresAuth: true,
  },
})

// Estado local para UI (cargas)
const isLoading = ref(false); // Carga inicial
const isMarkingAll = ref(false); // Carga masiva
const processingIds = reactive(new Set<string | number>()); // Spinners individuales

// --- Ciclo de Vida ---
onMounted(async () => {
  // Solo cargamos si el store está vacío para aprovechar el caché de Pinia
  if (notifications.value.length === 0) {
    isLoading.value = true;
    try {
      await notificationStore.fetchNotifications();
    } finally {
      isLoading.value = false;
    }
  }
});

// --- Acciones ---

const markAsRead = async (id: string | number) => {
  processingIds.add(id);
  try {
    await notificationStore.markAsRead([id]);
  } finally {
    processingIds.delete(id);
  }
};

const markAsUnread = async (id: string | number) => {
  processingIds.add(id);
  try {
    await notificationStore.markAsUnread([id]);
  } finally {
    processingIds.delete(id);
  }
};

const removeNotification = async (id: string | number) => {
  processingIds.add(id);
  try {
    await notificationStore.remove(id);
    toast('Notificación eliminada', '', 'success');
  } finally {
    processingIds.delete(id);
  }
};

const markAllAsRead = async () => {
  isMarkingAll.value = true;
  try {
    await notificationStore.markAllRead();
  } finally {
    isMarkingAll.value = false;
  }
};

const handleLoadMore = async () => {
  if (nextPageUrl.value) {
    // Nota: No activamos isLoading global para no ocultar la lista existente
    await notificationStore.fetchNotifications(nextPageUrl.value);
  }
};

const handleNotificationClick = (notification: Notification) => {
  // Si no está leída, marcarla
  if (!notification.isSeen) markAsRead(notification.id);

  // Navegación
  if (notification.action_url) {
    if (notification.openInNewTab) window.open(notification.action_url, '_blank');
    else window.location.href = notification.action_url;
  }
};
</script>

<template>
  <VContainer>
    <VRow justify="center">
      <VCol cols="12" md="10" lg="8">
        <VCard class="pb-4">

          <VCardItem class="border-b mb-2 py-4">
            <template #prepend>
              <VIcon icon="tabler-bell" size="32" class="me-2 text-primary" />
            </template>
            <VCardTitle class="text-h5">Centro de Notificaciones</VCardTitle>
            <VCardSubtitle>
              Tienes {{ unreadCount }} notificación(es) sin leer
            </VCardSubtitle>

            <template #append>
              <VBtn v-if="unreadCount > 0" variant="tonal" color="primary" size="small"
                prepend-icon="tabler-mail-opened" :loading="isMarkingAll" @click="markAllAsRead">
                Marcar todo como leído
              </VBtn>
            </template>
          </VCardItem>

          <div v-if="isLoading && notifications.length === 0" class="pa-4">
            <div v-for="i in 3" :key="i" class="d-flex align-center gap-3 mb-4">
              <VSkeletonLoader type="avatar" />
              <div class="w-100">
                <VSkeletonLoader type="text" class="mb-1" width="60%" />
                <VSkeletonLoader type="text" width="40%" />
              </div>
            </div>
          </div>

          <VList v-else lines="two" class="pa-0">
            <template v-if="notifications.length > 0">
              <template v-for="(item, index) in notifications" :key="item.id">
                <VDivider v-if="index > 0" />

                <VListItem :class="{ 'bg-var-theme-background': !item.isSeen }" class="py-3 px-4 notification-item"
                  :disabled="processingIds.has(item.id) || isMarkingAll" @click="handleNotificationClick(item)">
                  <template #prepend>
                    <div v-if="processingIds.has(item.id)" class="me-3 d-flex align-center justify-center"
                      style="width: 40px; height: 40px;">
                      <VProgressCircular indeterminate color="primary" size="24" />
                    </div>
                    <VAvatar v-else :color="item.color || 'primary'" variant="tonal" size="40" class="me-3">
                      <VImg v-if="item.img" :src="storageBack(item.img)" />
                      <VIcon v-else :icon="item.icon || 'tabler-bell'" />
                    </VAvatar>
                  </template>

                  <VListItemTitle class="font-weight-bold mb-1">
                    {{ item.title }}
                    <VChip v-if="!item.isSeen" size="x-small" color="error" class="ms-2" label>Nueva</VChip>
                  </VListItemTitle>

                  <VListItemSubtitle class="text-body-2 text-high-emphasis mb-1">
                    {{ item.subtitle }}
                  </VListItemSubtitle>

                  <VListItemSubtitle v-if="item.text" class="text-caption">
                    {{ item.text }}
                  </VListItemSubtitle>

                  <template #append>
                    <div class="d-flex flex-column align-end gap-2">
                      <span class="text-caption text-disabled">{{ item.time }}</span>

                      <div class="actions">
                        <VBtn v-if="!item.isSeen" icon variant="text" color="primary" size="small"
                          :disabled="processingIds.has(item.id)" @click.stop="markAsRead(item.id)">
                          <VIcon icon="tabler-circle-check"></VIcon>
                          <VTooltip activator="parent" location="top">
                            Marcar como leída
                          </VTooltip>
                        </VBtn>

                        <VBtn v-else icon variant="text" color="medium-emphasis" size="small"
                          :disabled="processingIds.has(item.id)" @click.stop="markAsUnread(item.id)">
                          <VIcon icon="tabler-circle"></VIcon>
                          <VTooltip activator="parent" location="top">
                            Marcar como no leída
                          </VTooltip>
                        </VBtn>

                        <VBtn icon variant="text" color="error" size="small" :disabled="processingIds.has(item.id)"
                          @click.stop="removeNotification(item.id)">
                          <VIcon icon="tabler-trash"></VIcon>
                          <VTooltip activator="parent" location="top">
                            Eliminar
                          </VTooltip>
                        </VBtn>
                      </div>
                    </div>
                  </template>
                </VListItem>
              </template>
            </template>

            <div v-else class="text-center pa-10">
              <VAvatar color="surface-variant" size="80" class="mb-4">
                <VIcon icon="tabler-bell-off" size="40" />
              </VAvatar>
              <h3 class="text-h6">No hay notificaciones</h3>
              <p class="text-disabled">Estás al día con todo.</p>
            </div>
          </VList>

          <div v-if="nextPageUrl" class="text-center mt-4">
            <VBtn variant="text" :loading="isLoading && notifications.length > 0" @click="handleLoadMore">
              Cargar notificaciones antiguas
            </VBtn>
          </div>

        </VCard>
      </VCol>
    </VRow>
  </VContainer>
</template>

<style scoped>
.notification-item {
  transition: background-color 0.2s, opacity 0.2s;
  cursor: pointer;
}

.notification-item:hover {
  background-color: rgba(var(--v-theme-on-surface), 0.04) !important;
}

.notification-item.v-list-item--disabled {
  opacity: 0.6;
  pointer-events: none;
}
</style>
