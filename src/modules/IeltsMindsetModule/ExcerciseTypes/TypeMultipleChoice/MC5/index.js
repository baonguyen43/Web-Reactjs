/* eslint-disable react/prop-types */
import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { CardBody, CardFooter, Row } from 'reactstrap';

import styles from './styles.module.css';
import FooterIeltsMindset from 'components/FooterIeltsMindset';
import CircleTheNumberInTheText from 'modules/IeltsMindsetModule/components/CircleTheNumberInTheText';
// import TitleQuestion from 'components/TitleQuestion';
import * as specifications from '../../../constants/AdjustSpecifications';
import { useLocation, useParams } from 'react-router';
import queryString from 'query-string';
import { useSelector } from 'react-redux';
import * as functions from '../../../../../components/functions';
import { message } from 'antd';
import { useDispatch } from 'react-redux';
import { FETCH_SCORE } from 'modules/IeltsMindsetModule/actions/types';

const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

const MC5 = ({ question, audio }) => {
  const [state, setState] = React.useState({
    questions: [],
    isPointed: false,
    isDisabledSubmit: false,
    isDisabledRetry: true,
    videoVisible: false,
    userAnswers: [],
  });

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
          question: state,
        }),
        studentId: StudentId,
        takeExamTime: takeExamTime,
        duration: 0,
      };
      // Gởi
      functions
        .postAnswerToAPI(result)
        .then((response) => console.log('Send MC5 answers: success'))
        .catch((error) => console.log('Send MC5 answers', error));
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
    if (state.questions.length !== Object.values(state.userAnswers).length) {
      message.error(specifications.NOTIFICATION_INCOMPLETED_EXERCISE);
      return;
    }

    setState((prevState) => ({ ...prevState, isPointed: true, isDisabledSubmit: true, isDisabledRetry: false }));

    state.userAnswers.map((item, index) => {
      if (!item.textes) return null;
      if (state.questions[index].answers.filter((x) => x.isCorrect).length !== item.textes.length) {
        item.isCorrect = false;
        return null;
      }
      item.textes.some((x) => x.isCorrect === false) ? (item.isCorrect = false) : (item.isCorrect = true);
      return true;
    });
    postAnswer(state.userAnswers, state.questions, state);
  }, [postAnswer, state]);

  const onRetry = React.useCallback(() => {
    setState((prevState) => ({ ...prevState, isPointed: false, isDisabledSubmit: false, isDisabledRetry: true }));
  }, []);

  const onClickAnswer = React.useCallback(
    (item, index) => {
      // const questions=state.questions;
      // questions[item.no - 1].answers[index].isSelected=questions[item.no - 1].answers[index].isSelected?false:true
      // setState({...state, questions })

      // Kiểm tra câu hỏi có nhiều đáp án không?
      if (item.countCorrectAnswers > 1) {
        // Tìm vị trí của đối tượng trong mảng
        let z = item.selectedItem.findIndex((k) => k.index === index);
        if (!item.selectedItem.includes(item.selectedItem[z])) {
          item.selectedItem.push({ index, selected: true });
        } else {
          item.selectedItem[z].selected = !item.selectedItem[z].selected;
        }
      } else {
        item.selectedItem.pop();
        item.selectedItem.push(index);
      }

      setState((prevState) => {
        // Kiểm tra đã làm đủ số câu hỏi chưa?
        const count = prevState.questions.reduce((total, countItem) => {
          if (countItem.selectedItem[countItem.selectedItem.length - 1] >= 0) {
            return total + 1;
          }
          // Phần kiểm tra câu hỏi có nhiều đáp án
          if (
            countItem.countCorrectAnswers > 1 &&
            countItem.selectedItem.findIndex((k) => k.selected === true) !== -1
          ) {
            return total + 1;
          }
          return total;
        }, 0);

        const isDone = count === prevState.questions.length;

        if (isDone && state.isDisabledSubmit) {
          setState((prevState) => ({ ...prevState, isDisabledSubmit: false }));
        }
        return { ...prevState, questions: prevState.questions };
      });

      item.countCorrectAnswers > 1
        ? !(typeof state.userAnswers[item.no - 1] === 'undefined') // Nếu đã có phần tử trong mảng.
          ? !state.userAnswers[item.no - 1].textes.some((x) => x.text === item.answers[index].text) // Nếu chưa có đáp án được chọn.
            ? state.userAnswers[item.no - 1].textes.push(item.answers[index])
            : (state.userAnswers[item.no - 1].textes = state.userAnswers[item.no - 1].textes.filter(
                (x) => x.text !== item.answers[index].text
              ))
          : (state.userAnswers[item.no - 1] = { textes: [item.answers[index]], isCorrect: false }) // Đưa các giá trị vào mảng textes.
        : (state.userAnswers[item.no - 1] = item.answers[index]);
    },
    [state.isDisabledSubmit, state.userAnswers]
  );

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

  const renderAnswerItem = React.useCallback(
    (qItem) => (answer, answerIndex) => {
      // Tìm vị trí được chọn đối với câu hỏi có nhiều câu trả lời
      let z = qItem.selectedItem.findIndex((k) => k.index === answerIndex);
      const isSelected =
        qItem.countCorrectAnswers > 1
          ? z === -1
            ? false
            : qItem.selectedItem[z].selected
          : qItem.selectedItem[qItem.selectedItem.length - 1] === answerIndex;
      // Check answers
      let isCorrect = false;

      if (state.isPointed) {
        isCorrect = answer.isCorrect;
      }

      const customStyles = {
        alphabet: {
          marginRight: 8,
          color: isSelected ? 'white' : 'black',
          background: isSelected ? (isCorrect ? '#2ecc71' : '#E74C3C') : 'white',
        },
      };

      return state.isPointed ? (
        <div key={answerIndex} type="text" className={`${styles.answerButton} flex flex-1 ml-4`}>
          <Row style={{ marginLeft: 4, fontSize: 18, display: 'flex' }}>
            <div>
              <strong className={styles.mutilpleKey} style={customStyles.alphabet}>
                {alphabet[answerIndex]}
              </strong>
            </div>
            <div
              style={{ display: 'block', justifyContent: 'center', alignItems: 'center', flex: 1, paddingRight: 20 }}
            >
              {answer.text}
            </div>
          </Row>
        </div>
      ) : (
        <div
          type="text "
          key={answerIndex}
          className={`${styles.answerButton} flex flex-1 ml-4`}
          onClick={() => onClickAnswer(qItem, answerIndex)}
          style={{ cursor: 'pointer' }}
        >
          <Row style={{ marginLeft: 4, fontSize: 18, display: 'flex' }}>
            <div className={isSelected ? styles.mutilpleKeySelected : styles.mutilpleKey}>
              <strong>{alphabet[answerIndex]}</strong>
            </div>
            <div
              style={{ display: 'block', justifyContent: 'center', alignItems: 'center', flex: 1, paddingRight: 20 }}
            >
              {answer.text}
            </div>
          </Row>
        </div>
      );
    },
    [state.isPointed, onClickAnswer]
  );

  const renderQuestion = React.useCallback(
    (item, index) => {
      return (
        <div
          key={index}
          style={{
            color: specifications.QUESTION_COLOR,
            fontSize: specifications.QUESTION_FONT_SIZE,
            fontWeight: specifications.QUESTION_FONT_WEIGHT,
            margin: specifications.QUESTION_SPACE_BETWEEN_SENTENCES,
          }}
          className="mb-3"
        >
          {/* <b>{index + 1}</b>{'.'} {renderTitle(item)} */}
          <div style={{ fontWeight: 500 }}>
            <CircleTheNumberInTheText text={item.question} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {item.answers.map(renderAnswerItem(item, index))}
          </div>
        </div>
      );
    },
    [renderAnswerItem]
  );

  React.useEffect(() => {
    // Thêm selectedItem tới JSON
    const items = JSON.parse(question.questionJson);
    let questions = items.map((item) => {
      return { ...item, selectedItem: [] };
    });
    setState((prevState) => ({ ...prevState, questions }));
    return () => {
      setState({
        questions: [],
        isPointed: false,
        isDisabledSubmit: false,
        isDisabledRetry: true,
        videoVisible: false,
        userAnswers: [],
      });
    };
  }, [onRetry, question]);

  if (!state.questions) return null;

  return (
    <React.Fragment>
      <CardBody style={{ overflowY: 'auto', overflowX: 'hidden', padding: 0 }}>
        {/* {question?.questionText && (
              <div dangerouslySetInnerHTML={{ __html: question.questionText }} />
            )} */}
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

MC5.propTypes = {
  question: PropTypes.instanceOf(Object),
  history: PropTypes.instanceOf(Object),
  sessionId: PropTypes.string,
  classId: PropTypes.string,
};

export default MC5;
