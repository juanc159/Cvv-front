<script setup lang="ts">
import { IStickyNote } from '../Actions/sticky-note/StickyNoteTypes';

defineProps<{
  stickyNotes: IStickyNote[]
}>()

const emit = defineEmits<{ (e: 'deleteStickyNote', stickyNote: IStickyNote): void }>()
</script>

<template>

  <div class="card rounded" v-for="stickyNote in stickyNotes" :key="stickyNote.id" :style="{
    backgroundColor: stickyNote.color,
    position: 'absolute',
    top: stickyNote.dragPosition.y + 'px',
    left: stickyNote.dragPosition.x + 'px',
    width: stickyNote.resizePosition.x + 'px',
    height: stickyNote.resizePosition.y + 'px',
  }" :class="'  sticky-note-' + stickyNote.id">

    <div class="d-flex flex-column h-100"> <!-- Contenedor flex para hacer que el contenido ocupe todo el alto -->

      <!-- Contenedor para los iconos en la parte superior (izquierda y derecha) -->
      <div class="d-flex justify-space-between pa-1">
        <!-- Icono en la esquina superior derecha -->
        <VBtn color="#000000" variant="tonal" :class="'sticky-note-handler-' + stickyNote.id" style="cursor: move;" icon
          size="25">
          <VIcon icon="tabler-arrows-move" size="15"></VIcon>
        </VBtn>

        <!-- Icono en la esquina superior izquierda -->
        <VBtn color="#000000" variant="tonal" icon size="25" @click="emit('deleteStickyNote', stickyNote)">
          <VIcon icon="tabler-trash" size="15"></VIcon>
        </VBtn>

      </div>

      <!-- Card body que ocupa todo el espacio disponible -->
      <div :class="'contentEditable card-body flex-grow-1 pa-2 sticky-note-body-' + stickyNote.id"
        contenteditable="true">
        {{ stickyNote.body }}
      </div>

      <!-- Icono en la esquina inferior derecha (siempre pegado al fondo de la tarjeta) -->
      <div class="d-flex justify-end pa-1 mt-auto">
        <VBtn color="#000000" variant="tonal" :class="'sticky-note-resizer-' + stickyNote.id" style="cursor: nw-resize;"
          icon size="25">
          <VIcon icon="tabler-arrow-down-right" size="15"></VIcon>
        </VBtn>
      </div>

    </div>
  </div>

</template>

<style lang="scss" scoped>
.contentEditable {
  color: black;
  border: 1px solid #ddd;
  background-color: #f9f9f9;
  border-radius: 4px;
}
</style>
