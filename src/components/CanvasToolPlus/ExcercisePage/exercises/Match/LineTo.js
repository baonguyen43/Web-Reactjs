/* eslint-disable react/no-array-index-key */
import React from 'react';
import LineTo from 'react-lineto';

export default function RenderLineTo({ userAnswers, isDone, listBoolean }) {
  if (!userAnswers) return null;

  const Anchor = { fromAnchor: 'center', toAnchor: 'center' };
  return userAnswers.map((item, index) => {
    const [first, second] = item.split('-');
    let color = '#4285F4';
    if (isDone === true && listBoolean) {
      const isCorrect = listBoolean[`${first}-${second}`];
      color = isCorrect ? 'green' : 'red';
    }

    return (
      <LineTo
        key={index}
        fromAnchor="center"
        toAnchor="center"
        from={`dot-${first}`}
        to={`dot-${second}`}
        within="match-container"
        borderColor={color}
        borderWidth={5}
        delay={500}
      />
    );
  });
}

export function calculateResultMatch(userAnswers, arrayAnswers) {
  const countAnswers = arrayAnswers.length / 2;
  if (!userAnswers) {
    return {
      resultString: `0/${countAnswers}`,
      percent: 0,
      complete: `0/${countAnswers}`,
    };
  }
  //
  const total = Math.max(userAnswers.length, countAnswers); // tổng số đáp án hoặc tổng số đã chọn;
  const booleanArray = new Array(total);
  const listBoolean = {}; // biến hiển thị css đúng/sai
  userAnswers.forEach((item, index) => {
    const [first, second] = item.split('-');
    const isCorrect = arrayAnswers[first] === arrayAnswers[second];
    booleanArray[index] = isCorrect;
    Object.assign(listBoolean, { [item]: isCorrect });
  });
  // params
  // const correct = booleanArray.reduce((total, item) => (total += item ? 1 : 0), 0);
  const correct = booleanArray.filter((x) => x === true).length;
  const percent = parseInt((correct * 100) / total); // tính %
  const resultString = `${correct}/${total}`; // điểm / tổng
  const star = percent / 20;
  //
  const complete = `${Math.min(userAnswers.length, countAnswers)}/${countAnswers}`;
  return { listBoolean, booleanArray, percent, resultString, star, complete };
}
