import { defineStore } from "pinia";

const useDivNewStore = defineStore('useDivNewStore', {
  state: () => ({
    divNew: {} as { id: string }
  }),

});


export const divNewStore = useDivNewStore();
