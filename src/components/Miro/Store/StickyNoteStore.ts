import { defineStore } from "pinia";

const useStickyNoteStore = defineStore('useStickyNoteStore', {
  state: () => ({
    stickyNote: {} as { id: string }
  }),

});


export const stickyNoteStore = useStickyNoteStore();
