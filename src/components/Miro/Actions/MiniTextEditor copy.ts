import { miniTextEditorStore } from "../Store/MiniTextEditorStore";
import { yDocStore } from "../Store/yDocStore";
import { IMiniTextEditor } from "./MiniTextEditorTypes";


export function useDragMiniTextEditor() {

  const miniTextEditor = ref<IMiniTextEditor[]>([] as IMiniTextEditor[]);


  const yArrayMiniTextEditor = ref();
  const miniTextEditorHasEventSet = new Set<string>();


  function createMiniTextEditor() {
    const color = getRandomColor();
    miniTextEditor.value.push({
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
    } as IMiniTextEditor);



    const id = miniTextEditor.value[miniTextEditor.value.length - 1].id;
    miniTextEditorStore.miniTextEditor.id = id;

    setTimeout(() => {
      dragMiniTextEditor(id);
    }, 200);
  }




  function changeMiniTextEditorBodyContent(id: string) {
    const miniTextEditorContent = document.querySelector('.text-editor-' + id) as HTMLElement;

    const index = miniTextEditor.value.findIndex((obj) => obj.id === id);
    miniTextEditorContent.addEventListener("keydown", (e: any) => {


      yDocStore.doc.transact(() => {
        const trackMiniTextEditor = yArrayMiniTextEditor.value.get(index);

        if (trackMiniTextEditor) {
          trackMiniTextEditor.body = miniTextEditorContent.textContent
        }

        yArrayMiniTextEditor.value.delete(index);
        yArrayMiniTextEditor.value.insert(index, [trackMiniTextEditor]);
      })
    })

  }

  function getRandomColor() {
    const colors = ["#FFCA28", "#FFF176", "#EDE7F6", "#BBDEFB"]; // Colores predefinidos
    const randomIndex = Math.floor(Math.random() * colors.length); // Genera un índice aleatorio
    return colors[randomIndex]; // Retorna el color correspondiente al índice aleatorio
  }


  function deleteMiniTextEditor(miniTextEditor: IMiniTextEditor) {

  }


  function dragMiniTextEditor(id: string) {
    const miniTextEditor = document.querySelector('.text-editor-' + id) as HTMLElement;
    const miniTextEditorHandler = document.querySelector('.text-editor-handler-' + id) as HTMLElement;
    const miniTextEditorResizer = document.querySelector('.text-editor-resizer-' + id) as HTMLElement;

    let newX = 0, newY = 0, startX = 0, startY = 0;
    let newRX = 0, newRY = 0, startRX = 0, startRY = 0;

    let miniTextEditorSartWidth = 0, miniTextEditorStartHeight = 0;

    //resizing
    miniTextEditorResizer.addEventListener('mousedown', (e: any) => {

      miniTextEditorStore.miniTextEditor.id = id;

      startRX = e.clientX;
      startRY = e.clientY;

      miniTextEditorSartWidth = miniTextEditor.offsetWidth;
      miniTextEditorStartHeight = miniTextEditor.offsetHeight;

      miniTextEditor.style.position = 'absolute';

      document.addEventListener('mousemove', mouseMove);
      document.addEventListener('mouseup', mouseUp);

      function mouseMove(e: any) {
        const newWidth = miniTextEditorSartWidth + e.clientX - startRX;
        const newHeight = miniTextEditorStartHeight + e.clientY - startRY;

        // miniTextEditor.style.width = Math.max(newWidth, 200) + 'px';
        miniTextEditor.style.height = Math.max(newHeight, 260) + 'px';
      }

      function mouseUp(e: any) {
        document.removeEventListener('mousemove', mouseMove);
      }
    })


    //dragging
    miniTextEditorHandler.addEventListener('mousedown', (e: any) => {

      startX = e.clientX;
      startY = e.clientY;

      miniTextEditor.style.position = 'absolute';

      document.addEventListener('mousemove', mouseMove);
      document.addEventListener('mouseup', mouseUp);

      function mouseMove(e: any) {
        newX = startX - e.clientX;
        newY = startY - e.clientY;

        startX = e.clientX;
        startY = e.clientY;

        miniTextEditor.style.top = (miniTextEditor.offsetTop - newY) + 'px';
        miniTextEditor.style.left = (miniTextEditor.offsetLeft - newX) + 'px';
      }

      function mouseUp(e: any) {
        document.removeEventListener('mousemove', mouseMove);
      }
    })
  }

  return {
    dragMiniTextEditor,
    createMiniTextEditor,
    miniTextEditor,
    deleteMiniTextEditor,

    yArrayMiniTextEditor,
    miniTextEditorHasEventSet,
    changeMiniTextEditorBodyContent,
  }
}
