/* eslint-disable no-restricted-syntax */
/* eslint-disable guard-for-in */
import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import colors from 'constants/colors';

function Result({ data }) {
  //
  const showResult = (type) => {
    if (!type) return <b>0</b>;
    return <b>{type.resultString}</b>;
  };
  //
  const renderResult = useCallback(() => {
    const list = [
      { title: 'Fill in the gaps:', name: 'writeResult', color: '#006EE6' },
      { title: 'Multiple choice:', name: 'multipleChoiceResult', color: '#d93434' },
      { title: 'One choice:', name: 'oneChoiceResult', color: '#d93434' },
      { title: 'Matching:', name: 'matchResult', color: '#4DA5AD' },
      { title: 'SelectWord:', name: 'selectWordResult', color: '#4DA5AD' },
      { title: 'DropDown:', name: 'dropDownResult', color: '#4D05AD' },
      { title: 'DragDrop:', name: 'dragDropResult', color: '#4DA5AD' },
    ];
    return list.map(({ title, name, color }) => {
      if (!data[name]) return null;
      return (
        <div
          key={name}
          className="mr-2 mb-0 py-1 px-2"
          style={{ fontSize: 15, borderRadius: 3, fontWeight: 600, border: `1px dashed ${color}` }}
        >
          <span style={{ marginRight: 10 }}>{title}</span>
          <span style={{ color }}>{showResult(data[name])}</span>
        </div>
      );
    });
  }, [data]);
  //
  return (
    <div className="d-flex flex-md-row flex-column mt-2 align-items-center">
      <div
        className="mr-2 mb-0 py-1 px-2 d-flex justify-content-center align-items-center"
        style={{ fontSize: 15, fontWeight: 600 }}
      >
        <span className="mr-2">Score: </span>
        <div
          className="d-flex justify-content-center align-items-center"
          style={{
            color: 'white',
            borderRadius: '50%',
            width: 50,
            height: 50,
            fontFamily: 'HandWriting',
            fontSize: 24,
            fontWeight: 600,
            background: totalScore(data) < 5 ? colors.theme.danger : colors.theme.success,
          }}
        >
          <b>{totalScore(data)}</b>
        </div>
      </div>
      {renderResult()}
    </div>
  );
}

Result.propTypes = {
  data: PropTypes.object.isRequired,
};

export default Result;
//
export const totalScore = (data) => {
  const total = SumStringToArray(data, 'resultString');
  const score = (total[0] * 10) / total[1];
  return Number.isNaN(score) ? 0 : score.toFixed(1);
};

export const SumStringToArray = (data, key) => {
  if (!data) return [0, 0];
  // 1/2 + 0/1 +2/3 = [3,6]
  return Object.values(data).reduce(
    (total, item) => {
      const res = item[key].split('/');
      return total.map((x, i) => x + Number(res[i]));
    },
    [0, 0]
  );
};
