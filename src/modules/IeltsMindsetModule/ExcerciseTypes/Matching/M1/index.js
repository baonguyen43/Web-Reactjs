/* eslint-disable react/prop-types */
import React, { useCallback, useRef } from 'react';
import { useDrop } from 'react-dnd';
import update from 'immutability-helper';
import { ArrowRightOutlined } from '@ant-design/icons';
import { Row, Col, CardFooter, CardBody } from 'reactstrap'

import { Card } from './Card.js';
// import styles from './styles.module.css';
import FooterIeltsMindset from 'components/FooterIeltsMindset';
import { dragItemTypes } from '../../../constants/index.js';
import { useLocation, useParams } from 'react-router';
import queryString from 'query-string';
import { useSelector } from 'react-redux';
import * as functions from '../../../../../components/functions';
import { useDispatch } from 'react-redux';
import { FETCH_SCORE } from 'modules/IeltsMindsetModule/actions/types'

const M1 = ({ question, audio }) => {
  const [, dropRight] = useDrop({ accept: dragItemTypes.CARD });
  const [, dropLeft] = useDrop({ accept: dragItemTypes.CARD });
  const [state, setState] = React.useState({
    arrayArrow: [],
    isPointed: false,
    videoVisible: false,
    questionParse: [],
    userAnswers: [],
  });

  // const toggleState = React.useCallback((fieldName) => () => {
  //   setState((prevState) => ({
  //     ...prevState,
  //     [fieldName]: !prevState[fieldName],
  //   }));
  // }, []);

  // const onPlayVideo = React.useCallback(() => {
  //   toggleState('videoVisible')();
  // }, [toggleState])

  // Chiều cao tối thiểu của khung chứa text.
  const heightRef = useRef(0)

  const left = React.useCallback((questionParse) => {
    const leftItem = [];
    questionParse.forEach((item) => {
      const id = parseFloat(item.no);
      const text = item.question;
      if (text !== ' ') {
        leftItem.push({ id, text })
      }
      heightRef.current = heightRef.current < text.length ? text.length : heightRef.current
    })
    return leftItem
  }, [])

  const right = React.useCallback((questionParse) => {
    const rightItem = [];
    questionParse.forEach((item, index) => {
      const id = parseFloat(item.no);
      const text = item.answers[0].right;
      if (text !== ' ') {
        rightItem.push({ id, text })
      }
      heightRef.current = heightRef.current < text.length ? text.length : heightRef.current
    })
    return rightItem
  }, [])

  const results = React.useCallback((questionParse) => {
    let resultItem = [];
    questionParse.forEach((item) => {
      const left = item.question;
      const right = item.answers[0].right;
      const text = item.answers[0].text; // Correct answer
      resultItem.push({ left, right, text });
    })
    return resultItem
  }, [])

  const [cardsLeft, setCardsLeft] = React.useState([]);

  const [cardsRight, setCardsRight] = React.useState([]);

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
    functions.postAnswerToAPI(result).then(response => console.log('Send M1 answers: success')).catch(error => console.log('Send M1 answers', error))
    // Cập nhật điểm.
    fetchIeltsMindsetScore(StudentId, params.sessionId, params.assignmentId, takeExamTime)
  }, [StudentId, fetchIeltsMindsetScore, params.assignmentId, params.sessionId, question.book, question.exercise, question.id, question.lesson, question.questionEntityName, question.subExercise, question.unit, takeExamTime])
  // #endregion

  // onSubmit
  const onSubmit = React.useCallback(() => {
    const resultsArray = results(state.questionParse);
    //
    const question_Answers = resultsArray.map(x => `${x.left} ${x.text}`); // danh sách đáp án đúng
    cardsLeft.forEach((item_left, index) => {
      const text = `${item_left.text} ${cardsRight[index].text}`; // đáp án đã chọn
      const isCorrect = question_Answers.some(x => text === x); //tìm đáp án đã chọn trong đáp án đúng
      state.arrayArrow[index].isCorrect = isCorrect;
      state.userAnswers[index] = { answer: { left: item_left.text, right: cardsRight[index].text }, isCorrect }
    });
    //
    // cardsLeft.forEach((item, index) => {
    //   const leftInResult = resultsArray.find((x) => x.left === item.text);
    //   const isCorrect = leftInResult?.text === cardsRight[index]?.text;
    //   state.arrayArrow[index].isCorrect = isCorrect;
    //   state.userAnswers[index] = { answer: { left: leftInResult.left, right: cardsRight[index].text }, isCorrect }
    // });
    setState((preState) => ({ ...preState, isPointed: true }))
    postAnswer(state.userAnswers, state.userAnswers, state)
  }, [cardsLeft, cardsRight, postAnswer, results, state]);

  const onRetry = React.useCallback(() => {
    setState((preState) => ({ ...preState, isPointed: false }))
  }, [])

  const moveCardRight = (id, atIndex) => {
    const { card, index } = findCardRight(id);
    setCardsRight(update(cardsRight, {
      $splice: [
        [index, 1],
        [atIndex, 0, card],
      ],
    }));
  };

  const findCardRight = (id) => {
    const card = cardsRight.filter((c) => `${c.id}` === id)[0];
    return {
      card,
      index: cardsRight.indexOf(card),
    };
  };

  //Card Left
  const moveCardLeft = (id, atIndex) => {
    const { card, index } = findCardLeft(id);
    const newCardLeft = update(cardsLeft, {
      $splice: [
        [index, 1],
        [atIndex, 0, card],
      ],
    });
    setCardsLeft(newCardLeft);
  };

  const findCardLeft = (id) => {
    const card = cardsLeft.filter((c) => `${c.id}` === id)[0];
    return {
      card,
      index: cardsLeft.indexOf(card),
    };
  };

  React.useEffect(() => {
    const questionParse = JSON.parse(question?.questionJson)
    const cardsLeft = left(questionParse);
    setCardsLeft(cardsLeft);
    setCardsRight(right(questionParse))
    let arrayArrow = [];
    cardsLeft.forEach(() => {
      const isCorrect = false;
      arrayArrow.push({ isCorrect });
    })
    setState((preState) => ({ ...preState, arrayArrow, questionParse, isPointed: false, userAnswers: [] }))

  }, [left, question, right])

  return (
    <React.Fragment>
      <CardBody style={{ overflowY: 'auto', overflowX: 'hidden', padding: 0 }}>
        <Row style={{ margin: 0 }}>
          <Col style={{ padding: 0 }}>
            <Row style={{ margin: 0, padding: 0 }}>
              <Col style={{ paddingLeft: 0 }}>
                <div ref={dropLeft}>
                  {cardsLeft.map((card) => (<Card key={card.id} id={`${card.id}`} text={card.text} moveCard={moveCardLeft} findCard={findCardLeft} height={heightRef.current} />))}
                </div>
              </Col>
              <span style={{ margin: '0 15px' }} >
                {state.arrayArrow.map((item, index) => {
                  return (
                    <Row key={index} className='flex-1' style={{ minHeight: 60, height: heightRef.current, justifyContent: 'center', fontSize: 28, marginBottom: '0.5rem', color: state.isPointed ? item.isCorrect ? '#27ae60' : '#e74c3c' : 'black' }}>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <ArrowRightOutlined />
                      </div>
                    </Row>
                  )
                })}
              </span>
              <Col style={{ paddingRight: 0 }}>
                <div ref={dropRight}>
                  {cardsRight.map((card) => (<Card key={card.id} id={`${card.id}`} text={card.text} moveCard={moveCardRight} findCard={findCardRight} height={heightRef.current} />))}
                </div>
              </Col>
            </Row>
          </Col>
        </Row>
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
          isDisabledSubmit={state.isPointed}
          isDisabledRetry={!state.isPointed}
          onSubmit={onSubmit}
          onRetry={onRetry}
          // onPlayVideo={onPlayVideo}
          audioUrl={audio}
        />
      </CardFooter>
    </React.Fragment>
  );
}

export default M1;
