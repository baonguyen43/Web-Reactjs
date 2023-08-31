export const canvasID = 'canvas-id';
//
export const modeName = {
  // pointer: 'pointer',
  // pencil: 'pencil',
  // text: 'text',
  // bucket: 'bucket',
  // shape: 'shape',
  // erase: 'delete',
  WRITE: 'Write',
  CHOICE: 'Choice',
  MATCH: 'Match',
  LISTEN: 'Listen',
  SELECTWORD: 'SelectWord',
  DROPDOWN: 'DropDown',
  DRAGDROP: 'DragDrop',
};
//
export const modeColor = {
  [modeName.WRITE]: 'rgba(255,255,255,0.7)',
  [modeName.MATCH]: 'rgba(255,255,248,0.8)',
  [modeName.CHOICE]: 'rgba(230,230,230, 0.80)',
  [modeName.SELECTWORD]: 'rgba(230,230,230, 0.80)',
  [modeName.DROPDOWN]: 'rgba(230,230,230, 0.80)',
  [modeName.DRAGDROP]: 'rgba(230,230,230, 0.80)',
  [modeName.LISTEN]: 'rgba(255, 240, 165, 0.81)',
};
//
export const keyToolbar = {
  SAVE: 'save',
  REMOVEALL: 'removeAll',
  CANCEL: 'cancel',
  DONE: 'done',
  CHANGEMODE: 'change_mode',
};
