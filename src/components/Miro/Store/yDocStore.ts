import { defineStore } from "pinia";
import * as Y from 'yjs';
import { IMiniTextEditor } from "../Actions/MiniTextEditorTypes";

const useYDocStore = defineStore('useYDocStore', {
  state: () => ({
    doc: new Y.Doc(),
    miniTextEditor: [] as IMiniTextEditor[],
    yArrayMiniTextEditor: new Y.Array<IMiniTextEditor>,

    mousePosition: {
      x: 0,
      y: 0,
    },
    yCursor: new Y.Map
  }),

});


export const yDocStore = useYDocStore();
