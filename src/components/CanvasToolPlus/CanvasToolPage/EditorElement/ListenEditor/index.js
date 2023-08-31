import React from 'react';
import PropTypes from 'prop-types';
import ListenElement from './ListenElement';

function ListenEditor({ listObject = [], canvas }) {
  //
  return (
    <div>
      {listObject.map((item, index) => {
        const { data, top, left, width, height, scaleX, scaleY } = item;
        //update reload dependency
        const dependency = JSON.stringify({ top, left, width, height, scaleX, scaleY, data });
        //
        return <ListenElement key={index} canvas={canvas} obj={item} dependency={dependency} />;
      })}
    </div>
  );
}

ListenEditor.propTypes = {
  listObject: PropTypes.array,
  canvas: PropTypes.object,
};

export default ListenEditor;
