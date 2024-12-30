import { defineStore } from "pinia";
import * as Y from 'yjs';
import { IMiniTextEditor } from "../Actions/MiniTextEditorTypes";

export interface ICursor {
  cursorPosition: number,
  x: string,
  y: string,
}

const useYDocStore = defineStore('useYDocStore', {
  state: () => ({
    doc: new Y.Doc(),
    miniTextEditor: [] as IMiniTextEditor[],
    yArrayMiniTextEditor: new Y.Array<IMiniTextEditor>,

    mousePosition: {
      x: 0,
      y: 0,
    },
    yMouse: new Y.Map,
    yCursor: new Y.Map,
    cursor: {
      cursorPosition: 0,
      x: "",
      y: "",
    },
  }),

});


export const yDocStore = useYDocStore();
