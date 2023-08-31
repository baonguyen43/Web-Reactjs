import React, { useCallback } from 'react';

import styles from './styles.module.css';
import { Input, CardBody, CardFooter } from 'reactstrap';
import PropTypes from 'prop-types';
import ReactHtmlParser from 'react-html-parser';
import FooterIeltsMindset from 'components/FooterIeltsMindset';
import HintBox from 'modules/IeltsMindsetModule/components/HintBox';
import * as specifications from '../../../constants/AdjustSpecifications';
import CircleTheNumberInTheText from 'modules/IeltsMindsetModule/components/CircleTheNumberInTheText';
import NotData from 'components/Error/NotData';
import { message } from 'antd';

import * as functions from '../../../../../components/functions';
import { useLocation, useParams } from 'react-router';
import queryString from 'query-string';
import { useSelector, useDispatch } from 'react-redux';
import { FETCH_SCORE } from 'modules/IeltsMindsetModule/actions/types';

const TypeIn2 = ({ question, audio }) => {
  const inputTag = '#';

  const inputCount = React.useRef(0);

  const [state, setState] = React.useState({
    sentences: [],
    answers: [],
    isDisabledInput: false,
    isDisabledRetry: true,
    videoVisible: false,
    userInputs: [],
    userAnswers: [],
  });

  const [marginHintbox, setMarginHintbox] = React.useState(100);
  const hintBoxRef = React.useRef(null);
  const questionBlockRef = React.useRef(null);

  const isThereHintbox = state.sentences[0]?.hintBox && state.sentences[0].hintBox.trim().length > 0;
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
  const fetchIeltsMindsetScore = useCallback(
    (studentId, sessionId, assignmentId, takeExamTime) => {
      const payload = { studentId, sessionId, assignmentId, takeExamTime };
      dispatch({ type: FETCH_SCORE, payload });
    },
    [dispatch]
  );
  // #region Gởi dữ liệu tới máy chủ.
  const params = useParams();
  const location = useLocation();
  const { takeExamTime } = queryString.parse(location.search);
  const StudentId = useSelector((state) => state.loginReducer.loggedInUser.userMyames.StudentId);
  const postAnswer = useCallback(
    (answers, sentences, state) => {
      // Tính điểm.
      const correctAnswers = answers.filter((item) => item.isCorrect).length;
      const score = (correctAnswers / sentences.length) * 100;
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
          score: score,
          answers: answers,
          question: state,
        }),
        studentId: StudentId,
        takeExamTime: takeExamTime,
        duration: 0,
      };
      // Gởi
      functions
        .postAnswerToAPI(result)
        .then((response) => console.log('Send T2 answers: success'))
        .catch((error) => console.log('Send T2 answers', error));
      // Cập nhật điểm.
      fetchIeltsMindsetScore(StudentId, params.sessionId, params.assignmentId, takeExamTime);
    },
    [
      StudentId,
      fetchIeltsMindsetScore,
      params.assignmentId,
      params.sessionId,
      question.book,
      question.exercise,
      question.id,
      question.lesson,
      question.questionEntityName,
      question.subExercise,
      question.unit,
      takeExamTime,
    ]
  );
  // #endregion

  // Khi hoàn thành các field
  const onFinish = React.useCallback(() => {
    let booleanArray = [];
    let answers = [];
    state.sentences.correctArray.forEach((item, index) => {
      let isCorrect = false;
      item.correctAnswers.forEach((answers) => {
        if (answers?.trim().toLowerCase() === state.userInputs[index]?.trim().toLowerCase()) {
          isCorrect = true;
        }
      });
      booleanArray.push(isCorrect);
      answers.push({
        id: index,
        number_sentences: state.userAnswers[index]?.numberOfSenternces,
        answers_user: state.userInputs[index]?.trim().toLowerCase() ?? '',
        isCorrect,
      });
    });
    state.sentences.booleanArray = booleanArray;
    state.answers = answers;
    setState((preState) => ({
      ...preState,
      sentences: state.sentences,
      isDisabledInput: true,
      isDisabledRetry: false,
    }));
    postAnswer(state.answers, state.answers, state);
  }, [state, postAnswer]);

  const handleNameChange = React.useCallback(
    (event) => {
      const { userInputs, userAnswers } = state;
      const index = event.target.id;
      const value = event.target.value;
      userInputs[index] = value;
      userAnswers[index] = { value };
      setState((prevState) => ({ ...prevState, userInputs, userAnswers }));
    },
    [state]
  );
  // Hàm tìm câu dài nhất để lấy làm độ dài input
  // * 16 là vì 1 ký tự, ký tự 'm', với fontSize 18 thì có width ~ 16px
  // + >= 24 là cộng thêm khoảng cách padding left, right
  const maxWidth = useCallback(() => {
    let max = 0;
    for (let i = 0; i < state.sentences[0].answers.length; i++) {
      if (max < state.sentences[0].answers[i].text.split('/')[0].length) {
        max = state.sentences[0].answers[i].text.split('/')[0].length;
      }
    }
    // return max * 8 + 35
    return max * 10 + 24;
  }, [state.sentences]);

  const transformContent = React.useCallback(
    (node, indexNode) => {
      // if (node.type === 'tag' && node.name === 'p') {
      //   numberOfSentencesRef.current = indexNode
      // }

      if (node.type === 'text') {
        if (!node.data.includes(inputTag))
          return (
            <span
              key={indexNode}
              style={{
                color: specifications.QUESTION_COLOR,
                fontSize: specifications.QUESTION_FONT_SIZE,
                margin: specifications.QUESTION_SPACE_BETWEEN_SENTENCES,
              }}
            >
              <CircleTheNumberInTheText text={node.data} />
            </span>
          );
        const elementArray = node.data.split(inputTag);
        let currentInputNo = 0;
        return (
          <React.Fragment key={indexNode}>
            {elementArray.map((item, index) => {
              if (index > 0) {
                currentInputNo = inputCount.current;
                const maxInput = state.sentences[0].answers.length;
                inputCount.current++;
                if (inputCount.current >= maxInput) {
                  inputCount.current = 0;
                }
              }
              return (
                <span
                  key={index}
                  style={{
                    color: specifications.QUESTION_COLOR,
                    fontSize: specifications.QUESTION_FONT_SIZE,
                    fontWeight: specifications.QUESTION_FONT_WEIGHT,
                    margin: specifications.QUESTION_SPACE_BETWEEN_SENTENCES,
                    lineHeight: specifications.Line_height,
                  }}
                >
                  {index !== 0 && (
                    <React.Fragment>
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
                          color: state.isDisabledInput
                            ? state.sentences.booleanArray?.[currentInputNo]
                              ? specifications.SUCCESS_OR_CORRECT
                              : specifications.FAILED_OR_WRONG
                            : specifications.ANSWER_COLOR,
                          fontWeight: specifications.FONTWEIGHT,
                          boxShadow: specifications.BOXSHADOW,
                          backgroundColor: specifications.BACKGROUND_WHITE,
                          padding: 0,
                        }}
                        id={currentInputNo}
                        onChange={(event) => handleNameChange(event)}
                        value={state.userInputs[currentInputNo] ?? ''}
                        disabled={state.isDisabledInput}
                        className={!state.isDisabledInput ? styles.input : styles.checkInput}
                      />
                    </React.Fragment>
                  )}
                  <CircleTheNumberInTheText text={item} />
                </span>
              );
            })}
          </React.Fragment>
        );
      }
    },
    [handleNameChange, maxWidth, state.isDisabledInput, state.sentences, state.userInputs]
  );

  React.useEffect(() => {
    if (typeof question === 'undefined') {
      message.error('Try accessing the homepage again!');
      return;
    }

    const sentences = JSON.parse(question.questionJson);
    let correctArray = [];
    sentences[0].answers.forEach((item) => {
      correctArray.push({ correctAnswers: item.text.split('/') });
    });
    sentences.correctArray = correctArray;
    const handledQuestion = sentences[0].question.replaceAll(
      '<p style="text-align:justify;">',
      '<p style="text-align:left;">'
    ); //Xử lý chữ thưa do text-align: justify
    sentences[0].question = handledQuestion;
    setState((prevState) => ({ ...prevState, sentences, userInputs: [] }));
    onRetry();
  }, [onRetry, question]);

  React.useEffect(() => {
    const updateMargin = () => {
      if (hintBoxRef.current) {
        setMarginHintbox(
          hintBoxRef.current.offsetHeight > marginHintbox ? hintBoxRef.current.offsetHeight : marginHintbox
        );
      }
    };
    window.addEventListener('resize', updateMargin);
    window.addEventListener('click', updateMargin);

    return () => {
      window.removeEventListener('resize', updateMargin);
      window.removeEventListener('click', updateMargin);
    };
  }, []);

  if (typeof question === 'undefined') return <NotData />;
  if (!state.sentences[0]) return null;

  return (
    <React.Fragment>
      <CardBody style={{ overflowY: 'auto', padding: '0 15px 0 0' }}>
        <div
          style={{
            position: isThereHintbox ? 'sticky' : 'relative',
            top: isThereHintbox ? '0' : '',
            backgroundColor: isThereHintbox ? 'white' : '',
            display: 'flex',
            justifyContent: 'center',
            // marginBottom: isThereHintbox && marginHintbox,
            height: isThereHintbox && marginHintbox,
          }}
        >
          {isThereHintbox && (
            <HintBox ref={hintBoxRef} content={state.sentences[0].hintBox} isDivided={!!question.questionText} />
          )}
        </div>
        <span ref={questionBlockRef}>
          {ReactHtmlParser(state.sentences[0]?.question, {
            transform: transformContent,
          })}
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

TypeIn2.propTypes = {
  // allowPress: PropTypes.func.isRequired,
  question: PropTypes.instanceOf(Object),
  audio: PropTypes.string,
};

export default TypeIn2;
