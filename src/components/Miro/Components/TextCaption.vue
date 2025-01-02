<script setup lang="ts">
import { ITextCaption } from '../Actions/text-caption/TextCaptionTypes';

defineProps<{
  textCaptions: ITextCaption[]
}>()

const emit = defineEmits<{ (e: 'deleteTextCaption', textCaption: ITextCaption): void }>()
</script>

<template>


  <VCard min-width="200" :color="textCaption.color" :class="'text-caption-' + textCaption.id"
    v-for="textCaption in textCaptions" :key="textCaption.id" :style="{
      left: textCaption.dragPosition.x + 'px',
      top: textCaption.dragPosition.y + 'px',
      width: textCaption.resizePosition.x + 'px',
      height: textCaption.resizePosition.y + 'px',
    }" class="border rounded shadow-sm">
    <VCardTitle class="d-flex justify-space-between align-items-center p-1">
      <VBtn color="red" icon size="25" variant="outlined" @click="emit('deleteTextCaption', textCaption)" class="p-0">
        <VIcon icon="tabler-trash" size="15" />
      </VBtn>
      <VBtn color="gray" :class="'text-caption-handler-' + textCaption.id" style="cursor: move;" icon size="25"
        variant="outlined" class="p-0">
        <VIcon icon="tabler-arrows-move" size="15" />
      </VBtn>
    </VCardTitle>

    <VCardText class="d-flex p-0" style="position: relative;">
      <div contenteditable="true" :class="'w-100  p-2 text-caption-body-' + textCaption.id"
        style="box-sizing: border-box; border: 1px solid #ddd; background-color: #f9f9f9; font-weight: bold; border-radius: 4px">
        {{ textCaption.body }}
      </div>
    </VCardText>

    <VCardActions class="d-flex justify-end align-end" style="position: absolute; bottom: 0; right: 0;">
      <VBtn color="gray" :class="'text-caption-resizer-' + textCaption.id" style="cursor: nw-resize;" icon size="25"
        variant="outlined">
        <VIcon icon="tabler-arrow-down-right" size="15" />
      </VBtn>
    </VCardActions>
  </VCard>
</template>
