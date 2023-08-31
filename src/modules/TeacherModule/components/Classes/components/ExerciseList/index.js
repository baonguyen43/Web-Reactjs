import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Empty } from 'antd';
import Container from 'components/Containers/Container';
import { query } from 'helpers/QueryHelper';
import _ from 'lodash';
import DynamicTable from 'packages/DynamicForm/components/DynamicTable';
import { useQuery } from 'react-query';
import ExerciseDetail from '../ExerciseDetail';
import StudentInfomationHeader from '../StudentInfomationHeader';
import tableData from './tableData';
import Card from 'components/Containers/Card';
import NotData from 'components/Error/NotData';

const sqlCommand = 'p_MYAMES_SHARE_LiveWorkSheetListById';

const fetcher = (StudentId, ClassId) => () => {
  return query(sqlCommand, { StudentId, ClassId });
};

function ExerciseList({ match }) {
  const { studentId, classId } = match.params;
  // const studentId = '11147806';

  const [refresh, setRefresh] = React.useState(new Date());
  const key = [sqlCommand, studentId];
  const { data, isLoading } = useQuery(key, fetcher(studentId, classId));

  const [selectedId, setSelectedId] = useState('');

  // const isLoading = false;
  // const data = jsonData;
  const hideExerciseDetail = () => {
    setSelectedId('');
  };

  const convertData = (data) => {
    if (!data) return null;
    return _.cloneDeep(data).map((item, index) => {
      return Object.assign(item, {
        score: item.score / 10,
      });
    });
  };

  const renderHeader = () => {
    if (data.length === 0) return null;
    const { fullName, email, phone, address, divitions, sex } = data[0];
    return <StudentInfomationHeader {...{ fullName, email, phone, address, divitions, sex }} />;
  };

  const renderData = () => {
    if (data?.length === 0) return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />; // data=[]
    return (
      <DynamicTable
        loading={isLoading}
        dataSource={convertData(data)}
        initialTableData={tableData}
        onReload={() => {
          setRefresh(new Date());
        }}
        onRow={(record) => {
          return {
            onClick: () => {
              setSelectedId(record.id);
            },
          };
        }}
      />
    );
  };
  if (!data) return <NotData />;
  return (
    <React.Fragment>
      <Container name="Danh sách bài tập">
        {renderHeader()}
        <Card>{renderData()}</Card>
        {selectedId && <ExerciseDetail {...{ selectedId, hideExerciseDetail }} />}
      </Container>
    </React.Fragment>
  );
}

ExerciseList.propTypes = {
  match: PropTypes.object,
};

export default ExerciseList;
