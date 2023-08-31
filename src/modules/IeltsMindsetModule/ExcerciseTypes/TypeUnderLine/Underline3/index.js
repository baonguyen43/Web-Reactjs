/* eslint-disable react/prop-types */
/* eslint-disable no-unused-expressions */
import React, { useCallback } from 'react';
import { Col } from 'antd';
import { CardBody, CardFooter } from 'reactstrap';
import PropTypes from 'prop-types';
import FooterIeltsMindset from 'components/FooterIeltsMindset';
import styles from './styles.module.css';

import * as functions from '../../../../../components/functions';
import { useLocation, useParams } from 'react-router';
import { useSelector, useDispatch } from 'react-redux';
import queryString from 'query-string';
import { FETCH_SCORE } from 'modules/IeltsMindsetModule/actions/types'

const UnderLine3 = ({ question, audio }) => {
  const [state, setState] = React.useState({
    sentences: [],
    answers: [],
    isDisabledSubmit: false,
    isDisabledRetry: true,
    isPointed: false,
    selectedArray: [],
    questionType: null
  });

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
    functions.postAnswerToAPI(result).then(response => console.log('Send U3 answers: success')).catch(error => console.log('Send U3 answers', error))
    // Cập nhật điểm.
    fetchIeltsMindsetScore(StudentId, params.sessionId, params.assignmentId, takeExamTime)
  }, [StudentId, fetchIeltsMindsetScore, params.assignmentId, params.sessionId, question.book, question.exercise, question.id, question.lesson, question.questionEntityName, question.subExercise, question.unit, takeExamTime])
  // #endregion


  const onSubmit = React.useCallback(() => {
    const correctAnswers = state.sentences[0].correctAnswers;
    let results = []
    let answers = []
    state.selectedArray.forEach((item, index) => {
      let isCorrect = false;
      if (item === correctAnswers[index]) {
        isCorrect = true;
      }
      answers.push({ answer: item, isCorrect: isCorrect })
      results.push(isCorrect);
    })
    state.answers = answers
    state.sentences[0].results = results
    postAnswer(state.answers, correctAnswers, state)
    setState((prevState) => ({
      ...prevState, sentences: state.sentences, isDisabledSubmit: true, isPointed: true, isDisabledRetry: false
    }))
  }, [state, postAnswer])


  const onRetry = React.useCallback(() => {
    setState((prevState) => ({
      ...prevState, selectedArray: [], isDisabledRetry: true, isPointed: false, isDisabledSubmit: false
    }))
  }, [])

  const choiceAnwsers = React.useCallback((index, answer) => () => {
    // Kiểm tra nếu đang check kết quả thì return
    if (state.isPointed) return null;
    // push câu trả lời được chọn vào mảng
    state.selectedArray[index] = answer

    setState((prevState) => ({ ...prevState, selectedArray: state.selectedArray }))
  }, [state.selectedArray, state.isPointed])

  const renderContent = React.useCallback(() => {
    return state.sentences.map((x, i) => {
      return x.answers.map((item, index) => {
        const answerFirst = state.sentences[0].answersInPairs[index].first;
        const answerFirstIsSelected = state.selectedArray[index] === answerFirst;
        const answersecond = state.sentences[0].answersInPairs[index].second;
        const answerSecondIsSelected = state.selectedArray[index] === answersecond;
        let borderColor = 'black'
        if (state.isPointed) {
          borderColor = state.sentences[0].results[index] ? '#2ecc71' : '#e74c3c'
        }
        return (
          <div key={index} className={styles.item.image}>
            <div style={{ padding: 12 }}>
              <img src={item.image} alt='...' style={{ height: 200 }} />
            </div>
            <div style={{ padding: 12, fontSize: 15, fontWeight: 600 }}>
              <span className={answerFirstIsSelected ? styles.selectedSpan : ''} onClick={choiceAnwsers(index, answerFirst)} style={{ cursor: 'pointer', borderColor }}>{answerFirst}</span>
              <span> / </span>
              <span className={answerSecondIsSelected ? styles.selectedSpan : ''} onClick={choiceAnwsers(index, answersecond)} style={{ cursor: 'pointer', borderColor }}>{answersecond}</span>
            </div>
          </div>
        )
      })
    })
  }, [state.sentences, choiceAnwsers, state.selectedArray, state.isPointed])


  if (!question) return null

  return (
    <React.Fragment>
      <CardBody style={{ overflowY: 'auto', overflowX: 'hidden', padding: 0 }}>

        <Col className='d-initial justify-content-center'>
          <div className={styles.contentContainer}>
            {renderContent()}
          </div>
        </Col>
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
UnderLine3.propTypes = {
  // allowPress: PropTypes.func.isRequired,
  question: PropTypes.instanceOf(Object),
}
export default UnderLine3;
