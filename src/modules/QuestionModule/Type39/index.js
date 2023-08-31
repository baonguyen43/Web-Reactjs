/* eslint-disable no-unused-expressions */
import React from 'react';
import PropTypes from 'prop-types';
import styles from './styles.module.css';
import TitleQuestion from 'components/TitleQuestion'
import FooterIeltsMindset from 'components/FooterIeltsMindset'
import { CardBody, Card, CardFooter, CardHeader, Col, Row } from 'reactstrap';
import { Select, Form, Button } from 'antd';
// import * as Colors from 'configs/color';
import ReactHtmlParser from 'react-html-parser';


const Type39 = ({ question, classId, sessionId, history }) => {

  const [state, setState] = React.useState({
    questions: null,
    isPointed: false,
    isDisabledSubmit: false,
    isDisabledRetry: true,
    videoVisible: false,
  });

  const inputTag = '#'

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
      if(!question) return null;
      const questionParse = JSON.parse(JSON.stringify(question))
      if(!questionParse.questionJson) return null;
      const questionJson = JSON.parse(questionParse.questionJson)
      //Tạo mảng random cho thẻ select
      let randomArray = [];

      questionJson.forEach((item, index) => {

        item.answers.forEach((answer, indexAnswer) => {
          randomArray.push(answer.text)
        })

        for (let i = 0; i < item.answers.length / 2; i++) {
          const randomIndex = Math.floor(Math.random() * item.answers.length);
          [randomArray[i], randomArray[randomIndex]] = [randomArray[randomIndex], randomArray[i]];
        }
        item.randomArray = randomArray;
      })

      setState((preState) => ({
        ...preState, questions: questionJson
      }))
    }
    randomArray();
  }, [question])


  //Khi hoàn thành các field
  const onFinish = React.useCallback((value) => {
    
    const { questions } = state;
    let checkAnswerArray = [];
    questions[0].answers.forEach((answer, indexAnswer) => {
      const isCorrect = answer.text === questions[0].randomArray[value[indexAnswer]]
      checkAnswerArray.push(isCorrect)
    })
    questions[0].checkAnswerArray = checkAnswerArray;

    setState((preState) => ({ ...preState, questions, isPointed: true, isDisabledRetry: false, isDisabledSubmit: true }))
  }, [state])
  //Tạo thẻ select
  const contentSelect = React.useCallback(() => {
    return state.questions?.[0]?.randomArray?.map((item, index) => {
      return (
        <Select.Option key={index}>{item}</Select.Option>
      )
    })
  }, [state.questions])

  //Dịch HTML
  const transform = React.useCallback((node, index) => {
    if (node.type === 'text') {
      if (!node.data.includes('#')) return;
      const elementArray = node.data.split(inputTag)
      let currentInputNo = 0;
      return (
        <span key={index}>
          {elementArray.map((item, index) => {
            if (index > 0) {
              currentInputNo = inputCount.current;
              const maxInput = state.questions[0].answers.length
              inputCount.current++;
              if (inputCount.current >= maxInput) {
                inputCount.current = 0;
              }
            }
            return (
              <React.Fragment key={index}>
                {index !== 0 && (
                  <Form.Item
                    className='ml-2 mr-2'
                    name={currentInputNo}
                    style={{ display: 'inline-block', marginBottom: 0 }}
                    rules={[{ required: true, message: 'Please choice the answer' },]}
                  >
                    <Select
                      style={{
                        width: 150,
                        fontWeight:'600',
                        color: state.isPointed ? state.questions[0].checkAnswerArray[currentInputNo] ? '#2dce89' : '#e74c3c' : '#11cdef'
                      }}
                      // disabled={state.isPointed}
                      className={styles.select}
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
                )}
                {item}
              </React.Fragment>
            )
          })}
        </span>
      )
    }
  }, [state.questions, state.isPointed, contentSelect])

  const renderKeyWord = React.useCallback((item) => {
    return item.randomArray.map((itemWord, index) => {
      return (
        <span className='ml-2 mr-2' style={{ fontSize: 16, fontWeight: '500' }} key={index}>{itemWord}</span>
      )
    })

  }, [])

  const renderQuestion = React.useCallback((item, index) => {
    return (
      <>
        <Row>
          <div className='mb-4' style={{ borderStyle: 'solid', borderWidth: 2, borderColor: '#11cdef' }}>
            {renderKeyWord(item)}
          </div>
        </Row>
        <Row>
          <Form
            form={form}
            // ref={refForm}
            autoComplete="off"
            onFinish={onFinish}
            style={{ fontSize: 18, fontWeight: '500' }}
          >
            <span>
              {ReactHtmlParser(item.title, { transform })}
            </span>
            <Form.Item style={{ display: 'none' }}>
              <Button  ref={submitButton} id='submitButton' htmlType="submit"></Button>
            </Form.Item>

          </Form>
        </Row>
      </>
    );
  }, [renderKeyWord, form, onFinish, transform]);

  const linkGoBackAssignment = React.useCallback(() => {
    const link = `/ames/class/${classId}/session/${sessionId}/assignments/`;
    history.push(link)
  }, [classId, history, sessionId])

  return (
    <Row className='flex flex-1 justify-content-center'>
      <Col className='d-initial justify-content-center'> 
      <Card className='d-initial justify-content-center'>
        <CardHeader>
          <div className="modal-header" style={{ padding: 0 }}>
            <TitleQuestion
              no={question?.exercise}
              type={question?.lesson}
              title={question?.exerciseName}
            />
            <button
              type="button"
              className="close"
              aria-label="Close"
              data-dismiss="modal"
              onClick={linkGoBackAssignment}
            >
              <span aria-hidden={true}>×</span>
            </button>
          </div>
        </CardHeader>
        <CardBody className='ml-3'>
          {state.questions?.map(renderQuestion)}
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
            isDisabledRetry={state.isDisabledRetry}
            isDisabledSubmit={state.isDisabledSubmit}
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

Type39.propTypes = {
  question: PropTypes.instanceOf(Object),
  history: PropTypes.instanceOf(Object),
  sessionId: PropTypes.string,
  classId: PropTypes.string,
};

export default Type39;
