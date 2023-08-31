import React from 'react';
import PropTypes from 'prop-types';
import { Space } from 'antd';

function Header({ data }) {
  const filteredData = data.filter((x) => x.ExName);

  const totalScore = () => {
    return filteredData.reduce((total, item) => total + Number(item.ExScore), 0);
  };

  return (
    <div>
      <h3>Danh sách các bài</h3>
      <Space>
        <span>
          Số lượng: <b>{`${filteredData.length}`}</b>
        </span>
        <span>
          Tổng điểm: <b>{`${totalScore()}`}</b>
        </span>
      </Space>
    </div>
  );
}

Header.propTypes = {
  data: PropTypes.array,
};

export default Header;
