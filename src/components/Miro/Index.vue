<script lang="ts" setup>
import { useDragMiniTextEditor } from '@/components/Miro/Actions/editor/MiniTextEditor';
import { useDragStickyNote } from '@/components/Miro/Actions/sticky-note/StickyNote';
import { initYjs } from '@/components/Miro/yjs/yjs';
import { useCanvas } from './Actions/canvas/canvas';
import { useShareUserCursor } from './Actions/cursor/useMouse';
import { useGetProjectBoardData } from './Actions/http/getProjectBoardData';
import { useSaveData } from './Actions/http/useSaveData';
import { useDragTextCaption } from './Actions/text-caption/TextCaption';
import { yDocStore } from './Store/yDocStore';

import { useAuthenticationStore } from "@/stores/useAuthenticationStore";
import { useDragDivNew } from './Actions/div-new/DivNew';
import { useGetProjectDetail } from './Actions/http/getProjectDetail';

const authenticationStore = useAuthenticationStore();

const props = defineProps<{
  code: string,
}>()

const { initCanvas } = useCanvas()

const { trackMousePosition } = useShareUserCursor()

const {
  dragStickyNote,
  createStickyNote,
  deleteStickyNote,
  stickyNoteHasEventSet,
  changeStickyNoteBodyContent
} = useDragStickyNote()

const {
  dragDivNew,
  createDivNew,
  deleteDivNew,
  divNewHasEventSet,
  changeDivNewBodyContent
} = useDragDivNew()

const {
  dragTextCaption,
  createTextCaption,
  deleteTextCaption,
  textCaptionHasEventSet,
  changeTextCaptionBodyContent
} = useDragTextCaption()

const {
  dragMiniTextEditor,
  createMiniTextEditor,
  deleteMiniTextEditor,
  miniTextEditorHasEventSet,
  changeMiniTextEditorBodyContent
} = useDragMiniTextEditor()


const changeStickyNoteColor = (stickyNoteId: string, color: string) => {
  const singleStickyNote = yDocStore.stickyNote.find((stickyNote) => stickyNote.id === stickyNoteId)
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

const {
  projectData,
  getProjectDetail,
  trackJoinAndLeavingUsers,
  showJoiningUsersModal,
  hideJoiningUsersModal,
  showJoinneesModal,
} = useGetProjectDetail(props.code, authenticationStore.user.id);



const saveProject = () => {
  const { saveBoardData } = useSaveData(
    yDocStore.arrayDrawing,
    yDocStore.miniTextEditor,
    yDocStore.stickyNote,
    yDocStore.textCaption,
    projectData.value.id
  )

  saveBoardData()
}


const { getProjectBoardData, loading: loadingData } = useGetProjectBoardData(
  initCanvas,
  dragStickyNote,
  changeStickyNoteBodyContent,
  dragTextCaption,
  changeTextCaptionBodyContent,
  dragMiniTextEditor,
  changeMiniTextEditorBodyContent
);

onMounted(async () => {

  trackJoinAndLeavingUsers()

  await getProjectDetail();

  await getProjectBoardData(projectData.value.id, authenticationStore);

  initYjs({
    stickyNoteHasEventSet,
    changeStickyNoteBodyContent,
    dragStickyNote,
  }, {
    miniTextEditorHasEventSet,
    changeMiniTextEditorBodyContent,
    dragMiniTextEditor,
  },
    {
      dragTextCaption,
      textCaptionHasEventSet,
      changeTextCaptionBodyContent,
    },
    projectData.value,
    {
      divNewHasEventSet,
      changeDivNewBodyContent,
      dragDivNew,
    }
  )
})


</script>
<template>
  <div>

    <TopNavBar :project="projectData" :userData="authenticationStore" @showJoiningUsersModal="showJoiningUsersModal" />

    <div @mousemove="trackMousePosition" class="miro">
      <LoadingIndicator :loading="loadingData" />
      <div class="d-flex " v-show="!loadingData">

        <div>
          <AddItem @saveBoardData="saveProject" @createTextCaption="createTextCaption"
            @createStickyNote="createStickyNote" @createDivNew="createDivNew"
            @createMiniTextEditor="createMiniTextEditor"
            @initDrawing="async () => (await initCanvas()).drawOnCanvas()" />

          <ColorPalette @changeStickyNoteColor="changeStickyNoteColor" :sticky-notes="yDocStore.stickyNote" />

          <UndoRedo @reset-canvas="async () => (await initCanvas()).initCanvas()"
            @redo="async () => (await initCanvas()).redo()" @undo="async () => (await initCanvas()).undo()" />
        </div>

        <div style="width: 100%; height: 50rem;  ">
          <!-- Canvas con bordes redondeados -->
          <canvas class="canvas">
          </canvas>
          <TextCaption @deleteTextCaption="deleteTextCaption" :text-captions="yDocStore.textCaption" />

          <StickyNote @deleteStickyNote="deleteStickyNote" :sticky-notes="yDocStore.stickyNote" />

          <MiniTextEditor @deleteMiniTextEditor="deleteMiniTextEditor" :miniTextEditors="yDocStore.miniTextEditor" />

          <!-- <UserCursor :mousePosition="yDocStore.mousePosition" /> -->

        </div>

      </div>

    </div>
  </div>

</template>



<style scoped>
.miro {
  display: flex;
  height: 100vh;
  /* Ocupa toda la altura de la pantalla */
  padding: 20px;
  /* Espacio interno alrededor del contenido */
  margin: 0;
  /* Asegura que el contenedor no tenga margen adicional, puedes ajustar este valor si es necesario */
  box-sizing: border-box;
  /* Asegura que el padding se incluya en el cálculo del tamaño */
}

.canvas {
  margin-left: .5rem;
  background-color: #f4f4f9;
  z-index: -1000;
  width: inherit;
  height: inherit;
  border-radius: 15px;
}
</style>
