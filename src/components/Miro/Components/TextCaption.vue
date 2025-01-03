<script setup lang="ts">
import { ITextCaption } from '../Actions/text-caption/TextCaptionTypes';

defineProps<{
  textCaptions: ITextCaption[]
}>()

const emit = defineEmits<{ (e: 'deleteTextCaption', textCaption: ITextCaption): void }>()
</script>

<template>

  <div class="card rounded " v-for="textCaption in textCaptions" :key="textCaption.id" :style="{
    backgroundColor: textCaption.color,
    position: 'absolute',
    left: textCaption.dragPosition.x + 'px',
    top: textCaption.dragPosition.y + 'px',
    width: textCaption.resizePosition.x + 'px',
    height: textCaption.resizePosition.y + 'px',
  }" :class="'text-caption-' + textCaption.id">

    <div class="d-flex flex-column h-100"> <!-- Contenedor flex para hacer que el contenido ocupe todo el alto -->

      <!-- Contenedor para los iconos en la parte superior (izquierda y derecha) -->
      <div class="d-flex justify-space-between pa-1">
        <!-- Icono en la esquina superior derecha -->
        <VBtn color="#000000" variant="tonal" :class="'text-caption-handler-' + textCaption.id" style="cursor: move;"
          icon size="25">
          <VIcon icon="tabler-arrows-move" size="15"></VIcon>
        </VBtn>

        <!-- Icono en la esquina superior izquierda -->
        <VBtn color="#000000" variant="tonal" icon size="25" @click="emit('deleteTextCaption', textCaption)">
          <VIcon icon="tabler-trash" size="15"></VIcon>
        </VBtn>

      </div>

      <!-- Card body que ocupa todo el espacio disponible -->
      <div :class="'contentEditable card-body flex-grow-1 pa-2 text-caption-body-' + textCaption.id"
        contenteditable="true">
        {{ textCaption.body }}
      </div>

      <!-- Icono en la esquina inferior derecha (siempre pegado al fondo de la tarjeta) -->
      <div class="d-flex justify-end pa-1 mt-auto">
        <VBtn color="#000000" variant="tonal" :class="'text-caption-resizer-' + textCaption.id"
          style="cursor: nw-resize;" icon size="25">
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
  font-weight: bold;
  border-radius: 4px;
}
</style>
