import { defineStore } from "pinia";
import * as Y from "yjs";
import { IDivNew } from "../Actions/div-new/DivNewTypes";
import { IMiniTextEditor } from "../Actions/editor/MiniTextEditorTypes";
import { IStickyNote } from "../Actions/sticky-note/StickyNoteTypes";
import { ITextCaption } from "../Actions/text-caption/TextCaptionTypes";
export interface ICursor {
  cursorPosition: number;
  x: string;
  y: string;
}

export interface IReplayDrawing {
  x: number;
  y: number;
  type: "start" | "drawing";
  strokeStyle: string;
}

const useYDocStore = defineStore("y-doc", {
  state: () => ({
    doc: new Y.Doc(),
    miniTextEditor: [] as IMiniTextEditor[],
    yArrayMiniTextEditor: new Y.Array<IMiniTextEditor>(),

    mousePosition: {
      userName: '',
      x: 0,
      y: 0,
    },
    yMouse: new Y.Map(),

    yCursor: new Y.Map(),
    cursor: {
      typingUser: '',
      cursorPosition: 0,
      x: "",
      y: "",
    },

    yArrayDrawing: new Y.Array<Array<IReplayDrawing>>(),
    arrayDrawing: [] as Array<Array<IReplayDrawing>>,
    //we use it as history
    redoDrawingArray: [] as Array<Array<IReplayDrawing>>,

    loading: false,



    stickyNote: [] as IStickyNote[],
    yArrayStickyNote: new Y.Array<IStickyNote>(),

    divNew: [] as IDivNew[],
    yArrayDivNew: new Y.Array<IDivNew>(),

    yArrayTextCaption: new Y.Array<ITextCaption>(),
    textCaption: [] as ITextCaption[],


    //users
    joinees: [] as Array<{
      id: string
      name: string
      email: string
    }>



  }),
});

export const yDocStore = useYDocStore();
