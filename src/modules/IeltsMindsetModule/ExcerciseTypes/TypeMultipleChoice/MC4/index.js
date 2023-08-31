import React, { Fragment, useCallback } from 'react';
import PropTypes from 'prop-types';
import { CardFooter } from 'reactstrap';
import styles from './styles.module.css';
import FooterIeltsMindset from 'components/FooterIeltsMindset';
import Checkbox from '@material-ui/core/Checkbox';
import CardBody from 'reactstrap/lib/CardBody';
import * as specifications from '../../../constants/AdjustSpecifications';
import { message } from 'antd';
import { useLocation, useParams } from 'react-router';
import queryString from 'query-string';
import { useSelector, useDispatch } from 'react-redux';
import * as functions from '../../../../../components/functions';
import CircleTheNumberInTheText from 'modules/IeltsMindsetModule/components/CircleTheNumberInTheText';
import { FETCH_SCORE } from 'modules/IeltsMindsetModule/actions/types';

// const questions = [
//   [{ label: 'Opinion' }, { label: 'Samantha' }, { label: 'Tom' }, { label: 'Sarah' }],
//   [{ label: '1. Joining the gym is too expensive' }, { label: '#', isCorrect: true }, { label: '#', isCorrect: true }, { label: '#' }],
//   [{ label: "2. It's more fun to excercise with other people" }, { label: '#' }, { label: '#' }, { label: '#', isCorrect: true }],
//   [{ label: "3. It's more fun to excercise with other people" }, { label: '#', isCorrect: true }, { label: '#' }, { label: '#', isCorrect: true }],
// ]

const Multiple4 = ({ question, audio }) => {
  const [state, setState] = React.useState({
    questions: [],
    // selectedArray: [],
    isPointed: false,
    videoVisible: false,
    isDisabledRetry: true,
    isDisabledSubmit: false,
    answers: [],
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
    (answers, sentences) => {
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
        .then((response) => console.log('Send MC4 answers: success'))
        .catch((error) => console.log('Send MC4 answers', error));
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
    // #region Kiểm tra làm đủ số câu hỏi chưa?
    const total = state.questions.length;
    let count = 0;
    for (let i = 1; i < total; i++) {
      count += state.questions[i].some((x) => x.checked) ? 1 : 0;
    }

    if (count < total - 1) {
      message.error(specifications.NOTIFICATION_INCOMPLETED_EXERCISE);
      return;
    }
    // #endregion

    const virtualQuestions = []; // Lấy mảng các câu hỏi, không lấy dòng đầu tiên trong mảng

    // Lấy đáp án và câu trả lời.
    state.questions.map((item, questionIndex) => {
      if (questionIndex === 0) return false;
      virtualQuestions.push(item);
      return item.some(
        (element, index) =>
          element.label === '#' &&
          element.checked &&
          state.answers.push({ answer: state.questions[0][index].label, isCorrect: element.isCorrect })
      );
    });

    setState((prevState) => ({
      ...prevState,
      isPointed: true,
      isDisabledSubmit: true,
      isDisabledRetry: false,
    }));
    postAnswer(state.answers, virtualQuestions);
  }, [postAnswer, state.answers, state.questions]);

  const onRetry = React.useCallback(() => {
    setState((prevState) => ({
      ...prevState,
      isPointed: false,
      isDisabledSubmit: false,
      isDisabledRetry: true,
      answers: [],
    }));
  }, []);

  const onChange = React.useCallback(
    (rowIndex) => (e) => {
      const payload = {
        checked: e.target.checked,
        index: e.target.value,
      };
      setState((prevState) => {
        const { questions } = prevState;
        questions[rowIndex][payload.index].checked = payload.checked;
        return { ...prevState, questions };
      });
    },
    []
  );

  const renderCheckBox = React.useCallback(
    (item, index, indexRow) => {
      const { questions } = state;
      const checked = questions[indexRow][index].checked; // Kiểm tra checked còn lưu trong useState không?
      let color = '#1675BD';
      if (state.isPointed) {
        color = item.checked ? (item.isCorrect ? 'green' : 'red') : 'gray';
      }
      return (
        <Checkbox
          style={{ color }}
          disabled={state.isPointed}
          onChange={onChange(indexRow)}
          value={index}
          checked={checked ? true : false}
        />
      );
    },
    [onChange, state]
  );

  const renderItem = React.useCallback(
    (values, indexRow) => {
      return values.map((item, index) => {
        const Component = indexRow === 0 ? 'th' : 'td';
        const isCheckBox = item.label === '#';
        const isStyleCenter = Component === 'th' || isCheckBox;
        const text = indexRow === 0 && item.label === ' ' ? 'Statements' : item.label;
        const itemContent = isCheckBox ? (
          renderCheckBox(item, index, indexRow)
        ) : (
          <CircleTheNumberInTheText text={text} />
        );
        return (
          <Component
            key={`Component-${index}`}
            style={{
              textAlign: isStyleCenter ? 'center' : '',
              color: specifications.QUESTION_COLOR,
              fontSize: specifications.QUESTION_FONT_SIZE,
              fontWeight: indexRow === 0 ? 'bold' : specifications.QUESTION_FONT_WEIGHT,
              margin: specifications.QUESTION_SPACE_BETWEEN_SENTENCES,
              padding: indexRow === 0 && 0,
              position: indexRow === 0 && 'sticky', // Fix header
              top: indexRow === 0 && 0,
              backgroundColor: indexRow === 0 && 'white',
              borderTop: indexRow === 0 && 'none',
              zIndex: indexRow === 0 && 1,
            }}
          >
            {indexRow === 0 ? (
              <div style={{ padding: 8, borderTop: '2px solid #1675BD' }}>{itemContent}</div> // Xử lý border trống khi header fixed
            ) : (
              itemContent
            )}
          </Component>
        );
      });
    },
    [renderCheckBox]
  );

  const renderContent = React.useCallback(() => {
    return state.questions.map((item, index) => {
      return <tr key={`tr-${index}`}>{renderItem(item, index)}</tr>;
    });
  }, [renderItem, state.questions]);

  React.useEffect(() => {
    setState((prevState) => ({
      ...prevState,
      questions: JSON.parse(question.questionJson).questionsArray,
    }));
    return () => {
      setState((prevState) => ({
        ...prevState,
        questions: [],
        // selectedArray: [],
        isPointed: false,
        videoVisible: false,
        isDisabledRetry: true,
        isDisabledSubmit: false,
        answers: [],
      }));
    };
  }, [question.questionJson]);

  if (!state.questions) return null;

  return (
    <Fragment>
      {/* <Row className='d-flex justify-content-center'>
        <Col className='d-initial justify-content-center'> */}
      <CardBody style={{ overflowY: 'auto', padding: 0 }}>
        <table className={styles.table}>
          <tbody>{renderContent()}</tbody>
        </table>
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
      {/* </Col>
      </Row> */}
    </Fragment>
  );
};

Multiple4.propTypes = {
  question: PropTypes.instanceOf(Object),
  history: PropTypes.instanceOf(Object),
  sessionId: PropTypes.string,
  classId: PropTypes.string,
  audio: PropTypes.string,
};

export default Multiple4;
