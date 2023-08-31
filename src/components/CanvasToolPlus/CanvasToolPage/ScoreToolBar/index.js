import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { List, message, Modal } from 'antd';
import Header from './Header';
import AddButton from './AddButton';
import ScoresInput from './ScoresInput';
import { fabric } from 'fabric';
function ScoreToolBar({ scoreToolBar, canvas }) {
  const [listData, setListData] = useState([]);

  // ref control
  useEffect(() => {
    Object.assign(scoreToolBar.current, {
      setList: (arrayObject) => {
        const newListData = convertList(arrayObject);
        setListData((pre) => {
          if (JSON.stringify(newListData) === JSON.stringify(pre)) {
            // not rereder
            return pre;
          }
          return newListData;
        });
      },
    });
    return () => {};
  }, [scoreToolBar]);

  const handleDataChange = (values, index) => {
    syncData(canvas, values);
    //
    setListData((pre) => {
      const newArray = pre.map((item, i) => (i === index ? values : item));
      return newArray;
    });
  };
  //
  const handlePush = (values) => {
    const { ExName, ExScore } = values;
    const ActiveObjects = canvas.getActiveObjects();
    const arrayByExName = canvas.getObjects('rect').filter((item) => item.data.ExName === ExName);
    //
    if (ActiveObjects.length === 0) {
      if (arrayByExName.length === 0) {
        message.warning('Chưa chọn đối tượng!');
      } else {
        selectObjects(canvas, arrayByExName);
        message.success(`Bài ${ExName} đã được chọn`);
      }
    } else {
      const title = `Chú ý ghi đè thành ${ExName}`;
      confirm(title, () => {
        ActiveObjects.forEach((item) => {
          Object.assign(item.data, values);
        });
        message.success('Thêm bài thành công!');
      });
    }
  };

  return (
    <div style={{ width: 240, backgroundColor: 'white' }}>
      <List
        header={<Header data={listData} />}
        loadMore={<AddButton {...{ setListData }} />}
        bordered
        dataSource={listData}
        renderItem={(item, index) => (
          <List.Item>
            <ScoresInput data={item} onDataChange={(values) => handleDataChange(values, index)} onPush={handlePush} />
          </List.Item>
        )}
      />
    </div>
  );
}

ScoreToolBar.propTypes = {
  scoreToolBar: PropTypes.object,
  canvas: PropTypes.object,
};

export default ScoreToolBar;
//
const convertList = (array) => {
  // Remove duplicates
  const newArray = [];
  array.forEach((item, i) => {
    const { ExName, ExScore } = item.data;
    const isIncludes = newArray.some((x) => x.ExName === ExName);
    if (!isIncludes) {
      newArray.push({ ExName, ExScore });
    }
  });
  return newArray;
};
//
const syncData = (canvas, values) => {
  const { ExName, ExScore } = values;
  const arrayObject = canvas.getObjects('rect');
  arrayObject.forEach((item) => {
    if (item.data.ExName === ExName) {
      item.data.ExScore = ExScore;
    }
  });
};
//
const selectObjects = (canvas, arrayObject) => {
  canvas.discardActiveObject();
  const sel = new fabric.ActiveSelection(arrayObject, {
    canvas: canvas,
  });
  canvas.setActiveObject(sel);
  canvas.requestRenderAll();
};
//
function confirm(title, handleOK) {
  Modal.confirm({
    title: title,
    onOk() {
      handleOK();
    },
    onCancel() {},
  });
}
