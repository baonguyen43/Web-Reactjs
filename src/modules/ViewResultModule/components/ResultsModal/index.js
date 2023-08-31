/* eslint-disable react/display-name */
import React from 'react';
import PropTypes from 'prop-types';
import { Modal, Progress } from 'antd';
import TableComponent from '../TableComponent';
import columns from './columns'
import { useDispatch, useSelector } from 'react-redux';

const ResultsModal = ({ isShowModal, setShowModal, params, loggedInUser, classItem, classId }) => {
  const [isModalVisible, setIsModalVisible] = React.useState(false);
  const dispatch = useDispatch();
  const assignmentData = useSelector((state) => state.assignmentReducer.data);

  const data = [];
  for (let i = 0; i < assignmentData.length; i++) {
    const e = assignmentData[i];
    const user = {
      key: i,
      id: e.asrId,
      score: e.star,
      assignment: e.title,
      description: e.description,
      progress: e.completedPercent,
    };
    data.push(user);
  }

  const config = {
    progess: (value) => <Progress percent={value} />,
    score: (score) => <span style={{ color: score < 50 ? 'red' : '#2DCE89' }}>{score}</span>,
    assignment: (value, record) => <div>
      <span style={{ color: '#525F7F', display: 'block', fontWeight: 600, whiteSpace: 'nowrap' }}>{value}</span>
      <small><i>{record.description}</i></small>
    </div>
  }


  const handleOk = () => {
    setIsModalVisible(false);
    setShowModal(pre => ({ ...pre, showModal: false }));
  };

  const handleCancel = () => {
    setShowModal(pre => ({ ...pre, showModal: false }));
    setIsModalVisible(false);
  };

  const getAssinments = React.useCallback(() => {
    const AppName = loggedInUser?.userMyai?.AppName;
    const typeApp = classItem?.courseType;
    const studentId =
      typeApp === 'AMES'
        ? loggedInUser?.userMyames?.StudentId
        : loggedInUser?.userMyai?.StudentId;
    const payload = {
      classId,
      studentId,
      sessionId: params?.sessionId,
      typeApp,
      AppName,
    };
    dispatch({ type: 'FETCH_ASSIGNMENT_REQUEST', payload })
  }, [classId, classItem.courseType, loggedInUser, params, dispatch])

  React.useEffect(() => {
    setIsModalVisible(isShowModal);
    if (isShowModal) {
      getAssinments();
    }
    // getHistory()
  }, [getAssinments, isShowModal])

  if (!isShowModal) return null;

  return (
    <Modal width="90vw" footer={false} title="Nhật ký làm bài" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
      <TableComponent
        rowKey={obj => obj.id}
        columns={columns(config)}
        data={data}
        pagination={{ hideOnSinglePage: true }}
      />
    </Modal>
  );
};

ResultsModal.propTypes = {
  isShowModal: PropTypes.bool,
  setShowModal: PropTypes.func,
  params: PropTypes.object,
  loggedInUser: PropTypes.any,
  classItem: PropTypes.any,
  classId: PropTypes.any,
};

export default ResultsModal;