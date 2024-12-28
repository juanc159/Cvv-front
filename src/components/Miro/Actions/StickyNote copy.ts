import { ref } from 'vue';
import { IndexeddbPersistence } from 'y-indexeddb';
import { WebsocketProvider } from 'y-websocket';
import * as Y from 'yjs';
import { stickyNoteStore } from "../Store/StickyNoteStore";
import { IStickyNote } from "./StickyNoteTypes";

export function useDragStickyNote() {

  let newX = 0, newY = 0, startX = 0, startY = 0;
  let newResizeX = 0, newResizeY = 0, startRX = 0, startRY = 0;

  let stickyNoteStartWidth = 0, stickyNoteStartHeight = 0;

  const stickyNote = ref<IStickyNote[]>([] as IStickyNote[]);


  const doc = ref();
  const yArrayStickyNote = ref();
  const stickyNoteHasEventSet = new Set();

  function initYjs() {
    doc.value = new Y.Doc()
    yArrayStickyNote.value = doc.value.getArray('y-array-sticky-notes')

    yArrayStickyNote.value.observe((event: any) => {
      stickyNote.value = yArrayStickyNote.value.toArray();

      for (const item of stickyNote.value) {

        if (stickyNoteHasEventSet.has(item.id) === false) {
          stickyNoteHasEventSet.add(item.id);
          setTimeout(() => {
            //add an event on each sticky note 
            dragStickyNote(item.id);

            const _stickyNote = document.querySelector('.sticky-note-' + item.id) as HTMLElement;

            _stickyNote.style.position = 'absolute';
          }, 200);
        }
      }
    })


    // this allows you to instantly get the (cached) documents data
    const indexeddbProvider = new IndexeddbPersistence('sticky-note', doc.value)
    indexeddbProvider.whenSynced.then(() => {
      console.log('loaded data from indexed db')
    })

    new WebsocketProvider('ws://localhost:1234', 'sticky-note', doc.value)

  }

  function changeStickyNoteResizerXYPosition(id: string) {
    const index = stickyNote.value.findIndex((obj) => obj.id === id);

    const x = (stickyNote.value[index].resizePosition.x = newResizeX);
    const y = (stickyNote.value[index].resizePosition.y = newResizeY);

    doc.value.transact(() => {
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

    doc.value.transact(() => {
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
        x: 0,
        y: 0
      }
    } as IStickyNote);

    yArrayStickyNote.value.insert(0, [
      {
        id: stickyNote.value[stickyNote.value.length - 1].id,
        body: '',
        color: color,
        dragPosition: {
          x: 0,
          y: 0
        },
        resizePosition: {
          x: 0,
          y: 0
        }
      } as IStickyNote
    ])

    const id = stickyNote.value[stickyNote.value.length - 1].id;
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

        stickyNote.style.width = Math.max(newWidth, 200) + 'px';
        stickyNote.style.height = Math.max(newHeight, 200) + 'px';
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
    initYjs
  }
}
