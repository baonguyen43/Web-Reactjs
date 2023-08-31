import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { Input } from 'antd';

function SelectWordElement({ canvas, obj, dependency }) {
  if (obj.group) return null; // when selecting multiple objects

  const { data, top, left, width, height, scaleX, scaleY, angle } = JSON.parse(dependency);
  //
  const newWidth = width * scaleX;
  const newHeight = height * scaleY;
  const border = 4;
  const isMin = newHeight < 30;
  // update data
  function handleChange(e) {
    const { value } = e.target;
    const { data } = obj;
    data.text = value;
    // canvas.renderAll();
  }
  //
  return (
    <div
      style={{
        position: 'absolute',
        transformOrigin: isMin ? 'bottom left' : 'top left',
        transform: `rotate(${angle}deg)`,
        top: top + (isMin ? -30 : border),
        left: left + 2 * border,
        width: newWidth - 4 * border,
        height: 22,
      }}
    >
      <Input size='small' defaultValue={data.text} style={{ position: 'absolute', top: 0, width: '100%', fontSize: 16, padding: 0 }} onChange={handleChange} />
    </div>
  );
}

SelectWordElement.propTypes = {
  canvas: PropTypes.object,
  obj: PropTypes.object,
  dependency: PropTypes.string, // update reload dependency
};

export default memo(SelectWordElement);
