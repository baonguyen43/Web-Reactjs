import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Input } from 'antd';
import _ from 'lodash';

function Write({ write, data }) {
  const [result, setResult] = useState(null);

  const [state, setState] = useState([]);
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    const cloneData = _.cloneDeep(data) ?? [];
    if (result && result.userAnswers) {
      result.userAnswers.forEach((element, index) => {
        cloneData[index].userAnswer = element;
      });
    }
    setState(cloneData);
    return () => {
      setState([]);
    };
  }, [data, result]);
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
        setResult(null);
        setState(_.cloneDeep(data) ?? []);
        setIsDone(false)
      },
      setResult,
      setIsDone,
    });
    return () => { };
  }, [data, write, state]);

  const handleChange = (id, userAnswer) => {
    setState((prev) => {
      const arrayState = Array.from(prev);
      Object.assign(arrayState[id], { userAnswer });
      return arrayState;
    });
  };

  if (!data) return null;

  return (
    <div>
      {data.map((item, index) => {
        const { width, height, top, left, text, groupName, angle } = item;
        let color = '#333';
        if (isDone) {
          const { listBoolean } = result ?? {};
          if (listBoolean) color = listBoolean[index] ? '#2ecc71' : '#e74c3c';
        }
        return (
          <div key={index} style={{ position: 'absolute', width, height, top, left, transform: `rotate(${angle}deg)` }}>
            <Input
              style={{
                width: `${width}px`,
                height: `${height}px`,
                fontSize: (height * 2) / 3,
                padding: 2,
                color,
              }}
              value={state[index]?.userAnswer}
              onChange={(e) => handleChange(index, e.target.value)}
              readOnly={isDone}
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

const handleResult = (userData, checkUppercase = true) => {
  const newState = userData.map((item) => {
    if (item.userAnswer === undefined) {
      // Người dùng không điền đáp án
      return Object.assign({}, { ...item, isCorrect: undefined, userAnswer: undefined });
    }

    item.isCorrect = checkUppercase
      ? item.text.trim() === item.userAnswer.trim()
      : item.text
        .trim()
        .toLowerCase()
        .replace(/(\W+)$/g, '') ===
      item.userAnswer
        .trim()
        .toLowerCase()
        .replace(/(\W+)$/g, '');
    return item;
  });

  const listBoolean = newState.map((x) => x.isCorrect);

  const groups = _.groupBy(newState, 'groupName');
  // trong 1 groupName có nhiều vị trí điền, chỉ cần 1 vị trí điền sai, thì cả groupName đó sai
  // Nếu có 1 chỗ sai trong groupName => groupName đó đúng (vì có vị trí sai trong câu) => Phủ định của đúng là sai
  const booleanArray = _.toArray(groups).map((item) => _.every(item, ['isCorrect', true]));

  const correct = booleanArray.filter((x) => x).length;
  const total = booleanArray.length;

  const percent = parseInt((correct * 100) / total);
  const resultString = `${correct}/${total}`;
  const star = percent / 20;

  const userAnswers = newState.map((x) => x.userAnswer);
  const countWrite = Object.values(groups).filter(group => group.some(x => x.userAnswer)).length
  const complete = `${countWrite}/${total}`;
  return { listBoolean, booleanArray, percent, resultString, star, userAnswers, complete };
};
