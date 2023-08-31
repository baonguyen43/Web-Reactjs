import React, { Fragment, useCallback } from 'react';
import PropTypes from 'prop-types';
import styles from './styles.module.css';
// import FooterModal from '../../../FooterModal'
import { CardBody, CardFooter } from 'reactstrap';
import { Input } from 'antd';
import FooterIeltsMindset from 'components/FooterIeltsMindset';
import CircleTheNumberInTheText from 'modules/IeltsMindsetModule/components/CircleTheNumberInTheText';
import * as specifications from '../../../constants/AdjustSpecifications';
import { useLocation, useParams } from 'react-router';
import queryString from 'query-string';
import { useSelector } from 'react-redux';
import * as functions from '../../../../../components/functions';
// import * as Colors from 'configs/color';
// import ReactHtmlParser from 'react-html-parser';
import { useDispatch } from 'react-redux';
import { FETCH_SCORE } from 'modules/IeltsMindsetModule/actions/types'

const TypeIn7 = ({ question }) => {

  const inputCount = React.useRef(0);

  const [state, setState] = React.useState({
    questions: null,
    isPointed: false,
    isDisabledInput: false,
    isDisabledRetry: true,
    videoVisible: false,
    randomArray: [],
    userInputs: [],
    numberOfSentences: [],
  });

  const toggleState = React.useCallback(
    (fieldName) => () => {
      setState((prevState) => ({
        ...prevState,
        [fieldName]: !prevState[fieldName],
      }));
    },
    []
  );

  const onRetry = React.useCallback(() => {
    setState((preState) => ({
      ...preState,
      isDisabledInput: false,
      isPointed: false,
      isDisabledRetry: true,
    }));
  }, []);

  const onPlayVideo = React.useCallback(() => {
    toggleState('videoVisible')();
  }, [toggleState]);

  // Cập nhật điểm cho session.
  const dispatch = useDispatch();
  const fetchIeltsMindsetScore = useCallback((studentId, sessionId, assignmentId, takeExamTime) => {
      const payload = { studentId, sessionId, assignmentId, takeExamTime }
      dispatch({ type: FETCH_SCORE, payload })
  }, [dispatch])
  // #region Gởi dữ liệu tới máy chủ.
  const params = useParams()
  const location = useLocation()
  const { takeExamTime } = queryString.parse(location.search)
  const StudentId = useSelector(state => state.loginReducer.loggedInUser.userMyames.StudentId)
  const postAnswer = useCallback((answers, sentences, state) => {
    // Tính điểm.
    const correctAnswers = answers.filter(item => item.isCorrect).length
    const score = (correctAnswers / sentences.length) * 100
    // Thuộc tính.
    let result = {
      answerType: 'IELTS', // Đổi từ NEWWORD sang IELTS
      assignmentId: params.assignmentId,
      notes: '',
      questionEntityName: question.questionEntityName,
      groupName: '',
      questionGuid: '',
      questionId: question.id,
      score: score,
      sessionId: params.sessionId,
      studentChoice: JSON.stringify({
        book: question.book,
        unit: question.unit,
        lesson: question.lesson,
        exercise: question.exercise,
        subexercise: question.subExercise ?? '',
        answers: answers,
        score: score,
        question: state,
      }),
      studentId: StudentId,
      takeExamTime: takeExamTime,
      duration: 0,
    }
    // Gởi
    functions.postAnswerToAPI(result).then(response => console.log('Send T7 answers: success')).catch(error => console.log('Send T7 answers', error))
    // Cập nhật điểm.
    fetchIeltsMindsetScore(StudentId, params.sessionId, params.assignmentId, takeExamTime)
  }, [StudentId, fetchIeltsMindsetScore, params.assignmentId, params.sessionId, question.book, question.exercise, question.id, question.lesson, question.questionEntityName, question.subExercise, question.unit, takeExamTime])
  // #endregion

  // Khi hoàn thành các field
  const onFinish = React.useCallback(() => {
    let booleanArray = [];
    let answers = []

    state.questions.correctArray.forEach((item, index) => {
      let isCorrect = false;
      if (
        item?.trim().toLowerCase() ===
        state.userInputs[index]?.trim().toLowerCase()
      ) {
        isCorrect = true;
      }
      booleanArray.push(isCorrect);
    });
    state.questions.booleanArray = booleanArray;

    state.questions.booleanArray.forEach((element, index) => {
      answers[state.numberOfSentences[index]] === undefined
        ? answers[state.numberOfSentences[index]] = { answers: [state.userInputs[index]], isCorrect: state.userInputs[index] === '' ? false : element }
        : answers[state.numberOfSentences[index]].answers.push(state.userInputs[index])
          && element === false
          ? answers[state.numberOfSentences[index]].isCorrect = element
          : answers[state.numberOfSentences[index]].isCorrect = answers[state.numberOfSentences[index]].isCorrect
    })

    setState((preState) => ({
      ...preState,
      questions: state.questions,
      isDisabledInput: true,
      isDisabledRetry: false,
    }));
    postAnswer(answers, state.questions[0].answers, state)
  }, [postAnswer, state]);

  const onChange = useCallback(
    (event, i) => {
      const { userInputs, numberOfSentences } = state;
      const value = event.target.value;
      const index = event.target.id;
      userInputs[index] = value;
      numberOfSentences[index] = i
      setState((prevState) => ({ ...prevState, userInputs, numberOfSentences }));
    },
    [state]
  );

  // Dịch HTML
  const transform = React.useCallback(() => {
    if (!state.questions) return null;
    return (
      <span
        style={{
          display: 'flex',
          flexDirection: 'column',
          textAlign: 'justify',
          flexWrap: 'wrap',
        }}
      >
        {state.questions[0].answers.map((item, index) => {
          // let temp = item.question.split(/(\d{1,2}\.|#)/) // Cắt theo số hoặc dấu '#'
          let temp = item.question.split(/(#)/); // Cắt theo dấu '#'

          return (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                marginBottom: 10,
              }}
              key={index}
            >
              <span>
                {temp.map((v, i) => {
                  if (v === '#') {
                    // Lưu vị trí của input
                    const currentInputNo = inputCount.current;
                    inputCount.current++;
                    if (inputCount.current >= state.questions.maxInput) {
                      inputCount.current = 0;
                    }

                    return (
                      <Input
                        key={i}
                        maxLength={1}
                        autoComplete="off"
                        style={{
                          marginLeft: 8,
                          fontSize: specifications.FONTSIZE,
                          color: state.isDisabledInput
                            ? state.questions.booleanArray?.[currentInputNo]
                              ? specifications.SUCCESS_OR_CORRECT : specifications.FAILED_OR_WRONG : specifications.ANSWER_COLOR,
                          fontWeight: specifications.FONTWEIGHT,
                          boxShadow: specifications.BOXSHADOW,
                          border: specifications.BORDER,
                          borderBottom: specifications.DOTTED_Black,
                          height: specifications.HEIGHT,
                          backgroundColor: specifications.BACKGROUND_WHITE,
                          textAlign: specifications.text_Align,
                        }}
                        id={currentInputNo}
                        onChange={(event) => onChange(event, index)}
                        value={state.userInputs[currentInputNo] ?? ''}
                        className={styles.Input}
                        disabled={state.isDisabledInput}
                      />
                    );
                  }
                  return (

                    <CircleTheNumberInTheText key={i} text={v} />

                  );
                })}
              </span>
            </div>
          );
        })}
      </span>
    );
  }, [state.questions, state.isDisabledInput, state.userInputs, onChange]);

  React.useEffect(() => {
    const questions = JSON.parse(question?.questionJson);
    let maxInput = 0;
    let correctArray = [];
    questions[0].answers.forEach((item) => {
      const array = item.text.split('');
      array.forEach((itemArray) => {
        correctArray.push(itemArray);
      });
      maxInput += array.length;
    });
    questions.maxInput = maxInput;
    questions.correctArray = correctArray;
    setState((prevState) => ({ ...prevState, questions }));
    onRetry()
  }, [onRetry, question]);

  if (!state.questions) return null;

  return (
    <Fragment>
      <CardBody style={{ overflowY: 'auto', overflowX: 'hidden', padding: 0 }}>
        <span
          style={{
            color: specifications.QUESTION_COLOR,
            fontSize: specifications.QUESTION_FONT_SIZE,
            fontWeight: specifications.QUESTION_FONT_WEIGHT,
            margin: specifications.QUESTION_SPACE_BETWEEN_SENTENCES,
          }}
        >
          {transform()}
        </span>
        {/* {state.videoVisible && (
          <Row className={styles.centeredRow}>
            <div className={styles['video-container']}>
              <iframe title='video'
                src="https://www.youtube.com/embed/tgbNymZ7vqY">
              </iframe>
            </div>
          </Row>
        )} */}
      </CardBody>
      <CardFooter style={{ padding: 0 }}>
        <FooterIeltsMindset
          isDisabledRetry={state.isDisabledRetry}
          isDisabledSubmit={state.isDisabledInput}
          onSubmit={onFinish}
          onRetry={onRetry}
          onPlayVideo={onPlayVideo}
        />
      </CardFooter>
    </Fragment>
  );
};

TypeIn7.propTypes = {
  question: PropTypes.instanceOf(Object),
  history: PropTypes.instanceOf(Object),
  sessionId: PropTypes.string,
  classId: PropTypes.string,
};

export default TypeIn7;
