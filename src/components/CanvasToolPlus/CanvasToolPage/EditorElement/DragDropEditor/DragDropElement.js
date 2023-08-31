import React, { memo, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Input, Popover } from 'antd';
import { fabric } from 'fabric';

function DragDropElement({ obj, dependency }) {
  const { data, top, left, width, height, scaleX, scaleY, angle } = JSON.parse(dependency);
  //
  const newWidth = width * scaleX;
  const newHeight = height * scaleY;
  // update data
  useEffect(() => {
    const {
      data,
      top,
      left,
      canvas: { backgroundImage },
    } = obj;
    //
    if (data.text.includes('Drag') && backgroundImage) {
      fabric.Image.fromURL(
        backgroundImage._element.src, // backgroundImage link
        (img) => {
          const { scaleX, scaleY } = backgroundImage;
          img.set({ width: newWidth / scaleX, height: newHeight / scaleY, cropX: left / scaleX, cropY: top / scaleY });
          //
          data.image = img.toDataURL();
        },
        { crossOrigin: 'anonymous' },
      );
    }
    return () => {};
  });
  //
  if (obj.group) return null; // when selecting multiple objects
  //
  return (
    <div
      style={{
        position: 'absolute',
        transform: 'translate(-50%, -50%)',
        top: top + newHeight / 2,
        left: left + newWidth / 2,
        backgroundColor: 'white',
        borderRadius: 2,
        fontSize: 12,
      }}
    >
      <Popover
        content={
          <div style={{ border: '1px solid gray' }}>
            <img src={data.image} alt='' />
          </div>
        }
      >
        <b>{data.text}</b>
      </Popover>
    </div>
  );
}

DragDropElement.propTypes = {
  canvas: PropTypes.object,
  obj: PropTypes.object,
  dependency: PropTypes.string, // update reload dependency
};

export default memo(DragDropElement);
