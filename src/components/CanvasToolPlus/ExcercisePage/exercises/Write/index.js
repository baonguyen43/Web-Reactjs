import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Input } from 'antd';
import _ from 'lodash';

function Write({ write, data }) {
  const [result, setResult] = useState(null);
  const [state, setState] = useState([]);
  const [isDone, setIsDone] = useState(false);
  //
  useEffect(() => {
    Object.assign(write, {
      submit: () => {
        // handle submit
        if (!data) return {};
        const res = handleResult(state);
        setResult(res);
        // setIsDone(true);
        return { writeResult: res };
      },
      tryAgain: () => {
        setState(_.cloneDeep(data) ?? []);
        setResult(null);
        setIsDone(false);
      },
      setResult,
      setIsDone,
    });
    return () => {};
  }, [data, state, write]);

  useEffect(() => {
    setState((pre) => {
      const cloneData = _.cloneDeep(data) ?? [];
      if (result) {
        return [...result.userData];
      }
      if (pre.length === 0) return cloneData;
      return pre;
    });
  }, [data, result]);
  //
  const hanleInputChange = useCallback(
    (index, value) => {
      if (isDone) return;
      setState((pre) => {
        const arrayState = Array.from(pre);
        Object.assign(arrayState[index], { userAnswer: value });
        return arrayState;
      });
    },
    [isDone]
  );
  //
  if (!data) return null;
  //
  return (
    <div>
      {state.map((item, index) => {
        const { width, height, top, left, text, groupName, angle, isCorrect } = item;
        let color = 'black';
        if (isDone) {
          color = 'blue';
          if (isCorrect === true) {
            color = '#2df12d';
          } else if (isCorrect === false) {
            color = 'red';
          }
        }
        return (
          <div key={index} style={{ position: 'absolute', width, height, top, left, transform: `rotate(${angle}deg)` }}>
            <Input
              value={item.userAnswer}
              onChange={(e) => hanleInputChange(index, e.target.value)}
              style={{
                width: `${width}px`,
                height: `${height}px`,
                fontSize: (height * 2) / 3,
                padding: 2,
                borderColor: color,
                color,
              }}
            />
          </div>
        );
      })}
    </div>
  );
}

Write.propTypes = {
  write: PropTypes.object,
  data: PropTypes.array,
};

export default Write;

const handleResult = (userData) => {
  const convert = (value = '') =>
    value
      .trim()
      .toLowerCase()
      .replace(/(\W+)$/g, ''); // ko phân biệt hoa thường, bỏ dấu cuối câu
  const newState = userData.map((item) => {
    const arrayAnswer = item.text.split('|');
    item.isCorrect = arrayAnswer.some((key) => convert(item.userAnswer) === convert(key));
    return item;
  });
  const groups = _.groupBy(newState, 'groupName');
  // trong 1 groupName có nhiều vị trí điền, chỉ cần 1 vị trí điền sai, thì cả groupName đó sai
  // Nếu có 1 chỗ sai trong groupName => groupName đó đúng => Phủ định của đúng là sai
  const booleanArray = _.toArray(groups).map((item) => !_.some(item, ['isCorrect', false]));

  const correct = booleanArray.filter((x) => x).length;
  const total = booleanArray.length;

  const percent = parseInt((correct * 100) / total);
  const resultString = `${correct}/${total}`;
  const star = percent / 20;
  //
  const count = Object.values(groups).filter((group) => group.some((x) => x.userAnswer)).length;
  const complete = `${count}/${total}`;

  return { userData: newState, percent, resultString, star, complete };
};
