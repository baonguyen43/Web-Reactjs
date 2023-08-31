/* eslint-disable react/prop-types */
import React, { useCallback } from 'react';
// import styles from './styles.module.css';
import { Form, Input } from 'antd';
import {
  CloseOutlined
} from '@ant-design/icons';
import CardBody from 'reactstrap/lib/CardBody';
import CardFooter from 'reactstrap/lib/CardFooter';
import FooterIeltsMindset from 'components/FooterIeltsMindset';
import * as specifications from '../../../constants/AdjustSpecifications';
import * as functions from '../../../../../components/functions';
import { useLocation, useParams } from 'react-router';
import queryString from 'query-string';
import { useSelector, useDispatch } from 'react-redux';
import { FETCH_SCORE } from 'modules/IeltsMindsetModule/actions/types'

// const questionsArray = [
//   { 'id': 1, label: 'Reptiles', answers: ['Snake', 'crocodile'], inputArray: [], bgc: '81C707', tempInput: '' },
//   { 'id': 2, label: 'Insects', answers: ['Ant', 'Butterfly'], inputArray: [], bgc: '02ACCF', tempInput: '' },
//   { 'id': 3, label: 'Mammals', answers: ['Dolphin', 'Dog', 'Tiger', 'Kangaroo'], inputArray: [], bgc: '0276C1', tempInput: '' },
//   { 'id': 3, label: 'Birds', answers: ['Eagle'], inputArray: [], bgc: '0276C1', tempInput: '' },
// ]

