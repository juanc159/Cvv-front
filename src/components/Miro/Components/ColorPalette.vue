<script setup lang="ts">
import { IStickyNote } from '../Actions/sticky-note/StickyNoteTypes';
import { stickyNoteStore } from '../Store/StickyNoteStore';

const props = defineProps<{
  stickyNotes: IStickyNote[]
}>()

const emit = defineEmits<{ (e: 'changeStickyNoteColor', stickyId: string, color: string): void }>()

const changeStickyNoteBgColor = (color: string) => {
  const id = stickyNoteStore.stickyNote.id
  emit("changeStickyNoteColor", id, color)
  const singleStickyNote = props.stickyNotes.find((stickyNote) => stickyNote.id === id)

  if (singleStickyNote) {
    const currentBgColor = singleStickyNote.color
    const stickyNote = document.querySelector(`.sticky-note-${id}`) as HTMLElement
    stickyNote.classList.remove(currentBgColor)
    stickyNote.classList.add(color)
  }
}

const sheets = [
  { color: "#FFCA28" },
  { color: "#FFF176" },
  { color: "#EDE7F6" },
  { color: "#BBDEFB" },
]
</script>


<template>
  <VSheet rounded elevation="10" class=" d-flex flex-column  pt-4 align-center gap-5 my-5" height="200" width="50">
    <VSheet v-for="(item, index) in sheets" :key="index" @click="changeStickyNoteBgColor(item.color)"
      :color="item.color" rounded :elevation="5" class="mx-auto  cursor-pointer " height="25" width="25">
    </VSheet>
  </VSheet>
</template>
