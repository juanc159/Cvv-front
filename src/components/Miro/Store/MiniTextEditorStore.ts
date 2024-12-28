import { defineStore } from "pinia";

const useMiniTextEditorStore = defineStore('miniTextEditorStore', {
  state: () => ({
    miniTextEditor: {} as { id: string }
  }),

});


export const miniTextEditorStore = useMiniTextEditorStore();
