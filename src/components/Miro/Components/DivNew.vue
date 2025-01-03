<script setup lang="ts">
import { IDivNew } from '../Actions/div-new/DivNewTypes';



defineProps<{
  divNews: IDivNew[]
}>()

const emit = defineEmits<{ (e: 'deleteDivNew', divNew: IDivNew): void }>()
</script>

<template>
  <VCard min-width="200" min-height="200" :color="divNew.color" :class="'div-new-' + divNew.id"
    v-for="divNew in divNews" :key="divNew.id" :style="{
      left: divNew.dragPosition.x + 'px',
      top: divNew.dragPosition.y + 'px',
      width: divNew.resizePosition.x + 'px',
      height: divNew.resizePosition.y + 'px',
    }">
    <VCardTitle class="d-flex justify-space-between">
      <VBtn color="#000000" icon size="25" variant="outlined" @click="emit('deleteDivNew', divNew)">
        <VIcon icon="tabler-trash" size="15"></VIcon>
      </VBtn>
      <VBtn color="#000000" :class="'div-new-handler-' + divNew.id" style="cursor: move;" icon size="25"
        variant="outlined">
        <VIcon icon="tabler-arrows-move" size="15"></VIcon>
      </VBtn>
    </VCardTitle>
    <VCardText class="d-flex p-0" style="height: 60%; width: 100%;">111111111111111111
      <div contenteditable="true" :class="'w-100 h-100 p-2 div-new-body-' + divNew.id" style="box-sizing: border-box;">
        {{ divNew.body }}
      </div>
    </VCardText>
    <VCardActions class="d-flex justify-end align-end" style="position: absolute; bottom: 0; right: 0;">
      <VBtn color="#000000" :class="'div-new-resizer-' + divNew.id" style="cursor: nw-resize;" icon size="25"
        variant="outlined">
        <VIcon icon="tabler-arrow-down-right" size="15"></VIcon>
      </VBtn>
    </VCardActions>
  </VCard>

</template>
