import { __debounce, runFuncSequentially } from "../Helper/util";
import { miniTextEditorStore } from "../Store/MiniTextEditorStore";
import { ICursor, yDocStore } from "../Store/yDocStore";
import { IMiniTextEditor } from "./MiniTextEditorTypes";


export function useDragMiniTextEditor() {

  // const miniTextEditor = ref<IMiniTextEditor[]>([] as IMiniTextEditor[]);
  let count = 0;

  let newX = 0, newY = 0, startX = 0, startY = 0;
  let newRX = 0, newMiniTextEditorHeight = 300, startRX = 0, startRY = 0;

  let miniTextEditorSartWidth = 0, miniTextEditorStartHeight = 0;

  // const yArrayMiniTextEditor = ref();
  const miniTextEditorHasEventSet = new Set<string>();

  function createMiniTextEditor() {
    count++
    const color = getRandomColor();
    yDocStore.miniTextEditor.push({
      id: Math.random().toString(36).substr(2, 9),
      body: '',
      color: color,
      dragPosition: {
        x: 0,
        y: 0
      },
      resizePosition: {
        x: 0,
        y: newMiniTextEditorHeight
      }
    } as IMiniTextEditor);

    yDocStore.yArrayMiniTextEditor.insert(0, [{
      id: Math.random().toString(36).substr(2, 9),
      body: '',
      color: color,
      dragPosition: {
        x: 0,
        y: 0
      },
      resizePosition: {
        x: 0,
        y: newMiniTextEditorHeight
      }
    } as IMiniTextEditor]);


    const id = yDocStore.miniTextEditor[yDocStore.miniTextEditor.length - 1].id;
    miniTextEditorStore.miniTextEditor.id = id;

    setTimeout(() => {
      dragMiniTextEditor(id);
    }, 200);
  }



  const _modifyMiniTextEditor = __debounce((fn: (...args: any[]) => void) => {
    fn()
  }, 2000);

  function getCursorPosition(editor: HTMLElement, cursor: HTMLElement): ICursor {
    const selection = window.getSelection();

    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0) as Range;
      const cloneRange = range.cloneRange();
      cloneRange.selectNodeContents(editor);
      cloneRange.setEnd(range.endContainer, range.endOffset);
      const cursorPosition = cloneRange.toString().length;



      const rect = range.getBoundingClientRect();
      const editorRect = editor.getBoundingClientRect();

      const x = `${rect.left - editorRect.left}px`;
      const y = `${rect.bottom - editorRect.top + window.scrollY + 20}px`;


      return {
        cursorPosition,
        x,
        y
      };
    }
  }


  function changeMiniTextEditorBodyContent(id: string) {
    const miniTextEditorContent = document.querySelector('.text-editor-body-' + id) as HTMLElement;

    const index = yDocStore.miniTextEditor.findIndex((obj) => obj.id === id);

    const htmlMiniTextEditor = yDocStore.yArrayMiniTextEditor.get(index);

    miniTextEditorContent.addEventListener("keydown", _changeMiniTextEditorContentEvent)
    miniTextEditorContent.addEventListener("mouseup", _changeMiniTextEditorContentEvent)


    function _changeMiniTextEditorContentEvent() {

      const blinkingCursor = document.querySelector('.blinking-cursor-' + id) as HTMLElement;
      blinkingCursor.style.display = 'block';

      const { cursorPosition, x, y } = getCursorPosition(miniTextEditorContent, blinkingCursor);
      yDocStore.cursor.cursorPosition = cursorPosition;
      yDocStore.cursor.x = x;
      yDocStore.cursor.y = y;
      yDocStore.yCursor.set("x", x);
      yDocStore.yCursor.set("y", y);

      // _modifyMiniTextEditor(_changeMiniTextEditorBodyContent)

      function _changeMiniTextEditorBodyContent() {
        yDocStore.doc.transact(() => {
          const trackMiniTextEditor = yDocStore.yArrayMiniTextEditor.get(index);

          if (trackMiniTextEditor) {
            trackMiniTextEditor.body = htmlMiniTextEditor.body
          }

          yDocStore.yArrayMiniTextEditor.delete(index);
          yDocStore.yArrayMiniTextEditor.insert(index, [trackMiniTextEditor]);
        })
      }

      const func1 = () => {
        return new Promise((resolve, reject) => {
          yDocStore.cursor.cursorPosition = cursorPosition; //update cursor position
          _changeMiniTextEditorBodyContent();
          resolve(null);
        })
      }

      const func2 = () => {
        return new Promise((resolve, reject) => {
          console.log("func2");
          moveCursorToPosition(miniTextEditorContent, yDocStore.cursor.cursorPosition);

          resolve(null);
        })
      }

      function runner() {
        runFuncSequentially([func1, func2]).then(() => {
          console.log("done");

        });
      }
      _modifyMiniTextEditor(runner);

    }










  }

  function changeMiniTextEditorXYPosition(id: string) {
    const index = yDocStore.miniTextEditor.findIndex((obj) => obj.id === id);

    const x = (yDocStore.miniTextEditor[index].dragPosition.x = startX);
    const y = (yDocStore.miniTextEditor[index].dragPosition.y = startY);

    yDocStore.doc.transact(() => {
      const trackMiniTextEditor = yDocStore.yArrayMiniTextEditor.get(index);

      if (trackMiniTextEditor) {
        trackMiniTextEditor.dragPosition.y = y;
        trackMiniTextEditor.dragPosition.x = x;
      }

      yDocStore.yArrayMiniTextEditor.delete(index);
      yDocStore.yArrayMiniTextEditor.insert(index, [trackMiniTextEditor]);
    })
  }

  function changeMiniTextEditorResizerXYPosition(id: string) {
    const index = yDocStore.miniTextEditor.findIndex((obj) => obj.id === id);

    // const x = (yDocStore.miniTextEditor[index].resizePosition.x = newResizeX);
    const y = (yDocStore.miniTextEditor[index].resizePosition.y = newMiniTextEditorHeight);

    yDocStore.doc.transact(() => {
      const trackMiniTextEditor = yDocStore.yArrayMiniTextEditor.get(index);

      if (trackMiniTextEditor) {
        // trackMiniTextEditor.resizePosition.x = x;
        trackMiniTextEditor.resizePosition.y = y;
      }

      yDocStore.yArrayMiniTextEditor.delete(index);
      yDocStore.yArrayMiniTextEditor.insert(index, [trackMiniTextEditor]);
    })
  }



  function getRandomColor() {
    const colors = ["#FFCA28", "#FFF176", "#EDE7F6", "#BBDEFB"]; // Colores predefinidos
    const randomIndex = Math.floor(Math.random() * colors.length); // Genera un índice aleatorio
    return colors[randomIndex]; // Retorna el color correspondiente al índice aleatorio
  }


  function deleteMiniTextEditor(_miniTextEditor: IMiniTextEditor) {
    const index = yDocStore.miniTextEditor.findIndex((obj) => obj.id === _miniTextEditor.id);
    yDocStore.miniTextEditor.splice(index, index);
    yDocStore.yArrayMiniTextEditor.delete(index);
  }


  function dragMiniTextEditor(id: string) {
    const miniTextEditor = document.querySelector('.text-editor-' + id) as HTMLElement;
    const miniTextEditorHandler = document.querySelector('.text-editor-handler-' + id) as HTMLElement;
    const miniTextEditorResizer = document.querySelector('.text-editor-resizer-' + id) as HTMLElement;

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


        newMiniTextEditorHeight = newHeight;
        changeMiniTextEditorResizerXYPosition(id);

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

        changeMiniTextEditorXYPosition(id);

        miniTextEditor.style.top = (miniTextEditor.offsetTop - newY) + 'px';
        miniTextEditor.style.left = (miniTextEditor.offsetLeft - newX) + 'px';
      }

      function mouseUp(e: any) {
        document.removeEventListener('mousemove', mouseMove);
      }
    })
  }


  function moveCursorToPosition(editor: HTMLElement, position: number) {
    const selection = window.getSelection() as Selection;
    const range = document.createRange();

    let cursorPos = 0;
    let node: Node | null = null;

    for (let i = 0; i < editor.childNodes.length; i++) {
      node = editor.childNodes[i];
      const nodeLength = (node.textContent as string).length || 0;

      if (cursorPos + nodeLength >= position) {
        if (node.nodeType === Node.TEXT_NODE) {
          range.setStart(node, position - cursorPos);
        } else if (node.nodeType === Node.ELEMENT_NODE) {
          setCursorInsideElement(node, position - cursorPos, range);
        }
        break;
      } else {
        cursorPos += nodeLength;
      }
    }

    range.collapse(true);
    selection.removeAllRanges();
    selection.addRange(range);
    editor.focus();
  }

  function setCursorInsideElement(element: any, position: number, range: any) {
    for (let i = 0; i < element.childNodes.length; i++) {
      let child = element.childNodes[i];
      let length = (child.textContent as string).length || 0;
      if (position <= length) {
        if (child.nodeType === Node.TEXT_NODE) {
          range.setStart(child, position);
        } else {
          setCursorInsideElement(child, position, range);
        }
        break;
      } else {
        position -= length;
      }

    }
  }


  return {
    dragMiniTextEditor,
    createMiniTextEditor,
    deleteMiniTextEditor,
    miniTextEditorHasEventSet,
    changeMiniTextEditorBodyContent
  }
}
