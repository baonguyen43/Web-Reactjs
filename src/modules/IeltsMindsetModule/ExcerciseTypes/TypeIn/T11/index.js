/* eslint-disable react/prop-types */
import React, { Fragment, useCallback } from 'react';
// import styles from './styles.module.css';
import { Input, Form } from 'antd';
import CardBody from 'reactstrap/lib/CardBody';
import CardFooter from 'reactstrap/lib/CardFooter';
import FooterIeltsMindset from 'components/FooterIeltsMindset';
import CircleTheNumberInTheText from 'modules/IeltsMindsetModule/components/CircleTheNumberInTheText';
import * as specifications from '../../../constants/AdjustSpecifications';

import * as functions from '../../../../../components/functions';
import { useLocation, useParams } from 'react-router';
import queryString from 'query-string';
import { useSelector, useDispatch } from 'react-redux';
import { FETCH_SCORE } from 'modules/IeltsMindsetModule/actions/types'

// const qArray = [
//   {
//     id: 1, questions: [
//       { id: 1, label: 'Alice works on (1) #', answers: ['a farm'], input: '', isCorrect: false },
//       { id: 2, label: '- grows (2) #', answers: ['fruit'], input: '', isCorrect: false },
//       { id: 3, label: '- keeps (3) #, ducks and cows', answers: ['chicken'], input: '', isCorrect: false },
//       { id: 4, label: '- worse part of job – going out in winter to feed (4) #', answers: ['the animals', 'animals'], input: '', isCorrect: false },
//     ]
//   },
//   {
//     id: 2, questions: [
//       { id: 1, label: 'Wei Long works as a (9) #', answers: ['businessman'], input: '', isCorrect: false },
//       { id: 2, label: '- graduated in (10) #', answers: ['information technology'], input: '', isCorrect: false },
//       { id: 3, label: '- ambition – earn living through (11) #', answers: ['trade'], input: '', isCorrect: false },
//       { id: 4, label: '- has own (12) #', answers: ['small company'], input: '', isCorrect: false },
//     ]
//   }
// ]

