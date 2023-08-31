import { Rate } from 'antd';
import NotData from 'components/Error/NotData';
import * as functions from 'components/functions';
import RdIcon from 'components/functions/rdIcons';
import Loading from 'components/Loading';
import AssignmentsMix4LiveWorksheetModal from 'components/Modal/assignmentsMix4LiveWorksheetModal';
import * as Colors from 'configs/color';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Breadcrumb, BreadcrumbItem, Button, Card, Col, Container, Media, Progress, Row, Table } from 'reactstrap';
import * as ActionTypes from '../actions/types';

class AssignmentMix4Component extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      data: [],
      questions: [], // Danh sách Câu hỏi trong 1 phần
      index: null, // Câu hỏi hiện tại
      startIndex: null, // Câu bắt đầu
      endIndex: null, // Câu kết thúc
      takeExamTime: functions.uuid(),
      userTrial: false,
      sessionId: props.match.params.sessionId,
      classId: props.match.params.classId,
      studentInfo: functions.getUser(), // Lấy stundent Id phù hợp với khóa học
      questionIndex: 0,
      isVisibled: false, // Bật tắt Modal tặng sao
      isLiveWorksheetVisibled: false,
    };
    this.dateStart = new Date().getTime();
  }

  static getDerivedStateFromProps = (props, state) => {
    if (props.data !== state.data) {
      if (props.partQuestion) {
        // Lấy câu hỏi theo từng phần
        const { selectedPart, groupPart, data } = props;
        let startIndex = 0;
        let endIndex = 0;

        groupPart.forEach((item, index) => {
          if (index < selectedPart.index) {
            startIndex += item.TotalQuestion;
          }
        });
        endIndex = startIndex + selectedPart.TotalQuestion;
        const questions = data.slice(startIndex, endIndex);
        return {
          data,
          questions,
          startIndex,
          endIndex,
        };
      } else {
        return {
          questions: props.data,
        };
      }
    }
    return null;
  };

  componentDidMount = () => {
    this.getQuestions();
  };
  // Lấy tất cả câu hỏi
  getQuestions = () => {
    const { sessionId, studentInfo } = this.state;
    const studentId = studentInfo.StudentId;
    if (!studentId) return;
    this.props.onFetchAssignmentsMix4({
      sessionId,
      studentId,
    });
  };

  renderIcons = (item) => {
    const { questionType } = item;
    const iconArray = RdIcon(questionType);
    return iconArray.map((item, index) => {
      return (
        // eslint-disable-next-line jsx-a11y/anchor-is-valid
        <a key={index} className="avatar avatar-sm rounded-circle" onClick={(e) => e.preventDefault()}>
          <img alt="..." src={item} />
        </a>
      );
    });
  };

  toggleModal = (fieldName, value) => () => {
    let fieldValue = value;

    if (!fieldValue) {
      fieldValue = !this.state[fieldName];
    }

    this.setState({ [fieldName]: fieldValue });
  };

  renderItem = () => {
    const { data, match, history } = this.props;
    const { isLiveWorksheetVisibled, studentInfo } = this.state;
    const { classId, sessionId } = match.params;
    if (!data) return;
    return data.map((item, index) => {
      const questionType = item.questionType;

      // Chuyển sang questionModule
      const linkQuestion = () => {
        if (questionType === 'MIX4') {
          return history.push({
            pathname: `/ames/class/${classId}/session/${sessionId}/questionsMix`,
          });
        }
        if (questionType === 'LIVEWORKSHEET') {
          return this.toggleModal('isLiveWorksheetVisibled')();
        }
      };
      const avatarUrl = item.imageUrl ? item.imageUrl : require('assets/icon/L3.jpg');
      return (
        <React.Fragment key={index}>
          <tr style={{ cursor: 'pointer' }} key={index} onClick={() => linkQuestion()}>
            <th scope="row">
              <Media className="align-items-center">
                <a className="avatar mr-3" href="#pablo" onClick={(e) => e.preventDefault()}>
                  <img alt="..." src={avatarUrl} />
                </a>
                <Media style={{ flexDirection: 'column' }}>
                  <span style={{ fontSize: 13 }}>
                    {questionType === 'IMAGE_TEXT_RECORD' ? item.questionTypeText : item.title || item.name}
                  </span>
                  <span style={{ fontSize: 10, color: 'gray', fontStyle: 'italic' }}>{item.description}</span>
                </Media>
              </Media>
            </th>
            <td>
              <div className="avatar-group">{this.renderIcons(item)}</div>
            </td>
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
            <td className="text-right">
              <Button size="sm" color="primary" className="btn-icon">
                <span className="btn-inner--icon mr-1">
                  <i className="fas fa-pen-square"></i>
                </span>
                <span className="btn-inner--text">Làm bài</span>
              </Button>
            </td>
          </tr>
          {questionType === 'LIVEWORKSHEET' && (
            <AssignmentsMix4LiveWorksheetModal
              questionItem={item}
              takeExamTime={this.state.takeExamTime}
              history={history}
              isVisibled={isLiveWorksheetVisibled}
              toggleModal={this.toggleModal('isLiveWorksheetVisibled')}
              classId={classId}
              studentId={studentInfo.StudentId}
              sessionId={sessionId}
            />
          )}
        </React.Fragment>
      );
    });
  };

  render = () => {
    const { data, loading, selectedClass, selectedSession } = this.props;
    const { questions, classId } = this.state;

    const linkGoBack = `/ames/class/${classId}/sessions`;
    const isAmes = selectedClass.courseType === 'AMES';
    const { title: selectedSessionTitle } = selectedSession;

    if (loading) {
      return <Loading />;
    }

    if (data.length === 0 || questions.length === 0) {
      return <NotData />;
    }
    const headerClassName = `header bg-${Colors.PRIMARY} pb-4`;
    return (
      <>
        <div className={headerClassName}>
          <Container fluid>
            <div className="header-body">
              <Row className="align-items-center py-4">
                <Col xs={24} sm={12} md={12} lg={8} xl={6} xxl={4}>
                  <Link to="/ames">
                    <h6 className="h2 text-white d-inline-block mb-0">HOME PAGE</h6>
                  </Link>
                  <Breadcrumb
                    className="d-none d-md-inline-block ml-md-4"
                    listClassName="breadcrumb-links breadcrumb-dark"
                  >
                    {/* <BreadcrumbItem>
                      <a href="#pablo" onClick={(e) => e.preventDefault()}>
                        <i className="fas fa-book-open" />
                      </a>
                    </BreadcrumbItem> */}
                    <BreadcrumbItem>
                      <Link to="/ames/classes" style={{ fontSize: 15 }}>
                        {isAmes ? selectedClass.className : selectedClass.courseName}
                      </Link>
                    </BreadcrumbItem>
                    <BreadcrumbItem>
                      <Link to={linkGoBack} style={{ fontSize: 15 }}>
                        {selectedSessionTitle}
                      </Link>
                    </BreadcrumbItem>
                    <BreadcrumbItem aria-current="page" className="active">
                      <span style={{ fontSize: 15 }}>Assignments</span>
                    </BreadcrumbItem>
                  </Breadcrumb>
                </Col>
              </Row>
            </div>
          </Container>
        </div>

        <Container className="mt--4" fluid>
          <Row>
            <div className="col">
              <Card>
                <Table className="align-items-center table-flush" responsive>
                  <thead className="thead-light">
                    <tr>
                      <th className="sort" scope="col">
                        Tên bài học
                      </th>
                      <th scope="col"> Kỹ năng</th>
                      <th className="sort" scope="col">
                        Đánh giá
                      </th>
                      <th scope="col">Hoàn thành</th>
                      <th className="sort" scope="col"></th>
                      <th scope="col" />
                    </tr>
                  </thead>
                  <tbody className="list">{this.renderItem()}</tbody>
                </Table>
              </Card>
            </div>
          </Row>
        </Container>
      </>
    );
  };
}

