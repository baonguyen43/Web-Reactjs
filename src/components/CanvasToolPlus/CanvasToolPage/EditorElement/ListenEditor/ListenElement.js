/* eslint-disable react/require-default-props */
/* eslint-disable consistent-return */
/* eslint-disable no-shadow */
import React, { memo, useRef } from 'react';
import PropTypes from 'prop-types';
import { Button, Input, Tooltip } from 'antd';
import { toBase64 } from '../../configuration';
import { fileToURL } from '../../api';

function ListenElement({ canvas, obj, dependency }) {
  const refUpLoad = useRef(null);

  if (obj.group) return null; // when selecting multiple objects

  const { data, top, left, width, height, scaleX, scaleY } = JSON.parse(dependency);
  //
  const newWidth = width * scaleX;
  const newHeight = height * scaleY;
  // update data
  async function handleChange(e) {
    const file = e.target.files[0];
    if (!file) return null;
    const params_id = '358d8538-628d-471e-8ed5-5c337f4aa8cb';
    const audio = await fileToURL(file, params_id);
    // const audio = await toBase64(file);
    const { data } = obj;
    Object.assign(data, { audio, text: audio.audioURL });
    //
    canvas.renderAll();
  }
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
        style={{ top: 0, width: '100%', fontSize: 16 }}
        onChange={handleChange}
      /> */}
      <Tooltip
        title={data?.audio?.fileName ?? 'upload audio file'}
        getPopupContainer={(trigger) => {
          return trigger.parentElement;
        }}
      >
        <Button shape='circle' icon={<i className='fa fa-upload' style={{ color: data.audio ? '#52C41A' : 'gray' }} />} onClick={() => refUpLoad.current.click()} />
      </Tooltip>
      <input ref={refUpLoad} type='file' onChange={handleChange} style={{ display: 'none' }} />
    </div>
  );
}

ListenElement.propTypes = {
  canvas: PropTypes.object,
  obj: PropTypes.object,
  dependency: PropTypes.string, // update reload dependency
};

export default memo(ListenElement);
