import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
// import Drag from './Drag';
import Drop from './Drop';

function DragDrop({ dragdrop, data }) {
  const [state, setState] = useState([]);
  const [result, setResult] = useState();
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    Object.assign(dragdrop, {
      submit: () => {
        if (!data) return {};
        const res = handleResult(state);
        setResult(res);
        return { dragDropResult: res };
      },
      tryAgain: () => {
        // tryAgain handle
        setState(pre => {
          return _.map(_.cloneDeep(data), (item) => {
            if (item.image !== undefined) item.answer = item.text.match(/\d+$/g)[0];
            return item;
          });
        });
        setIsDone(false);
        setResult();
      },
      setIsDone,
      setResult,
    });
    return () => { };
  }, [data, dragdrop, state]);

  useEffect(() => {
    setState((pre) => {
      const newData = _.map(_.cloneDeep(data), (item) => {
        if (item.image !== undefined) item.answer = item.text.match(/\d+$/g)[0];
        return item;
      });
      if (result) {
        return [...result.userData];
      }
      if (pre.length === 0) return newData;
      return pre;
    });
  }, [data, result]);
  //
  const handleDropAtDropComponent = (draggedItem, droppedIndex) => {
    const { value, draggedIndex } = draggedItem;
    if (!value.image) return;
    const isImageExisted = state[droppedIndex].image;
    isImageExisted === undefined
      ? setState((pre) => {
        pre[droppedIndex].image = value.image;
        pre[droppedIndex].answer = value.answer;
        delete pre[draggedIndex].image;
        delete pre[draggedIndex].answer;
        return [...pre];
      })
      : state[droppedIndex].image !== value.image &&
      setState((pre) => {
        const oldImage = pre[droppedIndex].image;
        pre[droppedIndex].image = value.image;
        pre[draggedIndex].image = oldImage;

        const oldAnswer = pre[droppedIndex].answer;
        pre[droppedIndex].answer = value.answer;
        pre[draggedIndex].answer = oldAnswer;
        return [...pre];
      });
  };
  //
  if (!data) return null;
  //
  return (
    <div>
      {state.map((item, index) => {
        const { angle, answer, groupName, height, image, left, mode, text, top, width, isCorrect } = item;
        const boxStyle = { border: '2px dotted gray' };
        if (isDone) {
          if (isCorrect === true) Object.assign(boxStyle, { border: '3px solid #2df12d' });
          if (isCorrect === false) Object.assign(boxStyle, { border: '3px solid #F12C35' });
        }
        return (
          <div key={index} style={{ position: 'absolute', width, height, top, left, transform: `rotate(${angle}deg)` }}>
            <Drop boxStyle={boxStyle} value={item} onDrop={(draggedItem) => handleDropAtDropComponent(draggedItem, index)} draggedIndex={index} />
          </div>
        );
      })}
    </div>
  );
}

DragDrop.propTypes = {
  dragdrop: PropTypes.object,
  data: PropTypes.array,
};

export default DragDrop;

const handleResult = (userData) => {
  // const newState = userData.map((item) => {
  //   if (!item.image) return item;
  //   item.isCorrect = _.startsWith(item.text, 'Drop') && item.text.match(/\d+$/g)[0] === item.answer;
  //   return item;
  // });
  //
  const DROP = 'Drop';
  const newState = userData.map((item) => {
    const { text, answer } = item;
    const [type, number] = text.split(':');
    let isCorrect = null;
    if (type === DROP) {
      isCorrect = number === answer;
    }
    return { ...item, isCorrect };
  });

  // #region Tính điểm theo nhóm.
  // const groups = _.groupBy(newState, 'groupName');
  // trong 1 groupName có nhiều vị trí điền, chỉ cần 1 vị trí điền sai, thì cả groupName đó sai
  // Nếu có 1 chỗ sai trong groupName => groupName đó đúng => Phủ định của đúng là sai
  // const booleanArray = _.toArray(groups).map((item) => !_.some(item, ['isCorrect', false]));
  // #endregion

  // #region Tính điểm theo vị trí.
  const groups = newState.filter(x => x.text.split(':')[0] === DROP);
  const booleanArray = groups.map((item) => item.isCorrect);
  // #endregion

  const correct = booleanArray.filter((x) => x).length;
  const total = booleanArray.length;

  const percent = parseInt((correct * 100) / total);
  const resultString = `${correct}/${total}`;
  const star = percent / 20;

  // #region Số câu đúng theo nhóm.
  // const count = Object.values(groups).filter(group => group.some(({ text, image }) => text.includes(DROP) && image)).length;
  // #endregion

  // #region Số câu đúng theo vị trí.
  const count = Object.values(groups).filter(group => group.text.includes(DROP) && group.image).length;
  // #endregion

  const complete = `${count}/${total}`;

  return { userData: newState, percent, resultString, star, complete };
};
