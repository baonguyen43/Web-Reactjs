import React from 'react';
import PropTypes from 'prop-types';
import ExcercisePage from 'components/CanvasToolPlus/ExcercisePage';
import { Modal } from 'antd';
import { query, queryFirst } from 'helpers/QueryHelper';
import { useQuery } from 'react-query';

const sqlCommand = 'p_MYAMES_SHARE_GetLiveWorkSheetById';

const fetcher = (LiveWorkSheetId) => () => {
  return queryFirst(sqlCommand, { Id: LiveWorkSheetId });
};

function ExerciseDetail({ selectedId, hideExerciseDetail }) {
  const key = [sqlCommand, selectedId];
  const { data, isLoading } = useQuery(key, fetcher(selectedId));

  return (
    <Modal
      width="95%"
      style={{ marginTop: 24 }}
      centered
      visible={true}
      className="workshetModal"
      title="BÀI TẬP LIVE WORKSHEET"
      footer={null}
      onCancel={() => {
        hideExerciseDetail();
      }}
    >
      <div style={{ height: 'calc(80vh - 44px)' }}>
        <ExcercisePage file={data} isTeacher />
      </div>
    </Modal>
  );
}

ExerciseDetail.propTypes = {
  selectedId: PropTypes.string,
  hideExerciseDetail: PropTypes.func,
};

export default ExerciseDetail;
