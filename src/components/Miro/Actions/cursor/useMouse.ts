import { yDocStore } from "../../Store/yDocStore";

export function useShareUserCursor() {


  function trackMousePosition(event: any) {
    // const userName=userData?.user?.name
    yDocStore.mousePosition.x = event.clientX;
    yDocStore.mousePosition.y = event.clientY;
    // yDocStore.mousePosition.userName = userName as string



    yDocStore.yMouse.set("x", event.clientX);
    yDocStore.yMouse.set("y", event.clientY);
    // yDocStore.yMouse.set("userName", userName);

  }

  return {
    trackMousePosition,
  };
}
