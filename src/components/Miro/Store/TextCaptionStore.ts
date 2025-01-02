import { defineStore } from "pinia";

const useTextCaptionStore = defineStore('useTextCaptionStore', {
  state: () => ({
    textCaption: {} as { id: string }
  }),

});


export const textCaptionStore = useTextCaptionStore();
