import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import RenderLineTo, { calculateResultMatch } from './LineTo';

const Match = ({ match, data }) => {
  const [state, setState] = React.useState({
    userSelect: [],
    userAnswers: [],
    arrayAnswers: [],
  });

  const [isDone, setIsDone] = React.useState(false);

  const [result, setResult] = React.useState([]);

  const handleClick = React.useCallback(
    (id) => {
      if (isDone) return;
      let { userSelect = [], userAnswers = [] } = state;
      userSelect.push(id);
      userSelect = [...new Set(userSelect)]; // loại bỏ trùng lặp
      if (userSelect.length >= 2) {
        const newline = userSelect.sort().join('-');
        const multipleLine = false;
        if (multipleLine) {
          // chọn  nhiều
          if (userAnswers.includes(newline)) {
            // tìm đường đã nối
            userAnswers = userAnswers.filter((x) => x !== newline); // xóa đường nối
          } else {
            userAnswers.push(newline); // thêm đường mới
          }
        } else {
          // chọn 1-1
          userAnswers = userAnswers.filter((item) => {
            const selected_point = item.split('-'); // điểm đã chọn
            const isRepetition = userSelect.some((x) => {
              return selected_point.includes(`${x}`);
            }); // phát hiện ít nhất 1 điểm trùng lặp
            return !isRepetition; // lọc lấy những đường ko trùng lặp
          });
          userAnswers.push(newline);
        }
        userSelect = []; // clear
      }
      // update
      // const arrayAnswers = data.map((x) => x.text);
      setState((pre) => ({ ...pre, userSelect, userAnswers }));
    },
    [isDone, state]
  );

  useEffect(() => {
    if (result) {
      setState((pre) => ({ ...pre, userAnswers: result.userAnswers, arrayAnswers: data?.map((x) => x.text) }));
    }
  }, [data, result]);

  useEffect(() => {
    Object.assign(match, {
      submit: () => {
        // handle submit
        if (!data) return {};
        const resultObject = calculateResultMatch(state.userAnswers, state.arrayAnswers);
        if (!resultObject) return {};
        resultObject.userAnswers = state.userAnswers;
        setResult(resultObject);
        return { matchResult: resultObject };
      },
      tryAgain: () => {
        setState({
          userSelect: [],
          userAnswers: [],
          arrayAnswers: [],
        });
        setResult([]);
        setIsDone(false);
      },
      setResult,
      setIsDone,
    });
    return () => {};
  }, [data, match, state.arrayAnswers, state.userAnswers]);

  if (!data) return null;

  return (
    <div>
      {data.map((item, index) => {
        const { top, left, width, height } = item;
        return (
          <div
            key={index}
            className={`dot-${index}`}
            style={{
              position: 'absolute',
              top,
              left,
              width,
              height,
              border: '2px dotted gray',
              backgroundColor: '#b1d9f533',
              cursor: 'pointer',
            }}
            onClick={() => handleClick(index)}
          >
            {dotSelect(index, state.userSelect)}
          </div>
        );
      })}
      <RenderLineTo userAnswers={state.userAnswers} isDone={isDone} listBoolean={result?.listBoolean} />
    </div>
  );
};

Match.propTypes = {
  match: PropTypes.object,
  data: PropTypes.array,
};

export default Match;

const dotSelect = (id, userSelect) => {
  if (!userSelect?.includes(id)) return null;
  return (
    <div
      style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 20,
        height: 20,
        borderRadius: '50%',
        backgroundColor: '#4285F4',
      }}
    />
  );
};