const mapStateToProps = (state) => {
  return {
    data: state.assignmentMix4Reducer.data,
    loading: state.assignmentMix4Reducer.loading,
    exerciseCountdowns: state.saveAnswerReducer,
    loggedInUser: state.loginReducer.loggedInUser,
    selectedClass: state.classReducer.selectedClass,
    selectedSession: state.sessionReducer.selectedSession,
    assignments: state.questionMixReducer.data,
    selectedPart: state.sessionReducer.selectedPart,
    partQuestion: state.sessionReducer.partQuestion,
    groupPart: state.sessionReducer.groupPart,
  };
};

const mapDispatchToProps = (dispatch) => ({
  onFetchAssignmentsMix4: ({ sessionId, studentId }) => {
    dispatch({
      type: ActionTypes.FETCH_ASSIGNMENTS_MIX4_REQUEST,
      sessionId,
      studentId,
    });
  },
});

AssignmentMix4Component.propTypes = {
  data: PropTypes.instanceOf(Array),
  selectedSession: PropTypes.instanceOf(Object),
  assignments: PropTypes.instanceOf(Object),
  groupPart: PropTypes.instanceOf(Array),
  loggedInUser: PropTypes.instanceOf(Object),
  questions: PropTypes.instanceOf(Object),
  selectedClass: PropTypes.instanceOf(Object),
  selectedPart: PropTypes.instanceOf(Object),
  match: PropTypes.instanceOf(Object),
  history: PropTypes.instanceOf(Object),
  partQuestion: PropTypes.bool,
  loading: PropTypes.bool,
  sessionId: PropTypes.string,
  classId: PropTypes.string,
  onFetchAssignmentsMix4: PropTypes.func,
};

export default connect(mapStateToProps, mapDispatchToProps)(AssignmentMix4Component);
