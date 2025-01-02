<script lang="ts" setup>
const emit = defineEmits<{
  (e: "redo"): void;
  (e: "undo"): void;
  (e: "resetCanvas"): void;

}>();
</script>

<template>
  <VSheet rounded elevation="10" class="d-flex flex-column justify-center align-center gap-5 my-5" width="50"
    height="170">
    <VBtn icon size="35" variant="tonal" @click="emit('resetCanvas')">
      <VIcon icon="tabler-refresh" class="cursor-pointer"></VIcon>
    </VBtn>
    <VBtn icon size="35" variant="tonal" @click="emit('redo')">
      <VIcon icon="tabler-arrow-forward-up" class="cursor-pointer"></VIcon>
    </VBtn>
    <VBtn icon size="35" variant="tonal" @click="emit('undo')">
      <VIcon icon="tabler-arrow-back-up" class="cursor-pointer"></VIcon>
    </VBtn>
  </VSheet>
</template>
