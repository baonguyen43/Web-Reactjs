import React, { useCallback, useRef } from 'react';
import { CardBody, CardFooter } from 'reactstrap';
import PropTypes from 'prop-types';
import ReactHtmlParser from 'react-html-parser';
import FooterIeltsMindset from 'components/FooterIeltsMindset';
import styles from './styles.module.css';
import CircleTheNumberInTheText from 'modules/IeltsMindsetModule/components/CircleTheNumberInTheText';
import * as specifications from '../../../constants/AdjustSpecifications';
import { message } from 'antd';
import { useLocation, useParams } from 'react-router';
import queryString from 'query-string';
import { useSelector } from 'react-redux';
import * as functions from '../../../../../components/functions';
// import { AnswerstoGroup } from '../../../../IeltsMindsetModule/components/GroupAnswers';
// import { AnswerstoGroup_every } from '../../../../IeltsMindsetModule/components/GroupAnswers';
import { useDispatch } from 'react-redux';
import { FETCH_SCORE } from 'modules/IeltsMindsetModule/actions/types'

const UnderLine2 = ({ question, audio }) => {
  const inputTag = '#';

  const inputCount = React.useRef(0);
  const isDoneRef = useRef(null) // null là vì nếu để false thì mới đầu vào, chưa làm bài vẫn submit được.

  const [state, setState] = React.useState({
    sentences: [],
    isDisabledSubmit: false,
    // isDisabledSubmit:false,
    isDisabledRetry: true,
    isPointed: false,
    selectedArray: [],
    answers: [],
  });

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
    functions.postAnswerToAPI(result).then(response => console.log('Send U2 answers: success')).catch(error => console.log('Send U2 answers', error))
    // Cập nhật điểm.
    fetchIeltsMindsetScore(StudentId, params.sessionId, params.assignmentId, takeExamTime)
  }, [StudentId, fetchIeltsMindsetScore, params.assignmentId, params.sessionId, question.book, question.exercise, question.id, question.lesson, question.questionEntityName, question.subExercise, question.unit, takeExamTime])
  // #endregion

  const onSubmit = React.useCallback(() => {
    // Kiểm tra làm đủ số câu chưa?
    if (!isDoneRef.current) {
      message.error(specifications.NOTIFICATION_INCOMPLETED_EXERCISE)
      return
    }
    // ----------------------------------------------------------------------------------------------------
    const answerString = state.sentences[0].answerString;
    const correctAnswers = state.sentences[0].correctAnswers;
    let answerArray = []
    let results = []
    state.selectedArray.forEach((item, index) => {
      let isCorrect = false;
      if (answerString[item].trim() === correctAnswers[index].trim()) {
        isCorrect = true;
      }
      answerArray.push({ isCorrect, selectedText: answerString[item] });
    })

    answerString.forEach((item, index) => {
      const indexAnswer = state.selectedArray.findIndex(x => x === index);
      let checkAnswer = false;
      if (indexAnswer > -1) {
        checkAnswer = answerArray[indexAnswer].isCorrect
      }
      results.push(checkAnswer)
    });
    state.sentences[0].results = results

    // Lưu đáp án người dùng nhập.
    state.selectedArray.forEach((item) => {
      state.answers.push({ answer: state.sentences[0].answerString[item], isCorrect: state.sentences[0].results[item] })
    })

    setState((prevState) => ({
      ...prevState, sentences: state.sentences, isDisabledSubmit: true, isPointed: true, isDisabledRetry: false
    }))

    postAnswer(state.answers, state.sentences[0].answers, state)
  }, [postAnswer, state])


  const onRetry = React.useCallback(() => {
    isDoneRef.current = null // Khi làm lại thì thiết lập lại yêu cầu.
    setState((prevState) => ({
      ...prevState, selectedArray: [], isDisabledSubmit: false, isDisabledRetry: true, isPointed: false, answers: []
    }))
  }, [])

  const choiceAnwsers = React.useCallback((value) => () => {
    const indexArray = parseInt(value / 2)
    // let isDone = false;
    let total = 0;

    state.selectedArray[indexArray] = value

    for (let index = 0; index < state.sentences[0].correctAnswers.length; index++) {
      let isEmpty = state.selectedArray[index] !== undefined;
      total = isEmpty ? total + 1 : total;
      isDoneRef.current = total === state.sentences[0].correctAnswers.length
    }

    setState((prevState) => ({
      ...prevState, selectedArray: state.selectedArray // isDisabledSubmit: !isDone
    }))
  }, [state.selectedArray, state.sentences])

  const transform = React.useCallback((node, indexNode) => {
    if (!state.sentences[0].question) return null;
    if (!state.sentences[0].answerString) return null;
    if (node.type === 'text') {
      if (!node.data.includes(inputTag)) return <CircleTheNumberInTheText key={indexNode} text={node.data} />;
      const elementArray = node.data.split(inputTag)
      let currentInputNo = 0;
      return (
        <span key={indexNode}>
          {elementArray.map((item, index) => {
            if (index > 0) {
              currentInputNo = inputCount.current;

              const maxInput = state.sentences[0].answerString?.length
              inputCount.current++;
              if (inputCount.current >= maxInput) {
                inputCount.current = 0;
              }
            }

            const isSelected = state.selectedArray.findIndex((x) => x === currentInputNo) > -1;

            let borderColor = '#022F63';
            if (state.isPointed) {
              const isCorrect = state.sentences[0].results[currentInputNo]
              borderColor = isSelected ? isCorrect ? '#2dce89' : '#f5365c' : '';
            }
            
            let color = isSelected ? specifications.ANSWER_COLOR : specifications.QUESTION_COLOR; // Thay đổi màu lúc chọn.
            if (state.isPointed) {
              const isCorrect = state.sentences[0].results[currentInputNo]
              color = isSelected ? (isCorrect ? specifications.SUCCESS_OR_CORRECT : specifications.FAILED_OR_WRONG) : specifications.QUESTION_COLOR; // Thay đổi màu lúc đúng sai.
            }

            return (
              <React.Fragment key={index}>
                {index !== 0 && (
                  <span
                    className={isSelected ? styles.selectedSpan : ''}
                    style={{
                      color,
                      fontSize: specifications.QUESTION_FONT_SIZE,
                      fontWeight: 700,
                      margin: specifications.QUESTION_SPACE_BETWEEN_SENTENCES,
                      cursor: 'pointer',
                      borderColor,
                      lineHeight: specifications.Line_height
                    }}
                    onClick={choiceAnwsers(currentInputNo)}>
                    {state.sentences[0].answerString?.[currentInputNo]}
                  </span>
                )}
                <CircleTheNumberInTheText text={item} />
              </React.Fragment>
            )
          })}
        </span>
      )
    }
  }, [state.sentences, state.selectedArray, choiceAnwsers, state.isPointed])

  React.useEffect(() => {
    let answerString = [];
    let sentences = JSON.parse(question.questionJson)
    sentences[0].answersInPairs.forEach((item, index) => {
      answerString.push(item.first, item.second)
    })
    sentences[0].answerString = answerString;

    setState((prevState) => ({
      ...prevState, sentences
    }))
    return () => {
      setState((prevState) => ({
        ...prevState,
        sentences: [],
        isDisabledSubmit: false,
        // isDisabledSubmit:false,
        isDisabledRetry: true,
        isPointed: false,
        selectedArray: [],
        answers: [],
      }))
    }
  }, [question.questionJson])

  if (!question) return null
  return (
    <React.Fragment>
      <CardBody style={{ overflowY: 'auto', overflowX: 'hidden', padding: 0 }}>
        <span style={{ fontSize: 18 }}>
          {ReactHtmlParser(state.sentences[0]?.question, { transform })}
        </span>

        {/* <FooterIeltsMindset isDisabledSubmit={state.isDisabledSubmit} isDisabledRetry={state.isDisabledRetry} onSubmit={onSubmit} onRetry={onRetry} /> */}

      </CardBody>
      <CardFooter style={{ padding: 0 }}>
        <FooterIeltsMindset
          isDisabledSubmit={state.isDisabledSubmit}
          isDisabledRetry={state.isDisabledRetry}
          onSubmit={onSubmit}
          onRetry={onRetry}
          audioUrl={audio}
        />
      </CardFooter>
    </React.Fragment>
  );
};
UnderLine2.propTypes = {
  // allowPress: PropTypes.func.isRequired,
  question: PropTypes.instanceOf(Object),
  audio: PropTypes.string,
}
export default UnderLine2;
