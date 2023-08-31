import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import style from './style.module.css';

function MultipleChoice({ multipleChoice, data }) {
  const [state, setState] = useState([]);
  const [result, setResult] = useState();
  const [isDone, setIsDone] = useState(false);
  //
  useEffect(() => {
    Object.assign(multipleChoice, {
      submit: () => {
        if (data.length === 0) return {};
        const res = calculateResult(state);
        setState(res.userData);
        // setIsDone(true);
        return { multipleChoiceResult: res };
      },
      tryAgain: () => {
        setState(_.cloneDeep(data) ?? []);
        setResult();
        setIsDone(false);
      },
      setResult,
      setIsDone,
    });
    return () => { };
  }, [data, multipleChoice, state]);
  //
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

  const handleClick = (indexGroup, index) => {
    if (isDone) return;
    setState((pre) => {
      const array = _.cloneDeep(pre);
      const item = array[indexGroup][index];
      const { isSelected } = item;
      Object.assign(item, { isSelected: !isSelected, time: Date.now() });
      //
      filterSelect(array[indexGroup]);
      return array;
    });
  };

  if (!data) return null;

  return state.map((group, indexGroup) => {
    return group.map((item, index) => {
      const { width, height, top, left, text, groupName, angle, isSelected, isCorrect } = item;
      //
      return (
        <div
          key={index}
          onClick={() => handleClick(indexGroup, index)}
          className={`${style.boxMultiplechoice}
          ${isSelected ? style.boxMultiplechoiceClick : style.boxMultiplechoiceHover} 
          ${isDone && isSelected ? (isCorrect ? style.MultipleTrue : style.MultipleFalse) : ''}`}
          style={{
            position: 'absolute',
            width,
            height,
            top,
            left,
            transform: `rotate(${angle}deg)`,
            // border: `2px dotted ${color}`,
          }}
        />
      );
    });
  });
}

MultipleChoice.propTypes = {
  multipleChoice: PropTypes.object,
  data: PropTypes.array,
};

export default MultipleChoice;

//
function calculateResult(state) {
  const convention = {
    yes: true,
    no: false,
  };
  const newState = state.map((group) => {
    return group.map((item) => {
      const { text } = item;
      return Object.assign(item, { isCorrect: convention[text] });
    });
  });
  //
  // const booleanArray = newState.map((group) =>
  //   group.every(({ isSelected, isCorrect }) => (isSelected && isCorrect) || (!isSelected && !isCorrect))
  // );

  // const correct = booleanArray.filter((x) => x).length;
  // const total = booleanArray.length;

  let correct = 0;
  let total = 0;
  newState.flat().forEach(({ isSelected, isCorrect }) => {
    if (isCorrect === true) total++;
    if (isCorrect === true && isSelected === true) correct++;
  });

  const percent = parseInt((correct * 100) / total);
  const resultString = `${correct}/${total}`;
  const star = percent / 20;
  //
  // const countSelected = newState.filter((group) => group.some((x) => x.isSelected === true)).length;
  // const groupCount = newState.length;
  const countSelected = newState.flat().filter((x) => x.isSelected === true).length;

  const complete = `${countSelected}/${total}`;
  return { userData: newState, percent, resultString, star, complete };
}
//
const filterSelect = (group) => {
  let limit = 0;
  let selectedCount = 0;
  group.forEach(({ text, isSelected }) => {
    if (text === 'yes') limit++;
    if (isSelected === true) selectedCount++;
  });
  if (selectedCount > limit) {
    const arraySelected = group.filter((x) => x.isSelected === true);
    const minTime = Math.min(...arraySelected.map((x) => x.time));
    //
    group.find((x) => x.time === minTime).isSelected = false;
  }
  return group;
};
