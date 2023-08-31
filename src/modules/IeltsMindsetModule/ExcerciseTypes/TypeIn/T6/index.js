/* eslint-disable no-unused-expressions */
import React from 'react';
import styles from './styles.module.css';
import { Row, Col, Input, Card, CardBody, CardFooter } from 'reactstrap';
import { Form, Button } from 'antd';
import PropTypes from 'prop-types';
import ReactHtmlParser from 'react-html-parser';
import FooterIeltsMindset from '../../../FooterModal';


const TypeIn2 = ({ question, audio }) => {
  const inputTag = '#';

  const FormItem = Form.Item;
  const submitButton = React.useRef();
  const refForm = React.useRef();
  const inputCount = React.useRef(0);
  const [form] = Form.useForm();

  const [state, setState] = React.useState({
    sentences: JSON.parse(JSON.stringify(question)),
    isDisabledInput: false,
    isDisabledRetry: true,
    videoVisible: false
  });

  React.useEffect(() => {
    const sentences = JSON.parse(JSON.stringify(question));
    let correctArray = []
    sentences[0].answers.forEach((item) => {
      correctArray.push(item.text)
    })
    sentences.correctArray = correctArray
    setState((prevState) => ({ ...prevState, sentences }))
  }, [question])


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

  // Khi hoàn thành các field
  const onFinish = React.useCallback((value) => {
    let booleanArray = []
    state.sentences.correctArray.forEach((item, index) => {
      let isCorrect = false;
      if (item.trim().toLowerCase() === value[index].trim().toLowerCase()) {
        isCorrect = true;
      }
      booleanArray.push(isCorrect)
    })
    state.sentences.booleanArray = booleanArray
    setState((preState) => ({ ...preState, sentences: state.sentences, isDisabledInput: true, isDisabledRetry: false }))
  }, [state])


  const transform = React.useCallback((node, index) => {

    if (node.type === 'text') {
      if (!node.data.includes(inputTag)) return;
      const elementArray = node.data.split(inputTag);


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
                    name={currentInputNo}
                    style={{ display: 'inline-block', marginBottom: 0 }}
                    rules={[{ required: true, message: 'Please fill the answer' },]}
                  >
                    <span>
                      <Input
                        autoComplete='off'
                        style={{
                          height: 30,
                          fontSize: 18,
                          borderWidth: 0,
                          borderRadius: 0,
                          fontWeight: '500',
                          display: 'inline',
                          borderBottomWidth: 1,
                          width: type ? 600 : 150,
                          backgroundColor: 'white',
                          borderBottomColor: '#bdc3c7',
                          color: state.isDisabledInput ? (state.sentences.booleanArray?.[currentInputNo] ? '#2ecc71' : '#e74c3c') : 'black',
                        }}
                        id={currentInputNo}
                        disabled={state.isDisabledInput}
                        className={!state.isDisabledInput ? styles.input : styles.checkInput}
                      />
                    </span>
                  </FormItem>
                )}
                {item.split(' ').map((word, wIndex) => {
                  if (!word.includes('@')) return `${word} `;

                  return <span key={wIndex} style={{ color: question[0].textColor }}>{`${word.replace('@', '')} `}</span>;
                })}
              </React.Fragment>
            )
          })}
        </span>
      )
    }
  }, [state.sentences, state.isDisabledInput, question])

  if (!state.sentences) return null;

  return (
    <Row className='d-flex justify-content-center'>
      <Col className='d-initial justify-content-center'>
        <Card>
          <CardBody style={{ overflowY: 'auto', maxHeight: '50vh' }}>
            <Form
              autoComplete="off"
              form={form}
              ref={refForm}
              onFinish={onFinish}
            >
              <span>
                {ReactHtmlParser(state.sentences[0].question, { transform })}
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
              audioUrl={audio}
            />
          </CardFooter>
        </Card>
      </Col>
    </Row>
  );
};
TypeIn2.propTypes = {
  question: PropTypes.instanceOf(Object),

}
export default TypeIn2;
