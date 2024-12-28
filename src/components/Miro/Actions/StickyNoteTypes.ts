
export interface IStickyNote {
  id: string;
  body: string;
  color: string;
  dragPosition: {
    x: number;
    y: number;
  }
  resizePosition: {
    x: number;
    y: number;
  }
}
