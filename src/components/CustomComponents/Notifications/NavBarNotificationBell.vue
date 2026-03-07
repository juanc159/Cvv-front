<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthenticationStore } from '@/stores/useAuthenticationStore';
import { useNotificationStore } from './useNotificationStore';

const router = useRouter();
const notificationStore = useNotificationStore(); // Instanciar Store
const authenticationStore = useAuthenticationStore(); // Instanciar Auth Store
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

  // Iniciamos el listener global pasándole el ID del usuario actual.
  // El store se encargará de no duplicar el listener.
  if (authenticationStore.user?.id) {
    notificationStore.initializeListener(authenticationStore.user.id);
  }
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

const handleClick = (n: any) => {
  // 1. Marcar como leída si no lo está
  if (!n.isSeen) notificationStore.markAsRead([n.id]);

  // 2. Navegar a la URL de acción si existe
  if (n.action_url) {
    router.push(n.action_url);
  }
}
</script>

<template>
  <NotificationsList :notifications="notificationStore.notifications" :unreadCount="notificationStore.unreadCount"
    :loading="isLoading" :nextPageUrl="notificationStore.nextPageUrl" @remove="handleRemove" @read="handleRead"
    @unread="handleUnread" @click:notification="handleClick" @load-more="handleLoadMore"
    @click:view-all="handleViewAll" />
</template>
