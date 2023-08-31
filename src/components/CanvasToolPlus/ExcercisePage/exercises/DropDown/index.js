/* eslint-disable react/no-array-index-key */
import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { Select } from 'antd';
function DropDown({ dropDown, data }) {
  const [state, setState] = useState([]);
  const [result, setResult] = useState();
  const [isDone, setIsDone] = useState(false);
  const handleSelect = (e, indexGroup, index) => {
    const array = _.cloneDeep(state);
    array[indexGroup][index].userAnswers = e;
    setState(array);
  };

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
    Object.assign(dropDown, {
      submit: () => {
        if (!data) return {};
        const res = handleResult(state);
        setState(res.userData);
        // setIsDone(true);
        return { dropDownResult: res };
      },
      tryAgain: () => {
        setResult();
        setState(_.cloneDeep(Object.values(_.groupBy(data, 'groupName'))) ?? []);
        setIsDone(false)
      },
      setIsDone,
      setResult,
    });
    return () => { };
  }, [data, dropDown, state]);

  if (!data) return null;
  return (
    <React.Fragment>
      {
        state.map((item, indexGroup) => {
          return (
            <React.Fragment key={indexGroup}>
              {
                item.map((value, index) => {
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
                    <Select key={index} getPopupContainer={() => document.getElementsByClassName('match-container')[0]}
                      style={{ position: 'absolute', width, top, left, transform: `rotate(${angle}deg)`, fontSize: 20, color, border: isDone ? `1px solid ${color}` : '' }}
                      onChange={(e) => handleSelect(e, indexGroup, index)}
                      open={isDone ? false : undefined}
                      // defaultValue={userAnswers}
                      value={userAnswers}
                    >
                      {
                        value.text.split(';').map((x, i) => <Select.Option key={i} value={x} >{x.replace('*', '')} </Select.Option>)
                      }
                    </Select>
                  )
                })
              }
            </React.Fragment>
          )
        })
      }
    </React.Fragment >
  );
}

DropDown.propTypes = {
  dropDown: PropTypes.object,
  data: PropTypes.array,
};

export default DropDown;

const handleResult = (state) => {
  const newState = state.map((value) => value.map((item) => Object.assign(item, { isCorrect: item.userAnswers?.includes('*') ?? false })));
  const correct = newState.map(value => value.every(item => item.isCorrect)).filter(item => item).length
  const total = state.length;
  const percent = parseInt((correct * 100) / total);
  const resultString = `${correct}/${total}`;
  const star = percent / 20;
  //
  const countSelected = newState.filter(group => group.some(x => x.userAnswers)).length
  const complete = `${countSelected}/${newState.length}`;
  return { userData: newState, percent, resultString, star, complete };
};


