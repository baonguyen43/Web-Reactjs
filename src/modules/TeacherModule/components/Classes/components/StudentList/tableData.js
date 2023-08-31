/* eslint-disable react/display-name */
/* eslint-disable no-unused-vars */
import React from 'react';
import { studentColumns } from 'constants/displayColumns';
import { Button } from 'antd';
import { execute } from 'helpers/QueryHelper';
export default {
  rowKey: 'id',
  displayColumns: [...studentColumns],
};
