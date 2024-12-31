<script lang="ts" setup>
const emit = defineEmits<{
  (e: "redo"): void;
  (e: "undo"): void;
  (e: "resetCanvas"): void;

}>();
</script>
<template>

  <VSheet rounded elevation="10" class=" d-flex flex-column  pt-4 align-center gap-5 my-5" height="100" width="50">
    <!-- <VIcon @click="emit('resetCanvas')" icon="tabler-arrow-forward-up" class="cursor-pointer"></VIcon> -->
    <VIcon @click="emit('redo')" icon="tabler-arrow-forward-up" class="cursor-pointer"></VIcon>
    <VIcon @click="emit('undo')" icon="tabler-arrow-back-up" class="cursor-pointer"></VIcon>
  </VSheet>
</template>
