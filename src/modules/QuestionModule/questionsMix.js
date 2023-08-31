import classNames from 'classnames';
import NotData from 'components/Error/NotData';
import * as functions from 'components/functions';
import Loading from 'components/Loading';
import GiveStarModal from 'components/Modal/GiveStarModal';
import { dynamicApiAxios } from 'configs/api';
import * as Colors from 'configs/color';
import moment from 'moment';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Breadcrumb, BreadcrumbItem, Col, Container, Progress, Row } from 'reactstrap';
import * as ActionTypes from './actions/types';
import * as compQuestionTypes from './render_mix';
import * as textQuestionTypes from './typesQuestion';

class QuestionsMix extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      data: [],
      questions: [], //Danh sách Câu hỏi trong 1 phần
      index: null, // Câu hỏi hiện tại
      startIndex: null, // Câu bắt đầu
      endIndex: null, // Câu kết thúc
      takeExamTime: null,
      userTrial: false,
      sessionId: props.match.params.sessionId,
      classId: props.match.params.classId,
      studentInfo: functions.getUser(), // Lấy stundent Id phù hợp với khóa học
      questionIndex: 0,
      isVisibled: false, // Bật tắt Modal tặng sao
      receiveStarNumber: null,
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
  getQuestions = async () => {
    const userId = functions.getUser().StudentId;
    if (!userId) return;
    await this.getIndex();
    const { takeExamTime, sessionId } = this.state;
    const UUID = takeExamTime ? takeExamTime : '00000000-0000-0000-0000-000000000000';
    this.props.onFetchQuestions({
      sessionId,
      userId,
      takeExamTime: UUID,
    });
  };

  /// Lấy index câu hỏi hiện tại
  getIndex = async () => {
    const { partQuestion } = this.props;
    let stateModel = {
      questionIndex: 0,
      takeExamTime: '00000000-0000-0000-0000-000000000000',
    };
    const { selectedSession, selectedPart, groupPart } = this.props;
    const sessionId = selectedSession.id || selectedSession.sessionId;
    /////GetIndex trong partQuestion
    if (partQuestion) {
      let saveIndexList = localStorage.getItem('saveIndexPartQuestion');
      if (saveIndexList) {
        saveIndexList = JSON.parse(saveIndexList);

        const isSelectedPartSession = selectedPart && groupPart.length > 1;

        let findFunc = (x) => x.sessionId === sessionId;
        if (isSelectedPartSession) {
          findFunc = (x) => x.sessionId === sessionId && x.selectedPart && x.selectedPart.index === selectedPart.index;
        }
        const saveItem = saveIndexList.find(findFunc);

        if (saveItem) {
          stateModel.questionIndex = saveItem.index;
          stateModel.takeExamTime = saveItem.takeExamTime;
        }
      }
    } else {
      /////GetIndex không phải trong partQuestion
      let saveIndexList = localStorage.getItem('saveIndexQuestion');
      if (saveIndexList) {
        saveIndexList = JSON.parse(saveIndexList);
        let findFunc = (x) => x.sessionId === sessionId;
        const saveItem = saveIndexList.find(findFunc);
        if (saveItem) {
          stateModel.questionIndex = saveItem.index;
          stateModel.takeExamTime = saveItem.takeExamTime;
        }
      }
    }

    return new Promise((resolve) => this.setState(stateModel, resolve));
  };

  // Lưu index câu hỏi hiện tại
  saveIndex = () => {
    const { selectedSession, selectedPart, groupPart, partQuestion } = this.props;
    const { questions, questionIndex } = this.state;

    const sessionId = selectedSession.sessionId || selectedSession.id;
    const saveModel = {
      index: 0,
      sessionId,
      takeExamTime: questions[questionIndex].takeExamTime,
    };
    let saveIndexList = [];
    if (partQuestion) {
      if (selectedPart && groupPart.length > 1) {
        saveModel.selectedPart = selectedPart;
      }
      const results = localStorage.getItem('saveIndexPartQuestion');
      if (results) {
        saveIndexList = JSON.parse(results);
        let findFunc = (x) => x.sessionId === sessionId;
        if (selectedPart && groupPart.length > 1) {
          findFunc = (x) => x.sessionId === sessionId && x.selectedPart && x.selectedPart.index === selectedPart.index;
        }
        const sessionIndex = saveIndexList.findIndex(findFunc);
        if (sessionIndex > -1) {
          saveIndexList[sessionIndex].index = questionIndex;
        } else {
          saveModel.index = questionIndex;
          saveIndexList.push(saveModel);
        }
      } else {
        saveIndexList.push(saveModel);
      }
      localStorage.setItem('saveIndexPartQuestion', JSON.stringify(saveIndexList));
    }
    /// Lưu index không phải part question
    else {
      const results = localStorage.getItem('saveIndexQuestion');
      if (results) {
        saveIndexList = JSON.parse(results);
        let findFunc = (x) => x.sessionId === sessionId;
        const sessionIndex = saveIndexList.findIndex(findFunc);
        if (sessionIndex > -1) {
          saveIndexList[sessionIndex].index = questionIndex;
        } else {
          saveModel.index = questionIndex;
          saveIndexList.push(saveModel);
        }
      } else {
        saveIndexList.push(saveModel);
      }
      localStorage.setItem('saveIndexQuestion', JSON.stringify(saveIndexList));
    }
  };

  //Chuyển câu hỏi tiếp theo
  nextQuestion = async () => {
    const { questionIndex } = this.state;
    const index = questionIndex + 1;
    await this.onQuestionStateChange(questionIndex);
    if (this.checkLastQuestion(index)) return;
    this.saveIndex();
    await new Promise((resolve) => this.setState({ questionIndex: index }, resolve));
  };

  //Kiểm tra có phải câu hỏi cuối cùng
  checkLastQuestion = (index) => {
    const { history } = this.props;
    const { questions, classId, questionIndex } = this.state;
    if (index === questions.length) {
      const dateEnd = new Date().getTime();
      const { sessionId, takeExamTime } = questions[questionIndex];
      this.removeIndex();
      // , state: { dateStart: this.dateStart, dateEnd },
      history.push({
        pathname: `/ames/class/${classId}/session/${sessionId}/results_mix`,
        search: `?length=${questions.length}&takeExamtime=${takeExamTime}`,
        state: { dateStart: this.dateStart, dateEnd },
      });
      return true;
    }
    return false;
  };

  removeIndex = () => {
    const { sessionId } = this.state;
    const { partQuestion } = this.props;
    const typeItem = partQuestion ? 'saveIndexPartQuestion' : 'saveIndexQuestion';
    const response = JSON.parse(localStorage.getItem(typeItem));
    if (!response) return null;
    let results = response.filter((item) => {
      return item.sessionId !== sessionId;
    });
    localStorage.setItem('saveIndexPartQuestion', JSON.stringify(results));
    localStorage.setItem('saveIndexQuestion', JSON.stringify(results));
  };

  //Kiểm tra có được tặng sao hay không
  onQuestionStateChange = async (previousIndex, nextIndex) => {
    const { loggedInUser, selectedClass, selectedSession } = this.props;
    const previousQuestionIndex = previousIndex;
    // if (!loggedInUser.isTrialUser) return;

    if (!selectedSession.enableAddStar) return;
    if (previousQuestionIndex === 0) return;
    // Insert star (no need wait)
    const sessionId = selectedSession.id || selectedSession.sessionId;
    let studentId = '';
    if (selectedClass.courseType === 'AMES') {
      studentId = loggedInUser.userMyames.StudentId;
    } else {
      studentId = loggedInUser.userMyai.StudentId;
    }
    try {
      const parameters = {
        sessionId,
        studentId,
        nextReceiveStarNumber: 0, // not used on server
      };

      const response = await dynamicApiAxios.query.post('', {
        sqlCommand: 'p_AMES247_Session_Student_Star_Insert_V2',
        parameters,
      });

      if (response.data.ok) {
        const { items } = response.data;
        if (items[0].ok) {
          const receiveStarNumber = items[0].starNumber;
          await new Promise((resolve) => this.setState({ receiveStarNumber }, resolve));
          this.toggleGiveStarModal();
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  toggleGiveStarModal = () => {
    const { isVisibled } = this.state;
    this.setState({ isVisibled: !isVisibled });
  };

  renderExerciseCountdowns = () => {
    const { startIndex, endIndex, questionIndex, questions } = this.state;

    const { partQuestion } = this.props;

    const currentQuestion = questions[questionIndex];

    const totalQuestion = partQuestion ? endIndex - startIndex : questions.length;
    const badge = `${questionIndex + 1}/${totalQuestion}`;
    if (questions) {
      const percent = Math.ceil(((questionIndex + 1) / totalQuestion) * 100);
      return (
        <div className="progress-wrapper">
          {currentQuestion?.questionTitle !== '' && (
            <div style={{ display: 'flex', flexDirection: 'column', marginBottom: 5 }}>
              <span style={{ padding: 0, margin: 0, color: '#002958', fontSize: 16 }}>
                {currentQuestion?.questionTitle}
                {currentQuestion?.description !== '' && (
                  <span style={{ color: '#002958', fontSize: 16, fontStyle: 'italic' }}>
                    {' '}
                    ({currentQuestion?.description}).
                  </span>
                )}
              </span>
            </div>
          )}

          <div className="progress-info">
            <div className="progress-label">
              <span style={{ color: '#11cdef' }}>Tổng câu hỏi {badge}</span>
            </div>
            <div className="progress-percentage">
              <span>{percent}%</span>
            </div>
          </div>
          <Progress max="100" value={percent} color="info" />
        </div>
      );
    }
  };

  //Render loại câu hỏi
  renderQuestionType = () => {
    const { selectedClass, selectedPart, loggedInUser, loading, partQuestion } = this.props;

    const { questions, studentInfo, questionIndex } = this.state;
    // console.log('🚀 ~ file: questionsMix.js ~ line 332 ~ QuestionsMix ~ questions', questions)

    const speechRecognitionAPI = selectedClass.speechRecognitionAPI;
    // console.log('🚀 ~ file: questionsMix.js ~ line 335 ~ QuestionsMix ~ speechRecognitionAPI', speechRecognitionAPI)

    const question = questions[questionIndex];

    const questionContent = JSON.parse(question.questionContent);

    const answers = JSON.parse(questionContent[0].answers);

    const props = {
      studentInfo,
      loading,
      loggedInUser,
      allProps: this.props,
      question,
      selectedPart,
      speechRecognitionAPI,
      questionIndex,
      questionContent,
      answers,
      timeStart: moment().format(),
      type: question.questionType,
      partQuestion,
      nextQuestion: this.nextQuestion,
    };
    switch (question.questionType) {
      // Type 02
      case textQuestionTypes.Type02: {
        return speechRecognitionAPI === 'S' ? (
          <></>
        ) : (
          // <compQuestionTypes.Type02 {...props} />
          <compQuestionTypes.Type02_A {...props} />
        );
      }

      // Type 03
      case textQuestionTypes.Type03: {
        return <compQuestionTypes.Type03_Mix {...props} />;
      }

      // Type 04
      case textQuestionTypes.Type04: {
        return <compQuestionTypes.Type04 {...props} />;
      }

      // Type 05
      case textQuestionTypes.Type05: {
        return <compQuestionTypes.Type05_mix {...props} />;
      }

      // Type 07
      case textQuestionTypes.Type07: {
        return speechRecognitionAPI === 'S' ? (
          <></>
        ) : (
          // <compQuestionTypes.Type07 {...props} />
          <compQuestionTypes.Type07_A {...props} />
        );
      }

      // Type 12
      case textQuestionTypes.Type12: {
        return <compQuestionTypes.Type12 {...props} />;
      }

      // // Type 12A
      case textQuestionTypes.Type12_A: {
        return speechRecognitionAPI === 'S' ? (
          <compQuestionTypes.Type12 {...props} />
        ) : (
          <compQuestionTypes.Type12_A {...props} />
        );
      }

      // Type 13
      case textQuestionTypes.Type13: {
        return <compQuestionTypes.Type13_Mix {...props} />;
      }

      // Type 14
      case textQuestionTypes.Type14: {
        return <compQuestionTypes.Type14_Mix {...props} />;
      }

      case textQuestionTypes.Type15: {
        return <compQuestionTypes.Type15_Mix {...props} />;
      }

      // Type 16
      case textQuestionTypes.Type16: {
        return <compQuestionTypes.Type16_Mix {...props} />;
      }

      // Type 17
      case textQuestionTypes.Type17: {
        return <compQuestionTypes.Type17_Mix {...props} />;
      }

      case textQuestionTypes.Type17A: {
        return <compQuestionTypes.Type17_Mix {...props} />;
      }

      // Type 18
      case textQuestionTypes.Type18: {
        return <compQuestionTypes.Type18_Mix {...props} />;
      }

      // Type 20
      case textQuestionTypes.Type20: {
        return speechRecognitionAPI === 'S' ? (
          // <compQuestionTypes.Type20 {...props} />
          <></>
        ) : (
          <compQuestionTypes.Type20_A {...props} />
        );
      }

      // Type 04A - OneCorrectQuestionImage_A
      case textQuestionTypes.Type26: {
        return <compQuestionTypes.Type26_Mix {...props} />;
      }

      case textQuestionTypes.Type29: {
        return <compQuestionTypes.Type30_Mix {...props} />;
      }

      // Type 18A - CompleteWordForSS_A
      case textQuestionTypes.Type30: {
        return <compQuestionTypes.Type30_Mix {...props} />;
      }

      default:
        return <NotData />;
    }
  };

  render = () => {
    const { data, match, loading, selectedClass, selectedSession } = this.props;
    const { questions, isVisibled, classId, receiveStarNumber } = this.state;
    const isAmes = selectedClass?.courseType === 'AMES';
    const { sessionId } = match.params;
    const linkGoBackSession = `/ames/class/${classId}/sessions/`;

    const linkGoBackAssignment = `/ames/class/${classId}/session/${sessionId}/assignmentsMix4/`;

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
                    <BreadcrumbItem>
                      <a href="#pablo" onClick={(e) => e.preventDefault()}>
                        <i className="fas fa-book-open" />
                      </a>
                    </BreadcrumbItem>
                    {isAmes && (
                      <>
                        <BreadcrumbItem>
                          <Link to="/ames/classes" style={{ fontSize: 17 }}>
                            {selectedClass.className}
                          </Link>
                        </BreadcrumbItem>
                        <BreadcrumbItem>
                          <Link to={linkGoBackSession} style={{ fontSize: 16 }}>
                            {selectedSession.title}
                          </Link>
                        </BreadcrumbItem>
                      </>
                    )}
                    {!isAmes && (
                      <>
                        <BreadcrumbItem>
                          <Link to="/ames/classes" style={{ fontSize: 17 }}>
                            {selectedClass.courseName}
                          </Link>
                        </BreadcrumbItem>
                        <BreadcrumbItem>
                          <Link to={linkGoBackSession} style={{ fontSize: 16 }}>
                            {selectedSession.title}
                          </Link>
                        </BreadcrumbItem>
                      </>
                    )}
                    <BreadcrumbItem style={{ fontSize: 16 }} aria-current="page" className="active">
                      <Link to={linkGoBackAssignment} style={{ fontSize: 16 }}>
                        Assignments
                      </Link>
                    </BreadcrumbItem>
                    <BreadcrumbItem style={{ fontSize: 16 }} aria-current="page" className="active">
                      Questions
                    </BreadcrumbItem>
                  </Breadcrumb>
                </Col>
              </Row>
            </div>
          </Container>
        </div>

        <Container>
          <Row className="justify-content-md-center">
            <Col>{this.renderExerciseCountdowns()}</Col>
          </Row>

          <Row className={classNames(['text-align_center'])}>
            <Col>{this.renderQuestionType()}</Col>
          </Row>
          <GiveStarModal
            receiveStarNumber={receiveStarNumber}
            isVisibled={isVisibled}
            toggleModal={this.toggleGiveStarModal}
          />
        </Container>
      </>
    );
  };
}

const mapStateToProps = (state) => {
  return {
    data: state.questionMixReducer.data,
    loading: state.questionMixReducer.loading,
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
  onFetchQuestions: ({ sessionId, userId, takeExamTime }) => {
    dispatch({
      type: ActionTypes.FETCH_QUESTIONS_MIX_REQUEST,
      sessionId,
      userId,
      takeExamTime,
    });
  },
});

QuestionsMix.propTypes = {
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
  onFetchQuestions: PropTypes.func,
};

export default connect(mapStateToProps, mapDispatchToProps)(QuestionsMix);
