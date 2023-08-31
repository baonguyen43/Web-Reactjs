import React from 'react';
import PropTypes from 'prop-types';
import { Table } from 'antd';

const TableComponent = ({ columns, data, pagination, loading, onChange }) => {
  return (
    <Table
      columns={columns.map(x => {
        const title = <div style={{ whiteSpace: 'nowrap', fontWeight: 600 }}>{x.title}</div>
        return { ...x, title }
      })}
      dataSource={data}
      pagination={pagination}
      loading={loading}
      onChange={onChange}
      scroll={{ x: 800 }}
    />
  );
};

TableComponent.propTypes = {
  data: PropTypes.array,
  loading: PropTypes.bool,
  columns: PropTypes.array,
  pagination: PropTypes.object,
  onChange: PropTypes.func
};

export default TableComponent;