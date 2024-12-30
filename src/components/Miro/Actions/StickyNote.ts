import { ref } from 'vue';

import { __debounce } from '../Helper/util';
import { stickyNoteStore } from "../Store/StickyNoteStore";
import { yDocStore } from '../Store/yDocStore';
import { IStickyNote } from "./StickyNoteTypes";

export function useDragStickyNote() {

  let newX = 0, newY = 0, startX = 0, startY = 0;
  let newResizeX = 200, newResizeY = 200, startRX = 0, startRY = 0;

  let stickyNoteStartWidth = 0, stickyNoteStartHeight = 0;

  const stickyNote = ref<IStickyNote[]>([] as IStickyNote[]);


  // const doc = ref();
  const yArrayStickyNote = ref();
  const stickyNoteHasEventSet = new Set<string>();


  const _modifyStickyNote = __debounce((fn: (...args: any[]) => void) => {
    fn()
  }, 1000);

  function changeStickyNoteBodyContent(id: string) {
    const stickyNoteContent = document.querySelector('.sticky-note-' + id) as HTMLElement;

    const index = stickyNote.value.findIndex((obj) => obj.id === id);
    stickyNoteContent.addEventListener("keydown", (e: any) => {

      _modifyStickyNote(_changeStickyNoteBodyContent)
      function _changeStickyNoteBodyContent() {
        yDocStore.doc.transact(() => {
          const trackStickyNote = yArrayStickyNote.value.get(index);

          if (trackStickyNote) {
            trackStickyNote.body = stickyNoteContent.textContent
          }

          yArrayStickyNote.value.delete(index);
          yArrayStickyNote.value.insert(index, [trackStickyNote]);
        })
      }

    })

  }

  function changeStickyNoteResizerXYPosition(id: string) {
    const index = stickyNote.value.findIndex((obj) => obj.id === id);

    const x = (stickyNote.value[index].resizePosition.x = newResizeX);
    const y = (stickyNote.value[index].resizePosition.y = newResizeY);

    yDocStore.doc.transact(() => {
      const trackStickyNote = yArrayStickyNote.value.get(index);

      if (trackStickyNote) {
        trackStickyNote.resizePosition.x = x;
        trackStickyNote.resizePosition.y = y;
      }

      yArrayStickyNote.value.delete(index);
      yArrayStickyNote.value.insert(index, [trackStickyNote]);
    })
  }


  function changeStickyNoteXYPosition(id: string) {
    const index = stickyNote.value.findIndex((obj) => obj.id === id);

    const x = (stickyNote.value[index].dragPosition.x = startX);
    const y = (stickyNote.value[index].dragPosition.y = startY);

    yDocStore.doc.transact(() => {
      const trackStickyNote = yArrayStickyNote.value.get(index);

      if (trackStickyNote) {
        trackStickyNote.dragPosition.y = y;
        trackStickyNote.dragPosition.x = x;
      }

      yArrayStickyNote.value.delete(index);
      yArrayStickyNote.value.insert(index, [trackStickyNote]);
    })
  }

  function createStickyNote() {

    const color = getRandomColor();
    stickyNote.value.push({
      id: Math.random().toString(36).substr(2, 9),
      body: '',
      color: color,
      dragPosition: {
        x: 0,
        y: 0
      },
      resizePosition: {
        x: newResizeX,
        y: newResizeY
      }
    } as IStickyNote);

    const id = stickyNote.value[stickyNote.value.length - 1].id;


    yArrayStickyNote.value.insert(0, [
      {
        id: id,
        body: '',
        color: color,
        dragPosition: {
          x: 0,
          y: 0
        },
        resizePosition: {
          x: newResizeX,
          y: newResizeY
        }
      } as IStickyNote
    ])

    stickyNoteStore.stickyNote.id = id;

    setTimeout(() => {
      dragStickyNote(id);
    }, 200);
  }

  function getRandomColor() {
    const colors = ["#FFCA28", "#FFF176", "#EDE7F6", "#BBDEFB"]; // Colores predefinidos
    const randomIndex = Math.floor(Math.random() * colors.length); // Genera un índice aleatorio
    return colors[randomIndex]; // Retorna el color correspondiente al índice aleatorio
  }


  function deleteStickyNote(_stickyNote: IStickyNote) {
    const index = stickyNote.value.findIndex((stickyNote) => stickyNote.id === _stickyNote.id);
    stickyNote.value.splice(index, index);
    yArrayStickyNote.value.delete(index);
  }


  function dragStickyNote(id: string) {
    const stickyNote = document.querySelector('.sticky-note-' + id) as HTMLElement;
    const stickyNoteHandler = document.querySelector('.sticky-note-handler-' + id) as HTMLElement;
    const stickyNoteResizer = document.querySelector('.sticky-note-resizer-' + id) as HTMLElement;



    //resizing
    stickyNoteResizer.addEventListener('mousedown', (e: any) => {

      stickyNoteStore.stickyNote.id = id;

      startRX = e.clientX;
      startRY = e.clientY;

      stickyNoteStartWidth = stickyNote.offsetWidth;
      stickyNoteStartHeight = stickyNote.offsetHeight;

      stickyNote.style.position = 'absolute';

      document.addEventListener('mousemove', mouseMove);
      document.addEventListener('mouseup', mouseUp);

      function mouseMove(e: any) {
        const newWidth = stickyNoteStartWidth + e.clientX - startRX;
        const newHeight = stickyNoteStartHeight + e.clientY - startRY;

        newResizeX = newWidth;
        newResizeY = newHeight;
        changeStickyNoteResizerXYPosition(id)

        stickyNote.style.width = Math.max(newWidth, newResizeX) + 'px';
        stickyNote.style.height = Math.max(newHeight, newResizeY) + 'px';
      }

      function mouseUp(e: any) {
        document.removeEventListener('mousemove', mouseMove);
      }
    })


    //dragging
    stickyNoteHandler.addEventListener('mousedown', (e: any) => {

      startX = e.clientX;
      startY = e.clientY;

      stickyNote.style.position = 'absolute';

      document.addEventListener('mousemove', mouseMove);
      document.addEventListener('mouseup', mouseUp);

      function mouseMove(e: any) {
        newX = startX - e.clientX;
        newY = startY - e.clientY;

        startX = e.clientX;
        startY = e.clientY;
        changeStickyNoteXYPosition(id);

        stickyNote.style.top = (stickyNote.offsetTop - newY) + 'px';
        stickyNote.style.left = (stickyNote.offsetLeft - newX) + 'px';
      }

      function mouseUp(e: any) {
        document.removeEventListener('mousemove', mouseMove);
      }
    })
  }

  return {
    dragStickyNote,
    createStickyNote,
    stickyNote,
    deleteStickyNote,


    yArrayStickyNote,
    stickyNoteHasEventSet,
    changeStickyNoteBodyContent
  }
}
