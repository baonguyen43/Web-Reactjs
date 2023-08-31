/* eslint-disable react/require-default-props */
import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Col, Row, Space } from 'antd';
import { keyToolbar, modeName } from '../configuration';

const { SAVE, REMOVEALL, CANCEL, DONE, CHANGEMODE } = keyToolbar;

function ToolBar({ refToolBar, onClickToolBar }) {
  const [mode, setMode] = useState('');
  const [groupName, setGroupName] = useState(0);
  // ref control
  useEffect(() => {
    Object.assign(refToolBar.current, {
      getMode: () => {
        return mode;
      },
      getGroupName: () => {
        return groupName;
      },
      setGroupName: (value) => {
        setGroupName(value);
      },
    });
    return () => { };
  }, [groupName, mode, refToolBar]);
  //
  const handleClickMode = useCallback(
    (key) => {
      if (mode) return;
      setMode(key);
      onClickToolBar(CHANGEMODE);
    },
    [mode, onClickToolBar],
  );
  //
  const handleClickConfirm = useCallback(
    (key) => {
      setMode('');
      onClickToolBar(key);
    },
    [onClickToolBar],
  );
  //
  const renderMode = useCallback(() => {
    const { WRITE, CHOICE, MATCH, LISTEN, SELECTWORD, DROPDOWN, DRAGDROP } = modeName;
    const arrayMode = [
      { key: WRITE, label: 'Gap Filling', title: 'Điền từ vào chỗ trống', color: '#1E78FA' },
      { key: CHOICE, label: 'Multiple Choice', title: 'Chọn câu/từ đúng', color: '#A86843' },
      { key: MATCH, label: 'Matching', title: 'Nối', color: '#4DA5AD' },
      { key: SELECTWORD, label: 'Word Selecting', title: 'select', color: '#A86843' },
      { key: DROPDOWN, label: 'Drop Down', title: 'Drop Down', color: '#4DA5AD' },
      { key: DRAGDROP, label: 'Drag Drop', title: 'Drag Drop', color: '#11E8F1' },
      { key: LISTEN, label: 'Listening', title: 'Âm thanh', color: '#49B323' },
    ];
    return (
      <Space size='small'>
        {arrayMode.map(({ key, title, label, color }) => {
          const styleButton = { color, borderColor: color, fontWeight: 'bold' };
          let isDisabled = false;
          //
          if (mode && key !== mode) {
            isDisabled = true;
            Object.assign(styleButton, { color: 'gray', borderColor: 'gray' });
          }
          return (
            <Button
              key={key}
              type='dashed'
              disabled={isDisabled}
              style={styleButton}
              onClick={() => {
                handleClickMode(key);
              }}
            >
              {label}
            </Button>
          );
        })}
      </Space>
    );
  }, [handleClickMode, mode]);
  //
  const rederConfirm = useCallback(() => {
    if (!mode) return null;
    return (
      <Space size='small' direction='horizontal'>
        <Button type='primary' danger onClick={() => handleClickConfirm(CANCEL)}>
          Hủy
        </Button>
        {/* <h2>{mode}</h2> */}
        <Button type='primary' onClick={() => handleClickConfirm(DONE)}>
          Hoàn thành
        </Button>
      </Space>
    );
  }, [handleClickConfirm, mode]);
  //
  return (
    // <Row style={{ width: 1140, height: 40 }}>
    <Row style={{ width: '100%' }}>
      <Col span={16}>{renderMode()}</Col>
      <Col span={8} className='d-flex justify-content-end'>
        {rederConfirm()}
      </Col>
    </Row>
  );
}

ToolBar.propTypes = {
  refToolBar: PropTypes.object,
  onClickToolBar: PropTypes.any,
};

export default React.memo(ToolBar);
