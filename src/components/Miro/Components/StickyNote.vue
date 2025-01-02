<script setup lang="ts">
import { IStickyNote } from '../Actions/sticky-note/StickyNoteTypes';

defineProps<{
  stickyNotes: IStickyNote[]
}>()

const emit = defineEmits<{ (e: 'deleteStickyNote', stickyNote: IStickyNote): void }>()
</script>

<template>
  <VCard min-width="200" min-height="200" :color="stickyNote.color" :class="'sticky-note-' + stickyNote.id"
    v-for="stickyNote in stickyNotes" :key="stickyNote.id" :style="{
      left: stickyNote.dragPosition.x + 'px',
      top: stickyNote.dragPosition.y + 'px',
      width: stickyNote.resizePosition.x + 'px',
      height: stickyNote.resizePosition.y + 'px',
    }">
    <VCardTitle class="d-flex justify-space-between">
      <VBtn color="#000000" icon size="25" variant="outlined" @click="emit('deleteStickyNote', stickyNote)">
        <VIcon icon="tabler-trash" size="15"></VIcon>
      </VBtn>
      <VBtn color="#000000" :class="'sticky-note-handler-' + stickyNote.id" style="cursor: move;" icon size="25"
        variant="outlined">
        <VIcon icon="tabler-arrows-move" size="15"></VIcon>
      </VBtn>
    </VCardTitle>
    <VCardText class="d-flex p-0" style="height: 60%; width: 100%;">
      <div contenteditable="true" :class="'w-100 h-100 p-2 sticky-note-body-' + stickyNote.id"
        style="box-sizing: border-box;">
        {{ stickyNote.body }}
      </div>
    </VCardText>
    <VCardActions class="d-flex justify-end align-end" style="position: absolute; bottom: 0; right: 0;">
      <VBtn color="#000000" :class="'sticky-note-resizer-' + stickyNote.id" style="cursor: nw-resize;" icon size="25"
        variant="outlined">
        <VIcon icon="tabler-arrow-down-right" size="15"></VIcon>
      </VBtn>
    </VCardActions>
  </VCard>

</template>
