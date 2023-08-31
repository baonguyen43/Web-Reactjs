import React from 'react';
import PropTypes from 'prop-types';
import { ColumnHeightOutlined } from '@ant-design/icons';
import { Menu, Dropdown, Tooltip } from 'antd';

const DensityIcons = ({ tableSize, onChange }) => {
  return (
    <Dropdown
      overlay={() => (
        <Menu
          selectedKeys={tableSize}
          onClick={({ key }) => {
            onChange(key);
          }}
          style={{
            width: 120,
          }}
        >
          <Menu.Item key='large'>Rộng</Menu.Item>
          <Menu.Item key='middle'>Trung bình</Menu.Item>
          <Menu.Item key='small'>Hẹp</Menu.Item>
        </Menu>
      )}
      trigger={['click']}
    >
      <Tooltip title='Điểu chỉnh khoảng cách các dòng'>
        <ColumnHeightOutlined />
      </Tooltip>
    </Dropdown>
  );
};

DensityIcons.propTypes = {
  tableSize: PropTypes.string,
  onChange: PropTypes.func,
};

DensityIcons.defaultProps = {
  tableSize: 'small',
  onChange: () => {
    throw new Error('Please implement onChange event!');
  },
};

export default React.memo(DensityIcons);
