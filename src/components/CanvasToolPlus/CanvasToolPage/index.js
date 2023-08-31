/* eslint-disable no-unused-expressions */
/* eslint-disable no-case-declarations */
import React, { useCallback, useEffect, useRef, useState } from 'react';
// import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { updateJsonData } from './api';
import {
  addRect,
  canvasID,
  canvasToJson,
  configDeleteControl,
  createCanvas,
  createExerciseData,
  keyToolbar,
} from './configuration';
import EditorElement from './EditorElement';
import { get } from 'helpers/QueryHelper';
import Mouse from './models/mouse';
import ToolBar from './ToolBar';
import UpdateImage from './UpdateImage';
import ScoreToolBar from './ScoreToolBar';

const getDataByID = (attachmentsId) => {
  if (!attachmentsId) return [];
  return get(
    'Attachments',
    '*',
    { id: attachmentsId, entityName: 't_AMES247_Sessions' },
    'CreatedDate DESC',
    'SHARE'
  ).then((res) => res[0]);
};
const { SAVE, REMOVEALL, CANCEL, DONE, CHANGEMODE } = keyToolbar;
function CanvasToolPage({ idCurrent, entityId, worksheetFile, teacherId, onUpdateImage }) {
  const [storeCanvas, setStoreCanvas] = useState({});
  const [canvas, setCanvas] = useState();
  //
  const refMouse = useRef(new Mouse());
  // const refLinkTo = useRef({});
  const refToolBar = useRef({});
  const refEditorElement = useRef({});
  //
  // const scoreToolBar = useRef({});
  // init
  useEffect(() => {
    const loadData = async () => {
      if (worksheetFile) {
        setStoreCanvas((pre) => ({
          ...pre,
          backgroundImage: worksheetFile.imgURL,
          canvasJson: worksheetFile?.jsonData?.canvasJson,
        }));
      } else {
        const dataByID = await getDataByID(idCurrent);
        if (dataByID?.id) {
          const { id, fileUrl, jsonData } = dataByID;
          setStoreCanvas((pre) => {
            return {
              ...pre,
              id,
              backgroundImage: `https://cloud.softech.vn${fileUrl}`,
              canvasJson: jsonData?.canvasJson,
            };
          });
        }
      }
    };
    //
    loadData();
    return () => {};
  }, [idCurrent, worksheetFile]);

  //
  useEffect(() => {
    const { backgroundImage, canvasJson } = storeCanvas;
    const canvi = createCanvas(backgroundImage, canvasJson);
    //
    setCanvas(canvi);
    configDeleteControl();

    return () => {
      if (canvi) {
        canvi.dispose();
      }
    };
  }, [storeCanvas]);
  // canvas event
  useEffect(() => {
    const toolBar = refToolBar.current;
    const mouse = refMouse.current;
    if (typeof toolBar.getMode !== 'function') return undefined;
    //
    canvas?.on({
      'mouse:down': (e) => {
        mouse.eventDown(e);
      },
      'mouse:up': (e) => {
        const up = mouse.eventUp(e);
        const down = mouse.eventDown();
        const countActiveObjects = canvas.getActiveObjects().length;
        //
        if (!(down.target || up.target || countActiveObjects > 0)) {
          addRect(canvas, mouse, toolBar);
        }
      },
      'mouse:out': (e) => {
        if (e.target === null && toolBar.getMode() === '') {
          //
          handleSave();
        }
      },
      'object:modified': () => {
        if (toolBar.getMode() === '') {
          handleSave();
        }
      },
      'after:render': () => {
        //
        const arrayObject = canvas.getObjects('rect');
        refEditorElement.current.setList(arrayObject);
        //
        // scoreToolBar.current.setList(arrayObject);
      },
    });
    return () => {
      // removes all handlers for all events
      canvas?.off();
    };
  }, [canvas, handleSave]);
  //
  const handleChangeImage = useCallback(
    ({ imgURL, id }) => {
      // update new image and delete old canvas
      setStoreCanvas({ backgroundImage: imgURL, id });
      //
      if (typeof onUpdateImage === 'function') {
        onUpdateImage(id);
      }
    },
    [onUpdateImage]
  );
  //
  const handleSave = useCallback(() => {
    // save and send data
    const canvasJson = canvasToJson(canvas);
    const ExerciseData = createExerciseData(canvas);
    const newStoreCanvas = { ...storeCanvas, canvasJson, ExerciseData };
    // send
    const data = JSON.stringify(newStoreCanvas);
    localStorage.setItem('storeCanvas', data);
    updateJsonData(worksheetFile ? worksheetFile.id : storeCanvas.id, data, teacherId);
  }, [canvas, storeCanvas, teacherId, worksheetFile]);
  //
  const handleClickToolBar = useCallback(
    (key) => {
      const toolBar = refToolBar.current;
      switch (key) {
        case CANCEL:
          // delete objects belonging to the current group
          const groupCurrent = toolBar.getGroupName();
          const Objects = canvas.getObjects().filter((x) => x.data.groupName === groupCurrent);
          canvas.remove(...Objects);
          break;
        case DONE:
          handleSave();
          break;
        case CHANGEMODE:
          const groupMax = Math.max(...canvas.getObjects().map((x) => x.data.groupName), 0);
          toolBar.setGroupName(groupMax + 1);
          break;
        case REMOVEALL:
          canvas.remove(...canvas.getObjects());
          break;
        case SAVE:
          handleSave();
          break;

        default:
          break;
      }
    },
    [canvas, handleSave]
  );
  //
  return (
    <div style={{ height: '100%', position: 'relative' }}>
      <div style={{ display: 'flex', marginBottom: 10 }}>
        <div className="mr-2">
          <UpdateImage entityId={entityId} onChange={handleChangeImage} userId={teacherId} />
        </div>
        {storeCanvas.backgroundImage && <ToolBar refToolBar={refToolBar} onClickToolBar={handleClickToolBar} />}
      </div>
      <div style={{ maxHeight: '90%', overflow: 'auto' }}>
        <div style={{ position: 'relative' }}>
          <canvas id={canvasID} />
          <EditorElement refEditorElement={refEditorElement} canvas={canvas} />
        </div>
      </div>
      {/* <div style={{ position: 'absolute', top: '40px', right: '20px' }}>
        <ScoreToolBar {...{ scoreToolBar, canvas }} />
      </div> */}
    </div>
  );
}

CanvasToolPage.propTypes = {
  entityId: PropTypes.string,
  worksheetFile: PropTypes.object,
  teacherId: PropTypes.number,
  idCurrent: PropTypes.string,
  onUpdateImage: PropTypes.func,
};
CanvasToolPage.defaultProps = {
  entityId: '',
  worksheetFile: {},
};

export default CanvasToolPage;
