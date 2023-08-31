/* eslint-disable no-unused-expressions */

/*eslint no-unused-expressions: ["error", { "no-unused-expressions": true }]*/
import { Rate } from 'antd';
import React from 'react';
import * as ActionTypes from '../actions/types';
// import { default as Title } from "components/Title";
import NotData from 'components/Error/NotData';
import * as functions from 'components/functions';
import RdIcon from 'components/functions/rdIcons';
import Loading from 'components/Loading';
import AssignmentsLiveWorksheetModal from 'components/Modal/assignmentsLiveWorksheetModal';
import AssignmentsToeicModal from 'components/Modal/assignmentsToeicModal';
import ModalResultType32 from 'components/Modal/ModalResultType32';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import * as Colors from 'configs/color.js';
import { query } from 'helpers/QueryHelper';
import PropTypes from 'prop-types';
import { Breadcrumb, BreadcrumbItem, Button, Card, Col, Container, Media, Progress, Row, Table } from 'reactstrap';

const fetcherSession = async (SessionId) => {
  return await query('p_API_MYAMES_GetSession', { SessionId });
};
const fetcherClass = async (ClassId) => {
  return await query('p_API_MYAMES_GetEBMClass', { ClassId });
};

class AssignmentComponent extends React.Component {
  buttonRef = React.createRef();

  constructor(props) {
    super(props);
    this.takeExamTime = functions.uuid();
    this.state = {
      isVisibled: false,
      isLiveWorksheetVisibled: false,
      data: [],
      loading: false,
      studentId: this.getStudentId(),
      isVisibledType32: false,
      isVisibledIeltsModal: false,
      // isVisibledIeltsMindsetModal: false,
      className: '',
      sessionName: '',
    };
  }

  static getDerivedStateFromProps = (props, state) => {
    if (props.loading !== state.loading) {
      return {
        loading: props.loading,
        data: props.data,
      };
    }
    return null;
  };

  getStudentId = () => {
    const { loggedInUser, selectedClass } = this.props;
    const typeApp = selectedClass.courseType;
    const studentId = typeApp === 'AMES' ? loggedInUser.userMyames.StudentId : loggedInUser.userMyai.StudentId;
    return studentId;
  };

  componentDidMount = () => {
    this.getAssinments();
    const { classId, sessionId } = this.props.match.params;
    fetcherClass(classId).then((res) => this.setState({ className: res[0]?.className }));
    fetcherSession(sessionId).then((res) => this.setState({ sessionName: res[0].sessionName }));
  };

