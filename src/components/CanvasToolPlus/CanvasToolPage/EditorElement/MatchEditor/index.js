import React from 'react';
import PropTypes from 'prop-types';
import MatchElement from './MatchElement';

function MatchEditor({ listObject = [], canvas }) {
  //
  return (
    <div>
      {listObject.map((item, index) => {
        const { data, top, left, width, height, scaleX, scaleY } = item;
        //update reload dependency
        const dependency = JSON.stringify({ top, left, width, height, scaleX, scaleY, data });
        //
        return <MatchElement key={index} canvas={canvas} obj={item} dependency={dependency} />;
      })}
    </div>
  );
}

MatchEditor.propTypes = {
  listObject: PropTypes.array,
  canvas: PropTypes.object,
};

export default MatchEditor;
