/* eslint-disable react/display-name */
/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable no-unused-vars */
import _ from 'lodash';
import React from 'react';
import { CalendarOutlined, PaperClipOutlined } from '@ant-design/icons';

export default {
  rowKey: 'id',
  displayColumns: [
    {
      title: 'Danh sách bài tập',
      key: 'fileName',
      width: '88%',
      render: (text, row, index) => {
        const { title, fileName } = row;
        return <div style={{whiteSpace: 'nowrap', minWidth: '120px'}}>{title ?? fileName}</div>
      },
      style: {
        fontWeight: 600,
        cursor: 'pointer',
      },
      prefix: <PaperClipOutlined className='tw-mr-2' />,
    },
    {
      title: 'Ngày tạo',
      key: 'createdDate',
      width: '1%',
      render: 'renderDateTime',
      style: {
        fontWeight: '400',
      },
      prefix: <CalendarOutlined className='tw-mr-2' />,
    },
    {
      title: 'Người tạo',
      key: 'createdByName',
      width: '1%',
      render: 'renderNoWrap',
      style: {
        minWidth: '120px',
        fontWeight: '400',
      },
    },
    {
      title: 'Ngày cập nhật',
      key: 'modifiedDate',
      width: '1%',
      render: 'renderDateTime',
      style: {
        fontWeight: '400',
      },
      prefix: <CalendarOutlined className='tw-mr-2' />,
    },
    {
      title: 'Người cập nhật',
      key: 'modifiedByName',
      width: '1%',
      render: 'renderNoWrap',
      style: {
        minWidth: '120px',
        fontWeight: '400',
      },
    },
  ],
};
