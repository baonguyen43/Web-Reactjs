/* eslint-disable array-callback-return */
/* eslint-disable react/prop-types */
/* eslint-disable quotes */
/* eslint-disable no-unused-expressions */
import React, { Fragment, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Form, Button } from 'antd';
import { Row, Col, Input, CardBody, CardFooter } from 'reactstrap';
import ReactHtmlParser from 'react-html-parser';
import CircleTheNumberInTheText from 'modules/IeltsMindsetModule/components/CircleTheNumberInTheText';
import styles from './styles.module.css';
import FooterIeltsMindset from 'components/FooterIeltsMindset';
import * as specifications from '../../../constants/AdjustSpecifications';
import * as functions from '../../../../../components/functions';
import { useLocation, useParams } from 'react-router';
import queryString from 'query-string';
import { useSelector, useDispatch } from 'react-redux';
import { FETCH_SCORE } from 'modules/IeltsMindsetModule/actions/types'

const TypeIn8 = ({ question, audio }) => {
  const FormItem = Form.Item;
  const [form] = Form.useForm();
  const refForm = React.useRef();
  const inputCount = React.useRef(0);
  const submitButton = React.useRef();

  const [state, setState] = React.useState({
    sentences: [],
    booleanArray: [],
    answers: [],
    videoVisible: false,
    isDisabledRetry: true,
    isDisabledInput: false,
  });

  React.useEffect(() => {
    const sentences = JSON.parse(question.questionJson).questions;
    let correctArray = []
    sentences.forEach((sentence, index) => {
      sentence.answers.forEach((item) => {
        if (!item.text) return null;
        correctArray.push({ correctAnswers: item.text.split('/') })
      })
    })
    sentences.correctArray = correctArray
    form.resetFields();
    setState((prevState) => ({ ...prevState, sentences, isDisabledInput: false, isDisabledRetry: true }))
  }, [form, question])


  const toggleState = React.useCallback((fieldName) => () => {
    setState((prevState) => ({
      ...prevState,
      [fieldName]: !prevState[fieldName],
    }));
  }, []);

  const onPlayVideo = React.useCallback(() => {
    toggleState('videoVisible')();
  }, [toggleState]);

  const onSubmit = React.useCallback(() => {
    submitButton.current?.click();
  }, []);

  const onRetry = React.useCallback(() => {
    form.resetFields();
    inputCount.current = 0;
    setState((preState) => ({ ...preState, isDisabledInput: false, isDisabledRetry: true }))
  }, [form]);




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
    functions.postAnswerToAPI(result).then(response => console.log('Send T8 answers: success')).catch(error => console.log('Send T8 answers', error))
    // Cập nhật điểm.
    fetchIeltsMindsetScore(StudentId, params.sessionId, params.assignmentId, takeExamTime)
  }, [StudentId, fetchIeltsMindsetScore, params.assignmentId, params.sessionId, question.book, question.exercise, question.id, question.lesson, question.questionEntityName, question.subExercise, question.unit, takeExamTime])
  // #endregion

  // Khi hoàn thành các field
  const onFinish = React.useCallback((value) => {
    let booleanArray = []
    let answersArray = [];
    let keyName = [];
    let answers = [];
    for (const key in value) {
      answersArray.push(value[key]);
      keyName.push(key);
    }
    state.sentences.correctArray.forEach((item, index) => {
      let isCorrect = false;
      item.correctAnswers.forEach((answers) => {
        if (answers?.trim().toLowerCase() === answersArray[index]?.trim().toLowerCase()) {
          isCorrect = true;
        }
      })
      booleanArray.push({ isCorrect: `${keyName[index]}_${isCorrect}` })
      answers.push({ id: index, answer: answersArray[index]?.trim().toLowerCase() ?? '', isCorrect })
    })
    setState((preState) => ({ ...preState, sentences: state.sentences, isDisabledInput: true, isDisabledRetry: false, booleanArray }))
    state.answers = answers
    postAnswer(state.answers, state.answers, state)
  }, [postAnswer, state])

  const maxWidth = React.useCallback(() => {
    let max = 0
    state.sentences.map((x, i) => {
      x.answers.map((xa, ib) => {
        if (xa.text === '' || xa.text === ' ') return null
        if (max < xa.text.split('').length) {
          return max = xa.text.split('').length;
        }
      })
    })
    return max * 8 + 12
  }, [state.sentences]);


  const transform = React.useCallback(() => {
    return (
      <Row style={{ margin: 0 }}>
        {state.sentences.map((item, index) => {
          let currentInputNo = 0;
          const elementArray = item.question.split('#')
          return (
            <Col key={index} xs="6" sm="4" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <img src={item.image} alt='...' style={{ height: 150, width: 150, }} />
              <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
                {elementArray.map((itemSplit, indexSplit) => {
                  currentInputNo++;
                  return (
                    currentInputNo < elementArray.length ? (
                      <span key={`input${indexSplit}`}>
                        {/* <span key={`text${indexSplit}`} style={{}}>
                          {itemSplit}
                        </span> */}
                        <span>
                          <FormItem
                            name={`input${index}_${indexSplit}`}
                            style={{ display: 'inline-block', marginBottom: 0 }}
                          // rules={[{ required: true, message: 'Please fill the answer' },]}
                          >

                            <span>
                              <span style={{ lineHeight: specifications.Line_height }}>
                                <CircleTheNumberInTheText key={indexSplit} text={itemSplit} />
                              </span>

                              <Input
                                autoComplete='off'
                                style={{
                                  backgroundColor: specifications.BACKGROUND_WHITE,
                                  height: specifications.HEIGHT,
                                  width: maxWidth(),
                                  fontSize: specifications.FONTSIZE,
                                  border: specifications.BORDER,
                                  borderBottom: specifications.DOTTED_Black,
                                  boxShadow: specifications.BOXSHADOW,
                                  borderRadius: specifications.RADIUS,
                                  display: specifications.DISPLAY,
                                  fontWeight: specifications.FONTWEIGHT,
                                  padding: 0,
                                  margin: '0 0 15px 0',
                                  color: state.isDisabledInput ? (state.booleanArray.some(x => x.isCorrect === `input${index}_${indexSplit}_true`) ? specifications.SUCCESS_OR_CORRECT : specifications.FAILED_OR_WRONG) : specifications.ANSWER_COLOR,
                                }}
                                id={currentInputNo}
                                disabled={state.isDisabledInput}
                                className={!state.isDisabledInput ? styles.input : styles.checkInput}
                              />
                            </span>
                          </FormItem>
                        </span>
                      </span>
                    ) : (
                      <span key={`text${indexSplit}`} style={{ marginRight: 5, display: 'flex', flexDirection: 'row' }}>
                        {itemSplit}
                      </span>

                    )
                  )
                })
                }
              </div>
            </Col>
          )
        })}
      </Row>
    );
  }, [state.booleanArray, state.isDisabledInput, state.sentences, maxWidth]);

  const renderHintBox = React.useCallback((node, i) => {

    if (node.type === 'text') {
      if (!node.data.includes("|")) return;
      const elementArray = node.data.split("|")
      return (
        <span key={i}>
          {
            elementArray.map((item, index) => {
              return (
                <span key={index} style={{ marginInline: 15, display: 'inline-block' }}>
                  {item}
                </span>
              )
            })
          }
        </span>
      )
    }
  }, [])

  if (!state.sentences) return null;
  return (
    // <Row className='d-flex justify-content-center' >
    //   <Col className='d-initial justify-content-center'>
    //     <Card>
    <Fragment>
      <CardBody style={{ overflowY: 'auto', padding: 0 }}>
        {
          question?.hintBox && question?.hintBox.trim().length > 0 &&
          < div style={{ display: 'block', fontSize: 16, width: '70%', border: '2px solid rgb(17, 205, 239)', marginBottom: 15, paddingTop: 10, paddingLeft: 10 }}>
            {
              ReactHtmlParser(question?.hintBox, { transform: renderHintBox })
            }
          </div>
        }
        <Form
          autoComplete="off"
          form={form}
          ref={refForm}
          onFinish={onFinish}
          style={{ textAlign: 'justify', fontSize: 18 }}
        >
          <span>
            {transform()}
          </span>
          <FormItem>
            <Button style={{ display: 'none' }} ref={submitButton} id='submitButton' htmlType="submit"></Button>
          </FormItem>
        </Form>
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

    //     </Card>
    //   </Col>
    // </Row>
  );
};
TypeIn8.propTypes = {
  question: PropTypes.instanceOf(Object),

}
export default TypeIn8;
