/* eslint-disable quotes */
/* eslint-disable react/prop-types */
import React, { useCallback } from 'react';
import { CardFooter } from 'reactstrap';
import FooterIeltsMindset from 'components/FooterIeltsMindset';
import CardBody from 'reactstrap/lib/CardBody';
import * as specifications from '../../../constants/AdjustSpecifications';
import _ from 'lodash';

import DragItem from './DragItem';
import DropZone from './DropZone';

import styles from './styles.module.css';
import { useLocation, useParams } from 'react-router';
import queryString from 'query-string';
import { useSelector } from 'react-redux';
import * as functions from '../../../../../components/functions';
import { useDispatch } from 'react-redux';
import { FETCH_SCORE } from 'modules/IeltsMindsetModule/actions/types';

// const words = [
//   'tennis', 'taekwondo', 'gymnastics', 'chess', 'volleyball', 'horse-riding',
//   'basketball', 'table tennis', 'badminton', 'karate', 'skiing', 'judo', 'sailing',
//   'hiking', 'football', 'hockey', 'canoeing', 'swimming', 'fishing', 'boxing',
// ]

const DAD1 = ({ question, audio }) => {
  // const shuffle = React.useCallback((array) => {
  //   for (let i = array.length - 1; i > 0; i--) {
  //     const j = Math.floor(Math.random() * (i + 1));
  //     [array[i], array[j]] = [array[j], array[i]];
  //   }
  //   return array;
  // }, []);

  const [state, setState] = React.useState(() => {
    const stateModel = {
      submitted: false,
      words: [],
      question: [],
      answers: [],
    };
    const questionJson = JSON.parse(question.questionJson);
    const clonedQuestion = JSON.parse(JSON.stringify(questionJson));

    stateModel.question = clonedQuestion.map((q, index) => {
      // Những đáp án hiện sẵn trong cột thì không thêm vào.
      (q.switch === undefined || q.switch === false) && q.answers.forEach((a) => stateModel.words.push(a.answer));
      let listName = q.question;
      const itemIndex = questionJson.findIndex((x) => x.question === listName);
      if (itemIndex !== index) listName += index;
      // Cột nào có hiện sẵn đáp án thì thêm vào.
      stateModel[listName] = q.switch ? _.map(q.answers, 'answer') : [];
      return { ...q, listName };
    });
    _.shuffle(stateModel.words);
    return stateModel;
  });

  const renderItem = React.useCallback(
    (listName) => (item, index) => {
      // Tìm đối tượng có thuộc tính switch, thuộc tính này có từ AllType.
      const hasObjectSwitchProperty = _.find(state.question, { switch: true })?.answers;
      // Không tô màu thuộc tính này, vì đây là mặc định.
      const notInteractWithThisObject = hasObjectSwitchProperty && _.some(hasObjectSwitchProperty, { answer: item });
      const customStyles = { color: 'black' };

      if (state.submitted) {
        const correctList = state.question.find((x) => x.listName === listName)?.answers;
        const isCorrect = correctList?.findIndex((x) => x.answer === item) > -1;
        customStyles.color = notInteractWithThisObject ? '' : isCorrect ? 'green' : 'red';
      }

      return (
        <DragItem
          key={index}
          style={customStyles}
          // className={styles.item}
          // Nếu đối tượng là text, đề bài thì không cho kéo.
          disable={notInteractWithThisObject ? true : state.submitted}
          payload={{ text: item, listName }}
        >
          <span
            style={{
              padding: '3px 10px',
              borderRadius: specifications.Radius_3,
              backgroundColor: specifications.BACKGROUND_DROP,
              fontWeight: specifications.FONTWEIGHT,
              display: 'flex',
              justifyContent: 'center',
              margin: 5,
              fontSize: specifications.FONTSIZE,
              border: specifications.DOTTED_Black,
            }}
          >
            {item}
          </span>
        </DragItem>
      );
    },
    [state.question, state.submitted]
  );

  const onDrop = React.useCallback(
    (listName) => (item, monitor) => {
      if (listName === item.payload.listName) return;

      const fromListName = item.payload.listName;
      const toListName = listName;

      setState((prevState) => {
        const stateModel = {
          [fromListName]: prevState[fromListName],
          [toListName]: prevState[toListName],
        };

        const itemIndex = stateModel[fromListName].findIndex((x) => x === item.payload.text);

        const [removedItem] = stateModel[fromListName].splice(itemIndex, 1);

        stateModel[toListName].unshift(removedItem);

        return {
          ...prevState,
          ...stateModel,
        };
      });
    },
    []
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
          question: state,
        }),
        studentId: StudentId,
        takeExamTime: takeExamTime,
        duration: 0,
      };
      // Gởi
      functions
        .postAnswerToAPI(result)
        .then((response) => console.log('Send DD1 answers: success'))
        .catch((error) => console.log('Send DD1 answers', error));
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
    const { answers, question } = state;
    // Nếu switch = true thì loại bỏ, vì nó thuộc phần đề. Và filter xóa nó khỏi mảng tạm.
    const listGroup = question.map((x) => !x.switch && x.question).filter((x) => x !== false);
    let listWord = []; // Lưu mảng câu hỏi

    for (const group of listGroup) {
      const answerLists = question.find((x) => x.question === group).answers.map((x) => x.answer);
      listWord.push(...answerLists);

      state[group].forEach((element) => {
        const isCorrect = answerLists.includes(element);
        answers.push({ answer: element, isCorrect });
      });
    }

    setState((prevState) => ({ ...prevState, submitted: true }));
    postAnswer(answers, listWord, state);
  }, [postAnswer, state]);

  const onRetry = React.useCallback(() => {
    const wordList = [];
    const stateModel = { submitted: false };
    state.question.forEach((q) => {
      // Cột nào có hiện sẵn đáp án thì thêm vào.
      stateModel[q.listName] = q.switch ? _.map(q.answers, 'answer') : [];
      // Những đáp án hiện sẵn trong cột thì không thêm vào.
      (q.switch === undefined || q.switch === false) && q.answers.forEach((a) => wordList.push(a.answer));
    });
    stateModel.words = wordList;
    setState((prevState) => ({ ...prevState, ...stateModel, answers: [] }));
  }, [state.question]);

  const renderDropZone = React.useCallback(
    (item, index) => {
      const { listName } = item;

      let classes = `${styles.container} ${styles.columnContainer} flex-column`;

      if (index < state.question.length) {
        classes += ` ${styles.centerColumn}`;
      }

      return (
        <DropZone key={index} className={classes} onDrop={onDrop(listName)}>
          <div className={styles.columnHeader}>{item.question}</div>
          {state[listName]?.map(renderItem(listName))}
        </DropZone>
      );
    },
    [onDrop, renderItem, state]
  );

  React.useEffect(() => {
    onRetry();
  }, [question, onRetry]);

  // const isDisabledSubmit = state.words.length > 0 || state.submitted;

  return (
    <React.Fragment>
      <CardBody style={{ overflowY: 'auto', padding: 0 }}>
        {!state.submitted ? (
          <DropZone
            onDrop={onDrop('words')}
            className={styles.wordContainer}
            style={{ display: 'flex', justifyContent: 'center', color: '#fff' }}
          >
            {_.shuffle(state.words).map(renderItem('words'))}
          </DropZone>
        ) : (
          <div className={styles.wordContainer}></div>
        )}
        <div
          className={`${styles.container} ${styles.table}`}
          style={{ fontSize: 18, fontWeight: 600, color: 'black' }}
        >
          {state.question.map(renderDropZone)}
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
export default DAD1;
