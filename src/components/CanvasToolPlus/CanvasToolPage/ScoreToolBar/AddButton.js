import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

function AddButton({ setListData }) {
  const initElement = { ExName: '', ExScore: '' };
  return (
    <div style={{ textAlign: 'center', margin: '5px 24px' }}>
      <Button
        type="primary"
        size="small"
        style={{ width: '100%' }}
        block
        icon={<PlusOutlined />}
        onClick={() => setListData((pre) => [...pre, initElement])}
      />
    </div>
  );
}

AddButton.propTypes = {
  setListData: PropTypes.func,
};

export default AddButton;
