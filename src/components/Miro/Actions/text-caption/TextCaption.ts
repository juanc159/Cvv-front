import { __debounce } from "../../Helper/util";
import { textCaptionStore } from "../../Store/TextCaptionStore";
import { yDocStore } from "../../Store/yDocStore";
import { ITextCaption } from "./TextCaptionTypes";

export function useDragTextCaption() {
  let newX = 0,
    newY = 0,
    startX = 0,
    startY = 0;

  //default width
  let newResizeX = 200,
    //default height
    newResizeY = 100,
    startRX = 0,
    startRY = 0;

  let textCaptionStartwidth = 0,
    textCaptionStartHeight = 0;


  const textCaptionHasEventSet = new Set<string>();



  const _modifyTextCaption = __debounce(function (fn: (...args: any[]) => void) {
    fn()

  }, 1000);

  function changeTextCaptionBodyContent(id: string) {
    const textCaptionContent = document.querySelector(
      ".text-caption-body-" + id
    ) as HTMLElement;
    const index = yDocStore.textCaption.findIndex((obj) => obj.id === id);

    textCaptionContent.addEventListener("keydown", function () {

      _modifyTextCaption(_changeTextCaptionContent)

      function _changeTextCaptionContent() {
        yDocStore.doc.transact(function () {
          const trackTextCaption = yDocStore.yArrayTextCaption.get(index);

          if (trackTextCaption) {
            trackTextCaption.body = textCaptionContent.textContent as string
          }
          yDocStore.yArrayTextCaption.delete(index);
          yDocStore.yArrayTextCaption.insert(index, [trackTextCaption]);
        });
      }
    });
  }

  function changeTextCaptionResizeXYPosition(id: string) {
    const index = yDocStore.textCaption.findIndex((obj) => obj.id === id);

    const x = (yDocStore.textCaption[index].resizePosition.x = newResizeX);
    const y = (yDocStore.textCaption[index].resizePosition.y = newResizeY);

    yDocStore.doc.transact(function () {
      const trackTextCaption = yDocStore.yArrayTextCaption.get(index);

      if (trackTextCaption) {
        trackTextCaption.resizePosition.y = y;
        trackTextCaption.resizePosition.x = x;
      }
      yDocStore.yArrayTextCaption.delete(index);
      yDocStore.yArrayTextCaption.insert(index, [trackTextCaption]);
    });
  }

  function changeTextCaptionXYPosition(id: string) {
    const index = yDocStore.textCaption.findIndex((obj) => obj.id === id);

    const x = (yDocStore.textCaption[index].dragPosition.x = startX);
    const y = (yDocStore.textCaption[index].dragPosition.y = startY);

    yDocStore.doc.transact(function () {
      const trackTextCaption = yDocStore.yArrayTextCaption.get(index);

      if (trackTextCaption) {
        trackTextCaption.dragPosition.y = y;
        trackTextCaption.dragPosition.x = x;
      }
      yDocStore.yArrayTextCaption.delete(index);
      yDocStore.yArrayTextCaption.insert(index, [trackTextCaption]);
    });
  }

  function createTextCaption() {
    const color = getRandomColorClass();

    yDocStore.textCaption.push({
      id: Math.random().toString(36).substr(2, 9),
      body: "",
      color: color,
      resizePosition: {
        x: newResizeX,
        y: newResizeY,
      },
      dragPosition: {
        x: 0,
        y: 0,
      },
    });

    const id = yDocStore.textCaption[yDocStore.textCaption.length - 1].id;

    yDocStore.yArrayTextCaption.insert(0, [
      {
        id: id,
        body: "",
        color: color,
        resizePosition: {
          x: newResizeX,
          y: newResizeY,
        },
        dragPosition: {
          x: 0,
          y: 0,
        },
      },
    ]);

    textCaptionStore.textCaption.id = id;

    setTimeout(() => dragTextCaption(id), 200);
  }

  function getRandomColorClass() {
    const colorClasses = [
      "#FFCA28", "#FFF176", "#EDE7F6", "#BBDEFB"
    ];
    const randomIndex = Math.floor(Math.random() * colorClasses.length);
    return colorClasses[randomIndex];
  }

  function deleteTextCaption(_textCaption: ITextCaption) {
    const index = yDocStore.textCaption.findIndex(
      (obj) => obj.id === _textCaption.id
    );
    yDocStore.textCaption.splice(index, index);

    yDocStore.yArrayTextCaption.delete(index);
  }

  function dragTextCaption(id: string) {
    const textCaption = document.querySelector(
      ".text-caption-" + id
    ) as HTMLElement;
    const textCaptionHandler = document.querySelector(
      ".text-caption-handler-" + id
    ) as HTMLElement;
    const textCaptionResizer = document.querySelector(
      ".text-caption-resizer-" + id
    ) as HTMLElement;

    // dragging
    // resizing

    //resizing
    textCaptionResizer.addEventListener("mousedown", function (e: any) {
      textCaptionStore.textCaption.id = id;

      startRX = e.clientX;
      startRY = e.clientY;

      textCaptionStartwidth = textCaption.offsetWidth;
      textCaptionStartHeight = textCaption.offsetHeight;

      textCaption.style.position = "absolute";

      document.addEventListener("mousemove", mouseMove);
      document.addEventListener("mouseup", mouseUp);

      function mouseMove(e: any) {
        const newWidth = textCaptionStartwidth + e.clientX - startRX;
        // const newHeight = textCaptionStartHeight + e.clientY - startRY;
        newResizeX = newWidth;
        // newResizeY = newHeight;

        changeTextCaptionResizeXYPosition(id);

        textCaption.style.width = Math.max(newWidth, newResizeX) + "px";
        // textCaption.style.height =
        //     Math.max(newHeight, newResizeY) + "px";
      }

      function mouseUp(e: any) {
        document.removeEventListener("mousemove", mouseMove);
      }
    });

    //dragging
    textCaptionHandler.addEventListener("mousedown", function (e: any) {
      textCaptionStore.textCaption.id = id;

      startX = e.clientX;
      startY = e.clientY;

      textCaption.style.position = "absolute";

      document.addEventListener("mousemove", mouseMove);
      document.addEventListener("mouseup", mouseUp);

      function mouseMove(e: any) {
        newX = startX - e.clientX;
        newY = startY - e.clientY;

        startX = e.clientX;
        startY = e.clientY;

        changeTextCaptionXYPosition(id);

        textCaption.style.top = textCaption.offsetTop - newY + "px";
        textCaption.style.left = textCaption.offsetLeft - newX + "px";
      }

      function mouseUp(e: any) {
        document.removeEventListener("mousemove", mouseMove);
      }
    });
  }

  return {
    dragTextCaption,
    createTextCaption,

    deleteTextCaption,

    textCaptionHasEventSet,
    changeTextCaptionBodyContent,
  };
}