/* eslint-disable consistent-return */
/* eslint-disable react/require-default-props */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable react/no-array-index-key */
/* eslint-disable no-nested-ternary */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import style from './style.module.css';

function OneChoice({ oneChoice, data }) {
  const [select, setSelect] = React.useState([]);
  const [isDone, setIsDone] = React.useState(false);
  const handleSlect = (value) => {
    if (isDone) return;
    const repeat_group = select.some((x) => x.groupName === value.groupName); // Khi Click chọn bị trùng Group === true
    const findIndex_group = select.findIndex((x) => x.groupName === value.groupName); // Tìm vị trí Group nằm trong [] Slect
    if (select.length !== 0) {
      if (repeat_group) {
        const NewArray = [...select];
        NewArray[findIndex_group] = value;
        setSelect(NewArray);
      } else setSelect((pev) => [...pev, value]);
    } else setSelect([value]);
  };
  useEffect(() => {
    Object.assign(oneChoice, {
      submit: () => {
        if (data.length === 0) return {};
        // setIsDone(true);
        return { oneChoiceResult: calculateResultChoice(select, data) };
      },
      tryAgain: () => {
        setSelect([])
        setIsDone(false)
      },
      setResult: (res) => setSelect(res.userAnswer),
      setIsDone,
    });
    return () => { };
  }, [oneChoice, data, select, isDone]);

  if (!data) return null;

  const NewarrayAnswers = data.flat().map((x) => x.text);
  const booleanArray = NewarrayAnswers.map((x, i) => select.find((value) => value.index === i)?.text === 'yes');
  const listBoolean = { ...booleanArray }; // biến hiển thị css đúng/sai
  return (
    <React.Fragment>
      {data.flat().map((value, i) => {
        const { top, left, height, width, angle } = value;
        const select_anwser = select.some((v) => v.index === i);
        return (
          <div
            key={`index ${i}`}
            className={`${style.boxOnechoice}
             ${select_anwser ? style.boxOnechoiceClick : style.boxOnechoiceHover} 
             ${isDone && select_anwser ? (listBoolean[i] ? style.onchoiceTrue : style.onchoiceFalse) : ''}`}
            style={{
              position: 'absolute',
              top,
              left,
              height,
              width,
              transform: `rotate(${angle}deg)`,
            }}
            onClick={() => handleSlect(Object.assign(value, { index: i }))}
          />
        );
      })}
    </React.Fragment>
  );
}
OneChoice.propTypes = { oneChoice: PropTypes.object, data: PropTypes.array };
export default OneChoice;
export function calculateResultChoice(userAnswer, arrayAnswers) {
  if (!(userAnswer && arrayAnswers)) return;
  const total = Math.max(userAnswer.length, arrayAnswers.length); // tổng số đáp án hoặc tổng số đã chọn;
  const NewarrayAnswers = arrayAnswers.flat().map((x) => x.text); // Tách mảng ra
  const booleanArray = NewarrayAnswers.map((x, i) => userAnswer.find((value) => value.index === i)?.text === 'yes');
  const listBoolean = { ...booleanArray }; // biến hiển thị css đúng/sai
  const correct = userAnswer.map((x) => x.text.includes('yes')).filter((x) => x === true).length;
  const percent = parseInt((correct * 100) / total); // tính %
  const resultString = `${correct}/${total}`; // điểm / tổng
  const star = percent / 20; // tính sao
  const complete = `${userAnswer.length}/${arrayAnswers.length}`;
  return { listBoolean, booleanArray, percent, resultString, star, userAnswer, complete };
}
