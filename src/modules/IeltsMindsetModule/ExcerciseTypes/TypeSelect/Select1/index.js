/* eslint-disable react/prop-types */
/* eslint-disable no-unused-expressions */
import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import styles from './styles.module.css';
import { CardBody, Card, CardFooter, Col, Row, CardTitle } from 'reactstrap';
import { Select, Form, Button } from 'antd';
import FooterIeltsMindset from 'components/FooterIeltsMindset';
import * as specifications from '../../../constants/AdjustSpecifications';

import { useLocation, useParams } from 'react-router';
import queryString from 'query-string';
import { useSelector, useDispatch } from 'react-redux';
import * as functions from '../../../../../components/functions';
import { FETCH_SCORE } from 'modules/IeltsMindsetModule/actions/types'
// import * as Colors from 'configs/color';
// import ReactHtmlParser from 'react-html-parser';

const Select1 = ({ question, audio }) => {

  const [state, setState] = React.useState({
    questions: null,
    answers: [],
    isPointed: false,
    isDisabledSubmit: false,
    isDisabledRetry: true,
    videoVisible: false,
    randomArray: []
  });

  // const inputTag = '#'

  const [form] = Form.useForm();

  const inputCount = React.useRef(0);
  const submitButton = React.useRef();


  const toggleState = React.useCallback((fieldName) => () => {
    setState((prevState) => ({
      ...prevState,
      [fieldName]: !prevState[fieldName],
    }));
  }, []);

  const onSubmit = React.useCallback(() => {
    submitButton.current?.click()
  }, [])

  const onRetry = React.useCallback(() => {
    form.resetFields();
    setState((preState) => ({ ...preState, isPointed: false, isDisabledRetry: true, isDisabledSubmit: false }))
  }, [form])

  const onPlayVideo = React.useCallback(() => {
    toggleState('videoVisible')();
  }, [toggleState])


  React.useEffect(() => {
    const randomArray = () => {
      if (!question) return null;
      const questionJson = JSON.parse(question.questionJson)
      // Tạo mảng random cho thẻ select
      let randomArray = [];

      questionJson.forEach((item, index) => {
        randomArray.push(item.text)
      })

      for (let i = 0; i < randomArray.length / 2; i++) {
        const randomIndex = Math.floor(Math.random() * randomArray.length);
        [randomArray[i], randomArray[randomIndex]] = [randomArray[randomIndex], randomArray[i]];
      }

      setState((preState) => ({
        ...preState, questions: questionJson, randomArray, isPointed: false,
      }))
    }
    randomArray();
    form.resetFields();
  }, [question, form])
  
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
        answers: answers,
        score: score,
        question: state
      }),
      studentId: StudentId,
      takeExamTime: takeExamTime,
      duration: 0,
    }
    // Gởi
    functions.postAnswerToAPI(result).then(response => console.log('Send S1 answers: success')).catch(error => console.log('Send S1 answers', error))
    // Cập nhật điểm.
    fetchIeltsMindsetScore(StudentId, params.sessionId, params.assignmentId, takeExamTime)
  }, [StudentId, fetchIeltsMindsetScore, params.assignmentId, params.sessionId, question.book, question.exercise, question.id, question.lesson, question.questionEntityName, question.subExercise, question.unit, takeExamTime])
  // #endregion

  // Khi hoàn thành các field
  const onFinish = React.useCallback((value) => {

    const { questions } = state;
    let checkAnswerArray = [];
    let Answer = [];
    questions.forEach((answer, indexAnswer) => {
      const isCorrect = answer.text === state.randomArray[value[indexAnswer]]
      checkAnswerArray.push(isCorrect)
      Answer.push({ id: indexAnswer, answers: state.randomArray[value[indexAnswer]], isCorrect: isCorrect }) // submit
    })

    questions.checkAnswerArray = checkAnswerArray;
    state.answers = Answer
    postAnswer(state.answers, state.answers, state)

    setState((preState) => ({ ...preState, questions, isPointed: true, isDisabledRetry: false, isDisabledSubmit: true }))
  }, [postAnswer, state])

  // Tạo thẻ select
  const contentSelect = React.useCallback(() => {
    return state.randomArray?.map((item, index) => {
      return (
        <Select.Option key={index}>{item}</Select.Option>
      )
    })
  }, [state.randomArray])

  // Dịch HTML
  const transform = React.useCallback(() => {
    let currentInputNo = 0;
    return (
      <span style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' }}>
        {state.questions.map((item, index) => {
          currentInputNo = inputCount.current;
          const maxInput = state.questions.length
          inputCount.current++;
          if (inputCount.current >= maxInput) {
            inputCount.current = 0;
          }
          return (
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', }} key={index}>
              <img src={item.image} alt='...' className={styles.img} />
              <Form.Item
                name={currentInputNo}
                style={{ display: 'inline-block', marginBottom: 0, }}
                rules={[{ required: true, message: 'Please choice the answer' },]}
              >
                <Select
                  bordered={false}
                  style={{
                    fontSize: specifications.FONTSIZE,
                    width: specifications.WIDTH,
                    fontWeight: specifications.FONTWEIGHT,
                    color: state.isPointed ? state.questions.checkAnswerArray[currentInputNo] ? '#2dce89' : '#e74c3c' : specifications.ANSWER_COLOR,
                    borderBottom: specifications.DOTTED_Black
                  }}
                  // disabled={state.isPointed}
                  size="sm"
                  showSearch
                  allowClear
                  // placeholder='---Select---'
                  filterOption={(input, option) =>
                    option.props.children
                      .toLowerCase()
                      .indexOf(input.toLocaleLowerCase()) >= 0
                  }
                // prefix={<PhoneOutlined />}
                >
                  {contentSelect()}
                </Select>
              </Form.Item>

            </div>
          )
        })}
      </span>
    )
  }, [state.questions, state.isPointed, contentSelect])

  const renderKeyWord = React.useCallback(() => {
    return state.randomArray.map((itemWord, index) => {
      return (
        <span style={{
          display: specifications.DISPLAY_BLOCK,
          fontSize: specifications.FONTSIZE,
          fontWeight: specifications.FONTWEIGHT,
          backgroundColor: specifications.ANSWER_BACKGROUND_COLOR,
          padding: specifications.PADDING,
          margin: specifications.MARGIN_TOP_BOTTOM,
          color: specifications.TEXT_WHITE,
          borderRadius: specifications.Radius_3
        }} key={index}>{itemWord}</span>
      )
    })

  }, [state.randomArray])

  const renderQuestion = React.useCallback(() => {
    return (
      <>
        <Row>
          <Form
            form={form}
            // ref={refForm}
            autoComplete="off"
            onFinish={onFinish}
            style={{ fontSize: 18, fontWeight: '500' }}
          >
            <span>
              {transform()}
            </span>
            <Form.Item style={{ display: 'none' }}>
              <Button ref={submitButton} id='submitButton' htmlType="submit"></Button>
            </Form.Item>

          </Form>
        </Row>
      </>
    );
  }, [form, onFinish, transform]);

  if (!state.questions) return null

  return (
    <Row className='flex flex-1 justify-content-center' style={{ margin: 0 }}>
      <Col className='d-initial justify-content-center'>
        <Card className='d-initial justify-content-center'>
          <CardBody className='ml-3' style={{ padding: 0 }}>
            <CardTitle className='ml-3'>
              <Row>
                <div>
                  {renderKeyWord()}
                </div>
              </Row>
            </CardTitle>
            {renderQuestion()}
            {state.videoVisible && (
              <Row className={styles.centeredRow}>
                <div className={styles['video-container']}>
                  <iframe title='video'
                    src="https://www.youtube.com/embed/tgbNymZ7vqY">
                  </iframe>
                </div>
              </Row>
            )}
          </CardBody>
          <CardFooter>
            <FooterIeltsMindset
              isDisabledSubmit={state.isDisabledSubmit}
              isDisabledRetry={state.isDisabledRetry}
              onSubmit={onSubmit}
              onRetry={onRetry}
              onPlayVideo={onPlayVideo}
              audioUrl={audio}
            />
          </CardFooter>
        </Card>
      </Col>
    </Row>
  )
};

Select1.propTypes = {
  question: PropTypes.instanceOf(Object),
  history: PropTypes.instanceOf(Object),
  sessionId: PropTypes.string,
  classId: PropTypes.string,
};

export default Select1;
