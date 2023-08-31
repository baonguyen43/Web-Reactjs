/* eslint-disable react/prop-types */
import NotData from 'components/Error/NotData';
import * as functions from 'components/functions';
import Loading from 'components/Loading';
import GiveStarModal from 'components/Modal/GiveStarModal';
import * as Colors from 'configs/color';
import moment from 'moment';
import PropTypes from 'prop-types';
import queryString from 'query-string';
import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Badge, Breadcrumb, BreadcrumbItem, Col, Container, Progress, Row } from 'reactstrap';
import * as ActionTypes from '../QuestionModule/actions/types';
import * as compQuestionTypes from './render';
import * as textQuestionTypes from './typesQuestion';

class QuestionTypeComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      exerciseCountdowns: [],
      questionListType35: [],
      disabledBack: true,
      disabledNext: false,
      studentId: null,
      timeStart: moment().format(),
      isVisibled: false,
      data: [],
    };
    this.questionIndex = 0;
    this.queryString = queryString.parse(props.location.search);
    this.score = 0;
    this.lengthREADING_BOOK = 0;
  }

  // static getDerivedStateFromProps = (props, state) => {
  //   if (props.data !== state.data) {
  //     return {
  //       data: props.data,
  //     }
  //   }
  //   return null
  // }

  componentDidMount = () => {
    this.getQuestions();
  };

  componentDidUpdate = (prevProps, prevState) => {
    this.queryString = queryString.parse(prevProps.location.search);
  };

  getQuestions = () => {
    const { loggedInUser, selectedClass, fetchQuestions, match, toeicGroupPart, toeicSelectedPart } = this.props;
    const { sessionId, assignmentId } = match.params;

    const { asrId, takeExamTime, type } = this.queryString;
    const typeApp = selectedClass.courseType;
    const userId = typeApp === 'AMES' ? loggedInUser.userMyames.StudentId : loggedInUser.userMyai.StudentId;
    this.setState({ studentId: userId });
    if (type === 'LookWordAndImageThenListenAndRepeat') {
      return this.fetchQuestionsType08();
    }
    const payload = {
      type,
      sessionId,
      assignmentId,
      takeExamTime,
      userId,
      asrId,
      toeicGroupPart,
      toeicSelectedPart,
    };
    fetchQuestions(payload);
  };

  fetchQuestionsType08 = () => {
    const { folder, level, data } = this.queryString;
    const { dispatch } = this.props;

    const sentences = JSON.parse(data);
    let questions = [];
    const baseUri = `https://ames.edu.vn/Data/Reading/${level}/${folder}`;
    const imageBaseUri = `${baseUri}/images/{index}.jpg`;
    const soundBaseUri = `${baseUri}/sounds/{index}.mp3`;
    sentences.forEach((sen, senIndex) => {
      const soundUri = soundBaseUri.replace('{index}', senIndex + 1);
      const imageUri = imageBaseUri.replace('{index}', senIndex + 1);
      const tmpSen = [...sen];
      const data = [];
      tmpSen.forEach((word) => {
        data.push([word[0]]);
        // tmpSen[wordIndex].push(new Animated.Value(0));
      });
      questions.push({
        id: senIndex,
        text: data.join(' '),
        imageUrl: imageUri,
        soundUrl: soundUri,
        // played: false
      });
    });
    dispatch({ type: ActionTypes.FETCH_QUESTIONS_SUCCESS, payload: { questions } });
  };

  onBack = () => {
    this.questionIndex--;
    this.setState({ timeStart: moment().format() });
    if (this.questionIndex === 0) {
      this.setState({ disabledBack: true });
    }
  };

  onNext = async (exerciseCountdowns, postAnswerToApiParams, isPush) => {
    const { type } = this.queryString;
    if (!isPush && type !== 'IELTS_EXPLORER') {
      this.postAnswerToAPI(postAnswerToApiParams);
    }
    if (this.checkCompletedOrNo()) return;
    // nextQuestion
    await this.onQuestionStateChange();
    this.questionIndex++;
    this.setState({ timeStart: moment().format(), exerciseCountdowns });
    if (this.questionIndex !== 0) {
      this.setState({ disabledBack: false });
    }
  };

  onQuestionStateChange = async () => {
    // const {
    //   loggedInUser,
    //   selectedClass,
    //   selectedSession,
    // } = this.props;
    // const previousQuestionIndex = this.questionIndex;
    // // if (!loggedInUser.isTrialUser) return;
    // if (!selectedSession.enableAddStar) return;
    // if (previousQuestionIndex === 0) return;
    // // Insert star (no need wait)
    // const sessionId = selectedSession.id || selectedSession.sessionId;
    // let studentId = '';
    // if (selectedClass.courseType === 'AMES') {
    //   studentId = loggedInUser.userMyames.StudentId;
    // } else {
    //   studentId = loggedInUser.userMyai.StudentId;
    // }
    // try {
    //   const parameters = {
    //     sessionId,
    //     studentId,
    //     nextReceiveStarNumber: 0, // not used on server
    //   };
    //   const response = await dynamicApiAxios.query.post('', {
    //     sqlCommand: 'p_AMES247_Session_Student_Star_Insert_V2',
    //     parameters,
    //   });
    //   if (response.data.ok) {
    //     const { items } = response.data;
    //     if (items[0].ok) {
    //       // const receiveStarNumber = items[0].starNumber;
    //       // await new Promise((resolve) => this.setState({ receiveStarNumber }, resolve));
    //       this.toggleGiveStarModal();
    //     }
    //   }
    // } catch (error) {
    //   console.log(error);
    // }
  };

  toggleGiveStarModal = () => {
    const { isVisibled } = this.state;
    this.setState({ isVisibled: !isVisibled });
  };

  postAnswerToAPI = (postAnswerToApiParams) => {
    const { timeStart } = this.state;
    const { questionEntityName, data, loggedInUser, selectedClass, match } = this.props;
    const { assignmentId, sessionId } = match.params;
    const { takeExamTime, type } = this.queryString;

    const typeApp = selectedClass.courseType;
    const studentId = typeApp === 'AMES' ? loggedInUser.userMyames.StudentId : loggedInUser.userMyai.StudentId;
    let question = data[this.questionIndex];
    let questionId = question?.id;
    if (type === 'READING_BOOK') {
      questionId = data[0].id;
    }
    if (type === 'Grammar' || type === 'TOEIC_LISTENING_READING') {
      questionId = 0;
    }

    const duration = moment().diff(timeStart);
    const answerModel = {
      ...postAnswerToApiParams,
      studentId,
      sessionId,
      assignmentId,
      questionEntityName: questionEntityName,
      questionId,
      takeExamTime,
      duration,
    };
    functions
      .postAnswerToAPI(answerModel)
      .then((res) => {})
      .catch((err) => {
        console.log(err);
      });
  };

  checkCompletedOrNo = () => {
    const { data, match, history } = this.props;
    const { type } = this.queryString;
    const length = type === 'READING_BOOK' ? this.lengthREADING_BOOK : data.length;

    if (this.questionIndex + 1 === length) {
      const { type, takeExamTime } = this.queryString;
      const { assignmentId, sessionId, classId } = match.params;
      if (type === 'IMAGE_TEXT_RECORD' || type === 'IELTS_EXPLORER') {
        history.push(`/ames/class/${classId}/session/${sessionId}/assignments`);
      } else {
        history.push(
          `/ames/class/${classId}/session/${sessionId}/assignment/${assignmentId}/results?length=${length}&type=${type}&takeExamTime=${takeExamTime}`
        );
      }
      return true;
    }
    return false;
  };

  renderExerciseCountdowns = () => {
    const { data, assignments, match } = this.props;
    // console.log("🚀 ~ file: index.js ~ line 232 ~ QuestionTypeComponent ~ assignments", assignments)
    const { assignmentId } = match.params;
    const selectedAssignments = assignments.find((x) => x.id === assignmentId);
    // console.log("🚀 ~ file: index.js ~ line 234 ~ QuestionTypeComponent ~ selectedAssignments", selectedAssignments)

    const { exerciseCountdowns } = this.state;

    const { type } = this.queryString;
    if (type.includes('MINDSET_FOR_IELTS')) return null;
    if (!exerciseCountdowns) {
      return null;
    }
    //Đếm số câu hỏi trả lời đúng
    let isCorrect = 0;
    exerciseCountdowns.forEach((item) => {
      if (item.isDone || item.resultRecord?.score > 50) {
        isCorrect++;
      }
    });
    let scoreTotal = 0;
    const totalQuestion = type === 'READING_BOOK' ? this.lengthREADING_BOOK : data.length;
    const answerType = functions.getAnswerType(type);

    const arrayType = 'MATCHING-ONECHOICEIMAGE-MAKESENTENCE-COMPLETE-GRAMMAR-TOEIC_LISTENING_READING';

    ///// Kiểm tra chấm điểm loại ghi âm
    if (answerType === 'RECORD') {
      scoreTotal = this.questionIndex === 0 ? 0 : exerciseCountdowns[this.questionIndex - 1]?.resultRecord?.score;
    }
    ///// Kiểm tra chấm điểm loại trắc nghiệm
    else if (arrayType.includes(answerType)) {
      scoreTotal = (isCorrect * 100) / totalQuestion;
    } else {
      ///// Kiểm tra chấm điểm loại qua là có điểm
      scoreTotal = (exerciseCountdowns.length * 100) / totalQuestion;
    }

    const percent = (exerciseCountdowns.length + 1) / totalQuestion;

    return (
      <>
        <Row className="mt-4">
          <Badge className="badge-default text-default" style={{ fontSize: 15, fontWeight: '500' }}>
            TOTAL QUESTION
          </Badge>
          <Badge className="badge-lg" color="danger">{`${exerciseCountdowns.length + 1}/${totalQuestion}`}</Badge>
          <Badge className="badge-default text-warning" style={{ fontSize: 15, fontWeight: '500' }}>
            SCORE
          </Badge>
          <Badge className="badge-lg" color="warning">{`${parseInt(scoreTotal)}/100`}</Badge>
          <Badge className="badge-default text-success" style={{ fontSize: 15, fontWeight: '500' }}>
            PASSED
          </Badge>
          <Badge className="badge-lg" color="success">{`${isCorrect}/${totalQuestion}`}</Badge>
        </Row>
        {selectedAssignments?.questionTitle !== '' && (
          <div style={{ display: 'flex', flexDirection: 'column', padding: 0, margin: 0 }}>
            <span style={{ padding: 0, margin: 0, color: '#002958', marginTop: 5, fontSize: 16 }}>
              {selectedAssignments?.questionTitle}
              {selectedAssignments?.description !== '' && selectedAssignments !== undefined && (
                <span style={{ color: '#002958', fontSize: 16, fontStyle: 'italic' }}>
                  {' '}
                  ({selectedAssignments?.description}).
                </span>
              )}
            </span>
          </div>
        )}
        <Row>
          <Col>
            <div className="progress-wrapper" style={{ paddingTop: 5 }}>
              <div className="progress-info">
                <div className="progress-label">
                  <span>Completed</span>
                </div>
                <div className="progress-percentage">
                  <span>{`${parseInt(percent * 100)} %`}</span>
                </div>
              </div>
              <Progress max="100" value={percent * 100} color="default" />
            </div>
          </Col>
        </Row>
      </>
    );
  };

  renderQuestionType = () => {
    const { match, data, history } = this.props;
    const { disabledBack, disabledNext, studentId } = this.state;
    const { classId, sessionId, assignmentId } = match.params;
    const { type, takeExamTime, questionId } = this.queryString;

    // const speechRecognitionAPI = selectedClass.speechRecognitionAPI;
    let questionIndex = this.questionIndex;
    if (type.includes('MINDSET_FOR_IELTS')) {
      // eslint-disable-next-line eqeqeq
      questionIndex = data.findIndex((x) => x.id == questionId);
    }

    let question = data[questionIndex];
    if (type === 'READING_BOOK') {
      if (!data[0]?.jsonData) return;
      const sentences = JSON.parse(data?.[0]?.jsonData);
      const { bookLevel: level, folderName: folder } = data[0];
      let questions = [];
      const baseUri = `https://ames.edu.vn/Data/Reading/${level}/${folder}`;
      const imageBaseUri = `${baseUri}/images/{index}.jpg`;
      const soundBaseUri = `${baseUri}/sounds/{index}.mp3`;
      sentences.forEach((sen, senIndex) => {
        const soundUri = soundBaseUri.replace('{index}', senIndex + 1);
        const imageUri = imageBaseUri.replace('{index}', senIndex + 1);
        const tmpSen = [...sen];
        const data = [];
        const second = [];
        tmpSen.forEach((word) => {
          data.push([word[0]]);
          second.push(word[1]);
          // tmpSen[wordIndex].push(new Animated.Value(0));
        });
        questions.push({
          id: senIndex,
          text: data.join(' '),
          second,
          imageUrl: imageUri,
          soundUrl: soundUri,
          // played: false
        });
      });
      this.lengthREADING_BOOK = questions.length;
      question = questions[questionIndex];
    }

    const props = {
      question,
      data,
      disabledNext,
      disabledBack,
      onBack: this.onBack,
      onNext: this.onNext,
      studentId,
      takeExamTime,
      questionIndex: this.questionIndex,
      classId,
      sessionId,
      assignmentId,
      history,
    };

    if (data.length === 0) return <NotData />;
    switch (type) {
      case textQuestionTypes.Type01: {
        return <compQuestionTypes.Type01 {...props} />;
      }

      case textQuestionTypes.Type02: {
        return <compQuestionTypes.Type02 {...props} />;
      }

      case textQuestionTypes.Type03: {
        return <compQuestionTypes.Type03 {...props} />;
      }

      case textQuestionTypes.Type04: {
        return <compQuestionTypes.Type04 {...props} />;
      }

      case textQuestionTypes.Type05: {
        return <compQuestionTypes.Type05 {...props} />;
      }

      case textQuestionTypes.Type06: {
        return <compQuestionTypes.Type06 {...props} />;
      }

      case textQuestionTypes.Type07: {
        return <compQuestionTypes.Type07 {...props} />;
      }

      case textQuestionTypes.Type08: {
        return <compQuestionTypes.Type08 {...props} />;
      }

      case textQuestionTypes.READING_BOOK: {
        return <compQuestionTypes.READING_BOOK {...props} />;
      }

      case textQuestionTypes.Type09: {
        return <compQuestionTypes.Type09 {...props} />;
      }

      case textQuestionTypes.Type10: {
        return <compQuestionTypes.Type10 {...props} />;
      }

      case textQuestionTypes.Type12: {
        return <compQuestionTypes.Type12 {...props} />;
      }

      case textQuestionTypes.Type12_A: {
        return <compQuestionTypes.Type12_A {...props} />;
      }

      case textQuestionTypes.Type13: {
        return <compQuestionTypes.Type13 {...props} />;
      }

      case textQuestionTypes.Type14: {
        return <compQuestionTypes.Type14 {...props} />;
      }

      case textQuestionTypes.Type15: {
        return <compQuestionTypes.Type15 {...props} />;
      }

      case textQuestionTypes.Type16: {
        return <compQuestionTypes.Type16 {...props} />;
      }

      case textQuestionTypes.Type17: {
        return <compQuestionTypes.Type17 {...props} />;
      }

      case textQuestionTypes.Type17A: {
        return <compQuestionTypes.Type17A {...props} />;
      }

      case textQuestionTypes.Type18: {
        return <compQuestionTypes.Type18 {...props} />;
      }

      case textQuestionTypes.Type20: {
        return <compQuestionTypes.Type20 {...props} />;
      }

      case textQuestionTypes.Type21: {
        return <compQuestionTypes.Type21 {...props} />;
      }

      case textQuestionTypes.Type22: {
        return <compQuestionTypes.Type22 {...props} />;
      }

      case textQuestionTypes.Type26: {
        return <compQuestionTypes.Type26 {...props} />;
      }

      case textQuestionTypes.Type29: {
        return <compQuestionTypes.Type29 {...props} />;
      }

      case textQuestionTypes.Type30: {
        return <compQuestionTypes.Type30 {...props} />;
      }

      case textQuestionTypes.Type31: {
        return <compQuestionTypes.Type31 {...props} />;
      }

      case textQuestionTypes.Type32: {
        return <compQuestionTypes.Type32 {...props} />;
      }

      case textQuestionTypes.Type33: {
        return <compQuestionTypes.Type33 {...props} />;
      }
      //ListenAudio
      //   case textQuestionTypes.Type34: {
      //     return (
      //       <compQuestionTypes.Type34
      //         questions={questions}
      //         takeExamTime={takeExamTime}
      //         allProps={this.props}
      //       />
      //     );
      //   }

      case textQuestionTypes.Type36: {
        return <compQuestionTypes.Type36 {...props} />;
      }
      case textQuestionTypes.Type37: {
        return <compQuestionTypes.Type37 {...props} />;
      }

      // case textQuestionTypes.Type38: {
      //   return (
      //     <compQuestionTypes.Type38 {...props} />
      //   );
      // }

      // case textQuestionTypes.Type39: {
      //   return (
      //     <compQuestionTypes.Type39 {...props} />
      //   );
      // }

      // case textQuestionTypes.Type40: {
      //   return (
      //     <compQuestionTypes.Type40 {...props} />
      //   );
      // }
      // case textQuestionTypes.Type41: {
      //   return (
      //     <compQuestionTypes.Type41 {...props} />
      //   );
      // }
      // case textQuestionTypes.Type42: {
      //   return (
      //     <compQuestionTypes.Type42 {...props} />
      //   );
      // }
      default:
        return <NotData />;
    }
  };

  render = () => {
    const { data, match, loading, selectedClass, selectedSession } = this.props;
    const { isVisibled } = this.state;
    const isAmes = selectedClass?.courseType === 'AMES';
    const { classId, sessionId } = match.params;
    const linkGoBackSession = `/ames/class/${classId}/sessions/`;
    const linkGoBackAssignment = `/ames/class/${classId}/session/${sessionId}/assignments/`;
    const colorClassName = `header bg-${Colors.PRIMARY} pb-2`;
    if (loading) {
      return <Loading />;
    }
    if (!data) {
      return <NotData />;
    }
    return (
      <>
        <div>
          <Container className={colorClassName} fluid>
            <div className="header-body">
              <Row className="align-items-center py-4">
                <Col>
                  <Link to="/ames">
                    <h6 className="h2 text-white d-inline-block mb-0">HOME PAGE</h6>
                  </Link>
                  <Breadcrumb
                    className="d-none d-md-inline-block ml-md-4"
                    listClassName="breadcrumb-links breadcrumb-dark"
                  >
                    <BreadcrumbItem>
                      <a href="#pablo" onClick={(e) => e.preventDefault()} style={{ fontSize: 16 }}>
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

                    <BreadcrumbItem>
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
        <div className="px-4">
          <div>{this.renderExerciseCountdowns()}</div>
          <Row>
            <Col>{this.renderQuestionType()}</Col>
          </Row>
        </div>
        <GiveStarModal isVisibled={isVisibled} toggleModal={this.toggleGiveStarModal} />
      </>
    );
  };
}

