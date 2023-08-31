/* eslint-disable react/prop-types */
/* eslint-disable react/display-name */
import React from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  Card,
  CardBody,
  Col as ColTrap,
  Row as RowTrap,
  // Col,
  Breadcrumb,
  BreadcrumbItem,
} from 'reactstrap';
import { Progress, Rate } from 'antd';
import TableComponent from '../TableComponent';
import columns from './columns'
import Container from 'reactstrap/lib/Container';
import ResultsModal from '../ResultsModal';
import { useDispatch, useSelector } from 'react-redux';
import Loading from 'components/Loading';

const ResultsTable = props => {
  const [state, setState] = React.useState({
    showModal: false,
    data: [],
    params: null,
    pagination: {
      current: 1,
      pageSize: 10,
      showSizeChanger: false
    },
    isLoading: false,
  })

  const dispatch = useDispatch();
  const params = useParams();
  const { classId, classIndex } = params;
  const dataList = useSelector((state) => state.classReducer.data);
  const data = useSelector((state) => state.sessionReducer.data);
  const loading = useSelector((state) => state.sessionReducer.loading);
  const loggedInUser = useSelector((state) => state.loginReducer.loggedInUser);
  console.log("🚀 ~ file: index.js ~ line 42 ~ loggedInUser", loggedInUser)

  const ResultButton = ({ record }) => {
    const typeClass = classItem.courseType;
    const studentId =
      typeClass === 'AMES'
        ? loggedInUser.userMyames.StudentId
        : loggedInUser.userMyai.StudentId;
    const style = {
      border: 'none',
      color: '#006EE6',
      cursor: 'pointer',
      padding: 10,
      whiteSpace: 'nowrap'
    }
    return (
      <span onClick={() => setState(pre => ({ ...pre, showModal: true, params: { studentId, sessionId: record.id } }))} style={style}>Nhật ký làm bài</span>
    )
  }

  const config = {
    button: (record) => <ResultButton record={record} />,
    progess: (value) => <Progress percent={value} />,
    rating: (value) => <Rate style={{ whiteSpace: 'nowrap' }} disabled allowHalf value={value} />,
    filters: [...new Set(state.data.map(x => x.lesson))].sort((a, b) => (a < b) - (a > b)).map(x => { return { text: x, value: x } }),
  }

  function isNumeric(value) {
    return /^\d+$/.test(value);
  }

  const formatData = React.useCallback(() => {
    if (!data || data === 'Error') {
      setState(pre => ({ ...pre, isLoading: true }))
      return
    }
    const temp = [];
    data.forEach((e, i) => {
      const user = {
        id: e?.id ? e.id : e.sessionId,
        key: i,
        lesson: e?.title ? e.title : e.sessionName,
        rating: e.star,
        progress: e.completedPercent
      };
      temp.push(user);
    });
    setState(pre => ({ ...pre, data: temp, isLoading: true }))
  }, [data]);

  const classItem = dataList[classIndex];
  const classIdFormat = isNumeric(classId) ? +classId : classId
  const getSessions = React.useCallback(() => {
    const typeClass = classItem.courseType;
    const note = classItem.note;
    const studentId =
      typeClass === 'AMES'
        ? loggedInUser.userMyames.StudentId
        : loggedInUser.userMyai.StudentId;
    const payload = {
      classId: classIdFormat,
      studentId,
      typeClass,
      note,
      classItem
    };
    dispatch({ type: 'FETCH_SESSION', payload })
  }, [classIdFormat, classItem, dispatch, loggedInUser]);

  React.useEffect(() => {
    if (!loading) { formatData() }
    if (!state.isLoading) { getSessions() }
  }, [formatData, getSessions, loading, state.isLoading])



  const renderTitle = () => {
    return (
      <RowTrap>
        <ColTrap>
          <Card className="bg-primary bg-radiant-danger" style={{ fontSize: 15 }} >
            <CardBody className="text-white" tag="h2">
              {/* <Link to="/ames" style={{ fontSize: 15 }} >
                <h5 className="h2 text-white d-inline-block mb-0">HOME PAGE</h5>
              </Link> */}
              <span>
                <h5 className="h2 text-white d-inline-block mb-0">KẾT QUẢ BÀI LÀM</h5>
              </span>
              <Breadcrumb
                className="d-none d-md-inline-block ml-md-4"
                listClassName="breadcrumb-links breadcrumb-dark"
              >
                <BreadcrumbItem aria-current="page" className="active" style={{ fontSize: 16 }} >
                  <Link to="/ames/view-results" style={{ fontSize: 15 }} >
                    Khóa Học
                  </Link>
                </BreadcrumbItem>
              </Breadcrumb>
              <Breadcrumb
                className="d-none d-md-inline-block ml-md-4"
                listClassName="breadcrumb-links breadcrumb-dark"
              >
                <BreadcrumbItem aria-current="page" className="active" style={{ fontSize: 16 }} >
                  {classItem && classItem.className ? classItem.className : classItem.courseName}
                </BreadcrumbItem>
              </Breadcrumb>
            </CardBody>
          </Card>
        </ColTrap>
      </RowTrap>
    );
  };

  if (loading) return <Loading />
  return (
    <Container fluid className="mt-4">
      {renderTitle()}
      <TableComponent
        rowKey={obj => obj.id}
        columns={columns(config)}
        data={state.data}
        pagination={state.pagination}
        onChange={(e) => setState(pre => ({ ...pre, pagination: e }))}
      />
      <ResultsModal
        classId={classIdFormat}
        classItem={classItem}
        loggedInUser={loggedInUser}
        isShowModal={state.showModal}
        setShowModal={setState}
        params={state.params} />
    </Container>
  );
};

export default ResultsTable;