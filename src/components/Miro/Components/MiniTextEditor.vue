<script setup lang="ts">
import { IMiniTextEditor } from '../Actions/MiniTextEditorTypes';



defineProps<{
  miniTextEditors: IMiniTextEditor[]
}>()

const emit = defineEmits<{ (e: 'deleteMiniTextEditor', miniTextEditor: IMiniTextEditor): void }>()

</script>

<template>
  <VCard :class="'text-editor-' + miniTextEditor.id" v-for="miniTextEditor in miniTextEditors" :key="miniTextEditor.id"
    :style="{
      left: miniTextEditor.dragPosition.x + 'px',
      top: miniTextEditor.dragPosition.y + 'px',
      width: miniTextEditor.resizePosition.x + 'px',
      height: miniTextEditor.resizePosition.y + 'px',
    }">
    <VCardTitle class="d-flex justify-space-between">
      <VBtn @click="emit('deleteMiniTextEditor', miniTextEditor)" color="#000000" icon size="25" variant="outlined">
        <VIcon icon="tabler-trash" size="15"></VIcon>
      </VBtn>
      <VBtn color="#000000" :class="'text-editor-handler-' + miniTextEditor.id" style="cursor: move;" icon size="25"
        variant="outlined">
        <VIcon icon="tabler-arrows-move" size="15"></VIcon>
      </VBtn>
    </VCardTitle>
    <VCardText class="d-flex p-0">
      <TiptapEditor placeholder="Content here ..." v-model="miniTextEditor.body"
        :class="'border rounded basic-editor text-editor-body-' + miniTextEditor.id"></TiptapEditor>
    </VCardText>
    <VCardActions class="d-flex justify-end align-end" style="position: absolute; bottom: 0; right: 0;">
      <VBtn color="#000000" :class="'text-editor-resizer-' + miniTextEditor.id" style="cursor: nw-resize;" icon
        size="25" variant="outlined">
        <VIcon icon="tabler-arrow-down-right" size="15"></VIcon>
      </VBtn>
    </VCardActions>
  </VCard>

</template>

<style lang="scss">
.basic-editor {
  .ProseMirror {
    // block-size: 200px;
    outline: none;
    overflow-y: auto;
    padding-inline: 0.5rem;
  }
}
</style>
