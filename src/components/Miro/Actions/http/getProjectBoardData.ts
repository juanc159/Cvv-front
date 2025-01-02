
import { ref } from "vue";

import { useToast } from '@/composables/useToast';
import { IReplayDrawing, yDocStore } from "../../Store/yDocStore";
import { IMiniTextEditor } from "../editor/MiniTextEditorTypes";
import { IStickyNote } from "../sticky-note/StickyNoteTypes";
import { ITextCaption } from "../text-caption/TextCaptionTypes";
const { toast } = useToast()


type DrawingType = {
  data: string;
} | null;
type MiniTextEditorType = {
  data: string;
} | null;
type StickyNoteType = {
  data: string;
} | null;
type TextCaptionType = {
  data: string;
} | null;
export interface IProjectBoardData {
  miniTextEditor: MiniTextEditorType;
  stickyNote: StickyNoteType;
  textCaption: TextCaptionType;
  drawing: DrawingType;
}

export function useGetProjectBoardData(
  initCanvas: () => Promise<{
    drawOnCanvas: () => void;
    undo: () => void;
    redo: () => void;
    replayDrawing: () => void;
    initCanvas: () => void;
  }>,
  dragStickyNote: (id: string) => void,
  changeStickyNoteBodyContent: (id: string) => void,
  dragTextCaption: (id: string) => void,
  changeTextCaptionBodyContent: (id: string) => void,
  dragMiniTextEditor: (id: string) => void,
  changeMiniTextEditorBodyContent: (id: string) => void,
) {
  const loading = ref(false);
  async function getProjectBoardData(project_id: string, userData: any) {
    const user_id = userData?.user?.id
    try {
      loading.value = true;
      const { data, response } = await useApi<any>(
        createUrl(`/miro/project_boards`, {
          query: {
            project_id: project_id,
            user_id: user_id,
          },
        })
      );

      await resetYDocArray()
      getDrawingData(data.value);
      getStickyNoteData(data.value);
      getTextCaptionData(data.value);
      getMiniTextEditorData(data.value)

      loading.value = false;


    } catch (error) {
      toast((error as Error).message, "", "danger");
      loading.value = false;
    }
  }

  async function getDrawingData(data: IProjectBoardData) {

    if (data.drawing !== null) {
      const drawingCoordinates: IReplayDrawing[][] = JSON.parse(
        data.drawing.data
      );
      yDocStore.arrayDrawing = [...drawingCoordinates];
      yDocStore.yArrayDrawing.insert(0, drawingCoordinates);

      const canvas = await initCanvas();
      canvas.replayDrawing();
    }
  }


  function getMiniTextEditorData(data: IProjectBoardData) {
    if (data.miniTextEditor !== null) {
      const miniTextEditorData: IMiniTextEditor[] = JSON.parse(
        data.miniTextEditor.data
      );
      yDocStore.miniTextEditor = [...miniTextEditorData];
      setTimeout(() => {
        yDocStore.yArrayMiniTextEditor.insert(0, [...miniTextEditorData]);

        miniTextEditorData.forEach((miniTextEditor) => {
          dragMiniTextEditor(miniTextEditor.id);
          changeMiniTextEditorBodyContent(miniTextEditor.id);
        });
      }, 1000);
    }
  }


  function getStickyNoteData(data: IProjectBoardData) {
    if (data.stickyNote !== null) {
      const stickyNoteData: IStickyNote[] = JSON.parse(
        data.stickyNote.data
      );
      yDocStore.stickyNote = [...stickyNoteData];
      setTimeout(() => {
        yDocStore.yArrayStickyNote.insert(0, [...stickyNoteData]);

        stickyNoteData.forEach((stickyNote) => {
          dragStickyNote(stickyNote.id);
          changeStickyNoteBodyContent(stickyNote.id);
        });
      }, 1000);
    }
  }

  function getTextCaptionData(data: IProjectBoardData) {
    if (data.textCaption !== null) {
      const textCaptionData: ITextCaption[] = JSON.parse(
        data.textCaption.data
      );

      yDocStore.textCaption = [...textCaptionData];

      setTimeout(() => {
        yDocStore.yArrayTextCaption.insert(0, [...textCaptionData]);

        textCaptionData.forEach((textCaption) => {
          dragTextCaption(textCaption.id);
          changeTextCaptionBodyContent(textCaption.id);
        });
      }, 1000);
    }
  }

  /**
  * 
  * reset drawing, stickyNote, textCaption and miniTextEditor array
  */
  function resetYDocArray() {
    return new Promise((resolve, reject) => {
      setTimeout(() => {

        const drawingArray = yDocStore.yArrayDrawing.toArray();
        yDocStore.yArrayDrawing.delete(0, drawingArray.length);

        const textCaptionArray = yDocStore.yArrayTextCaption.toArray();
        yDocStore.yArrayTextCaption.delete(0, textCaptionArray.length);
        yDocStore.textCaption = [];

        const stickyNoteArray = yDocStore.yArrayStickyNote.toArray();
        yDocStore.yArrayStickyNote.delete(0, stickyNoteArray.length);
        yDocStore.stickyNote = [];

        const miniTextEditorArray = yDocStore.yArrayMiniTextEditor.toArray();
        yDocStore.yArrayMiniTextEditor.delete(0, miniTextEditorArray.length);
        yDocStore.miniTextEditor = [];


        resolve(null);


      }, 1000);
    });
  }



  return { getProjectBoardData, loading };
}
