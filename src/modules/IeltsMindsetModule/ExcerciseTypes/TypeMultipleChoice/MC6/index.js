/* eslint-disable react/prop-types */
import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
// import { Button } from 'antd';

import styles from './styles.module.css';
// import ReactHtmlParser from 'react-html-parser';
import { Row } from 'reactstrap';
import CardBody from 'reactstrap/lib/CardBody';
import CardFooter from 'reactstrap/lib/CardFooter';
import FooterIeltsMindset from 'components/FooterIeltsMindset';
import CircleTheNumberInTheText from 'modules/IeltsMindsetModule/components/CircleTheNumberInTheText';
import * as specifications from '../../../constants/AdjustSpecifications';
import { message } from 'antd';
import { useLocation, useParams } from 'react-router';
import queryString from 'query-string';
import { useSelector } from 'react-redux';
import * as functions from '../../../../../components/functions';
import { useDispatch } from 'react-redux';
import { FETCH_SCORE } from 'modules/IeltsMindsetModule/actions/types'

const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

const Multiple6 = ({ question, audio }) => {

  // const inputTag = '#';

  const [state, setState] = React.useState({
    questions: [],
    isPointed: false,
    isDisabledSubmit: true,
    isDisabledRetry: true,
    videoVisible: false,
    userAnswers: [],
  });

  React.useEffect(() => {
    // Thêm selectedItem tới JSON
    const items = JSON.parse(question.questionJson);
    let questions = items.map((item) => {
      return { ...item, selectedItem: [] }
    })
    setState((prevState) => ({
      ...prevState,
      isPointed: false,
      isDisabledSubmit: false,
      isDisabledRetry: true,
      videoVisible: false,
      questions
    }))
    return () => {
      setState((prevState) => ({
        questions: [],
        isPointed: false,
        isDisabledSubmit: true,
        isDisabledRetry: true,
        videoVisible: false,
        userAnswers: [],
      }))
    }
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
    functions.postAnswerToAPI(result).then(response => console.log('Send MC6 answers: success')).catch(error => console.log('Send MC6 answers', error))
    // Cập nhật điểm.
    fetchIeltsMindsetScore(StudentId, params.sessionId, params.assignmentId, takeExamTime)
  }, [StudentId, fetchIeltsMindsetScore, params.assignmentId, params.sessionId, question.book, question.exercise, question.id, question.lesson, question.questionEntityName, question.subExercise, question.unit, takeExamTime])
  // #endregion

  const onSubmit = React.useCallback(() => {
    if (state.questions.length !== Object.values(state.userAnswers).length) {
      message.error(specifications.NOTIFICATION_INCOMPLETED_EXERCISE)
      return
    }

    setState((prevState) => ({ ...prevState, isPointed: true, isDisabledSubmit: true, isDisabledRetry: false }))

    // Trường hợp 1 câu nhiều đáp án thì lại thành 1 câu.
    state.userAnswers.map((item, index) => {
      if (!item.textes) return null
      if (state.questions[index].answers.filter(x => x.isCorrect).length !== item.textes.length) {
        item.isCorrect = false
        return null
      }
      item.textes.some(x => x.isCorrect === false) ? item.isCorrect = false : item.isCorrect = true
      return true
    })
    postAnswer(state.userAnswers, state.questions, state)
  }, [postAnswer, state])

  const onRetry = React.useCallback(() => {
    setState((prevState) => ({ ...prevState, isPointed: false, isDisabledRetry: true, isDisabledSubmit: false, }))

  }, [])

  const onClickAnswer = React.useCallback((item, index) => {
    // Kiểm tra câu hỏi có nhiều đáp án không?
    if (item.countCorrectAnswers > 1) {
      // Tìm vị trí của đối tượng trong mảng
      let z = item.selectedItem.findIndex(k => k.index === index)
      if (!item.selectedItem.includes(item.selectedItem[z])) {
        item.selectedItem.push({ index, selected: true })
      }
      else {
        item.selectedItem[z].selected = !item.selectedItem[z].selected
      }
    }
    else {
      item.selectedItem.pop()
      item.selectedItem.push(index)
    }

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
    
    item.countCorrectAnswers > 1
      ? !(typeof state.userAnswers[item.no - 1] === 'undefined') // Nếu đã có phần tử trong mảng.
        ? !(state.userAnswers[item.no - 1].textes.some(x => x.text === item.answers[index].text)) // Nếu chưa có đáp án được chọn.
          ? state.userAnswers[item.no - 1].textes.push(item.answers[index])
          : state.userAnswers[item.no - 1].textes = state.userAnswers[item.no - 1].textes.filter(x => x.text !== item.answers[index].text)
        : state.userAnswers[item.no - 1] = { textes: [item.answers[index]], isCorrect: false } // Đưa các giá trị vào mảng textes.
      : state.userAnswers[item.no - 1] = item.answers[index]
  }, [state.isDisabledSubmit, state.userAnswers]);

  const renderAnswerItem = React.useCallback((qItem) => (answer, answerIndex) => {
    // Tìm vị trí được chọn đối với câu hỏi có nhiều câu trả lời
    let z = qItem.selectedItem.findIndex(k => k.index === answerIndex)
    const isSelected = qItem.countCorrectAnswers > 1 ?
      (z === -1 ? false : qItem.selectedItem[z].selected) :
      qItem.selectedItem[qItem.selectedItem.length - 1] === answerIndex
    //Check answers
    let isCorrect = false;

    if (state.isPointed) {
      isCorrect = answer.isCorrect;
    }

    const customStyles = {
      alphabet: {
        // marginRight: 8,
        color: isSelected ? 'white' : 'black',
        background: isSelected ? isCorrect ? '#2ecc71' : '#E74C3C' : 'white',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      },
    }

    return state.isPointed ? (
      <div // thay thẻ botton = div . sửa tạm thời
        key={`button-${answerIndex}`}
        type='text'
        style={{ margin: 0, padding: 0, marginLeft: 15 }}
        className={`${styles.answerButton} flex flex-1`}>
        <Row style={{ fontSize: 18, margin: 0, padding: 0 }}>
          {/* <strong className={styles.mutilpleKey_new} style={customStyles.alphabet}>{alphabet[answerIndex]}</strong>
          <span style={{ display: 'block', justifyContent: 'center', alignItems: 'center' }}>{answer.text}</span> */}
          <div style={{ display: 'flex', justifyContent: 'center', cursor: 'pointer' }}>
            <div className={styles.mutilpleKey_new} style={customStyles.alphabet} >
              <strong style={{ display: 'flex', justifyContent: 'center' }}>{alphabet[answerIndex]}</strong>
            </div>
            <div style={{
              color: specifications.QUESTION_COLOR,
              fontSize: specifications.QUESTION_FONT_SIZE,
              fontWeight: specifications.QUESTION_FONT_WEIGHT,
              margin: specifications.QUESTION_SPACE_BETWEEN_SENTENCES,
              flex: 1
            }}>
              {answer.text}
            </div>
          </div>
        </Row>
      </div> // thay thẻ botton = div . sửa tạm thời
    ) : (
      <div // thay thẻ botton = div . sửa tạm thời
        type='text'
        key={`button-${answerIndex}`}
        style={{ margin: 0, padding: 0, marginLeft: 15 }}
        className={`${styles.answerButton} flex flex-1`}
        onClick={() => onClickAnswer(qItem, answerIndex)}
      >
        <Row style={{ fontSize: 18, margin: 0, padding: 0 }}>
          {/* <span className={isSelected ? styles.mutilpleKeySelected : styles.mutilpleKey}>
            <strong>{alphabet[answerIndex]}</strong>
          </span> */}
          <div style={{ display: 'flex', justifyContent: 'center', cursor: 'pointer' }}>
            <div className={isSelected ? styles.mutilpleKeySelected_new : styles.mutilpleKey_new}
              style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <strong>{alphabet[answerIndex]}</strong>
            </div>
            <div style={{
              color: specifications.QUESTION_COLOR,
              fontSize: specifications.QUESTION_FONT_SIZE,
              fontWeight: specifications.QUESTION_FONT_WEIGHT,
              margin: specifications.QUESTION_SPACE_BETWEEN_SENTENCES,
              flex: 1
            }}>
              {answer.text}
            </div>
          </div>
        </Row>
      </div> // thay thẻ botton = div . sửa tạm thời
    );
  }, [state.isPointed, onClickAnswer])

  const renderQuestion = React.useCallback((item, index) => {
    return (
      <div key={index} style={{ fontSize: 18, display: 'flex', flexDirection: 'row' }} className='mb-3'>

        {/* <span className='ml-3 mt-3' style={{ fontWeight: '600' }}>{index + 1}</span> */}
        <CircleTheNumberInTheText text={`${index + 1}.`} />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          {item.answers.map(renderAnswerItem(item, index))}
        </div>

      </div>
    );
  }, [renderAnswerItem]);

  // const transform = React.useCallback((node, index) => {
  //   if (node.type === 'text') {
  //     if (!node.data.includes(inputTag)) return;
  //     const elementArray = node.data.split(inputTag)
  //     return (
  //       <span key={index}>
  //         {elementArray.map((item, index) => {
  //           return (
  //             <React.Fragment key={index}>
  //               {index !== 0 && (
  //                 <span>_______</span>
  //               )}
  //               {item}
  //             </React.Fragment>
  //           )
  //         })}
  //       </span>
  //     )
  //   }
  // }, [])


  if (!state.questions) return null;
  return (
    <React.Fragment>
      <CardBody style={{ overflowY: 'auto', padding: 0 }}>
        {/* <span style={{ overflowY: 'auto', overflowX: 'hidden', padding: 0, fontSize: 18 }}> */}
        {/* {state.questions[0].question && ReactHtmlParser(state.questions[0].question, { transform })} */}
        {state.questions.map(renderQuestion)}
        {/* </span> */}
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
  )
};

Multiple6.propTypes = {
  question: PropTypes.instanceOf(Object),
};

export default Multiple6;
