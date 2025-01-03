<script setup lang="ts">

const emit = defineEmits<{
  (e: "createDivNew"): void;
  (e: "saveBoardData"): void;
  (e: "createTextCaption"): void;
  (e: "createStickyNote"): void;
  (e: "createMiniTextEditor"): void;
  (e: "initDrawing"): void;
}>()

</script>

<template>
  <VSheet rounded elevation="10" class="d-flex flex-column justify-center align-center gap-5 my-5" width="50"
    height="270">
    <!-- <VBtn icon size="35" variant="tonal" @click="emit('createDivNew')">
      <VIcon icon="tabler-plus" class="cursor-pointer" size="20"></VIcon>
    </VBtn> -->
    <VBtn icon size="35" variant="tonal" @click="emit('saveBoardData')">
      <VIcon icon="tabler-device-floppy" class="cursor-pointer" size="20"></VIcon>
    </VBtn>
    <VBtn icon size="35" variant="tonal" @click="emit('createTextCaption')">
      <VIcon icon="tabler-clear-formatting" class="cursor-pointer" size="20"></VIcon>
    </VBtn>
    <VBtn icon size="35" variant="tonal" @click="emit('initDrawing')">
      <VIcon icon="tabler-writing" class="cursor-pointer" size="20"></VIcon>
    </VBtn>
    <VBtn icon size="35" variant="tonal" @click="emit('createStickyNote')">
      <VIcon icon="tabler-sticker-2" class="cursor-pointer" size="20"></VIcon>
    </VBtn>
    <VBtn icon size="35" variant="tonal" @click="emit('createMiniTextEditor')">
      <VIcon icon="tabler-file" class="cursor-pointer" size="20"></VIcon>
    </VBtn>
    <!-- Puedes agregar más botones aquí, y seguirán alineados verticalmente -->
  </VSheet>
</template>
