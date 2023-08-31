/* eslint-disable no-unused-expressions */
import React from 'react';
import PropTypes from 'prop-types';
import styles from './styles.module.css';
import FooterModal from '../../../FooterModal'
import { CardBody, Card, CardFooter, Col, Row } from 'reactstrap';
import { Form, Button, Input } from 'antd';
// import * as Colors from 'configs/color';
// import ReactHtmlParser from 'react-html-parser';

const TypeIn4 = ({ question }) => {
  const [form] = Form.useForm();

  const inputCount = React.useRef(0);

  const submitButton = React.useRef();

  const [state, setState] = React.useState({
    questions: null,
    isPointed: false,
    // isDisabledSubmit: false,
    isDisabledInput: false,
    isDisabledRetry: true,
    videoVisible: false,
    randomArray: []
  });

  React.useEffect(() => {
    const questions = JSON.parse(JSON.stringify(question[0].answers));
    let maxInput = 0;
    let correctArray = [];
    questions.forEach((item) => {
      const array = item.text.split('');
      array.forEach((itemArray) => {
        correctArray.push(itemArray)
      })
      maxInput += array.length
    })
    questions.maxInput = maxInput
    questions.correctArray = correctArray
    setState((prevState) => ({ ...prevState, questions }))
  }, [question]);

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
    setState((preState) => ({ ...preState, isDisabledInput: false, isPointed: false, isDisabledRetry: true}))
  }, [form])

  const onPlayVideo = React.useCallback(() => {
    toggleState('videoVisible')();
  }, [toggleState])


  //Khi hoàn thành các field
  const onFinish = React.useCallback((value) => {
    let booleanArray = []
    state.questions.correctArray.forEach((item, index) => {
      let isCorrect = false;
      if (item.trim().toLowerCase() === value[index].trim().toLowerCase()) {
        isCorrect = true;
      }
      booleanArray.push(isCorrect)
    })
    state.questions.booleanArray = booleanArray
    setState((preState) => ({ ...preState, questions: state.questions, isDisabledInput: true, isDisabledRetry: false }))
  }, [state])

  //Tạo thẻ select
  const renderTextForm = React.useCallback((text) => {
    const textSplit = text.split('');
    return textSplit.map((item, index) => {
      const currentInputNo = inputCount.current
      inputCount.current++
      if (inputCount.current >= state.questions.maxInput) {
        inputCount.current = 0;
      }
      return (
        <Form.Item
          key={index}
          className='ml-2'
          name={currentInputNo}
          rules={[{ required: true, message: '' },]}
          style={{ display: 'inline-block', marginBottom: 0 }}
        >
          <Input
            maxLength={1}
            autoComplete='off'
            className={styles.Input}
            disabled={state.isDisabledInput}
            style={{
              fontSize: 18,
              color: state.isDisabledInput ? (state.questions.booleanArray?.[currentInputNo] ? '#2ecc71' : '#e74c3c') : 'black',
              fontWeight: '500',
              height: 30,
            }}
          />
        </Form.Item>
      )
    })
  }, [state.isDisabledInput, state.questions])

  //Dịch HTML
  const transform = React.useCallback(() => {
    if (!state.questions) return null
    return (
      <span style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' }}>
        {state.questions.map((item, index) => {
          return (
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', paddingRight: 30 }} key={index}>
              <img src={item.image} alt='...' className={styles.img} />
              <span style={{ flexDirection: 'row', padding: 0 }}>
                {renderTextForm(item.text)}
              </span>
            </div>
          )
        })}
      </span>
    )
  }, [state.questions, renderTextForm])

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
    <Row className='flex flex-1 justify-content-center'>
      <Col className='d-initial justify-content-center'>
        <Card className='d-initial justify-content-center'>

          <CardBody className='ml-3' style={{ padding: 0 }}>

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
            <FooterModal
              isDisabledRetry={state.isDisabledRetry}
              isDisabledSubmit={state.isDisabledInput}
              onSubmit={onSubmit}
              onRetry={onRetry}
              onPlayVideo={onPlayVideo}
            />
          </CardFooter>
        </Card>
      </Col>
    </Row>
  )
};

TypeIn4.propTypes = {
  question: PropTypes.instanceOf(Object),
  history: PropTypes.instanceOf(Object),
  sessionId: PropTypes.string,
  classId: PropTypes.string,
};

export default TypeIn4;
