/* eslint-disable react/no-array-index-key */
import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { Select } from 'antd';

function SelectWord({ selectWord, data }) {
  const [state, setState] = useState([]);
  const [result, setResult] = useState();
  const [isDone, setIsDone] = useState(false);

  //
  const handleSelect = (e, indexGroup, index) => {
    const array = _.cloneDeep(state);
    array[indexGroup][index].userAnswers = e;
    setState(array);
  };

  //
  useEffect(() => {
    setState((pre) => {
      const cloneData = _.cloneDeep(Object.values(_.groupBy(data, 'groupName'))) ?? [];
      if (result) {
        return [...result.userData];
      }
      if (pre.length === 0) return cloneData;
      return pre;
    });
  }, [data, result]);

  useEffect(() => {
    Object.assign(selectWord, {
      submit: () => {
        if (!data) return {};
        const res = handleResult(state);
        setState(res.userData);
        // setIsDone(true);
        return { selectWordResult: res };
      },
      tryAgain: () => {
        setResult();
        setState(_.cloneDeep(Object.values(_.groupBy(data, 'groupName'))) ?? []);
        setIsDone(false);
      },
      setIsDone,
      setResult,
    });
    return () => {};
  }, [data, selectWord, state]);

  if (!data) return null;
  return (
    <React.Fragment>
      {state.map((item, indexGroup) => {
        return (
          <React.Fragment key={indexGroup}>
            {item.map((value, index) => {
              const { width, top, left, angle, isCorrect, userAnswers } = value;
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
                <Select
                  key={index}
                  onChange={(e) => handleSelect(e, indexGroup, index)}
                  // defaultValue={userAnswers}
                  value={userAnswers}
                  open={isDone ? false : undefined}
                  style={{
                    position: 'absolute',
                    width,
                    top,
                    left,
                    transform: `rotate(${angle}deg)`,
                    color,
                    fontSize: 20,
                  }}
                  getPopupContainer={() => document.getElementsByClassName('match-container')[0]}
                >
                  {_.shuffle(item).map((x, i) => (
                    <Select.Option key={i} value={x.text}>
                      {x.text}
                    </Select.Option>
                  ))}
                </Select>
              );
            })}
          </React.Fragment>
        );
      })}
    </React.Fragment>
  );
}

SelectWord.propTypes = {
  selectWord: PropTypes.object,
  data: PropTypes.array,
};

export default SelectWord;

const handleResult = (state) => {
  const newState = state.map((value) =>
    value.map((item) => Object.assign(item, { isCorrect: item.userAnswers === item.text }))
  );
  const correct = newState
    .flat()
    .map((value) => value.isCorrect)
    .filter((item) => item).length;
  const total = newState.flat().length;
  const percent = parseInt((correct * 100) / total);
  const resultString = `${correct}/${total}`;
  const star = percent / 20;
  //
  // const countSelected = newState.filter((group) => group.some((x) => x.userAnswers)).length;
  const countSelected = newState.flat().filter((x) => x.userAnswers).length;
  const complete = `${countSelected}/${total}`;
  return { userData: newState, percent, resultString, star, complete };
};
