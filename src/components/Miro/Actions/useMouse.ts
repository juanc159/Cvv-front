import { yDocStore } from "../Store/yDocStore";


export function useShareUserCursor() {

  const trackMousePosition = (event: MouseEvent) => {
    yDocStore.mousePosition.x = event.clientX;
    yDocStore.mousePosition.y = event.clientY;

    yDocStore.yMouse.set('x', event.clientX);
    yDocStore.yMouse.set('y', event.clientY);


  }

  return {
    trackMousePosition
  }
}
