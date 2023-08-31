import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import style from './style.module.css';

function MultipleChoice({ multipleChoice, data }) {
  const [select, setSelect] = React.useState([]);
  const [isDone, setIsDone] = React.useState(false);

  useEffect(() => {
    Object.assign(multipleChoice, {
      submit: () => {
        if (data.length === 0) return {};
        // setIsDone(true);
        return { multipleChoiceResult: calculateResultChoice(select, data) };
      },
      tryAgain: () => {
        setSelect([]);
        setIsDone(false)
      },
      setResult: (res) => setSelect(res.userAnswer),
      setIsDone,
    });
    return () => { };
  }, [multipleChoice, data, select]);
  // --------------------------------------------------------------------------------
  const handleSlect = (value) => {
    if (isDone) return;
    const repeat_index = select.find((x) => x.index === value.index) ? false : true;
    if (select.length !== 0) {
      if (repeat_index) {
        setSelect((pev) => [...pev, value]);
      } else {
        setSelect(select.filter((x) => x.index !== value.index));
      }
    } else {
      setSelect([value]);
    }
  };
  if (!data) return null;
  const booleanArray = data.flat().map((x, i) => (select.find((v) => v.index == i)?.text === 'yes' ? true : false));
  const listBoolean = { ...booleanArray };
  return (
    <React.Fragment>
      {data.flat().map((value, i) => {
        const { top, left, height, width, angle } = value;
        const select_anwser = select.some((value) => value.index === i);
        return (
          <div
            key={`index ${i}`}
            className={`${style.boxMultiplechoice}
          ${select_anwser ? style.boxMultiplechoiceClick : style.boxMultiplechoiceHover} 
          ${isDone && select_anwser ? (listBoolean[i] ? style.MultipleTrue : style.MultipleFalse) : ''}`}
            style={{
              position: 'absolute',
              top: top,
              left: left,
              height: height,
              width: width,
              transform: `rotate(${angle}deg)`,
            }}
            onClick={() => handleSlect(Object.assign(value, { index: i }))}
          />
        );
      })}
    </React.Fragment>
  );
}
MultipleChoice.propTypes = {
  multipleChoice: PropTypes.object,
  data: PropTypes.array,
};
export default MultipleChoice;
export function calculateResultChoice(userAnswer, arrayAnswers) {
  if (!(userAnswer && arrayAnswers)) return;
  const total = arrayAnswers.length;
  const booleanArray = arrayAnswers.flat().map((x, i) => (userAnswer.find((v) => v.index == i)?.text === 'yes' ? true : false));
  const listBoolean = { ...booleanArray };

  const numberofcorrectsentences = arrayAnswers.map((x) => x.map((vl) => vl.text).filter((xx) => xx === 'yes').length); //Tổng số đáp án đúng trong arrayAnswers
  const groups = Object.values(_.groupBy(userAnswer, 'groupName'));
  const correct = groups
    .map((x, i) => {
      const ArrayNext = x.map(
        (vl) =>
          arrayAnswers.flat().find(
            // map ra lần nữa trong mảng , rồi so sánh với các giá trị trong [arrayAnswers]
            (array) => array.index === vl.index,
          )?.text === 'yes', // tìm được index và chấm tới text , kiểm tra xem có yest không
      );
      if (ArrayNext.some((x) => !x)) return false;
      const filted = ArrayNext.filter((x) => x);
      return filted.length === numberofcorrectsentences[i];
    })
    .filter((x) => x === true).length; // đã có Array Next thì lọc ra true .length để chấm điểm thôi
  const percent = parseInt((correct * 100) / total); // tính %
  const resultString = `${correct}/${total}`; // điểm / tổng
  const star = percent / 20; // tính sao
  return { listBoolean, booleanArray, percent, resultString, star, userAnswer };
}
