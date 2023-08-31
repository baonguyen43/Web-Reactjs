/* eslint-disable no-extra-semi */
/* eslint-disable quotes */
/* eslint-disable react/prop-types */
import React, { useCallback, useState } from 'react';
import { CardFooter } from 'reactstrap';
import { useDrop } from 'react-dnd';
import { message } from 'antd';
import Bucket from './Bucket';
import Box from './Box';

import FooterIeltsMindset from 'components/FooterIeltsMindset';
import CardBody from 'reactstrap/lib/CardBody';
import * as specifications from '../../../constants/AdjustSpecifications';
import CircleTheNumberInTheText from 'modules/IeltsMindsetModule/components/CircleTheNumberInTheText';
import { useLocation, useParams } from 'react-router';
import queryString from 'query-string';
import { useSelector } from 'react-redux';
import * as functions from '../../../../../components/functions';
import { useDispatch } from 'react-redux';
import { FETCH_SCORE } from 'modules/IeltsMindsetModule/actions/types';

const DD3 = ({ question, audio }) => {
  // const questionsList = [
  //     { id: 1, question: 'what is # your name? # a #', droppedAnswer: [], answer: [], isDropped: false, color: null },
  //     { id: 2, question: 'How are # you? #', droppedAnswer: [], answer: [], isDropped: false, color: null },
  //     { id: 3, question: 'What is # going on here? #', droppedAnswer: [], answer: [], isDropped: false, color: null },
  // ];
  // const answersList = [
  //     { id: 1, answer: `1. I'm verry well.`, isDropped: false },
  //     { id: 2, answer: '2. Not at all.', isDropped: false },
  //     { id: 3, answer: '3. My name Thuan.', isDropped: false },
  //     { id: 4, answer: '4. Where are you from ?', isDropped: false },
  //     { id: 5, answer: '5. Wonderful', isDropped: false },
  // ];

  const [state, setState] = useState({
    questionsList: [],
    answersList: [],
    submitted: false,
    isCheck: false,
  });

  const onRetry = React.useCallback(() => {
    setState((prevState) => ({ ...prevState, questionsList: [], answersList: [], submitted: false, isCheck: false }));
  }, []);

  const handleDrop = React.useCallback(
    (item, toBox, toIndex) => {
      const { index } = item;
      const { droppedAnswer } = state.questionsList[toIndex];
      let isFound = droppedAnswer.some((el) => el.id === toBox + 1);

      //Drag from root to destination if destination is defined or not null
      if (isFound) {
        if (item.isDropped === false) {
          droppedAnswer.forEach((e, i) => {
            if (e.id === toBox + 1) {
              let temp = droppedAnswer[i].answer;
              droppedAnswer[i].answer = state.answersList[item.index].answer;
              state.answersList[index].answer = temp;
              setState((pre) => ({ ...pre, questionsList: state.questionsList, answersList: state.answersList }));
            }
          });
          return;
        }

        let fromDroppedBox = state.questionsList[item.index];
        let id = item.id + 1;
        fromDroppedBox.droppedAnswer.forEach((from, index) => {
          if (from.id === id) {
            droppedAnswer.forEach((to, i) => {
              if (to.answer === droppedAnswer[i].answer && to.id === toBox + 1) {
                let temp = droppedAnswer[i].answer;
                droppedAnswer[i].answer = from.answer;
                fromDroppedBox.droppedAnswer[index].answer = temp;
                setState((pre) => ({
                  ...pre,
                  questionsList: state.questionsList,
                }));
              }
            });
          }
        });
        return;
      }

      //Drag from answerList to destination if destination is undefined or null
      if (item.isDropped === false) {
        droppedAnswer.push({
          id: toBox + 1,
          answer: state.answersList[item.index].answer,
          isDropped: true,
          isCorrect: false,
        });
        state.answersList.splice(index, 1);
        setState((pre) => ({ ...pre, questionsList: state.questionsList, answersList: state.answersList }));
        return;
      }

      //Drag from questionList to destination if destination is undefined or null
      let fromDroppedBox = state.questionsList[item.index];
      fromDroppedBox.droppedAnswer.forEach((e, i) => {
        if (e.id === item.id + 1) {
          let answer = e.answer;
          fromDroppedBox.droppedAnswer.splice(i, 1);
          droppedAnswer.push({ id: toBox + 1, answer, isDropped: true, isCorrect: false });
          setState((pre) => ({ ...pre, questionsList: state.questionsList, answersList: state.answersList }));
        }
      });
      return;
    },
    [state.answersList, state.questionsList]
  );

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
          answers: answers,
          score: score,
        }),
        studentId: StudentId,
        takeExamTime: takeExamTime,
        duration: 0,
      };
      // Gởi
      functions
        .postAnswerToAPI(result)
        .then((response) => console.log('Send DD3 answers: success'))
        .catch((error) => console.log('Send DD3 answers', error));
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

  const onSubmit = React.useCallback(() => {
    let isNotEmpty = true;
    for (let index = 0; index < state.questionsList.length; index++) {
      let q = state.questionsList[index];
      if (q.droppedAnswer.length !== q.answers.length) {
        isNotEmpty = false;
        message.error('Fields must not be empty!');
        break;
      }
    }

    if (isNotEmpty) {
      for (let index = 0; index < state.questionsList.length; index++) {
        let q = state.questionsList[index];
        q.droppedAnswer.forEach((e, i) => {
          q.answers.forEach((answer) => {
            if (e.id === answer.id && e.answer === answer.answer) {
              q.droppedAnswer[i].isCorrect = true;
            }
          });
        });
      }
      setState((prevState) => ({ ...prevState, submitted: true, questionsList: state.questionsList }));
    }

    let answers = [];
    let questions = []; // Lưu mảng các câu hỏi có câu trả lời, có trường hợp: câu không có câu trả lời.
    state.questionsList.forEach((item) => {
      // Tính điểm theo vị trí.
      if (item.droppedAnswer.length === 0) return;
      questions.push(item);
      item.droppedAnswer.forEach((v) => answers.push({ answer: v.answer, isCorrect: v.isCorrect }));

      // Tính điểm theo câu.
      // let textes = [] // Trường hợp 1 câu có nhiều chỗ kéo thả đáp án.
      // if (item.droppedAnswer.length === 0) return
      // questions.push(item)
      // item.droppedAnswer.forEach((v) => answers.push({ answer: v.answer, isCorrect: v.isCorrect }))
      // item.droppedAnswer.forEach((v) => textes.push({ answer: v.answer, isCorrect: v.isCorrect }))
      // let isCorrect = !textes.some(x => !x.isCorrect)
      // return answers.push({ answers: textes, isCorrect })
    });
    postAnswer(answers, answers, state);
  }, [postAnswer, state]);

  //Drag from questionList to answerList
  const handleBoxDrop = React.useCallback(
    (item) => {
      if (item.isDropped === false) {
        return;
      }
      let id = item.id + 1;
      let { droppedAnswer } = state.questionsList[item.questionIndex];
      droppedAnswer.forEach((e, i) => {
        if (e.id === id) {
          droppedAnswer.splice(i, 1);
          state.answersList.push({ answer: e.answer, isDropped: false, color: 'green' });
          setState((pre) => ({ ...pre, questionsList: state.questionsList, answersList: state.answersList }));
        }
      });
      return;
    },
    [state.answersList, state.questionsList]
  );

  React.useEffect(() => {
    // onRetry();
    let dragItems = [];
    if (state.questionsList.length > 0) {
      onRetry();
      return;
    }
    const questions = JSON.parse(question.questionJson);
    for (let index = 1; index < questions.length; index++) {
      let q = questions[index];

      let answers = [];

      // Because we allow not to enter answers in the AllType folder at DragDrop3, the answer field will not exist for some questions
      if (q.answers !== undefined) {
        q.answers.forEach((e, i) => {
          answers.push({ id: i + 1, answer: e.answer.trim(), isCorrect: false });
        });
      }
      state.questionsList.push({
        id: index,
        question: q.question,
        droppedAnswer: [],
        answers: answers,
        isDropped: false,
      });
    }

    questions[0].answers.forEach((item) => {
      dragItems.push(item.answer);
    });

    // helpers.shuffle(dragItems);
    dragItems.forEach((item, i) => {
      state.answersList.push({ id: i + 1, answer: item.trim(), isDropped: false });
    });
    setState((prevState) => ({ ...prevState, questionsList: state.questionsList, answersList: state.answersList }));
  }, [onRetry, question, question.questionJson, state.answersList, state.questionsList]);
  // cũ        question.leng

  const [
    ,
    // { canDrop, isOver }
    drop,
  ] = useDrop(() => ({
    accept: 'BOX',
    canDrop: () => !state.submitted,
    drop: handleBoxDrop,
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
      isDropped: !state.submitted,
    }),
  }));

  const renderAnswerList = React.useCallback(() => {
    let backgroundColor = !state.submitted ? specifications.BACKGROUND_DROP : '#DFE1E5'; //1 giá trị chưa thả . 2 ????
    let margin = !state.submitted ? '2px 5px' : '2px 5px';
    let padding = !state.submitted ? '0px 10px' : '0px 10px';
    let color = specifications.COLOR_Black;
    let fontWeight = specifications.QUESTION_FONT_WEIGHT;
    return state.answersList.map((item, i) => (
      <Box
        backgroundColor={backgroundColor}
        padding={padding}
        margin={margin}
        fontWeight={fontWeight}
        color={color}
        key={i}
        answer={item.answer}
        index={i}
        isDropped={false}
        canDrag={!state.submitted}
      />
    ));
  }, [state.answersList, state.submitted]);

  const renderBucket = useCallback(
    (arr, q, i, count) => {
      return arr.map((text, index) => {
        count += 1;
        return count < arr.length ? (
          <span key={index}>
            <CircleTheNumberInTheText text={text} />{' '}
            <Bucket
              canDrag={!state.submitted}
              droppedAnswer={q.droppedAnswer}
              onDrop={(item) => handleDrop(item, index, i)}
              questionIndex={i}
              index={i}
              answerIndex={index}
            />
          </span>
        ) : (
          <CircleTheNumberInTheText key={index} text={text} />
        );
      });
    },
    [handleDrop, state.submitted]
  );

  const renderQuestionsList = React.useCallback(() => {
    return state.questionsList.map((q, i) => {
      var arr = q.question.split('#');
      let count = 0;
      return (
        <div
          key={i + 1}
          style={{
            color: specifications.QUESTION_COLOR,
            fontSize: specifications.QUESTION_FONT_SIZE,
            fontWeight: specifications.QUESTION_FONT_WEIGHT,
            margin: specifications.QUESTION_SPACE_BETWEEN_SENTENCES,
            textAlign: 'left',
          }}
        >
          {renderBucket(arr, q, i, count)}
        </div>
      );
    });
  }, [renderBucket, state.questionsList]);

  return (
    <React.Fragment>
      <CardBody style={{ padding: specifications.PADDING_ALL }}>
        {/* {questions.question?.questionText && (
                    <div dangerouslySetInnerHTML={{ __html: questions.question.questionText }} />
                )} */}
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          <div id="headerBox" ref={drop} style={{ fontSize: 20, textAlign: 'center', minHeight: 75 }}>
            {renderAnswerList()}
          </div>
          <div style={{ overflowY: 'auto', overflowX: 'hidden', flex: 1, paddingTop: specifications.PADDING_ALL }}>
            {renderQuestionsList()}
          </div>
        </div>
      </CardBody>
      <CardFooter style={{ padding: 0 }}>
        <FooterIeltsMindset
          isDisabledSubmit={state.submitted}
          isDisabledRetry={!state.submitted}
          onSubmit={onSubmit}
          onRetry={onRetry}
          audioUrl={audio}
        />
      </CardFooter>
    </React.Fragment>
  );
};

export default DD3;