const TypeIn11 = ({ question, audio }) => {
  const [state, setState] = React.useState({
    questions: [],
    answers: [],
    isPointed: false,
    videoVisible: false,
    isDisabledRetry: true,
    isDisabledSubmit: false,
  });
  const [form] = Form.useForm();
  React.useEffect(() => {
    let numbers = [];
    let questionsArray = []
    let questionJson = [];
    questionJson = JSON.parse(question.questionJson);
    questionJson.forEach(element => {
      numbers.push(element.group);
    });

    let uniqueNumbers = [...new Set(numbers)];
    uniqueNumbers.forEach(number => {
      questionsArray.push({ questions: questionJson.filter(x => x.group === number) });
    });

    let questions = questionsArray.map((q) => {
      let questions = q.questions.map((item) => {
        let answers = [];
        item.answers.forEach(itemAnswer => {
          answers.push({ correctAnswer: itemAnswer.answer.split('/'), isCorrect: false });
        })
        return { id: item.no, label: item.question, answers, input: '' }
      })
      return { questions }
    })
    setState((prevState) => ({ ...prevState, questions }))
    return () => {
      form.resetFields();
      setState({
        questions: [],
        answers: [],
        isPointed: false,
        videoVisible: false,
        isDisabledRetry: true,
        isDisabledSubmit: false,
      })
    }
  }, [form, question])

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
  const postAnswer = React.useCallback((answers, sentences, state) => {
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
        score: score,
        answers: answers,
        question: state
      }),
      studentId: StudentId,
      takeExamTime: takeExamTime,
      duration: 0,
    }
    // Gởi
    functions.postAnswerToAPI(result).then(response => console.log('Send T11 answers: success')).catch(error => console.log('Send T11 answers', error))
    // Cập nhật điểm.
    fetchIeltsMindsetScore(StudentId, params.sessionId, params.assignmentId, takeExamTime)
  }, [StudentId, fetchIeltsMindsetScore, params.assignmentId, params.sessionId, question.book, question.exercise, question.id, question.lesson, question.questionEntityName, question.subExercise, question.unit, takeExamTime])
  // #endregion

  const onSubmit = React.useCallback(() => {
    let answers_post = [];
    setState((prevState) => ({ ...prevState, isPointed: true, isDisabledSubmit: true, isDisabledRetry: false }))
    // eslint-disable-next-line array-callback-return
    state.questions.map((x, i) => {
      x.questions.map((xa, ia) => {
        if (xa.label.includes('#')) {
          // eslint-disable-next-line array-callback-return
          xa.answers.map((xb, ib) => {
            answers_post.push({ isCorrect: xb.isCorrect, answer: xb.answer ?? '', correctAnswers: xb.correctAnswer })
          })
        } return null


      })
    })
    state.answers = answers_post
    postAnswer(state.answers, state.answers, state)
  }, [postAnswer, state])

  const onRetry = React.useCallback(() => {
    setState((prevState) => ({ ...prevState, isPointed: false, isDisabledSubmit: false, isDisabledRetry: true }))
  }, [])

  const onHandleInput = React.useCallback((item) => {
    const input = item.e.target.value;
    if (item.input === 'title') {
      const { answers } = state.questions[item.questionIndex].questions[0];
      answers[item.itemIndex].isCorrect = answers[item.itemIndex].correctAnswer.includes(input)
      answers[item.itemIndex].answer = input;
    }
    else {
      const { answers } = state.questions[item.questionIndex].questions[item.itemIndex];
      answers[item.inputIndex].isCorrect = answers[item.inputIndex].correctAnswer.includes(input);
      answers[item.inputIndex].answer = input;
    }
    setState((prevState) => {
      return ({
        ...prevState, questions: state.questions
      })
    })
  }, [state.questions])
  const RenderInput = useCallback((props) => {
    return (
      <Form.Item name={`${props.questionIndex}_${props.index}`}>
        <TextArea 
          disabled={props.disabled}
          onChange={props.onInputChange}
          autoSize={{ minRows: 1, maxRows: 2 }}
          style={{
            fontSize: specifications.FONTSIZE,
            width: 200,
            padding: 3,
            fontWeight: specifications.FONTWEIGHT,
            border: specifications.BORDER,
            borderBottom: specifications.DOTTED_Black,
            boxShadow: specifications.BOXSHADOW,
            borderRadius: specifications.RADIUS,
            display: specifications.DISPLAY_BLOCK,
            color: props.color ? props.color : specifications.ANSWER_COLOR,
            backgroundColor: specifications.BACKGROUND_WHITE
            // backgroundColor: props.backgroundColor ? props.backgroundColor : 'rgba(0, 0, 0, 0.0)',
          }} />
      </Form.Item>
    )
  }, [])
  const { TextArea } = Input;
  if (!state.questions) return null;

  return (
    <Fragment>
      <CardBody style={{ overflowY: 'auto', padding: 0 }}>
        <div style={{ display: 'flex', flex: 1, flexdireaction: 'row', marginBottom: 20 }}>
          {state.questions.map((question, questionIndex) => {

            let backgroundColor = 'lightgreen';
            let borderRight = questionIndex < state.questions.length - 1 && '1px solid black';

            const title = question.questions[0].label.trim().split('#');
            const titleAnswers = question.questions[0].answers;

            return (
              <div key={questionIndex} style={{ flex: 1, borderRight, borderBottom: '1px solid black', borderTop: '1px solid black' }}>
                <Form form={form}>
                  <div style={{ flex: 7 }}>
                    <p style={{ borderBottom: '1px solid black', padding: '5px 10px', fontWeight: '700', backgroundColor, textAlign: 'center' }}>
                      <span style={{
                        color: specifications.QUESTION_COLOR,
                        fontSize: specifications.QUESTION_FONT_SIZE,
                        fontWeight: 'bold',
                        margin: specifications.QUESTION_SPACE_BETWEEN_SENTENCES,
                      }}>
                        {title.map((text, itemIndex) => {
                          const isCorrectTitle = titleAnswers[itemIndex]?.isCorrect;
                          return (
                            itemIndex < title.length - 1 ?
                              <React.Fragment key={itemIndex}>
                                <span style={{ lineHeight: specifications.Line_height }}>
                                  <CircleTheNumberInTheText text={text} />
                                </span>
                                <RenderInput
                                  index={itemIndex}
                                  questionIndex={questionIndex}
                                  disabled={state.isPointed}
                                  backgroundColor={state.isPointed && '#F0F0F1'}
                                  color={state.isPointed ? isCorrectTitle ? 'green' : 'red' : ''}
                                  onInputChange={(e,) => onHandleInput({ e, questionIndex, itemIndex, input: 'title' })} />
                              </React.Fragment> :
                              <span style={{ lineHeight: specifications.Line_height }}>
                                <CircleTheNumberInTheText key={itemIndex} text={text} />
                              </span>
                          )
                        })}
                      </span>
                    </p>
                    {question?.questions.map((item, itemIndex) => {
                      const labelItem = item.label.trim().split('#');
                      return (
                        <React.Fragment key={itemIndex}>
                          {itemIndex > 0 &&
                            <p style={{ padding: ' 0 10px' }}>
                              <span style={{
                                color: specifications.QUESTION_COLOR,
                                fontSize: specifications.QUESTION_FONT_SIZE,
                                fontWeight: specifications.QUESTION_FONT_WEIGHT,
                                margin: specifications.QUESTION_SPACE_BETWEEN_SENTENCES,
                              }}>{labelItem.map(
                                (text, i) => {
                                  return (
                                    i < labelItem.length - 1 ?
                                      <React.Fragment key={i}>
                                        <span style={{ lineHeight: specifications.Line_height }}>
                                          <CircleTheNumberInTheText text={text} />
                                        </span>
                                        <RenderInput
                                          index={itemIndex}
                                          questionIndex={questionIndex}
                                          disabled={state.isPointed}
                                          backgroundColor={state.isPointed && '#F0F0F1'}
                                          color={state.isPointed ? item.answers[i].isCorrect ? 'green' : 'red' : ''}
                                          onInputChange={(e) => onHandleInput({ e, questionIndex, itemIndex, input: 'body', inputIndex: i })} />
                                      </React.Fragment> :
                                      <CircleTheNumberInTheText key={i} text={text} />
                                  )
                                }
                              )}</span>
                            </p>
                          }
                        </React.Fragment>
                      )
                    })}

                  </div>
                </Form>
              </div>
            )
          })}
        </div>
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
  )
};
export default TypeIn11;