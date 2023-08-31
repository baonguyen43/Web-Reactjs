/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
/* eslint-disable consistent-return */
/* eslint-disable react/require-default-props */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'antd';
import { LoadingOutlined, UploadOutlined } from '@ant-design/icons';
import { fileToImgUrl } from '../configuration';

function UpdateImage({ onChange, entityId, userId }) {
  const [imgUrl, setImgUrl] = useState('');
  const imgUpload = React.useRef();
  const [isLoad, setIsLoad] = useState(false);

  //
  const handleChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return null;
    setIsLoad(true);
    const imgObject = await fileToImgUrl(file, entityId, userId);

    if (typeof onChange === 'function') {
      onChange(imgObject);
    }
    setIsLoad(false);
    // img
    // setImgUrl(imgUrl);
  };

  return (
    <div>
      <Button onClick={() => imgUpload.current.click()} icon={isLoad ? <LoadingOutlined style={{ color: '#1E78FA' }} /> : <UploadOutlined />} type='dashed'>
        Upload image
      </Button>
      <input ref={imgUpload} style={{ display: 'none' }} type='file' onChange={handleChange} />
      {/* <img src={imgUrl} alt="" width="100px" /> */}
    </div>
  );
}

UpdateImage.propTypes = { onChange: PropTypes.func };

export default UpdateImage;
