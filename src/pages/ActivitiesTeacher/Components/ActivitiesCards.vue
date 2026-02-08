<script setup lang="ts">
const props = defineProps<{
  items: any[]
  loading: boolean
}>()

const emit = defineEmits<{
  (e: 'edit', item: any): void
  (e: 'delete', id: string): void
}>()

const getStatusColor = (status: string) => {
  if (status === 'published') return 'success'
  if (status === 'closed') return 'error'
  return 'warning' // draft
}

const getStatusText = (status: string) => {
  if (status === 'published') return 'Publicada'
  if (status === 'closed') return 'Cerrada'
  return 'Borrador'
}

const formatDeadline = (iso?: string) => {
  if (!iso) return '—'
  // viene ISO: 2026-02-02T10:00:00.000000Z (ej)
  return iso.slice(0, 16).replace('T', ' ')
}
</script>

<template>
  <VRow>
    <VCol v-if="loading" cols="12">
      <VProgressLinear indeterminate />
    </VCol>

    <VCol v-for="item in items" :key="item.id" cols="12" md="6" lg="4">
      <VCard class="h-100 border card-hover">
        <VCardItem>
          <div class="d-flex justify-space-between align-start mb-3">
            <div class="d-flex flex-wrap align-center gap-2" style="gap: 8px;">
              <VChip size="small" :color="getStatusColor(item.status)" variant="flat" class="font-weight-bold">
                {{ getStatusText(item.status) }}
              </VChip>
            </div>

            <VMenu>
              <template #activator="{ props: menuProps }">
                <VBtn icon="tabler-dots" variant="text" size="small" v-bind="menuProps" class="mt-n2 me-n2" />
              </template>

              <VList>
                <VListItem @click="emit('edit', item)">
                  <template #prepend>
                    <VIcon icon="tabler-edit" size="20" />
                  </template>
                  <VListItemTitle>Editar Actividad</VListItemTitle>
                </VListItem>

                <VListItem @click="emit('delete', item.id)" class="text-error">
                  <template #prepend>
                    <VIcon icon="tabler-trash" size="20" />
                  </template>
                  <VListItemTitle>Eliminar</VListItemTitle>
                </VListItem>
              </VList>
            </VMenu>
          </div>

          <VCardTitle class="text-h6 mb-1 text-wrap pe-2" style="line-height: 1.4;">
            {{ item.title }}
          </VCardTitle>

          <p class="text-body-2 text-truncate-2 text-medium-emphasis" style="min-height: 42px;">
            {{ item.description || '—' }}
          </p>
        </VCardItem>

        <VDivider />

        <VCardText class="py-3 bg-var-theme-background">
          <div class="d-flex align-center mt-1 text-caption">
            <VIcon icon="tabler-calendar-time" size="16" class="me-1" />
            <span>Fecha límite: {{ formatDeadline(item.deadline_at) }}</span>
          </div>
        </VCardText>
      </VCard>
    </VCol>

    <VCol v-if="!loading && items.length === 0" cols="12">
      <VCard variant="outlined" class="pa-8 text-center text-medium-emphasis">
        No hay actividades para mostrar.
      </VCard>
    </VCol>
  </VRow>
</template>

<style scoped>
.text-truncate-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-hover {
  transition: transform 0.2s, box-shadow 0.2s;
}

.card-hover:hover {
  transform: translateY(-4px);
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.1) !important;
  border-color: rgb(var(--v-theme-primary)) !important;
}
</style>
