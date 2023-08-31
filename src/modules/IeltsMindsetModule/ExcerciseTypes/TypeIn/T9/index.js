import React, { Fragment, useCallback } from 'react';
import PropTypes from 'prop-types';
import styles from './styles.module.css';
import { message, Input, Form } from 'antd';
import CardBody from 'reactstrap/lib/CardBody';
import CardFooter from 'reactstrap/lib/CardFooter';
import FooterIeltsMindset from 'components/FooterIeltsMindset';
import * as specifications from '../../../constants/AdjustSpecifications';
import CircleTheNumberInTheText from 'modules/IeltsMindsetModule/components/CircleTheNumberInTheText';

import * as functions from '../../../../../components/functions';
import { useLocation, useParams } from 'react-router';
import queryString from 'query-string';
import { useSelector, useDispatch } from 'react-redux';
import { FETCH_SCORE } from 'modules/IeltsMindsetModule/actions/types';

// const questions = [
//   [{ label: '' }, { label: 'Subject' }, { label: 'Verb' }, { label: 'Object' }],
//   [{ label: '(1)' }, { label: '#', correctAnswer: 'My name' }, { label: '#', correctAnswer: 'Is' }, { label: '#', correctAnswer: 'Adam', }],
//   [{ label: '(2)' }, { label: '#', correctAnswer: 'I', }, { label: '#', correctAnswer: 'Do', }, { label: '#', correctAnswer: 'Some exercises', }],
//   [{ label: '(3)' }, { label: '#', correctAnswer: 'I', }, { label: '#', correctAnswer: 'Have', }, { label: '#', correctAnswer: 'My breakfast', }],
// ]

