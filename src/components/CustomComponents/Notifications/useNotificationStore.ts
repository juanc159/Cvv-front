import { useToast } from '@/composables/useToast'; // Ajusta la ruta si es necesario
import { useAuthenticationStore } from "@/stores/useAuthenticationStore";
import type { Notification } from '@layouts/types';
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useNotificationStore = defineStore('notification', () => {
  // --- ESTADO GLOBAL ---
  const notifications = ref<Notification[]>([]);
  const unreadCount = ref(0);
  const nextPageUrl = ref<string | null>(null);
  const isListening = ref(false); // Evita duplicar listeners

  // Stores externos
  const authStore = useAuthenticationStore();
  const { toast } = useToast();

  // --- ACCIONES ---

  // 1. Cargar Notificaciones (API)
  const fetchNotifications = async (url = '/notification/getNotifications', reset = false) => {
    const { response, data } = await useApi(url).get();

    if (response.value?.ok && data.value) {
      if (reset) {
        notifications.value = data.value.notifications;
      } else {
        // Concatenamos evitando duplicados por seguridad
        const newItems = data.value.notifications.filter((n: Notification) =>
          !notifications.value.some(existing => existing.id === n.id)
        );
        notifications.value.push(...newItems);
      }

      nextPageUrl.value = data.value.nextPageUrl;

      // Actualizamos el contador solo en la primera página para mantener sincronía
      if (url === '/notification/getNotifications') {
        unreadCount.value = data.value.unreadCount;
      }
    }
  };

  // 2. Marcar como Leído
  const markAsRead = async (ids: (string | number)[]) => {
    // Optimistic Update (Actualizamos la UI antes de la respuesta)
    notifications.value.forEach(n => {
      if (ids.includes(n.id) && !n.isSeen) {
        n.isSeen = true;
        unreadCount.value = Math.max(0, unreadCount.value - 1);
      }
    });

    await useApi('/notification/markMultipleAsRead').post({ notification_ids: ids });
  };

  // 3. Marcar como NO Leído (NUEVO)
  const markAsUnread = async (ids: (string | number)[]) => {
    // Optimistic Update
    notifications.value.forEach(n => {
      if (ids.includes(n.id) && n.isSeen) {
        n.isSeen = false;
        unreadCount.value++;
      }
    });

    await useApi('/notification/markMultipleAsUnread').post({ notification_ids: ids });
  };

  // 4. Eliminar
  const remove = async (id: string | number) => {
    const index = notifications.value.findIndex(n => n.id === id);
    if (index !== -1) {
      // Si eliminamos una no leída, opcionalmente bajamos el contador
      // if (!notifications.value[index].isSeen) unreadCount.value--; 
      notifications.value.splice(index, 1);
    }

    await useApi('/notifications/remove').post({ notification_ids: [id] });
  };

  // 5. Marcar Todo como Leído
  const markAllRead = async () => {
    const unreadIds = notifications.value.filter(n => !n.isSeen).map(n => n.id);
    if (unreadIds.length === 0) return;

    notifications.value.forEach(n => n.isSeen = true);
    unreadCount.value = 0;

    await useApi('/notification/markMultipleAsRead').post({ notification_ids: unreadIds });
    toast('Todo marcado como leído', '', 'success');
  };

  // 6. Inicializar WebSockets (Centralizado)
  const initializeListener = () => {
    if (isListening.value || !authStore.user?.id) return;

    console.log('🔌 Iniciando WebSocket Global para Notificaciones');

    // Canal privado estándar de Laravel: App.Models.User.{id}
    window.Echo.private('App.Models.User.' + authStore.user.id)

      // Escucha actualizaciones (borrado/leído en otros dispositivos)
      .listen('.update-notification', (event: any) => {
        unreadCount.value = event.activeNotificationsCount;

        if (event.notifications && Array.isArray(event.notifications)) {
          event.notifications.forEach((updatedNotif: any) => {
            const index = notifications.value.findIndex(n => n.id === updatedNotif.id);
            if (index !== -1) {
              if (updatedNotif.is_removed) {
                notifications.value.splice(index, 1);
              } else {
                notifications.value[index].isSeen = updatedNotif.isSeen;
              }
            }
          });
        }
      })
      // Escucha nuevas notificaciones
      .notification((notification: any) => {
        unreadCount.value++;

        notifications.value.unshift({
          id: notification.id,
          title: notification.title,
          subtitle: notification.subtitle,
          text: notification.text || null,
          img: notification.img || null,
          icon: notification.icon || 'tabler-bell',
          time: 'Ahora mismo',
          isSeen: false,
          color: notification.color || 'primary',
          action_url: notification.action_url,
          openInNewTab: notification.openInNewTab
        });

        toast(notification.title, notification.subtitle || 'Nueva notificación', 'info');
      });

    isListening.value = true;
  };

  // Función para desconectarse del canal personal
  const stopListening = (userId: string) => {
    if (!userId) return;

    console.log(`🔌 Desconectando canal de notificaciones: App.Models.User.${userId}`);

    // IMPORTANTE: Laravel Echo maneja el prefijo 'private-' internamente.
    // Solo debes pasar el nombre de la clase y el ID.
    // Asegúrate de tener acceso a tu instancia de Echo (window.Echo o importada).
    window.Echo.leave(`App.Models.User.${userId}`);
  }

  return {
    notifications,
    unreadCount,
    nextPageUrl,
    fetchNotifications,
    markAsRead,
    markAsUnread,
    remove,
    markAllRead,
    initializeListener,
    stopListening
  };
});
