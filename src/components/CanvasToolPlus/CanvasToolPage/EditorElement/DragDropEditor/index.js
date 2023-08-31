import React from 'react';
import PropTypes from 'prop-types';
import DragDropElement from './DragDropElement';

function DragDropEditor({ listObject = [] }) {
  //
  return (
    <div>
      {listObject.map((item, index) => {
        const { data, top, left, width, height, scaleX, scaleY, angle } = item;
        // update reload dependency
        const dependency = JSON.stringify({ top, left, width, height, scaleX, scaleY, data, angle });
        //
        return <DragDropElement key={index} obj={item} dependency={dependency} />;
      })}
    </div>
  );
}

DragDropEditor.propTypes = {
  listObject: PropTypes.array,
};

export default DragDropEditor;
