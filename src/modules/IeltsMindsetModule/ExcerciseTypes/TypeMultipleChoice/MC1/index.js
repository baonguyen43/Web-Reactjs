/* eslint-disable quotes */
/* eslint-disable react/prop-types */
import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { Col, Row } from 'reactstrap';
import CardBody from 'reactstrap/lib/CardBody';

import styles from './styles.module.css';
import CardFooter from 'reactstrap/lib/CardFooter';
import FooterIeltsMindset from 'components/FooterIeltsMindset';
import CircleTheNumberInTheText from 'modules/IeltsMindsetModule/components/CircleTheNumberInTheText';
import * as specifications from '../../../constants/AdjustSpecifications'
import { message } from 'antd';
import { useLocation, useParams } from 'react-router';
import queryString from 'query-string';
import { useSelector } from 'react-redux';
import * as functions from '../../../../../components/functions';
import { useDispatch } from 'react-redux';
import { FETCH_SCORE } from 'modules/IeltsMindsetModule/actions/types'

const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

const Multiple1 = ({ question, audio }) => {

  const [state, setState] = React.useState({
    questions: [],
    isPointed: false,
    isDisabledSubmit: false,
    isDisabledRetry: true,
    // videoVisible: false,
    answers: [],
  })
  React.useEffect(() => {
    let questionJson = JSON.parse(question?.questionJson);
    setState((prevState) => ({ ...prevState, questions: JSON.parse(JSON.stringify(questionJson)) }))
    return () => {
      setState((prevState) => ({
        ...prevState,
        questions: [],
        isPointed: false,
        isDisabledSubmit: false,
        isDisabledRetry: true,
        // videoVisible: false,
        answers: [],
      }))
    }
  }, [question]);

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
    functions.postAnswerToAPI(result).then(response => console.log('Send MC1 answers: success')).catch(error => console.log('Send MC1 answers', error))
    // Cập nhật điểm.
    fetchIeltsMindsetScore(StudentId, params.sessionId, params.assignmentId, takeExamTime)
  }, [StudentId, fetchIeltsMindsetScore, params.assignmentId, params.sessionId, question.book, question.exercise, question.id, question.lesson, question.questionEntityName, question.subExercise, question.unit, takeExamTime])
  // #endregion

  const onSubmit = React.useCallback(() => {
    if (state.questions.length !== state.answers.length) {
      message.error(specifications.NOTIFICATION_INCOMPLETED_EXERCISE)
      return
    }

    postAnswer(state.answers, state.questions, state)
    setState((prevState) => ({ ...prevState, isPointed: true, isDisabledSubmit: true, isDisabledRetry: false }))
  }, [postAnswer, state]);

  const onRetry = React.useCallback(() => {
    setState((prevState) => ({ ...prevState, isPointed: false, isDisabledSubmit: false, isDisabledRetry: true }))
  }, []);

  // Retry và xóa đáp án cũ
  // const onRetry = React.useCallback(() => {
  //   let questions = JSON.parse(question.questionJson);
  //   setState((prevState) => ({ ...prevState, isPointed: false, isDisabledSubmit: false, isDisabledRetry: true, questions }))
  // }, [question.questionJson]);

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

    state.answers[item.no - 1] = item.answers[index]
  }, [state.answers, state.isDisabledSubmit]);

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
        marginRight: 8,
        color: isSelected ? 'white' : 'black',
        background: isSelected ? isCorrect ? '#2ecc71' : '#E74C3C' : 'white',
      },
    }

    return state.isPointed ? (
      <Col key={answerIndex} style={{ marginLeft: 4, fontSize: specifications.QUESTION_FONT_SIZE, cursor: 'pointer', display: 'flex' }}>
        <div style={{ display: 'flex', justifyContent: 'center', }}>
          <strong className={styles.mutilpleKey} style={customStyles.alphabet}>{alphabet[answerIndex]}</strong>
        </div>
        <div style={{ flex: 1 }}>
          {answer.text}
        </div>
      </Col >
    ) : (
      <Col key={answerIndex} onClick={() => onClickAnswer(qItem, answerIndex)} style={{ marginLeft: 4, fontSize: specifications.QUESTION_FONT_SIZE, cursor: 'pointer', display: 'flex' }}>
        <div className={isSelected ? styles.mutilpleKeySelected : styles.mutilpleKey} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', }}>
          <strong>{alphabet[answerIndex]}</strong>
        </div>
        <div style={{ flex: 1 }}>
          {answer.text}
        </div>
      </Col >
    );
  }, [state.isPointed, onClickAnswer])

  const renderQuestion = React.useCallback((item, index) => {
    return (
      <div key={index}
        style={{
          color: specifications.QUESTION_COLOR,
          fontSize: specifications.QUESTION_FONT_SIZE,
          fontWeight: specifications.QUESTION_FONT_WEIGHT,
          margin: specifications.QUESTION_SPACE_BETWEEN_SENTENCES,
        }}
      >
        <div style={{ fontWeight: 600, wordSpacing: 5 }}>
          <CircleTheNumberInTheText text={item.question} index={index + 1} />
        </div>
        <Row>
          {item.answers.map(renderAnswerItem(item, index))}
        </Row>
      </div>
    )
    // return (
    //   <div key={index} style={{ marginRight: 8, fontSize: 16 }} className='mb-3'>
    //     <b>{index + 1}</b>{'.'} {renderTitle(item)}
    //     <Row style={{ fontSize: 20 }}>
    //       {item.answers.map(renderAnswerItem(item, index))}
    //     </Row>
    //   </div>
    // );
  }, [renderAnswerItem]);


  if (!state.questions) return null;

  return (
    <React.Fragment>
      <CardBody style={{ overflowY: 'auto', overflowX: 'hidden', padding: 0 }}>
        {state.questions.map(renderQuestion)}
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

Multiple1.propTypes = {
  question: PropTypes.instanceOf(Object),
  history: PropTypes.instanceOf(Object),
  sessionId: PropTypes.string,
  classId: PropTypes.string,
};

export default Multiple1;
