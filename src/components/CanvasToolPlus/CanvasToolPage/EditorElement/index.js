import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import WriteEditor from './WriteEditor';
import ChoiceEditor from './ChoiceEditor';
import MatchEditor from './MatchEditor';
import SelectWordEditor from './SelectWordEditor';
import DragDropEditor from './DragDropEditor';
import DropDownEditor from './DropDownEditor';
import ListenEditor from './ListenEditor';
import { modeName } from '../configuration';

const { WRITE, CHOICE, MATCH, SELECTWORD, DROPDOWN, DRAGDROP, LISTEN } = modeName;

function EditorElement({ refEditorElement, canvas }) {
  const [Objects, setObjects] = useState({});
  // ref control
  useEffect(() => {
    Object.assign(refEditorElement.current, {
      setList: (arrayObj) => {
        const newObjects = _.groupBy(arrayObj, (o) => o.mode);
        setObjects(newObjects);
      },
    });
    return () => { };
  }, [refEditorElement]);
  return (
    <>
      <WriteEditor listObject={Objects[WRITE]} canvas={canvas} />

      <ChoiceEditor listObject={Objects[CHOICE]} canvas={canvas} />

      <MatchEditor listObject={Objects[MATCH]} canvas={canvas} />

      <SelectWordEditor listObject={Objects[SELECTWORD]} canvas={canvas} />

      <DropDownEditor listObject={Objects[DROPDOWN]} canvas={canvas} />

      <DragDropEditor listObject={Objects[DRAGDROP]} canvas={canvas} />

      <ListenEditor listObject={Objects[LISTEN]} canvas={canvas} />
    </>
  );
}

EditorElement.propTypes = {
  refEditorElement: PropTypes.object,
  canvas: PropTypes.object,
};

export default EditorElement;
