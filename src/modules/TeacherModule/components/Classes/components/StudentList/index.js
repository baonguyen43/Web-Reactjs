import React from 'react';
import PropTypes from 'prop-types';
import DynamicTable from 'packages/DynamicForm/components/DynamicTable';
import { useQuery } from 'react-query';
import { query } from 'helpers/QueryHelper';
import tableData from './tableData';
import jsonData from './jsonData';
import Card from 'components/Containers/Card';
import Container from 'components/Containers/Container';
import withTeacherAuthenticator from 'HOCs/withTeacherAuthenticator';
import { Empty } from 'antd';
import ClassInfomationHeader from '../ClassInfomationHeader';
import { useHistory } from 'react-router';

const sqlCommand = 'p_MYAMES_STUDENTS_GetStudents_ByClassId';

const fetcher = (classId) => () => {
  return query(sqlCommand, { classId });
};

export default withTeacherAuthenticator(({ loggedInUser, match }) => {
  const { classId } = match.params;
  const history = useHistory();

  // const [view, setView] = React.useState('list');

  const [refresh, setRefresh] = React.useState(new Date());

  const key = [sqlCommand, classId, refresh];
  const { data, isLoading } = useQuery(key, fetcher(classId));

  // const isLoading = false;
  // const data = jsonData;

  const renderData = () => {
    if (data?.length === 0) return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />; // data=[]
    return (
      <DynamicTable
        loading={isLoading}
        dataSource={data}
        initialTableData={tableData}
        onReload={() => {
          setRefresh(new Date());
        }}
        onRow={(record) => {
          return {
            onClick: () => {
              history.push(`/ames/teacher/classes/${record.classId}/ExerciseList/${record.id}`);
            },
          };
        }}
      />
    );
  };
  return (
    <React.Fragment>
      <Container name="THÔNG TIN LỚP HỌC">
        <ClassInfomationHeader classId={classId} />
        <Card>{renderData()}</Card>
      </Container>
    </React.Fragment>
  );
});
