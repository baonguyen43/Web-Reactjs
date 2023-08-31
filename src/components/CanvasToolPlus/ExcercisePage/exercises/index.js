import _ from 'lodash';
import React from 'react';

export { default as Write } from './Write';
export { default as Match } from './Match';
export { default as Listen } from './Listen';
export { default as MultipleChoice } from './MultipleChoice';
export { default as OneChoice } from './OneChoice';
export { default as SelectWord } from './SelectWord';
export { default as DragDrop } from './DragDrop';
export { default as DropDown } from './DropDown';
//
export default function useExercises() {
  const exercises = React.useRef({
    match: {},
    write: {},
    oneChoice: {},
    multipleChoice: {},
    selectWord: {},
    dragdrop: {},
    dropDown: {}
  });
  //
  function submitAll() {
    const result = {};
    _.forEach(exercises.current, (value) => {
      if (typeof value.submit === 'function') {
        const res = value.submit();
        // console.table(res);
        Object.assign(result, res);
      }
    });
    return result;
  }
  //
  function tryAgainAll() {
    _.forEach(exercises.current, (value) => {
      if (typeof value.tryAgain === 'function') {
        value.tryAgain();
      }
    });
  }
  //
  function setIsDoneAll(bool) {
    _.forEach(exercises.current, (value) => {
      if (typeof value.setIsDone === 'function') value.setIsDone(bool);
    });
  }
  //
  function setResults(results = {}) {
    _.forEach(results, (value, key) => {
      const ex = exercises.current[key];
      if (typeof ex.setResult === 'function' && value) ex.setResult(value);
    });
  }

  Object.assign(exercises.current, {
    submitAll,
    tryAgainAll,
    setIsDoneAll,
    setResults,
  });
  return exercises.current;
}
