<script lang="ts" setup>

const elementId = computed(() => {
  const attrs = useAttrs();
  const _elementIdToken = attrs.id || attrs.label;

  return _elementIdToken
    ? `app-textFile-field-${_elementIdToken}-${Math.random()
      .toString(36)
      .slice(2, 7)}`
    : undefined;
});


const props = defineProps<{
  show: boolean;
}>();

const emit = defineEmits<{
  (e: "closeModal"): void;
}>();

</script>

<template>
  <VDialog v-bind="{
    ...$attrs,
    id: elementId,
  }" v-model="props.show" :scrim="false" transition="dialog-bottom-transition">

    <!-- Dialog close btn -->
    <DialogCloseBtn @click="emit('closeModal')" />

    <!-- Toolbar -->
    <div>
      <VToolbar color="primary">
        <VToolbarTitle>
          <slot name="title"></slot>
        </VToolbarTitle>
      </VToolbar>
    </div>
    <VCard>
      <VCardText>
        <slot name="body"> </slot>
      </VCardText>

      <VCardText>
        <slot name="footer"> </slot>
      </VCardText>

    </VCard>
  </VDialog>
</template>

<style lang="scss">
.dialog-bottom-transition-enter-active,
.dialog-bottom-transition-leave-active {
  transition: transform 0.2s ease-in-out;
}
</style>
