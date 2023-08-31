import { fabric } from 'fabric';
import _ from 'lodash';
import { canvasID, modeColor, modeName } from './constant';

const { WRITE, MATCH, CHOICE, SELECTWORD, DROPDOWN, DRAGDROP, LISTEN } = modeName;

//
const initialCanvas = {
  isDrawingMode: false,
  renderOnAddRemove: true,
  preserveObjectStacking: true,
};
//
const initialRect = {
  stroke: 'blue',
  strokeWidth: 1,
  strokeUniform: true,
};

//
export function createCanvas(image, canvasJson) {
  const custom_width = 1140;
  const canvas = new fabric.Canvas(canvasID, { ...initialCanvas });
  if (image) {
    fabric.Image.fromURL(image, (img) => {
      img.scaleToWidth(custom_width);
      const { width, height, scaleX, scaleY } = img;
      canvas.setWidth(width * scaleX);
      canvas.setHeight(height * scaleY);
      canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas));
    });
    // load
    if (canvasJson) {
      // canvas.loadFromJSON(canvasJson, canvas.renderAll.bind(canvas));
      canvas.loadFromJSON(canvasJson);
    }
  }
  return canvas;
}
//
export function canvasToJson(canvas) {
  const propertiesToInclude = ['id', 'mode', 'data', 'hasControls'];
  const canvasObjects = canvas.toJSON(propertiesToInclude);
  return canvasObjects;
}
//
export function createExerciseData(canvas) {
  const listObj = canvas.getObjects();
  const arrayData = listObj.map(({ mode, top, left, width, height, angle, scaleX, scaleY, data }) => ({
    mode,
    top,
    left,
    width: width * scaleX,
    height: height * scaleY,
    angle,
    ...data,
  }));
  return arrayData;
}
//
export const addRect = (canvas, mouse, toolBar) => {
  const mode = toolBar.getMode();
  const groupName = toolBar.getGroupName();
  if (!mode) return null; // not select mode
  const { top, left, width, height } = mouse.getShape();

  if (!(width * height)) return null;
  if (width < 20 || height < 16) return null; // Smallest size
  //
  const Objects = canvas.getObjects();
  const idMax = Math.max(...Objects.map((x) => x.id), 0);
  //
  const rectProperties = {
    ...initialRect,
    id: idMax + 1, // next id
    mode,
    data: {
      groupName, // next group
      text: '',
    },
    fill: modeColor[mode],
    width,
    height,
    top,
    left,
  };
  //
  const { data } = rectProperties;
  switch (mode) {
    case WRITE: {
      data.text = 'Text';
      break;
    }
    //
    case MATCH: {
      const arrayColor = ['#F44336', '#9C27B0', '#2196F3', '#4CAF50', '#FFEB3B', '#795548', '#607D8B', '#7FFF00', '#00FFFF', '#00008B', '#00FA9A', '#FFA500', '#8B4513', '#FF7F50', '#FF1493', '#B22222', '#4B0082', '#008080', '#9370DB', '#FF00FF'];
      const preMatch = Objects.filter((x) => x.mode === MATCH).pop() ?? { data: { countMatch: -1 } }; // preMatch === undefined => countMatch= -1
      const countMatch = 1 + preMatch.data.countMatch;
      const index = Math.floor(countMatch / 2) % arrayColor.length;
      Object.assign(data, { text: arrayColor[index], countMatch });
      break;
    }
    //
    case CHOICE: {
      data.text = 'no';
      break;
    }
    //
    case SELECTWORD: {
      data.text = 'select';
      break;
    }
    //
    case DROPDOWN: {
      data.text = 'DropDown';
      break;
    }
    //
    case DRAGDROP: {
      const DRAG_DROP = ['Drag', 'Drop'];
      const preDragDrop = Objects.filter((x) => x.mode === DRAGDROP).pop() ?? { data: { text: 'Drop:0' } }; // preDragDrop === undefined=> text: 'Drop:0'
      const nextCount = +preDragDrop.data.text.split(':')[1] + 1;
      // creat rectDrag and rectDrop
      DRAG_DROP.forEach((item, index) => {
        const cloneProperties = _.cloneDeep(rectProperties);
        const { top, height } = cloneProperties;
        cloneProperties.data.text = `${item}:${nextCount}`; // ['Drag:1', 'Drop:1']
        cloneProperties.top = top + height * index; // when index === 1 => top = top + height
        canvas.add(new fabric.Rect(cloneProperties));
      });
      return null;
      // break;
    }
    //
    case LISTEN: {
      data.text = 'url';
      break;
    }
    //
    default:
      break;
  }
  //
  const rect = new fabric.Rect(rectProperties);
  //
  canvas.add(rect);
  return rect;
};