  getAssinments = () => {
    const { match, fetchAssignments, selectedClass, loggedInUser } = this.props;

    const { classId, sessionId } = match.params;

    const AppName = loggedInUser?.userMyai?.AppName;
    const typeApp = selectedClass.courseType;
    const studentId = typeApp === 'AMES' ? loggedInUser.userMyames.StudentId : loggedInUser.userMyai.StudentId;
    const payload = {
      classId,
      studentId,
      sessionId,
      typeApp,
      AppName,
    };
    fetchAssignments(payload);
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

  renderItem = () => {
    const { data, isVisibled, studentId, isVisibledType32, isLiveWorksheetVisibled } = this.state;

    const { match, history } = this.props;
    const { classId, sessionId } = match.params;
    if (!data) return;

    // let percentVisible = true;
    // let starVisible = true;
    let type32ResultVisible = false;
    let isGrading = false;
    let groupPart = [];
    // let TotalQuestionPlayed = 0;
    // let TotalQuestion = 0;

    return data.map((item, index) => {
      const questionType = item.questionType;
      // Kiểm tra trong type IMAGE_TEXT_RECORD

      const linkStart = `/ames/class/${classId}/session/${sessionId}/assignment/${item.id}/questions`;

      // Chuyển sang questionModule
      const linkQuestion = () => {
        if (!questionType) {
          //Type class trọng âm
          return history.push({
            pathname: linkStart,
            search: `?type=LookWordAndImageThenListenAndRepeat&takeExamTime=${this.takeExamTime}&data=${item.data}&folder=${item.folder}&level=${item.level}`,
          });
        }
        history.push({
          pathname: linkStart,
          search: `?type=${item.questionType}&asrId=${item.asrId}&takeExamTime=${this.takeExamTime}&questionId=${item.questionId}`,
        });
      };

      const moveToQuestion = () => {
        ////////////////Check type
        if (questionType === 'MINDSET_FOR_IELTS') {
          // return this.toggleModal('isVisibledIeltsMindsetModal')()
          const pathname = `/ames/class/${classId}/session/${sessionId}/assignment/${item.id}/IELTSMindSet`;
          return history.push({
            pathname,
            search: `asrId=${item.asrId}&takeExamTime=${this.takeExamTime}`,
          });
        }
        if (questionType === 'TOEIC_LISTENING_READING') {
          // Mở modal chọn phần trong type TOEIC_LISTENING_READING
          return this.toggleModal('isVisibled')();
        }
        if (questionType === 'LIVEWORKSHEET') {
          // Mở modal chọn phần trong type TOEIC_LISTENING_READING
          return this.toggleModal('isLiveWorksheetVisibled')();
        }

        if (questionType === 'MINDSET_FOR_IELTS') {
          // Mở modal chọn phần trong type TOEIC_LISTENING_READING

          return this.toggleModal('isVisibledIeltsModal')();
        }

        ////////////////Check type có thuộc type 32 (IMAGE_TEXT_RECORD) hoặc IELTS_EXPLORER
        if (questionType === 'IMAGE_TEXT_RECORD' || questionType === 'IELTS_EXPLORER') {
          // percentVisible = false;
          // starVisible = false;

          if (typeof item.groupPart === 'string') {
            groupPart = JSON.parse(item.groupPart);

            if (groupPart.length) {
              const speakingPractice = groupPart.find((x) => x.Type === 'SPEAK');

              if (speakingPractice) {
                type32ResultVisible =
                  speakingPractice.TotalQuestion > 0 &&
                  speakingPractice.TotalQuestionPlayed === speakingPractice.TotalQuestion &&
                  speakingPractice.TotalQuestionMarked >= speakingPractice.TotalQuestionPlayed;

                isGrading =
                  speakingPractice.TotalQuestion > 0 &&
                  speakingPractice.TotalQuestionPlayed === speakingPractice.TotalQuestion &&
                  speakingPractice.TotalQuestionMarked < speakingPractice.TotalQuestionPlayed;

                // TotalQuestion = speakingPractice.TotalQuestion;

                // TotalQuestionPlayed = speakingPractice.TotalQuestionPlayed;
              }
            }

            /// Bật modal type 32 hoặc chuyển sang questionModule
            if (!isGrading && !type32ResultVisible) {
              // Kiểm tra có phải đang chấm điểm
              return linkQuestion();
            } else {
              if (isGrading) return this.setState({ isVisibledType32: true });
              if (!isGrading && type32ResultVisible) {
                return this.setState({ isVisibledType32: true });
              }
            }
          }
        }
        //Trả về type bình thường
        return linkQuestion();
      };
      const avatarUrl = item.imageUrl ? item.imageUrl : require('assets/icon/L3.jpg');
      return (
        <React.Fragment key={index}>
          <tr style={{ cursor: 'pointer' }} key={index} onClick={() => moveToQuestion()}>
            <th scope="row">
              <Media className="align-items-center">
                <a className="avatar mr-3" href="#pablo" onClick={(e) => e.preventDefault()}>
                  <img alt="..." src={avatarUrl} />
                </a>
                <Media style={{ flexDirection: 'column' }}>
                  <span style={{ fontSize: 13 }}>
                    {questionType === 'IMAGE_TEXT_RECORD' ? item.questionTypeText : item.questionTitle || item.name}
                  </span>
                  <span style={{ fontSize: 10, color: 'gray', fontStyle: 'italic' }}>{item.description}</span>
                </Media>
              </Media>
            </th>

            {/* <td className="budget"> <span className="budget">{item.description}</span></td> */}
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

          {questionType === 'TOEIC_LISTENING_READING' && (
            <AssignmentsToeicModal
              questionItem={item}
              takeExamTime={this.takeExamTime}
              history={history}
              isVisibled={isVisibled}
              toggleModal={this.toggleModal('isVisibled')}
              classId={classId}
              studentId={studentId}
              sessionId={sessionId}
            />
          )}
          {questionType === 'LIVEWORKSHEET' && (
            <AssignmentsLiveWorksheetModal
              questionItem={item}
              takeExamTime={this.takeExamTime}
              history={history}
              isVisibled={isLiveWorksheetVisibled}
              toggleModal={this.toggleModal('isLiveWorksheetVisibled')}
              classId={classId}
              studentId={studentId}
              sessionId={sessionId}
            />
          )}
          {questionType === 'IMAGE_TEXT_RECORD' && (
            <ModalResultType32
              questionItem={item}
              isVisibled={isVisibledType32}
              toggleModal={this.toggleModal('isVisibledType32')}
              studentId={studentId}
              sessionId={sessionId}
            />
          )}
        </React.Fragment>
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

  passOverAssignment = (classId, sessionId, history) => {
    const { id, asrId } = this.state.data[0];
    const pathname = `/ames/class/${classId}/session/${sessionId}/assignment/${id}/IELTSMindSet`;
    return history.push({
      pathname,
      search: `asrId=${asrId}&takeExamTime=${this.takeExamTime}`,
    });
  };

  render = () => {
    const { selectedSession, selectedClass, match, history } = this.props;
    const { data, loading } = this.state;
    const isAmes = selectedClass.courseType === 'AMES';
    const { classId, sessionId } = match.params;
    const linkBackSession = `/ames/class/${classId}/sessions`;
    const colorHeaderClass = `header bg-${Colors.PRIMARY} pb-6`;

    if (loading) return <Loading />;

    if (!data) return <NotData />;

    if (this.state.data[0] && this.state.data[0]?.questionType === 'MINDSET_FOR_IELTS') {
      this.passOverAssignment(classId, sessionId, history);
    }
    return (
      <>
        <div className={colorHeaderClass}>
          <Container fluid>
            <div className="header-body">
              <Row className="align-items-center py-4">
                <Col xs={24} sm={12} md={12} lg={8} xl={6} xxl={4}>
                  <h6 className="h2 text-white d-inline-block mb-0">
                    <Link to="/ames">Home Page</Link>
                  </h6>{' '}
                  <Breadcrumb
                    className="d-none d-md-inline-block ml-md-4"
                    listClassName="breadcrumb-links breadcrumb-dark"
                  >
                    <BreadcrumbItem>
                      <a href="#pablo" onClick={(e) => e.preventDefault()} style={{ fontSize: 15 }}>
                        <i className="fas fa-book-open" />
                      </a>
                    </BreadcrumbItem>
                    <BreadcrumbItem>
                      <Link to="/ames/classes" style={{ fontSize: 15 }}>
                        {isAmes ? selectedClass.className : selectedClass.courseName}
                      </Link>
                    </BreadcrumbItem>
                    <BreadcrumbItem>
                      <Link to={linkBackSession} style={{ fontSize: 15 }}>
                        {isAmes ? selectedSession.title : selectedSession.sessionName}
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
        <Container className="mt--6" fluid>
          <Row>
            <div className="col">
              <Card>
                {/* <CardHeader className="border-0">
                  <h3 className="mb-0">Danh sách bài học</h3>
                </CardHeader> */}

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
    data: state.assignmentReducer.data,
    loading: state.assignmentReducer.loading,
    selectedClass: state.classReducer.selectedClass,
    loggedInUser: state.loginReducer.loggedInUser,
    selectedSession: state.sessionReducer.selectedSession,
  };
};

const mapDispatchToProps = (dispatch) => ({
  fetchAssignments: (payload) =>
    dispatch({
      type: ActionTypes.FETCH_ASSIGNMENT_REQUEST,
      payload,
    }),
});

AssignmentComponent.propTypes = {
  data: PropTypes.instanceOf(Array).isRequired,
  fetchAssignments: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  match: PropTypes.instanceOf(Object).isRequired,
  history: PropTypes.instanceOf(Object).isRequired,
  selectedClass: PropTypes.instanceOf(Object).isRequired,
  loggedInUser: PropTypes.instanceOf(Object).isRequired,
  selectedSession: PropTypes.instanceOf(Object).isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(AssignmentComponent);
