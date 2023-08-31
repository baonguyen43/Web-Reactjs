import React, { useCallback } from 'react';
import { Button, message } from 'antd';
import PropTypes from 'prop-types';
import { Row } from 'reactstrap';

import styles from './styles.module.css';
import CardBody from 'reactstrap/lib/CardBody';
import CardFooter from 'reactstrap/lib/CardFooter';
import FooterIeltsMindset from 'components/FooterIeltsMindset';
import CircleTheNumberInTheText from 'modules/IeltsMindsetModule/components/CircleTheNumberInTheText';
import * as specifications from '../../../constants/AdjustSpecifications';
import { useLocation, useParams } from 'react-router';
import queryString from 'query-string';
import { useSelector, useDispatch } from 'react-redux';
import * as functions from '../../../../../components/functions';
import { FETCH_SCORE } from 'modules/IeltsMindsetModule/actions/types'

const Multiple3 = ({ question, audio }) => {
  const [state, setState] = React.useState({
    questions: [],
    isPointed: false,
    isDisabledSubmit: false,
    isDisabledRetry: true,
    videoVisible: false,
  });

  React.useEffect(() => {
    setState((prevState) => ({
      ...prevState, questions: JSON.parse(question.questionJson),
      isPointed: false, isDisabledSubmit: false, isDisabledRetry: true
    }))
  }, [question])

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
    functions.postAnswerToAPI(result).then(response => console.log('Send MC3 answers: success')).catch(error => console.log('Send MC3 answers', error))
    // Cập nhật điểm.
    fetchIeltsMindsetScore(StudentId, params.sessionId, params.assignmentId, takeExamTime)
  }, [StudentId, fetchIeltsMindsetScore, params.assignmentId, params.sessionId, question.book, question.exercise, question.id, question.lesson, question.questionEntityName, question.subExercise, question.unit, takeExamTime])
  // #endregion

  const onSubmit = React.useCallback(() => {
    const array = []
    state.questions.forEach((x) => x.selectedItem !== undefined && array.push(x.selectedItem))

    if (state.questions.length !== array.length) {
      message.error(specifications.NOTIFICATION_INCOMPLETED_EXERCISE)
      return
    }

    let answers = []
    state.questions.forEach((item) => answers.push(item.answers[item.selectedItem] ?? ''))
    setState((prevState) => ({ ...prevState, isPointed: true, isDisabledSubmit: true, isDisabledRetry: false }))
    postAnswer(answers, state.questions, state)
  }, [postAnswer, state])

  const onRetry = React.useCallback(() => {
    setState((prevState) => ({ ...prevState, isPointed: false, isDisabledSubmit: false, isDisabledRetry: true }))
  }, [])

  const onClickAnswer = React.useCallback((item, index) => {
    item.selectedItem = index;

    setState((prevState) => {
      const count = prevState.questions.reduce((total, countItem) => {
        if (countItem.selectedItem >= 0) {
          return total + 1;
        }
        return total;
      }, 0);

      const isDone = count === prevState.questions.length;

      if (isDone && state.isDisabledSubmit) {
        setState((prevState) => ({ ...prevState, isDisabledSubmit: false }))
      }

      return { ...prevState, questions: prevState.questions };
    })
  }, [state.isDisabledSubmit]);

  // const renderTitle = React.useCallback((item) => {
  //   const titleSplit = item.question?.split(' ');
  //   if (!titleSplit) return null
  //   return titleSplit.map((itemTitle, index) => {
  //     return itemTitle === '#' ? (
  //       <span key={index}>__________</span>
  //     ) : (
  //       <span key={index}>{' '}{itemTitle}{' '}</span>
  //     )
  //   })
  // }, []);

  const renderAnswerItem = React.useCallback((qItem) => (answer, answerIndex) => {
    const isSelected = qItem.selectedItem === answerIndex;
    // Check answers
    let isCorrect = false;

    if (state.isPointed) {
      isCorrect = answer.isCorrect;
    }

    const customStyles = {
      alphabet: {
        marginRight: "50px",
        color: isSelected ? 'white' : 'black',
        background: isSelected ? isCorrect ? '#2ecc71' : '#E74C3C' : 'white',
        width: `${qItem.answers[answerIndex].text.length * 11}px`
      },
    }

    return state.isPointed ? (
      <Button style={{ minWidth: 110 }} key={answerIndex} type='text' className={`${styles.answerButton} flex flex-1 ml-2`}>
        <Row style={{ fontSize: 16 }}>
          <strong className={styles.mutilpleKey} style={customStyles.alphabet}>{answer.text}</strong>
          {/* <span style={{ display: 'block', justifyContent: 'center', alignItems: 'center' }}>{answer.text}</span> */}
        </Row>
      </Button>
    ) : (
      <Button
        type='text'
        key={answerIndex}
        className={`${styles.answerButton} flex flex-1 ml-2`}
        style={{ minWidth: 110 }}
        onClick={() => onClickAnswer(qItem, answerIndex)}
      >
        <Row style={{ fontSize: 18 }}>
          <span className={isSelected ? styles.mutilpleKeySelected : styles.mutilpleKey} style={{ width: `${answer.text.length * 11}px` }}>
            <strong>{answer.text}</strong>
          </span>
          {/* <span style={{ display: 'block', justifyContent: 'center', alignItems: 'center' }}>{answer.text}</span> */}
        </Row>
      </Button>
    );
  }, [state.isPointed, onClickAnswer])

  const renderQuestion = React.useCallback((item, index) => {
    return (
      <div key={index} style={{ marginRight: 8, fontSize: 18 }} className='mb-3'>
        <span
          style={{
            width: 420, display: 'inline-block', maxWidth: 420,
            color: specifications.QUESTION_COLOR,
            fontSize: specifications.QUESTION_FONT_SIZE,
            fontWeight: specifications.QUESTION_FONT_WEIGHT,
            // margin: specifications.QUESTION_SPACE_BETWEEN_SENTENCES,
          }}
        >
          {/* <b>{index + 1}</b>{'.'} {renderTitle(item)} */}
          <CircleTheNumberInTheText text={item.question.includes('#') ? item.question.replace('__________') : item.question} />
        </span>
        <span style={{ marginLeft: 20 }}>
          {item.answers.map(renderAnswerItem(item, index))}
        </span>
      </div>
    );
  }, [renderAnswerItem]);

  if (!state.questions) return null;

  return (
    <>
      <CardBody style={{ overflowY: 'auto', padding: 0 }}>
        <span style={{ fontSize: 18 }}>
          {state.questions.map(renderQuestion)}
        </span>
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
    </>
  )
};

Multiple3.propTypes = {
  question: PropTypes.instanceOf(Object),
  history: PropTypes.instanceOf(Object),
  sessionId: PropTypes.string,
  classId: PropTypes.string,
  audio: PropTypes.string,
};

export default Multiple3;
