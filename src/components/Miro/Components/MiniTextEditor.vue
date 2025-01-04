<script setup lang="ts">
import { IMiniTextEditor } from '../Actions/editor/MiniTextEditorTypes';
import { yDocStore } from '../Store/yDocStore';

defineProps<{
  miniTextEditors: IMiniTextEditor[]
}>()

const emit = defineEmits<{ (e: 'deleteMiniTextEditor', miniTextEditor: IMiniTextEditor): void }>()


const updateBodyMiniTextEditor = (event: any, id: any) => {

  const index = yDocStore.miniTextEditor.findIndex((obj) => obj.id === id);

  const newContent = yDocStore.miniTextEditor[index].body = event;

  yDocStore.doc.transact(async () => {
    const trackMiniTextEditor = yDocStore.yArrayMiniTextEditor.get(index);

    if (trackMiniTextEditor) {
      trackMiniTextEditor.body = newContent;
    }

    yDocStore.yArrayMiniTextEditor.delete(index);
    yDocStore.yArrayMiniTextEditor.insert(index, [trackMiniTextEditor]);
  })
}
</script>

<template>


  <div class="card rounded border border-dark border-5" v-for="miniTextEditor in miniTextEditors"
    :key="miniTextEditor.id" :style="{
      backgroundColor: '#ccc',
      position: 'absolute',
      left: miniTextEditor.dragPosition.x + 'px',
      top: miniTextEditor.dragPosition.y + 'px',
      height: miniTextEditor.resizePosition.y + 'px',
    }" :class="'text-editor-' + miniTextEditor.id">

    <div class="d-flex flex-column h-100"> <!-- Contenedor flex para hacer que el contenido ocupe todo el alto -->

      <!-- Contenedor para los iconos en la parte superior (izquierda y derecha) -->
      <div class="d-flex justify-space-between pa-1">
        <!-- Icono en la esquina superior derecha -->
        <VBtn color="#000000" variant="tonal" :class="'text-editor-handler-' + miniTextEditor.id" style="cursor: move;"
          icon size="25">
          <VIcon icon="tabler-arrows-move" size="15"></VIcon>
        </VBtn>

        <!-- Icono en la esquina superior izquierda -->
        <VBtn color="#000000" variant="tonal" icon size="25" @click="emit('deleteMiniTextEditor', miniTextEditor)">
          <VIcon icon="tabler-trash" size="15"></VIcon>
        </VBtn>
      </div>

      <BlinkingCursor :miniTextEditorId="miniTextEditor.id" :x="yDocStore.cursor.x" :y="yDocStore.cursor.y" />

      <!-- Card body que ocupa todo el espacio disponible -->
      <TiptapEditor placeholder="Content here ..." v-model="miniTextEditor.body"
        @update:model-value="updateBodyMiniTextEditor($event, miniTextEditor.id)"
        :class="'border rounded basic-editor  text-editor-body-' + miniTextEditor.id"></TiptapEditor>

      <!-- Icono en la esquina inferior derecha (siempre pegado al fondo de la tarjeta) -->
      <div class="d-flex justify-end pa-1 mt-auto">
        <VBtn color="#000000" variant="tonal" :class="'text-editor-resizer-' + miniTextEditor.id"
          style="cursor: nw-resize;" icon size="25">
          <VIcon icon="tabler-arrow-down-right" size="15"></VIcon>
        </VBtn>
      </div>

    </div>
  </div>

</template>

<style lang="scss" scoped>
.basic-editor {
  // block-size: 200px;
  outline: none;
  overflow-y: auto;
  padding-inline: 0.5rem;
  color: black;
  border: 1px solid black;
  color: black;
}
</style>
