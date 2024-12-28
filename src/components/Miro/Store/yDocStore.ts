import { defineStore } from "pinia";
import * as Y from 'yjs';

const useYDocStore = defineStore('useYDocStore', {
  state: () => ({
    doc: new Y.Doc(),
  }),

});


export const yDocStore = useYDocStore();