const TypeIn9 = ({ question, audio }) => {
  const [form] = Form.useForm();
  const [state, setState] = React.useState({
    questions: [],
    answers: [],
    isPointed: false,
    videoVisible: false,
    isDisabledRetry: true,
    isDisabledSubmit: false,
  });
  React.useEffect(() => {
    let questionJson = [];
    questionJson = JSON.parse(question.questionJson);
    form.resetFields();
    setState((prevState) => ({
      ...prevState,
      questions: JSON.parse(JSON.stringify(questionJson.questionsArray)),
      isPointed: false,
      isDisabledSubmit: false,
      isDisabledRetry: true,
    }));
  }, [form, question]);

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
  const postAnswer = React.useCallback(
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
          score: score,
          answers: answers,
          question: state,
        }),
        studentId: StudentId,
        takeExamTime: takeExamTime,
        duration: 0,
      };
      // Gởi
      functions
        .postAnswerToAPI(result)
        .then((response) => console.log('Send T9 answers: success'))
        .catch((error) => console.log('Send T9 answers', error));
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
      state,
      takeExamTime,
    ]
  );
  // #endregion

  const onSubmit = React.useCallback(() => {
    for (let i = 0; i < state.questions.length; i++) {
      for (let j = 0; j < state.questions.length; j++) {
        let label = state.questions[i][j]?.label;
        if (label && label === '#') {
          if (!state.questions[i][j].correctAnswer) {
            return message.error('Fields must be enter.');
          }
        }
      }
    }

    let answers_user = [];
    let number_correctAnswer = [];

    // eslint-disable-next-line array-callback-return
    state.questions.map((item, indexRow) => {
      // eslint-disable-next-line array-callback-return
      item.map((v, i) => {
        let isCorrect = false;
        if (v.correctAnswer !== '') {
          if (v.correctAnswer === undefined || typeof v.correctAnswer === 'undefined' || v.correctAnswer === ' ')
            return null;
          number_correctAnswer.push({
            arraycorrectAnswer: v.correctAnswer?.split('/').map((x) => x?.trim().toLowerCase()),
          });
          if (v.answer === undefined) return null;
          const answers = v.correctAnswer
            ?.replaceAll('&', '')
            ?.split('/')
            .map((x) => x?.trim().toLowerCase());
          const answersuse = v.answer;
          answers?.includes(answersuse?.trim().toLowerCase()) ? (isCorrect = true) : (isCorrect = false);
          answers_user.push({ isCorrect: isCorrect, answer: v.answer ?? '' });
        }
      });
    });
    state.answers = answers_user;
    postAnswer(state.answers, number_correctAnswer, state);

    setState((prevState) => ({
      ...prevState,
      isPointed: true,
      isDisabledSubmit: true,
      isDisabledRetry: false,
    }));
  }, [postAnswer, state]);

  const onRetry = React.useCallback(() => {
    setState((prevState) => ({
      ...prevState,
      isPointed: false,
      isDisabledSubmit: false,
      isDisabledRetry: true,
    }));
  }, []);

  const onChange = React.useCallback(
    (rowIndex, index) => (e) => {
      let input = e.target.value;
      setState((prevState) => {
        const { questions } = prevState;
        questions[rowIndex][index].answer = input;
        return { ...prevState, questions };
      });
    },
    []
  );

  const renderCheckBox = React.useCallback(
    (item, index, indexRow) => {
      let color = specifications.ANSWER_COLOR;
      if (state.isPointed && item.answer !== undefined) {
        let isCorrect = false;
        const answers = item.correctAnswer.replaceAll('&', '').split('/');
        answers.forEach((answer) => {
          if (answer.toLowerCase().trim() === item?.answer.toLowerCase().trim()) {
            isCorrect = true;
          }
        });
        color = isCorrect ? specifications.SUCCESS_OR_CORRECT : specifications.FAILED_OR_WRONG;
      }
      const inputWidth = `${item.correctAnswer.length * 12}px`;
      return (
        <Form.Item name={`${indexRow}_${index}`} noStyle>
          <Input
            style={{
              color,
              textAlign: 'center',
              maxWidth: 150,
              width: inputWidth,
              boxShadow: 'none',
              border: 'none',
              borderBottom: '1px dashed black',
              borderRadius: 0,
              padding: 0,
              marginLeft: '5px',
            }}
            disabled={state.isPointed}
            onChange={onChange(indexRow, index)}
          />
        </Form.Item>
      );
    },
    [onChange, state.isPointed]
  );

  const renderItem = React.useCallback(
    (values, indexRow) => {
      return values.map((item, index) => {
        // eslint-disable-next-line no-undef
        const Component = indexRow === 0 ? 'th' : 'td';

        // Flag variable
        let isHashMark = false;
        let stringAndHashMark = item.label?.trim().split('#');
        // Verify that the item has the only text or hash mark or both.
        if (stringAndHashMark?.length !== 0) {
          isHashMark = true;
        }

        const isNone = state.questions[0][0].label !== 'none';
        return isNone ? (
          <Component key={`Component-${index}`} style={{ textAlign: 'center' }}>
            {isHashMark ? (
              // renderCheckBox(item, index, indexRow):
              <span>
                {stringAndHashMark?.map((v, i) => {
                  return i < stringAndHashMark.length - 1 ? (
                    <React.Fragment key={i}>
                      <CircleTheNumberInTheText text={v} />
                      {renderCheckBox(item, index, indexRow)}
                    </React.Fragment>
                  ) : (
                    v
                  );
                })}
              </span>
            ) : (
              item.label
            )}
          </Component>
        ) : (
          index !== 0 && (
            <Component key={`Component-${index}`} style={{ textAlign: 'center' }}>
              {isHashMark ? (
                <span>
                  {stringAndHashMark.map((v, i) => {
                    return i < stringAndHashMark.length - 1 ? (
                      <React.Fragment>
                        <CircleTheNumberInTheText text={v} />
                        {renderCheckBox(item, index, indexRow)}
                      </React.Fragment>
                    ) : (
                      v
                    );
                  })}
                </span>
              ) : (
                item.label
              )}
            </Component>
          )
        );
      });
    },
    [renderCheckBox, state.questions]
  );

  const renderContent = React.useCallback(() => {
    return state.questions.map((item, index) => {
      return <tr key={`tr-${index}`}>{renderItem(item, index)}</tr>;
    });
  }, [renderItem, state.questions]);

  if (!state.questions) return null;

  return (
    <Fragment>
      <CardBody style={{ overflowY: 'auto', padding: 0 }}>
        <Form form={form} labelCol={{ span: 6 }} wrapperCol={{ span: 12 }}>
          <table className={styles.table}>
            <tbody>{renderContent()}</tbody>
          </table>
        </Form>
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
    </Fragment>
  );
};

TypeIn9.propTypes = {
  question: PropTypes.instanceOf(Object),
  audio: PropTypes.string,
};

export default TypeIn9;
