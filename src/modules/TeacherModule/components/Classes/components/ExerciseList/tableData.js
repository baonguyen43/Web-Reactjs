/* eslint-disable react/display-name */
/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable no-unused-vars */
import _ from 'lodash';
import React from 'react';
import { CalendarOutlined, PaperClipOutlined } from '@ant-design/icons';
import colors from 'constants/colors';

export default {
  rowKey: 'id',
  displayColumns: [
    {
      title: 'Danh sách bài tập',
      key: 'fileName',
      width: '88%',
      render: (text, row, index) => {
        const { title, fileName } = row;
        return <div style={{ whiteSpace: 'nowrap', minWidth: '120px', cursor: 'pointer' }}>{title ?? fileName}</div>;
      },
      style: {
        fontWeight: 600,
        cursor: 'pointer',
      },
      prefix: <PaperClipOutlined className="tw-mr-2" />,
    },
    {
      title: 'Ngày nộp bài',
      key: 'createdDate',
      width: 140,
      render: 'renderDateTime',
      style: {
        fontWeight: 400,
        cursor: 'pointer',
      },
      prefix: <CalendarOutlined className="tw-mr-2" />,
    },
    {
      title: 'Điểm',
      key: 'score',
      width: '1%',
      render: 'renderNumber',
      formatString: '0.0',
      style: {
        fontWeight: 600,
        color: colors.theme.danger,
        // minWidth: 100,
      },
      formatConditions: [
        {
          condition: 'record.score >= 6.5',
          style: {
            color: colors.theme.success,
          },
        },
      ],
    },
  ],
};