QuestionTypeComponent.propTypes = {
  fetchQuestions: PropTypes.func.isRequired,
  dispatch: PropTypes.func,
  loading: PropTypes.bool.isRequired,
  match: PropTypes.instanceOf(Object).isRequired,
  loggedInUser: PropTypes.instanceOf(Object).isRequired,
  selectedSession: PropTypes.instanceOf(Object).isRequired,
  data: PropTypes.instanceOf(Object),
  history: PropTypes.instanceOf(Object).isRequired,
  location: PropTypes.instanceOf(Object).isRequired,
  toeicGroupPart: PropTypes.instanceOf(Object),
  toeicSelectedPart: PropTypes.instanceOf(Object),
  questionEntityName: PropTypes.string,
  selectedClass: PropTypes.instanceOf(Object).isRequired,
  exerciseCountdowns: PropTypes.instanceOf(Array),
};

const mapStateToProps = (state) => {
  return {
    data: state.questionReducer.data?.questions,
    questionEntityName: state.questionReducer.data?.questionEntityName,
    loading: state.questionReducer.loading,
    selectedClass: state.classReducer.selectedClass,
    selectedSession: state.sessionReducer.selectedSession,
    assignments: state.assignmentReducer.data,
    toeicGroupPart: state.sessionReducer.groupPart,
    toeicSelectedPart: state.sessionReducer.selectedPart,
    loggedInUser: state.loginReducer.loggedInUser,
  };
};

const mapDispatchToProps = (dispatch) => ({
  fetchQuestions: (payload) => dispatch({ type: ActionTypes.FETCH_QUESTIONS_REQUEST, payload }),
  dispatch,
});

const QuestionTypeContainer = connect(mapStateToProps, mapDispatchToProps)(QuestionTypeComponent);

export default QuestionTypeContainer;
