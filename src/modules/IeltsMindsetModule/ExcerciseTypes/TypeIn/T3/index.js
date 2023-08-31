/* eslint-disable react/prop-types */
import React, { Fragment, useCallback } from 'react';
import styles from './styles.module.css';
import { Input, CardBody, CardFooter } from 'reactstrap';
import PropTypes from 'prop-types';
import ReactHtmlParser from 'react-html-parser';
import FooterIeltsMindset from 'components/FooterIeltsMindset';
import CircleTheNumberInTheText from 'modules/IeltsMindsetModule/components/CircleTheNumberInTheText';
import * as specifications from '../../../constants/AdjustSpecifications';
import { useLocation, useParams } from 'react-router';
import queryString from 'query-string';
import { useSelector } from 'react-redux';
import * as functions from '../../../../../components/functions';
import { useDispatch } from 'react-redux';
import { FETCH_SCORE } from 'modules/IeltsMindsetModule/actions/types'

const TypeIn3 = ({ question, audio }) => {
  const inputTag = '#';

  const inputCount = React.useRef(0);

  const [state, setState] = React.useState({
    sentences: [],
    isDisabledInput: false,
    isDisabledRetry: true,
    videoVisible: false,
    userInputs: [],
    userAnswers: [], // Lưu đáp án người dùng đẩy lên server.
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

  const onPlayVideo = React.useCallback(() => {
    toggleState('videoVisible')();
  }, [toggleState]);

  const onRetry = React.useCallback(() => {
    setState((preState) => ({
      ...preState,
      isDisabledInput: false,
      isDisabledRetry: true,
      // userInputs: [], // xóa đáp án cũ
    }));
  }, []);

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
    functions.postAnswerToAPI(result).then(response => console.log('Send T3 answers: success')).catch(error => console.log('Send T3 answers', error))
    // Cập nhật điểm.
    fetchIeltsMindsetScore(StudentId, params.sessionId, params.assignmentId, takeExamTime)
  }, [StudentId, fetchIeltsMindsetScore, params.assignmentId, params.sessionId, question.book, question.exercise, question.id, question.lesson, question.questionEntityName, question.subExercise, question.unit, takeExamTime])
  // #endregion

  //  Khi hoàn thành các field
  const onFinish = React.useCallback(() => {
    let booleanArray = [];
    let answers = []

    state.sentences.correctArray.forEach((item, index) => {
      let isCorrect = false;
      item.correctAnswers.forEach((answers) => {
        if (answers?.trim().toLowerCase() === state.userInputs[index]?.trim().toLowerCase()) {
          isCorrect = true;
        }
      });
      booleanArray.push(isCorrect);
      answers.push({ id: index, answer: state.userInputs[index]?.trim() ?? '', isCorrect })
    });

    state.userAnswers = answers
    state.sentences.booleanArray = booleanArray;
    setState((preState) => ({
      ...preState,
      sentences: state.sentences,
      isDisabledInput: true,
      isDisabledRetry: false,
      userAnswers: state.userAnswers,
    }));

    postAnswer(state.userAnswers, state.sentences[0].answers, state)
  }, [postAnswer, state]
  );

  const onChange = React.useCallback(
    (e) => {
      const { userInputs } = state;
      const index = e.target.id;
      const value = e.target.value;
      userInputs[index] = value;
      setState((prevState) => ({ ...prevState, userInputs }));
    },
    [state]
  );

  // Hàm tìm câu dài nhất để lấy làm độ dài input
  // * 16 là vì 1 ký tự, ký tự 'm', với fontSize 18 thì có width ~ 16px
  // + 24 là cộng thêm khoảng cách padding left, right
  const maxWidth = useCallback(() => {
    let max = 0;
    for (let i = 0; i < state.sentences[0].answers.length; i++) {
      if (max < state.sentences[0].answers[i].text.split('/')[0].length) {
        max = state.sentences[0].answers[i].text.split('/')[0].length;
      }
    }
    // > 50 là số ký tự trong câu nhiều hơn 50 ký tự
    // (max * 16 + 24) / 2 = max * 8 + 12   chia 2 là vì chuỗi > 50 ký tự * 16 sẽ cho ra 1 số rất lớn, cỡ > 800
    // return (max > 50) ? (max * 8 + 50) : (max * 16 + 24)
    return max * 11
  }, [state.sentences]);

  const transform = React.useCallback(
    (node, index) => {
      if (node.type === 'text') {
        if (!node.data.includes(inputTag))

          return (
            <span style={{ lineHeight: specifications.Line_height }}>
              <CircleTheNumberInTheText key={index} text={node.data} />
            </span>
          );
        const elementArray = node.data.split(inputTag);
        let currentInputNo = 0;

        return (
          <Fragment key={index}>
            {elementArray.map((item, i) => {
              if (i > 0) {
                currentInputNo = inputCount.current;
                const maxInput = state.sentences[0].answers.length;
                inputCount.current++;
                if (inputCount.current >= maxInput) {
                  inputCount.current = 0;
                }
              }

              // const type = state.sentences[0].type === 'RE_ORDER'
              return (
                <span
                  key={i}
                  style={{
                    color: specifications.QUESTION_COLOR,
                    fontWeight: specifications.QUESTION_FONT_WEIGHT,
                    margin: specifications.QUESTION_SPACE_BETWEEN_SENTENCES,
                  }}
                >
                  {i !== 0 && (
                    <Input
                      autoComplete="off"
                      style={{
                        fontSize: specifications.FONTSIZE,
                        display: specifications.DISPLAY,
                        height: specifications.HEIGHT,
                        width: maxWidth(),
                        border: specifications.BORDER,
                        borderBottom: specifications.DOTTED_Black,
                        borderRadius: specifications.RADIUS,
                        color: state.isDisabledInput ? (state.sentences.booleanArray?.[currentInputNo]
                          ? specifications.SUCCESS_OR_CORRECT : specifications.FAILED_OR_WRONG) : specifications.ANSWER_COLOR,
                        fontWeight: specifications.FONTWEIGHT,
                        boxShadow: specifications.BOXSHADOW,
                        backgroundColor: specifications.BACKGROUND_WHITE,
                      }}
                      disabled={state.isDisabledInput}
                      value={state.userInputs[currentInputNo] ?? ''}
                      onChange={(e) => onChange(e)}
                      id={currentInputNo}
                      className={
                        !state.isDisabledInput
                          ? styles.input
                          : styles.checkInput
                      }
                    />
                  )}
                  <span style={{ lineHeight: specifications.Line_height }}>
                    <CircleTheNumberInTheText text={item} />
                  </span>
                </span>
              );
            })}
          </Fragment>
        );
      }
    },
    [
      maxWidth,
      onChange,
      state.isDisabledInput,
      state.sentences,
      state.userInputs,
    ]
  );

  const renderHintBox = React.useCallback((node, i) => {
    if (node.type === 'text') {
      if (!node.data.includes('|')) return;
      const elementArray = node.data.split('|');
      return (
        <span key={i}>
          {elementArray.map((item, index) => {
            return (
              <span
                key={index}
                style={{ marginInline: 15, display: 'inline-block' }}
              >
                {item}
              </span>
            );
          })}
        </span>
      );
    }
  }, []);

  React.useEffect(() => {
    const sentences = JSON.parse(question.questionJson);
    let correctArray = [];
    sentences[0].answers.forEach((item) => {
      correctArray.push({ correctAnswers: item.text.split('/') });
    });
    sentences.correctArray = correctArray;
    setState((prevState) => ({ ...prevState, sentences, userInputs: [] }));
    onRetry();
  }, [onRetry, question]);

  if (!state.sentences[0]) return null;
  return (
    <React.Fragment>
      <CardBody style={{ overflowY: 'auto', padding: 0 }}>
        {state.sentences[0]?.hintBox &&
          state.sentences[0]?.hintBox.trim().length > 0 && (
            <div
              style={{
                display: 'block',
                fontSize: 16,
                width: '70%',
                border: '2px solid rgb(17, 205, 239)',
                marginBottom: 15,
                paddingLeft:15
              }}
            >
              {ReactHtmlParser(state.sentences[0]?.hintBox, {
                transform: renderHintBox,
              })}
            </div>
          )}
        {ReactHtmlParser(state.sentences[0].question, { transform })}
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
          isDisabledSubmit={state.isDisabledInput}
          isDisabledRetry={state.isDisabledRetry}
          onSubmit={onFinish}
          onRetry={onRetry}
          onPlayVideo={onPlayVideo}
          audioUrl={audio}
        />
      </CardFooter>
    </React.Fragment>
  );
};
TypeIn3.propTypes = {
  // allowPress: PropTypes.func.isRequired,
  question: PropTypes.instanceOf(Object),
};
export default TypeIn3;
