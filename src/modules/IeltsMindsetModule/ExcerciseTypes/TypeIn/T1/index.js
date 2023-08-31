/* eslint-disable no-unused-expressions */
import React, { Fragment, useCallback } from 'react';
import styles from './styles.module.css';
import { Input, CardBody, CardFooter } from 'reactstrap';
import { Form, Button } from 'antd';
import PropTypes from 'prop-types';
import FooterIeltsMindset from 'components/FooterIeltsMindset';
import CircleTheNumberInTheText from 'modules/IeltsMindsetModule/components/CircleTheNumberInTheText';
import * as specifications from '../../../constants/AdjustSpecifications';
import * as functions from '../../../../../components/functions';
import { useLocation, useParams } from 'react-router';
import queryString from 'query-string';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { FETCH_SCORE } from 'modules/IeltsMindsetModule/actions/types'

const TypeIn1 = ({ question, audio }) => {

  const FormItem = Form.Item;
  const submitButton = React.useRef();
  const refForm = React.useRef();
  const inputCount = React.useRef(0);
  const [form] = Form.useForm();

  const [state, setState] = React.useState({
    sentences: [],
    isDisabledInput: false,
    // isDisabledSubmit:false,
    isDisabledRetry: true,
    videoVisible: false,
    answers: [],
  });

  const toggleState = React.useCallback((fieldName) => () => {
    setState((prevState) => ({
      ...prevState,
      [fieldName]: !prevState[fieldName],
    }));
  }, []);

  const onPlayVideo = React.useCallback(() => {
    toggleState('videoVisible')();
  }, [toggleState])


  const onSubmit = React.useCallback(() => {
    submitButton.current?.click();
  }, [])

  const onRetry = React.useCallback(() => {
    form.resetFields();
    setState((preState) => ({ ...preState, isDisabledInput: false, isDisabledRetry: true, answers: [] }))
  }, [form])

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
        score: score,
        answers: answers,
        question: state,
      }),
      studentId: StudentId,
      takeExamTime: takeExamTime,
      duration: 0,
    }
    console.log(result)
    // Gởi
    functions.postAnswerToAPI(result).then(response => console.log('Send T1 answers: success')).catch(error => console.log('Send T1 answers', error))
    // Cập nhật điểm.
    fetchIeltsMindsetScore(StudentId, params.sessionId, params.assignmentId, takeExamTime)
  }, [StudentId, fetchIeltsMindsetScore, params.assignmentId, params.sessionId, question.book, question.exercise, question.id, question.lesson, question.questionEntityName, question.subExercise, question.unit, takeExamTime])
  // #endregion

  // Khi hoàn thành các field
  const onFinish = React.useCallback((value) => {
    let booleanArray = []
    let answers = []

    state.sentences.correctArray.forEach((item, index) => {
      let isCorrect = false;
      if (item.answer?.trim().toLowerCase() === value[index]?.trim().toLowerCase()) {
        isCorrect = true;
      }
      booleanArray.push(isCorrect)
      answers.push({ id: index, answer: value[index]?.trim().toLowerCase() ?? '', isCorrect })
    })

    state.sentences.booleanArray = booleanArray
    state.answers = answers
    setState((preState) => ({ ...preState, sentences: state.sentences, isDisabledInput: true, isDisabledRetry: false }))

    postAnswer(state.answers, state.sentences, state)
  }, [postAnswer, state])

  const transform = React.useCallback(() => {
    let currentInputNo = 0;

    return state.sentences.map((item, index) => {

      const elementArray = item.question.split(' ')

      return (
        <div key={index} style={{ display: 'flex', flexDirection: 'row' }}>
          {
            elementArray.map((itemSplit, indexSplit) => {
              if (itemSplit === '#') {
                currentInputNo = inputCount.current;
                const maxInput = state.sentences.sumAnswers
                inputCount.current++;
                if (inputCount.current >= maxInput) {
                  inputCount.current = 0;
                }
              }

              return (
                <div key={indexSplit} style={{ display: 'flex', flexDirection: 'row' }}>
                  {itemSplit === '#' ? (
                    <span>
                      <FormItem
                        className='ml-2 mr-2'
                        style={{ display: 'inline-block', marginBottom: 0 }}
                        name={currentInputNo}
                      // rules={[{ required: true, message: 'Please fill the answer' },]}
                      >
                        <span>
                          <Input
                            bordered={false}
                            autoComplete='off'
                            style={{
                              backgroundColor: specifications.BACKGROUND_WHITE,
                              fontSize: specifications.FONTSIZE,
                              display: specifications.DISPLAY,
                              height: specifications.HEIGHT,
                              width: specifications.WIDTH,

                              border: specifications.BORDER,
                              borderBottom: specifications.DOTTED_Black,
                              boxShadow: specifications.BOXSHADOW,
                              borderRadius: specifications.RADIUS,
                              color: state.isDisabledInput ? (state.sentences.booleanArray?.[currentInputNo]
                                ? specifications.SUCCESS_OR_CORRECT : specifications.FAILED_OR_WRONG) : specifications.ANSWER_COLOR,
                              fontWeight: specifications.FONTWEIGHT,
                            }}
                            disabled={state.isDisabledInput}
                            // onChange={(e) => onChange(e, index)}
                            id={currentInputNo}
                            className={!state.isDisabledInput ? styles.input : styles.checkInput}
                          />
                        </span>
                      </FormItem>
                    </span>
                  ) : (
                    <span key={index} className='ml-2 mt-2' style={{
                      color: specifications.QUESTION_COLOR,
                      fontSize: specifications.QUESTION_FONT_SIZE,
                      fontWeight: specifications.QUESTION_FONT_WEIGHT,
                      margin: specifications.QUESTION_SPACE_BETWEEN_SENTENCES,
                    }}>
                      {/* {itemSplit} */}
                      <CircleTheNumberInTheText text={itemSplit} />
                    </span>
                  )}
                </div>
              )
            })
          }
        </div>
      )
      // const type = state.sentences[0].type === 'RE_ORDER'

    })

  }, [state.sentences, state.isDisabledInput])

  React.useEffect(() => {
    let questionJson = JSON.parse(question.questionJson);
    const sentences = JSON.parse(JSON.stringify(questionJson))
    let correctArray = []
    let countAnswers = 0
    sentences.forEach((sentence) => {
      sentence.answers.forEach((item) => {
        correctArray.push(item);
        countAnswers++
      })
    })
    sentences.correctArray = correctArray
    sentences.sumAnswers = countAnswers
    setState((prevState) => ({ ...prevState, sentences }))
    onRetry()
  }, [onRetry, question])

  if (!state.sentences) return null;
  return (
    <Fragment>
      <CardBody style={{ overflowY: 'auto', padding: 0 }}>
        <Form
          autoComplete="off"
          form={form}
          ref={refForm}
          onFinish={onFinish}
          style={{ textAlign: 'justify', fontSize: 18 }}
        >
          <div style={{ columnCount: 2, }}>
            {transform()}
          </div>
          <FormItem>
            <Button style={{ display: 'none' }} ref={submitButton} id='submitButton' htmlType="submit"></Button>
          </FormItem>
        </Form>
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
          isDisabledSubmit={state.isDisabledInput}
          isDisabledRetry={state.isDisabledRetry}
          onSubmit={onSubmit}
          onRetry={onRetry}
          onPlayVideo={onPlayVideo}
          audioUrl={audio}
        />
      </CardFooter>
    </Fragment>
  );
};
TypeIn1.propTypes = {
  // allowPress: PropTypes.func.isRequired,
  question: PropTypes.instanceOf(Object),
  audio: PropTypes.string,
}
export default TypeIn1;
