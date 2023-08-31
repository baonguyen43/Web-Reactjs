import { DatePicker, Empty, Pagination, Rate, Spin } from 'antd';
import PartsModal from 'components/Modal/PartsModal';
import { query } from 'helpers/QueryHelper';
import { SAVE_SELECTED_PART, SAVE_SELECTED_SESSION } from 'modules/SessionModule/actions/types';
import moment from 'moment';
import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import Select from 'react-select';
import { Card, Col, Container, Progress, Row, Table } from 'reactstrap';
import * as ActionTypes from '../../actions/types';
import * as AssignmentActionTypes from '../../../AssignmentModule/actions/types';
import './index.css';
const fetcherClass = async (ClassId) => {
  return await query('p_API_MYAMES_GetEBMClass', { ClassId });
};
const fetcherSession = async (SessionId) => {
  return await query('p_API_MYAMES_GetSession', { SessionId });
};
const AssignmentComponent = ({ userId }) => {
  const history = useHistory();
  const dispatch = useDispatch();
  const isMix4 = useSelector((state) => state.sessionReducer.isMix4);
  const getMonday = () => {
    const d = new Date();
    var day = d.getDay(),
      diff = d.getDate() - day + (day == 0 ? -6 : 1); // adjust when day is sunday
    return new Date(d.setDate(diff));
  };

  const getSunday = () => {
    const d = new Date();
    var day = d.getDay(),
      diff = d.getDate() - day + (day == 0 ? -6 : 1) + 6; // adjust when day is sunday
    return new Date(d.setDate(diff));
  };

  const formattedToday = () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    let mm = today.getMonth() + 1; // Months start at 0!
    let dd = today.getDate();

    if (dd < 10) dd = '0' + dd;
    if (mm < 10) mm = '0' + mm;

    return yyyy + '-' + mm + '-' + dd;
  };
  const [state, setState] = useState({
    isVisibled: false,
    groupPart: [],
    item: [],
    filterStartDate: '',
    filterEndDate: formattedToday(),
    // filterStartDate: moment(getMonday()).format('YYYY-MM-DD'),
    // filterEndDate: moment(getSunday()).format('YYYY-MM-DD'),
    pageSize: 5,
    pageNum: 1,
  });

  const KEY = [
    '[p_API_MYAMES_HOMEWORK_ASSIGNED_LASTEST]',
    userId.MyAmesStudentId,
    state.filterEndDate,
    state.filterStartDate,
    state?.pageSize,
    state?.pageNum,
  ];
  const { data, isLoading, error } = useQuery(KEY, () => {
    return query(
      '[p_API_MYAMES_HOMEWORK_ASSIGNED_LASTEST]',
      {
        studentId: userId.MyAmesStudentId,
        fromDate: state.filterStartDate,
        toDate: state.filterEndDate,
        pageNum: state?.pageNum || 1,
        pageSize: state?.pageSize || 5,
      },
      'SmartEducation'
    );
  });
  const handlePageSize = (e) => {
    setState((prev) => ({ ...prev, pageSize: e.value }));
  };

  const moveToQuestion = (item) => {
    fetcherClass(item.classId).then((res) => {
      dispatch({
        type: ActionTypes.SAVE_SELECTED_CLASS,
        selectedClass: res[0],
      });
    });
    fetcherSession(item.id).then((res) => {
      dispatch({
        type: SAVE_SELECTED_SESSION,
        selectedSession: res[0],
      });
    });
    dispatch({
      type: AssignmentActionTypes.FETCH_ASSIGNMENTS_MIX4_REQUEST,
      sessionId: item.id,
      studentId: userId.MyAmesStudentId,
    });
    const groupPart = item.groupPart ? item.groupPart : [];
    const checkMix = groupPart.length > 1 && groupPart[0].GroupName;
    if (!checkMix) {
      dispatch({ type: SAVE_SELECTED_PART, selectedPart: null, groupPart: null, partQuestion: false });
    }
    dispatch({
      type: ActionTypes.TOGGLE_DOING_LATEST_ASSIGNMENTS,
    });
    // Type Mix 1, mấy chục câu sổ ra 1 lần
    if (item.enableAddStar) {
      // Type Mix 2, hiện lên 1 bảng chứa phần 1, 2, 3
      if (item.groupPart.length === 3) {
        // return history.push({
        //   pathname: `/ames/class/${item.classId}/session/${item.id}/questionsMix`,
        //   // search: `?type=${item.questionType}&asrId=${item.asrId}&takeExamTime=${this.takeExamTime}&questionId=${item.questionId}`,
        // });
        const groupPart = item.groupPart;
        return toggleModal(groupPart, item);
      }
      if (isMix4) {
        return history.push({
          // pathname: `/ames/class/${item.classId}/session/${item.id}/questionsMix4`,
          pathname: `/ames/class/${item.classId}/session/${item.id}/assignmentsMix4`,
        });
      }
      return history.push({
        pathname: `/ames/class/${item.classId}/session/${item.id}/questionsMix`,
        // search: `?type=${item.questionType}&asrId=${item.asrId}&takeExamTime=${this.takeExamTime}&questionId=${item.questionId}`,
      });
    }
    return history.push({
      pathname: `/ames/class/${item.classId}/session/${item.id}/assignments`,
      // search: `?type=${item.questionType}&asrId=${item.asrId}&takeExamTime=${this.takeExamTime}&questionId=${item.questionId}`,
    });
  };

  //Bật tắt Part Modal
  const toggleModal = (groupPart, item) => {
    setState((prev) => ({ ...prev, isVisibled: !state.isVisibled, groupPart, item }));
  };

  //Cập nhật date trong filter date

  const handleFilterDate = (e) => {
    if (!e)
      setState((prev) => ({
        ...prev,
        filterStartDate: null,
        filterEndDate: null,
      }));
    else {
      setState((prev) => ({
        ...prev,
        filterStartDate: e?.[0].format('YYYY-MM-DD'),
      }));
      setState((prev) => ({
        ...prev,
        filterEndDate: e?.[1].format('YYYY-MM-DD'),
      }));
    }
  };

  const showTotal = (total) => `Có ${total} bài`;
  const { RangePicker } = DatePicker;
  const renderItem = () => {
    if (isLoading) {
      return (
        <React.Fragment>
          <tr>
            <th
              colSpan={6}
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                width: '750%',
              }}
            >
              <Spin size="large" />
            </th>
          </tr>
        </React.Fragment>
      );
    }
    if (!data || data.length === 0) {
      return (
        <React.Fragment>
          <tr>
            <th colSpan={6}>
              <Empty />
            </th>
          </tr>
        </React.Fragment>
      );
    }

    return data.map((item, index) => {
      return (
        <React.Fragment key={index}>
          <tr style={{ cursor: 'pointer' }} key={index} onClick={() => moveToQuestion(item)}>
            <th scope="row">
              <span style={{ fontSize: 13 }}>{item.className}</span>
            </th>
            <th scope="row">
              <span style={{ fontSize: 13 }}>{item.title}</span>
            </th>
            <td>{moment(new Date(item.dateAssigned)).format('DD-MM-YYYY')}</td>
            <td>{moment(new Date(item.dateDeadline)).format('DD-MM-YYYY')}</td>
            <td>
              <Rate disabled allowHalf defaultValue={item.star * 0.05} />
            </td>

            <td>
              <div className="d-flex align-items-center">
                <span className="completion mr-2">{item.completedPercent}%</span>
                <div>
                  <Progress
                    max="100"
                    value={item.completedPercent}
                    color={item.completedPercent < 100 ? 'warning' : 'success'}
                  />
                </div>
              </div>
            </td>
            {/* <td className="text-right">
              <Button size="sm" color="primary" className="btn-icon">
                <span className="btn-inner--icon mr-1">
                  <i className="fas fa-pen-square"></i>
                </span>
                <span className="btn-inner--text">Làm bài</span>
              </Button>
            </td> */}
          </tr>
        </React.Fragment>
      );
    });
  };

  const pageSizeOptions = [
    { value: 5, label: '5 / trang' },
    { value: 10, label: '10 / trang' },
    { value: 20, label: '20 / trang' },
  ];
  return (
    <div style={{ marginTop: 68 }}>
      <Container className="mt--6" fluid>
        <Row className="mb-2" align={'top'}>
          <Col span={4}>
            <div style={{ width: '130px' }}>
              <Select
                onChange={handlePageSize}
                placeholder={`${state?.pageSize || 5} / trang`}
                options={pageSizeOptions}
              ></Select>
            </div>
          </Col>
          <Col style={{ textAlign: 'right' }}>
            <RangePicker
              className="range-picker"
              onChange={handleFilterDate}
              format={'DD-MM-YYYY'}
              value={[
                state.filterStartDate ? moment(state.filterStartDate) : null,
                state.filterEndDate ? moment(state.filterEndDate) : null,
              ]}
            />
          </Col>
        </Row>
        <Row>
          <div className="col">
            <Card>
              <Table className="align-items-center table-flush" responsive>
                <thead className="thead-light">
                  <tr>
                    <th className="sort" scope="col">
                      Tên lớp
                    </th>
                    <th className="sort" scope="col">
                      Tên bài học
                    </th>
                    <th className="sort" scope="col">
                      Ngày giao bài
                    </th>
                    <th className="sort" scope="col">
                      Hạn nộp bài
                    </th>
                    <th className="sort" scope="col">
                      Đánh giá
                    </th>
                    <th scope="col">Hoàn thành</th>
                  </tr>
                </thead>
                <tbody className="list">{renderItem()}</tbody>
              </Table>
            </Card>
          </div>
        </Row>
        <Row className="mt--1 mb-2">
          <Col style={{ textAlign: 'right' }}>
            <Pagination
              total={data?.[0] ? data[0].totalRows : 0}
              onChange={(e) => {
                setState((prev) => ({ ...prev, pageNum: e }));
              }}
              current={state?.pageNum}
              showTotal={showTotal}
              pageSize={state?.pageSize}
            ></Pagination>
          </Col>
        </Row>
      </Container>
      <PartsModal
        isVisibled={state.isVisibled}
        toggleModal={toggleModal}
        groupPart={state.groupPart}
        sessionItem={state.item}
        history={history}
        classId={state.item?.classId?.toString()}
      />
    </div>
  );
};

export default AssignmentComponent;
