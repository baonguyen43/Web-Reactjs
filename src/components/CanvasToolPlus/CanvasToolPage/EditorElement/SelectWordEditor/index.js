import React from 'react';
import PropTypes from 'prop-types';
import SelectWordElement from './SelectWordElement';

function SelectWordEditor({ listObject = [], canvas }) {
  //
  return (
    <div>
      {listObject.map((item, index) => {
        const { data, top, left, width, height, scaleX, scaleY, angle } = item;
        // update reload dependency
        const dependency = JSON.stringify({ top, left, width, height, scaleX, scaleY, data, angle });
        //
        return <SelectWordElement key={index} canvas={canvas} obj={item} dependency={dependency} />;
      })}
    </div>
  );
}

SelectWordEditor.propTypes = {
  listObject: PropTypes.array,
  canvas: PropTypes.object,
};

export default SelectWordEditor;
