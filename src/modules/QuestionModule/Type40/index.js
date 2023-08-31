/* eslint-disable no-unused-expressions */
import React from 'react';
import styles from './styles.module.css';
import { Row, Col, Input, Card, CardBody, CardHeader, CardFooter } from 'reactstrap';
import { Form, Button } from 'antd';
import PropTypes from 'prop-types';
import ReactHtmlParser from 'react-html-parser';
import FooterIeltsMindset from 'components/FooterIeltsMindset';
import TitleQuestion from 'components/TitleQuestion'

const TypeIn = ({ question }) => {

  const inputTag = '#';

  const FormItem = Form.Item;

  const submitButton = React.useRef();

  const refForm = React.useRef();

  const inputCount = React.useRef(0);
  
  const [form] = Form.useForm();

  const [state, setState] = React.useState({
    sentences: question?.questionJson ? JSON.parse(question?.questionJson) : '',
    isDisabledInput: false,
    // isDisabledSubmit:false,
    isDisabledRetry: true,
    videoVisible: false
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
    setState((preState) => ({ ...preState, isDisabledInput: false, isDisabledRetry: true }))
  }, [form])

  //Khi hoàn thành các field
  const onFinish = React.useCallback((value) => {

    const { sentences } = state;

    sentences.forEach((sentence, indexSentence) => {
      sentence.answers.forEach((answer, indexAnswer) => {
        let isCorrect = false;
        if (answer.text.trim().toLowerCase() === value[indexAnswer].trim().toLowerCase()) {
          isCorrect = true;
        }
        answer.isCorrect = isCorrect
      })

    })
    setState((preState) => ({ ...preState, sentences, isDisabledInput: true, isDisabledRetry: false }))
  }, [state])

  const transform = React.useCallback((node, index) => {
    if (node.type === 'text') {
      if (!node.data.includes(inputTag)) return;
      const elementArray = node.data.split(inputTag)
      let currentInputNo = 0;
      return (
        <span>
          {elementArray.map((item, index) => {
            if (index > 0) {
              currentInputNo = inputCount.current;
              const maxInput = state.sentences[0].answers.length
              inputCount.current++;
              if (inputCount.current >= maxInput) {
                inputCount.current = 0;
              }
            }
            const type = state.sentences[0].type === 'RE_ORDER'
            return (
              <React.Fragment key={index}>
                {index !== 0 && (
                  <FormItem
                    className='ml-2 mr-2'
                    style={{ display: 'inline-block', marginBottom: 0 }}
                    name={currentInputNo}
                    rules={[{ required: true, message: 'Please fill the answer' },]}
                  >
                    <span>
                      <Input
                        autoComplete='off'
                        style={{
                          fontSize: 18,
                          width: type ? 600 : 150,
                          display: 'inline',
                          borderWidth: 0,
                          borderBottomWidth: 1,
                          borderRadius: 0,
                          backgroundColor: 'white',
                          color: state.isDisabledInput ? (state.sentences[0].answers[currentInputNo].isCorrect ? '#2ecc71' : '#e74c3c') : 'black',
                          fontWeight: '500',
                          height: 30,
                         
                        }}
                        disabled={state.isDisabledInput}
                        // onChange={(e) => onChange(e, index)}
                        id={currentInputNo}
                        className={!state.isDisabledInput ? styles.input : styles.checkInput}
                      />
                    </span>
                  </FormItem>
                )}
                {item}
              </React.Fragment>
            )
          })}
        </span>
      )
    }
  }, [state.sentences, state.isDisabledInput])
  if (!state.sentences) return null;
  return (
    <Row className='d-flex justify-content-center'>
      <Col className='d-initial justify-content-center'>
        <Card>
          <CardHeader>
            <TitleQuestion
              no={question?.exercise}
              type={question?.lesson}
              title={question?.exerciseName}
            />
          </CardHeader>
          <CardBody style={{ overflowY: 'auto', maxHeight: '50vh' }}>
            <Form
              autoComplete="off"
              form={form}
              ref={refForm}
              onFinish={onFinish}
              style={{ textAlign: 'justify', fontSize: 18,lineHeight :  state.sentences[0].type === 'RE_ORDER' ? 0 :2.5 }}
            >
              <span>
                {ReactHtmlParser(state.sentences[0].title, { transform })}
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
          <CardFooter>
            <FooterIeltsMindset
              isDisabledSubmit={state.isDisabledInput}
              isDisabledRetry={state.isDisabledRetry}
              onSubmit={onSubmit}
              onRetry={onRetry}
              onPlayVideo={onPlayVideo}
            />
          </CardFooter>
        </Card>
      </Col>
    </Row>
  );
};
TypeIn.propTypes = {
  question: PropTypes.instanceOf(Object),

}
export default TypeIn;
