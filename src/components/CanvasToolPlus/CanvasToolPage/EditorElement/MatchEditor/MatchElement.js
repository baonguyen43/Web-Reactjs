import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { Input, Tooltip } from 'antd';

function MatchElement({ canvas, obj, dependency }) {
  if (obj.group) return null; //when selecting multiple objects

  const { data, top, left, width, height, scaleX, scaleY } = JSON.parse(dependency);
  //
  const newWidth = width * scaleX;
  const newHeight = height * scaleY;
  //update data
  function handleChange(e) {
    const value = e.target.value;
    const { data } = obj;
    data.text = value;
    canvas.renderAll();
  }
  //
  const titleLabel = () => {
    const { data } = obj;
    return (
      <div>
        {/* <span> Mode: {obj.mode}</span> */}
        <span> Group: {data.groupName}</span>
      </div>
    );
  };
  //
  return (
    <div
      style={{
        position: 'absolute',
        transform: 'translate(-50%, -50%)',
        top: top + newHeight / 2,
        left: left + newWidth / 2,
        // width: newWidth,
      }}
    >
      {/* <Input
        size="small"
        defaultValue={data.text}
        style={{ top: 0, width: '100%', fontSize: 16, backgroundColor: data.text }}
        onChange={handleChange}
      /> */}
      <Tooltip placement='top' title={titleLabel()}>
        <i className='fas fa-circle fa-2x' style={{ color: data.text }}></i>
      </Tooltip>
    </div>
  );
}

MatchElement.propTypes = {
  canvas: PropTypes.object,
  obj: PropTypes.object,
  dependency: PropTypes.string, //update reload dependency
};

export default memo(MatchElement);
