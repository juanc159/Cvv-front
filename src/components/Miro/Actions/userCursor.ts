import { yDocStore } from "../Store/yDocStore";


export function useShareUserCursor() {

  const trackMousePosition = (event: MouseEvent) => {
    yDocStore.mousePosition.x = event.clientX;
    yDocStore.mousePosition.y = event.clientY;

    yDocStore.yCursor.set('x', event.clientX);
    yDocStore.yCursor.set('y', event.clientY);


  }

  return {
    trackMousePosition
  }
}
