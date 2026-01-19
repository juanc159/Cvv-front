<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useNotificationStore } from './useNotificationStore';

const router = useRouter();
const notificationStore = useNotificationStore(); // Instanciar Store
const isLoading = ref(false);

// Usamos el store para cargar y escuchar
onMounted(async () => {
  // Solo cargamos si está vacío para evitar llamadas dobles innecesarias, 
  // o forzamos carga si prefieres frescura.
  if (notificationStore.notifications.length === 0) {
    isLoading.value = true;
    await notificationStore.fetchNotifications();
    isLoading.value = false;
  }

  // Iniciamos el listener global (el store se encarga de no duplicarlo)
  notificationStore.initializeListener();
});

const handleLoadMore = async ({ done }: any) => {
  if (!notificationStore.nextPageUrl) { done('empty'); return; }
  try {
    await notificationStore.fetchNotifications(notificationStore.nextPageUrl);
    done('ok');
  } catch { done('error'); }
};

const handleViewAll = () => {
  router.push({ name: 'Notifications-Index' });
};

// Acciones directas al store
const handleRemove = (id) => notificationStore.remove(id);
const handleRead = (ids) => notificationStore.markAsRead(ids);
// Para unread, podrías agregar la acción al store si la necesitas
const handleUnread = async (ids) => {
  // Lógica rápida local o agregar acción 'markAsUnread' en el store
  await useApi('/notification/markMultipleAsUnread').post({ notification_ids: ids });
  // Actualizar store manual si no creaste la acción
  const notif = notificationStore.notifications.find(n => n.id === ids[0]);
  if (notif) { notif.isSeen = false; notificationStore.unreadCount++; }
};

const handleClick = (n) => {
  if (!n.isSeen) notificationStore.markAsRead([n.id]);
  if (n.action_url) { /* logica navegación */ }
}
</script>

<template>
  <NotificationsList :notifications="notificationStore.notifications" :unreadCount="notificationStore.unreadCount"
    :loading="isLoading" :nextPageUrl="notificationStore.nextPageUrl" @remove="handleRemove" @read="handleRead"
    @unread="handleUnread" @click:notification="handleClick" @load-more="handleLoadMore"
    @click:view-all="handleViewAll" />
</template>
