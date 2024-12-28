<script setup lang="ts">

const emit = defineEmits<{ (e: "createStickyNote"): void, (e: "createMiniTextEditor"): void }>()

</script>

<template>
  <VSheet rounded elevation="10" class="d-flex flex-column justify-center align-center gap-5 my-5" height="100"
    width="50">
    <VBtn icon size="35" variant="tonal" @click="emit('createStickyNote')">
      <VIcon icon="tabler-sticker-2" class="cursor-pointer" size="20"></VIcon>
    </VBtn>
    <VBtn icon size="35" variant="tonal" @click="emit('createMiniTextEditor')">
      <VIcon icon="tabler-file" class="cursor-pointer" size="20"></VIcon>
    </VBtn>
  </VSheet>
</template>
