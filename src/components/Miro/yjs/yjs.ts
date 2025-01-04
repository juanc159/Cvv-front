
// import { IndexeddbPersistence } from 'y-indexeddb';
import { WebsocketProvider } from 'y-websocket';
import { runFuncSequentially } from '../Helper/util';
import { yDocStore } from '../Store/yDocStore';
import { initCursor, initDivNew, initDrawing, initMiniTextEditor, initMouse, initStickyNote, initTextCaption } from './yjsUtils';


export interface IStickyNoteParams {
  stickyNoteHasEventSet: Set<string>,
  changeStickyNoteBodyContent: (...args: any[]) => void,
  dragStickyNote: (...args: any[]) => void,
}
export interface IDivNewParams {
  divNewHasEventSet: Set<string>,
  changeDivNewBodyContent: (...args: any[]) => void,
  dragDivNew: (...args: any[]) => void,
}

export interface IMiniTextEditorParams {
  miniTextEditorHasEventSet: Set<string>,
  changeMiniTextEditorBodyContent: (...args: any[]) => void,
  dragMiniTextEditor: (...args: any[]) => void,
}

export interface ITextCaptionParams {
  textCaptionHasEventSet: Set<string>,
  changeTextCaptionBodyContent: (...args: any[]) => void,
  dragTextCaption: (...args: any[]) => void,
}

export function initYjs(
  stickyNoteParam: IStickyNoteParams,
  miniTextEditorParam: IMiniTextEditorParams,
  textCaptionParam: ITextCaptionParams,
  projectData: any,
  divNewParam: IDivNewParams,

) {

  yDocStore.loading = true;
  yDocStore.doc.destroy()

  runFuncSequentially([
    initCursor,
    initMouse,
    initDrawing,
    initMiniTextEditor(miniTextEditorParam),
    initStickyNote(stickyNoteParam),
    initTextCaption(textCaptionParam),
    initDivNew(divNewParam),
  ]).then(() => {
    console.log("done runFuncSequentially");
    yDocStore.loading = false;

  }).catch((err) => console.log(err));


  const provider = new WebsocketProvider(
    "ws://localhost:1234",
    `sv000013-${projectData?.code}`,
    yDocStore.doc
  );

  //wait until the document is synchronized
  provider.on('sync', () => {
    yDocStore.loading = false;
    console.log('document is synchronized')
  })





  // new WebsocketProvider('ws://localhost:1234', projectData.code, yDocStore.doc)


}

