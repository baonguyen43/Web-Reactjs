/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from 'react';
import { Empty } from 'antd';
import { query } from 'helpers/QueryHelper';
import { useHistory } from 'react-router';
import { useQuery } from 'react-query';
import tableData from './tableData';
import DynamicTable from 'packages/DynamicForm/components/DynamicTable';
import jsonData from './jsonData';
import withTeacherAuthenticator from 'HOCs/withTeacherAuthenticator';

const sqlCommand = 'p_MYAMES_CLASSES_GetClasses_ByTeacherId';

const fetcher = (teacherId) => () => {
  return query(sqlCommand, { teacherId });
};

export default withTeacherAuthenticator(({ loggedInUser }) => {
  const { userId } = loggedInUser;
  // const userId = '1999';
  const history = useHistory();
  const key = [sqlCommand, userId];
  const { data, isLoading } = useQuery(key, fetcher(userId));
  // const isLoading = false;
  // const data = jsonData;

  if (data?.length === 0) return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />; // data=[]

  return (
    <React.Fragment>
      <DynamicTable
        rowClassName="tw-cursor-pointer"
        rowKey="id"
        loading={isLoading}
        dataSource={data}
        initialTableData={tableData}
        onRow={(record) => {
          return {
            onClick: () => {
              history.push(`/ames/teacher/classes/${record.id}`);
            },
          };
        }}
      />
    </React.Fragment>
  );
});
