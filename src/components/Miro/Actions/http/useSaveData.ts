import { useToast } from '@/composables/useToast';
import { IReplayDrawing } from "../../Store/yDocStore";
import { IMiniTextEditor } from "../editor/MiniTextEditorTypes";
import { IStickyNote } from "../sticky-note/StickyNoteTypes";
import { ITextCaption } from "../text-caption/TextCaptionTypes";

const { toast } = useToast()

export function useSaveData(
  arrayDrawing: IReplayDrawing[][],
  miniTextEditor: IMiniTextEditor[],
  stickyNote: IStickyNote[],
  textCaption: ITextCaption[],
  project_id: string
) {
  const isLoading = ref<boolean>(false)

  const saveBoardData = () => {

    try {
      isLoading.value = true

      useApi(`/miro/createOrUpdateMiniTextEditor`).post({
        project_id: project_id,
        data: miniTextEditor,
      });
      useApi(`/miro/createOrUpdateStickyNote`).post({
        project_id: project_id,
        data: stickyNote,
      });
      useApi(`/miro/createOrUpdateTextCaption`).post({
        project_id: project_id,
        data: textCaption,
      });
      useApi(`/miro/createOrUpdateDrawing`).post({
        project_id: project_id,
        data: arrayDrawing,
      });

      isLoading.value = false
      toast("Data saved successfully", "", "success")

    } catch (error) {
      toast((error as Error).message, "", "success")
    }
  }

  return {
    saveBoardData
  }
}
