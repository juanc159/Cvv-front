import { __debounce } from "../../Helper/util";
import { divNewStore } from "../../Store/DivNewStore";
import { yDocStore } from "../../Store/yDocStore";
import { IDivNew } from "./DivNewTypes";


export function useDragDivNew() {
  let newX = 0,
    newY = 0,
    startX = 0,
    startY = 0;

  //default width
  let newResizeX = 200,
    //default height
    newResizeY = 200,
    startRX = 0,
    startRY = 0;

  let divNewStartwidth = 0,
    divNewStartHeight = 0;

  const divNewHasEventSet = new Set<string>();

  const _modifyDivNew = __debounce(function (
    fn: (...args: any[]) => void
  ) {
    fn();
  },
    1000);

  function changeDivNewBodyContent(id: string) {
    const divNewContent = document.querySelector(
      ".div-new-body-" + id
    ) as HTMLElement;
    const index = yDocStore.divNew.findIndex((obj) => obj.id === id);

    divNewContent.addEventListener("keydown", function () {
      _modifyDivNew(_changeDivNewContent);

      function _changeDivNewContent() {
        yDocStore.doc.transact(function () {
          const trackDivNew =
            yDocStore.yArrayDivNew.get(index);


          if (trackDivNew) {
            trackDivNew.body =
              divNewContent.textContent as string;
          }
          yDocStore.yArrayDivNew.delete(index);
          yDocStore.yArrayDivNew.insert(index, [trackDivNew]);
        });
      }
    });
  }

  function changeDivNewResizeXYPosition(id: string) {
    const index = yDocStore.divNew.findIndex((obj) => obj.id === id);

    const x = (yDocStore.divNew[index].resizePosition.x = newResizeX);
    const y = (yDocStore.divNew[index].resizePosition.y = newResizeY);

    yDocStore.doc.transact(function () {
      const trackDivNew = yDocStore.yArrayDivNew.get(index);

      if (trackDivNew) {
        trackDivNew.resizePosition.y = y;
        trackDivNew.resizePosition.x = x;
      }
      yDocStore.yArrayDivNew.delete(index);
      yDocStore.yArrayDivNew.insert(index, [trackDivNew]);
    });
  }

  function changeDivNewXYPosition(id: string) {
    const index = yDocStore.divNew.findIndex((obj) => obj.id === id);

    const x = (yDocStore.divNew[index].dragPosition.x = startX);
    const y = (yDocStore.divNew[index].dragPosition.y = startY);

    yDocStore.doc.transact(function () {
      const trackDivNew = yDocStore.yArrayDivNew.get(index);

      if (trackDivNew) {
        trackDivNew.dragPosition.y = y;
        trackDivNew.dragPosition.x = x;
      }
      yDocStore.yArrayDivNew.delete(index);
      yDocStore.yArrayDivNew.insert(index, [trackDivNew]);
    });
  }

  function createDivNew() {
    const color = getRandomColorClass();

    yDocStore.divNew.push({
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

    const id = yDocStore.divNew[yDocStore.divNew.length - 1].id;


    yDocStore.yArrayDivNew.insert(0, [
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

    divNewStore.divNew.id = id;


    setTimeout(() => dragDivNew(id), 200);
  }

  function getRandomColorClass() {
    const colorClasses = [
      "#FFCA28", "#FFF176", "#EDE7F6", "#BBDEFB"
    ];
    const randomIndex = Math.floor(Math.random() * colorClasses.length);
    return colorClasses[randomIndex];
  }

  function deleteDivNew(_divNew: IDivNew) {
    const index = yDocStore.divNew.findIndex(
      (obj) => obj.id === _divNew.id
    );
    yDocStore.divNew.splice(index, index);

    yDocStore.yArrayDivNew.delete(index);
  }

  function dragDivNew(id: string) {
    const divNew = document.querySelector(".div-new-" + id) as HTMLElement;
    const divNewHandler = document.querySelector(
      ".div-new-handler-" + id
    ) as HTMLElement;
    const divNewResizer = document.querySelector(
      ".div-new-resizer-" + id
    ) as HTMLElement;


    console.log("divNew", divNew);

    // dragging
    // resizing

    //resizing
    divNewResizer.addEventListener("mousedown", function (e: any) {
      divNewStore.divNew.id = id;

      startRX = e.clientX;
      startRY = e.clientY;

      divNewStartwidth = divNew.offsetWidth;
      divNewStartHeight = divNew.offsetHeight;

      divNew.style.position = "absolute";

      document.addEventListener("mousemove", mouseMove);
      document.addEventListener("mouseup", mouseUp);

      function mouseMove(e: any) {
        const newWidth = divNewStartwidth + e.clientX - startRX;
        const newHeight = divNewStartHeight + e.clientY - startRY;
        newResizeX = newWidth;
        newResizeY = newHeight;

        changeDivNewResizeXYPosition(id);

        divNew.style.width = Math.max(newWidth, newResizeX) + "px";
        divNew.style.height =
          Math.max(newHeight, newResizeY) + "px";
      }

      function mouseUp(e: any) {
        document.removeEventListener("mousemove", mouseMove);
      }
    });

    //dragging
    divNewHandler.addEventListener("mousedown", function (e: any) {
      divNewStore.divNew.id = id;

      startX = e.clientX;
      startY = e.clientY;

      divNew.style.position = "absolute";

      document.addEventListener("mousemove", mouseMove);
      document.addEventListener("mouseup", mouseUp);

      function mouseMove(e: any) {
        newX = startX - e.clientX;
        newY = startY - e.clientY;

        startX = e.clientX;
        startY = e.clientY;

        changeDivNewXYPosition(id);

        divNew.style.top = divNew.offsetTop - newY + "px";
        divNew.style.left = divNew.offsetLeft - newX + "px";
      }

      function mouseUp(e: any) {
        document.removeEventListener("mousemove", mouseMove);
      }
    });
  }

  function changeDivNewColor(divNewId: string, color: string) {
    for (let i = 0; i < yDocStore.divNew.length; i++) {
      if (yDocStore.divNew[i].id === divNewId) {
        yDocStore.divNew[i].color = color;
      }
    }
  }

  return {
    dragDivNew,
    createDivNew,
    deleteDivNew,
    changeDivNewColor,
    divNewHasEventSet,
    changeDivNewBodyContent,
  };
}
