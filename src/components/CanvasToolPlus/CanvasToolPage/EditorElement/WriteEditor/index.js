import React from 'react';
import PropTypes from 'prop-types';
import WriteElement from './WriteElement';

function WriteEditor({ listObject = [], canvas }) {
  //
  return (
    <div>
      {listObject.map((item, index) => {
        const { data, top, left, width, height, scaleX, scaleY, angle } = item;
        //update reload dependency
        const dependency = JSON.stringify({ top, left, width, height, scaleX, scaleY, data, angle });
        //
        return <WriteElement key={index} canvas={canvas} obj={item} dependency={dependency} />;
      })}
    </div>
  );
}

WriteEditor.propTypes = {
  listObject: PropTypes.array,
  canvas: PropTypes.object,
};

export default WriteEditor;
