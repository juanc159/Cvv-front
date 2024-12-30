<script lang="ts" setup>
import { useDragMiniTextEditor } from '@/components/Miro/Actions/MiniTextEditor';
import { useDragStickyNote } from '@/components/Miro/Actions/StickyNote';
import { initYjs } from '@/components/Miro/yjs/yjs';
import { useShareUserCursor } from './Actions/useMouse';
import { yDocStore } from './Store/yDocStore';


const { trackMousePosition } = useShareUserCursor()

const {
  dragStickyNote,
  createStickyNote,
  stickyNote,
  deleteStickyNote,
  yArrayStickyNote,
  stickyNoteHasEventSet,
  changeStickyNoteBodyContent
} = useDragStickyNote()

const {
  dragMiniTextEditor,
  createMiniTextEditor,
  deleteMiniTextEditor,
  miniTextEditorHasEventSet,
  changeMiniTextEditorBodyContent
} = useDragMiniTextEditor()


const changeStickyNoteColor = (stickyNoteId: string, color: string) => {
  const singleStickyNote = stickyNote.value.find((stickyNote) => stickyNote.id === stickyNoteId)
  if (singleStickyNote) {
    singleStickyNote.color = color
  }
}

const changeMiniTextEditorColor = (miniTextEditorId: string, color: string) => {
  const singleMiniTextEditor = yDocStore.miniTextEditor.find((miniTextEditor) => miniTextEditor.id === miniTextEditorId)
  if (singleMiniTextEditor) {
    singleMiniTextEditor.color = color
  }
}

onMounted(() => {
  initYjs({
    yArrayStickyNote,
    stickyNoteHasEventSet,
    changeStickyNoteBodyContent,
    dragStickyNote,
    stickyNote
  }, {
    // yArrayMiniTextEditor,
    miniTextEditorHasEventSet,
    changeMiniTextEditorBodyContent,
    dragMiniTextEditor,
    // miniTextEditor
  })
})
</script>
<template>
  <div @mousemove="trackMousePosition" class="miro">
    <VContainer fluid class="d-flex gap-2">

      <div>
        <AddItem @createStickyNote="createStickyNote" @createMiniTextEditor="createMiniTextEditor" />

        <ColorPalette @changeStickyNoteColor="changeStickyNoteColor" :sticky-notes="stickyNote" />

        <UndoRedo />
      </div>

      <div>
        <VRow>
          <VCol cols="12">
            <StickyNote @deleteStickyNote="deleteStickyNote" :sticky-notes="stickyNote" />

            <MiniTextEditor @deleteMiniTextEditor="deleteMiniTextEditor" :miniTextEditors="yDocStore.miniTextEditor" />

            <UserCursor :mousePosition="yDocStore.mousePosition" />
          </VCol>
        </VRow>
      </div>

    </VContainer>


  </div>
</template>
