<script lang="ts" setup>
import type { Notification } from '@layouts/types';
import { computed } from 'vue';

interface Props {
  notifications: Notification[]
  badgeProps?: object
  location?: any
  loading: boolean
  unreadCount?: number
  nextPageUrl?: string | null
}

interface Emit {
  (e: 'read', value: number[]): void
  (e: 'unread', value: number[]): void
  (e: 'remove', value: number): void
  (e: 'click:notification', value: Notification): void
  (e: 'load-more', { done }: any): void
  (e: 'click:view-all'): void // <--- NUEVO EVENTO
}

const props = withDefaults(defineProps<Props>(), {
  location: 'bottom end',
  badgeProps: undefined,
  unreadCount: 0
})

const emit = defineEmits<Emit>()

const isAllMarkRead = computed(() => {
  return props.notifications.length > 0 && props.notifications.every(item => item.isSeen)
})

const markAllReadOrUnread = () => {
  if (!isAllMarkRead.value) {
    const unreadIds = props.notifications.filter(item => !item.isSeen).map(item => item.id)
    if (unreadIds.length) emit('read', unreadIds)
  } else {
    const readIds = props.notifications.map(item => item.id)
    if (readIds.length) emit('unread', readIds)
  }
}

const toggleReadUnread = (isSeen: boolean, id: number) => {
  if (isSeen) emit('unread', [id])
  else emit('read', [id])
}
</script>

<template>
  <IconBtn id="notification-btn">
    <VBadge dot v-bind="props.badgeProps" :model-value="props.unreadCount > 0" :content="props.unreadCount"
      color="error" offset-x="2" offset-y="3">
      <VIcon icon="tabler-bell" />
    </VBadge>

    <VMenu activator="parent" width="380px" :location="props.location" offset="12px" :close-on-content-click="false">
      <VCard class="d-flex flex-column">
        <VCardItem class="notification-section">
          <VCardTitle class="text-h6">Notificaciones</VCardTitle>
          <template #append>
            <VChip v-if="props.unreadCount > 0" size="small" color="primary" class="me-2">
              {{ props.unreadCount }} Nueva(s)
            </VChip>
            <IconBtn v-show="props.notifications.length" size="34" @click="markAllReadOrUnread">
              <VIcon size="20" color="high-emphasis" :icon="!isAllMarkRead ? 'tabler-mail' : 'tabler-mail-opened'" />
              <VTooltip activator="parent" location="start">
                {{ !isAllMarkRead ? 'Marcar todo como leído' : 'Marcar todo como no leído' }}
              </VTooltip>
            </IconBtn>
          </template>
        </VCardItem>

        <VDivider />

        <VList class="notification-list rounded-0 py-0" style="max-height: 400px; overflow-y: auto;">
          <v-infinite-scroll v-if="props.notifications.length" mode="manual" :items="props.notifications"
            @load="$emit('load-more', $event)" style="overflow-y: hidden;">
            <template v-for="(notification, index) in props.notifications" :key="notification.id">
              <VDivider v-if="index > 0" />
              <VListItem link lines="one" min-height="66px" class="list-item-hover-class"
                @click="$emit('click:notification', notification)">
                <div class="d-flex align-start gap-3">
                  <VAvatar :color="notification.color && !notification.img ? notification.color : undefined"
                    :variant="notification.img ? undefined : 'tonal'">
                    <VImg v-if="notification.img" :src="storageBack(notification.img)" />
                    <VIcon v-else-if="notification.icon" :icon="notification.icon" />
                    <span v-else>{{ avatarText(notification.title) }}</span>
                  </VAvatar>

                  <div>
                    <p class="text-sm font-weight-medium mb-1 text-wrap">{{ notification.title }}</p>
                    <p class="text-body-2 mb-2 text-wrap" style="line-height: 1.4;">{{ notification.subtitle }}</p>
                    <p class="text-caption text-disabled mb-0">{{ notification.time }}</p>
                  </div>

                  <VSpacer />

                  <div class="d-flex flex-column align-end">
                    <VIcon size="10" icon="tabler-circle-filled" :color="!notification.isSeen ? 'primary' : 'disabled'"
                      :class="notification.isSeen ? 'visible-in-hover' : ''" class="mb-2" title="Marcar leído/no leído"
                      @click.stop="toggleReadUnread(notification.isSeen, notification.id)" />
                    <VIcon v-if="notification.isSeen" size="18" icon="tabler-x"
                      class="visible-in-hover text-medium-emphasis" title="Eliminar"
                      @click.stop="$emit('remove', notification.id)" />
                  </div>
                </div>
              </VListItem>
            </template>
            <template #loading>
              <div class="d-flex justify-center pa-4">
                <VProgressCircular indeterminate color="primary" size="24" />
              </div>
            </template>
            <template #empty>
              <div class="text-center pa-2 text-caption text-disabled">No hay más notificaciones</div>
            </template>
            <template #load-more="{ props }">
              <VBtn v-bind="props" variant="text" size="small" block :loading="props.loading">Cargar más</VBtn>
            </template>
          </v-infinite-scroll>

          <div v-else class="text-center pa-6 text-medium-emphasis">
            <VIcon icon="tabler-bell-off" size="40" class="mb-2 text-disabled" />
            <p class="text-body-2 mb-0">¡No tienes notificaciones!</p>
          </div>
        </VList>

        <VDivider />

        <VCardText class="pa-2 text-center">
          <VBtn variant="text" size="x-small" color="primary" block @click="$emit('click:view-all')">
            Ver todas
          </VBtn>
        </VCardText>
      </VCard>
    </VMenu>
  </IconBtn>
</template>

<style lang="scss">
.notification-section {
  padding-block: 0.75rem;
  padding-inline: 1rem;
}

.list-item-hover-class {
  .visible-in-hover {
    display: none;
  }

  &:hover {
    .visible-in-hover {
      display: block;
    }
  }
}

.notification-list.v-list {
  .v-list-item {
    border-radius: 0 !important;
    margin: 0 !important;
    padding-block: 0.75rem !important;
  }
}
</style>
