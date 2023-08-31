import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { Button, Tooltip } from 'antd';
import { CheckCircleTwoTone, CloseCircleTwoTone } from '@ant-design/icons';

function ChoiceElement({ canvas, obj, dependency }) {
  if (obj.group) return null; //when selecting multiple objects

  const { data, top, left, width, height, scaleX, scaleY } = JSON.parse(dependency);
  //
  const newWidth = width * scaleX;
  const newHeight = height * scaleY;
  const YES = 'yes';
  const NO = 'no';
  //update data
  function handleClick(textCurrent) {
    const { data } = obj;
    if (textCurrent === YES) data.text = NO;
    if (textCurrent === NO) data.text = YES;
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
      }}
    >
      <Tooltip placement='top' title={titleLabel()}>
        {data.text === YES && <Button size='small' shape='circle' icon={<CheckCircleTwoTone twoToneColor='#52c41a' style={{ fontSize: 20 }} />} onClick={() => handleClick(YES)} />}
        {data.text === NO && <Button size='small' shape='circle' icon={<CloseCircleTwoTone twoToneColor='#FF4D4F' style={{ fontSize: 20 }} />} onClick={() => handleClick(NO)} />}
      </Tooltip>
    </div>
  );
}

ChoiceElement.propTypes = {
  canvas: PropTypes.object,
  obj: PropTypes.object,
  dependency: PropTypes.string, //update reload dependency
};

export default memo(ChoiceElement);