const TypeIn10 = ({ question, audio }) => {
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
    let questionJson = JSON.parse(question.questionJson);

    let questions = questionJson.map((q, i) => {
      let answers = [];
      q.answers.forEach(item => {
        answers.push(item.answer)
      })
      return { id: q.no, label: q.question, answers, inputArray: [], tempInput: '' }
    })
    setState((prevState) => ({ ...prevState, questions }))
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
    functions.postAnswerToAPI(result).then(response => console.log('Send T10 answers: success')).catch(error => console.log('Send T10 answers', error))
    // Cập nhật điểm.
    fetchIeltsMindsetScore(StudentId, params.sessionId, params.assignmentId, takeExamTime)
  }, [StudentId, fetchIeltsMindsetScore, params.assignmentId, params.sessionId, question.book, question.exercise, question.id, question.lesson, question.questionEntityName, question.subExercise, question.unit, takeExamTime])
  // #endregion

  const onSubmit = React.useCallback(() => {
    let answer = []
    let answers_isCorrect = []
    // eslint-disable-next-line array-callback-return
    state.questions.map((value, index) => {
      value.inputArray.map((x, i) => {
        return answer.push({ answers: x.inputText, isCorrect: x.isCorrect, })
      })
      value.answers.map((x, i) => {
        return answers_isCorrect.push({ answers_isCorrect: x })
      })
    })
    state.answer = answer
    postAnswer(state.answer, answers_isCorrect, state)

    setState((prevState) => ({ ...prevState, isPointed: true, isDisabledSubmit: true, isDisabledRetry: false }))

  }, [postAnswer, state])

  const onRetry = React.useCallback(() => {
    setState((prevState) => ({ ...prevState, isPointed: false, isDisabledSubmit: false, isDisabledRetry: true }))
  }, [])

  const onHandleInput = React.useCallback((e, index) => {
    let tempInput = e.target.value;
    setState((prevState) => {
      const { questions } = prevState;
      questions[index].tempInput = tempInput;
      return ({
        ...prevState, questions
      })
    })
  }, [])
  const onHandleDelete = React.useCallback((item, questionIndex) => {
    setState((prevState) => {
      const { questions } = prevState;
      questions[questionIndex].inputArray = questions[questionIndex].inputArray.filter(x => x.id !== item.id);
      let obj = questions[questionIndex].inputArray.find(x => x.inputText.trim().toLowerCase() === item.inputText.trim().toLowerCase())
      if (item.isCorrect && obj) {
        let inputIndex = questions[questionIndex].inputArray.findIndex(x => x.inputText.trim().toLowerCase() === item.inputText.trim().toLowerCase())
        questions[questionIndex].inputArray[inputIndex].isCorrect = true;
        questions[questionIndex].inputArray[inputIndex].isDuplicate = false;
      }
      return ({
        ...prevState, questions
      })
    })
  }, [])

  const onHandleSubmit = React.useCallback((index) => {
    let isEmpty = state.questions[index].tempInput;
    if (!isEmpty) {
      return;
    }
    setState((prevState) => {
      const { questions } = prevState;
      let { tempInput, inputArray, answers } = questions[index];
      let input = {
        id: inputArray.length,
        inputText: tempInput,
        isCorrect: false,
        isDuplicate: false
      }
      let isDuplicateText = inputArray.some(arr => arr.inputText.trim().toLowerCase() === tempInput.trim().toLowerCase());
      if (isDuplicateText) {
        input.isDuplicate = true;
      }
      if (!input.isDuplicate) {
        let isCorrectAnswer = answers.some(arr => arr.trim().toLowerCase() === tempInput.trim().toLowerCase());
        if (isCorrectAnswer) {
          input.isCorrect = true;
        }
      }
      inputArray.push(input);
      questions.forEach(q => {
        q.tempInput = ''
      });
      return ({
        ...prevState, questions
      })
    })
    let input = `input${index}`;
    form.setFieldsValue({
      [input]: ''
    })
    form.resetFields()
  }, [form, state.questions])


  if (!state.questions) return null;

  return (
    <>
      <CardBody>
        <div style={{ display: 'flex', flex: 1, flexdireaction: 'row', marginBottom: 20 }}>
          {state.questions.map((question, i) => {
            const inputArray = state.questions.reduce((accumulator, currentValue) => accumulator + currentValue.inputArray.length, 0)
            const number_answers = state.questions.reduce((accumulator, currentValue) => accumulator + currentValue.answers.length, 0)


            // let backgroundColor = state.isPointed && question.inputArray.length === 0 ? 'red' : 'lightgreen'; khi cột trống k làm bài . Thì backgour sáng đỏ ( Bỏ )
            //  let labelColor = state.isPointed && question.inputArray.length === 0 && 'white'; hi cột trống k làm bài . Thì color trắng ( Bỏ )
            let borderRight = i < state.questions.length - 1 && '1px solid black';
            return (
              <div key={i} style={{ flex: 1, textAlign: 'center', backgroundColor: '#EBEBEB', borderRight, borderBottom: '1px solid black', borderTop: '1px solid black' }}>
                <div style={{ flex: 7 }}>
                  <p style={{ borderBottom: '1px solid black', padding: 5, fontWeight: '700', backgroundColor: 'lightgreen', marginBottom: 5 }}> {question.label}</p>
                  {question?.inputArray.map((item, index) => {
                    let textColor = state.isPointed ? item.isCorrect ? '#52c41a' : '#f5222d' : 'black';
                    let border = state.isPointed ? item.isCorrect ? '1px solid #52c41a' : '1px solid #f5222d' : '1px solid #a09f9f';
                    let background = state.isPointed ? item.isCorrect ? '#f6ffed' : '#fff1f0' : '#fafafa';
                    return (
                      <React.Fragment key={index}>
                        <p style={{
                          display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: '0 5px 5px 5px', padding: '0 5px', flex: 1,
                          backgroundColor: background, border: border, color: textColor, borderRadius: 3
                        }}>
                          <span style={{ color: textColor, wordBreak: 'break-all' }}>{item.inputText}</span>

                          {!state.isPointed && <CloseOutlined onClick={() => onHandleDelete(item, i)} style={{ fontSize: 14 }} />}
                        </p>
                      </React.Fragment>
                    )
                  })}
                </div>
                <Form form={form} onFinish={() => onHandleSubmit(i)} style={{ display: 'flex', flex: 3, flexDirection: 'row', justifyContent: 'center', }}>
                  <Form.Item name={`input${i}`}>
                    <Input
                      //  prefix={<FormOutlined />} 
                      disabled={state.isPointed || inputArray > number_answers - 1 ? true : false} onKeyPress={(e) => { e.key === 'Enter' && e.preventDefault(); }} onChange={(e) => onHandleInput(e, i)}
                      style={{
                        color: specifications.ANSWER_COLOR,
                        border: specifications.BORDER,
                        borderBottom: specifications.DOTTED_Black,
                        boxShadow: specifications.BOXSHADOW,
                        borderRadius: specifications.RADIUS,
                        textAlign: specifications.text_Align,
                      }}
                      placeholder="Enter your answer"
                      onPressEnter={() => onHandleSubmit(i)}
                    />

                  </Form.Item>
                  {/* <Button onClick={() => onHandleSubmit(i)} style={{ height: 32 }}><CheckOutlined /></Button> */}
                </Form>
              </div>
            )
          })}
        </div>
      </CardBody>
      <CardFooter>
        <FooterIeltsMindset
          isDisabledSubmit={state.isDisabledSubmit}
          isDisabledRetry={state.isDisabledRetry}
          onSubmit={onSubmit}
          onRetry={onRetry}
          audioUrl={audio}
        />
      </CardFooter>
    </>
  )
};

export default TypeIn10;
