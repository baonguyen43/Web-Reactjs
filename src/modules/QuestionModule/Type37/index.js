import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Form, Rate, Row, Tooltip } from 'antd';
import ReactHtmlParser from 'react-html-parser';
import {
  Input,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Col,
  ListGroup,
  ListGroupItem,
  UncontrolledTooltip
} from 'reactstrap';

import Recorder from 'components/Recording/react_mic';
import CountDownTimer from 'components/countdownTimer';

import Listen from 'components/Listening';
import * as functions from 'components/functions';

const defaultState = {
  keysVisible: false,
  inputs: [],
  submitCount: 0,
  submitted: false,
  resultRecord: null,
  recordVisible: false,
}

const Type37 = (props) => {

  const inputTag = '___';

  const inputCount = React.useRef(0);

  const [form] = Form.useForm();

  const refCountdownTimer = React.useRef();

  const maxInput = props.question?.text?.match(new RegExp(inputTag, 'g'))?.length;

  const [state, setState] = React.useState(defaultState);

  React.useEffect(() => {
    setState(defaultState)
    form.resetFields();
    inputCount.current = 0;
  }, [form, props.question])

  const onFinish = React.useCallback((values) => {

    const answers = JSON.parse(props.question.answers);

    const inputs = [];

    answers.forEach((item, index) => {
      const isCorrect = item.text?.toLowerCase().trim() === values[`input${index}`]?.toLowerCase().trim();
      inputs.push(isCorrect);
    });

    setState((prevState) => ({
      ...prevState,
      inputs,
      submitted: true,
    }))
  }, [props.question])

  const transform = React.useCallback((node, index) => {
    // if (node.type === 'tag' && node.name === 'br') return null;

    if (node.type !== 'text') return;

    if (!node.data.includes(inputTag)) return;

    const elementArray = node.data.split(inputTag)

    return (
      <span key={index}>
        {elementArray.map((item, index) => {
          let itemName = '';

          let color = '#022F63';
          let borderColor;
          let borderWidth = 2;

          const currentInputNo = inputCount.current;

          const answers = JSON.parse(props.question.answers);

          let correctText = '';

          correctText = answers[currentInputNo]?.text;

          if (state.submitted && !state.recordVisible) {
            borderColor = '#F20E56';
            color = '#F20E56';

            if (state.inputs[currentInputNo]) {
              borderColor = '#2ECC82';
              color = '#2ECC82';
            }
          }

          if (index > 0) {
            itemName = `input${currentInputNo}`;

            inputCount.current++;

            if (inputCount.current >= maxInput) {
              inputCount.current = 0;
            }
          }

          return (
            <React.Fragment key={index}>
              {index !== 0 && (
                <Tooltip title={correctText} visible={state.keysVisible} placement='bottom' color='#2ECC82' style={{ fontSize: 5 }}>
                  <Form.Item
                    name={itemName}
                    className="ml-2 mr-2"
                    style={{ display: 'inline-block', marginBottom: 0 }}
                    value={state.recordVisible ? correctText : ''}
                  // rules={[{ required: true, message: 'Please input the answer!' }]}
                  >
                    <Input
                      // disabled={state.submitted || state.recordVisible}
                      // placeholder={state.recordVisible ? correctText : ''}
                      style={{
                        width: '210px',
                        height: '30px',
                        display: 'inline',
                        textAlign: 'center',
                        borderStyle: 'solid',
                        fontSize: 18,
                        color,
                        borderWidth,
                        borderColor,
                        borderRadius: 0,
                        borderTopWidth: 0,
                        borderLeftWidth: 0,
                        borderRightWidth: 0,
                        background: 'white',
                      }}
                    />
                  </Form.Item>
                </Tooltip>
              )}
              {item}
            </React.Fragment>
          )
        })}
      </span>
    )
  }, [
    maxInput,
    state.inputs,
    state.submitted,
    state.recordVisible,
    inputTag,
    state.keysVisible,
    props.question,
  ])

  const onRecording = React.useCallback(() => {
    refCountdownTimer.current.startTimer();
  }, []);

  const onStopTimer = React.useCallback(() => {
    refCountdownTimer.current.stopTimer();
  }, [])

  const onStopRecording = React.useCallback((result) => {
    setState((prevState) => ({ ...prevState, resultRecord: result }))
  }, []);

  const onNext = React.useCallback(() => {
    props.onNext();
  }, [props])

  const renderRecorder = React.useMemo(() => {
    const { question, studentId, takeExamTime } = props;
    // const { studentId, takeExamTime } = props;
    const recordParams = {
      questionId: question?.id,
      questionText: question?.correctText,
      studentId,
      takeExamTime,
      isTypeIELTS_DICTATION: true,
    };
    return (
      <>
        {/* ///////////////////// */}
        {/* Ghi âm */}
        <Recorder
          // ref={refRecorder}
          __custom
          __className={'question-type__recordType02'}
          __onRecording={onRecording}
          __onStopRecording={onStopRecording}
          recordParams={recordParams}
          onStopTimer={onStopTimer}
        >
          <div className={classNames(['mt-15'])}>
            <CountDownTimer seconds={60} ref={refCountdownTimer}>
              <span>Recording in: </span>
            </CountDownTimer>
          </div>
          <br />
          {/* ///////////////////////// */}
          {/* Sau khi ghi âm có kết quả */}
          {state.resultRecord && (
            <div>
              {/* {state.resultRecord.wordShows.map((item, i) => (
                <span key={i} style={{ color: item.color }} className={classNames(['question-type__textReply'])}>{item.word} </span>
              ))} */}
              <br />
              <Row className="justify-content-md-center">
                <Col lg="5" style={{ minWidth: 400 }}>
                  <ListGroup>
                    <ListGroupItem className="d-flex justify-content-between align-items-center" >
                      <div>
                        <Listen custom className={'record--content record--result__listen'} audioURL={state.resultRecord.recordUrl}>
                          <Button color="primary" id="tooltipRepeat">
                            <i style={{ fontSize: 15 }} className="fas fa-volume-up" />
                          </Button>
                          <UncontrolledTooltip
                            delay={0}
                            placement="top"
                            target="tooltipRepeat"
                          >
                            Nhấn để nghe lại
                          </UncontrolledTooltip>
                        </Listen>
                      </div>
                      <div style={{ marginLeft: 15, marginRight: 8 }}>
                        <Rate allowHalf disabled value={functions.getStarRecord(state.resultRecord.score)} style={{ marginRight: 12 }} />
                        <strong>{`${parseInt(state.resultRecord.score)}%`}</strong>
                      </div>
                      <div>
                        <Button color="primary" onClick={onNext} id='tooltipNextButton'>
                          <i style={{ fontSize: 15 }} className="fas fa-arrow-circle-right" />
                        </Button>
                        <UncontrolledTooltip
                          delay={0}
                          placement="top"
                          target="tooltipNextButton"
                        >
                          Tiếp tục
                          </UncontrolledTooltip>
                      </div>
                    </ListGroupItem>
                  </ListGroup>
                </Col>
              </Row>
            </div>
          )}
        </Recorder>
      </>
    );
  }, [onNext, onRecording, onStopRecording, onStopTimer, props, state.resultRecord])

  const onClickRetry = React.useCallback(() => {
    setState((prevState) => ({
      ...prevState,
      submitted: false,
      keysVisible: false,
      submitCount: prevState.submitCount + 1,
    }))
  }, [])

  const onClickShowRecord = React.useCallback(() => {
    form.resetFields();
    setState((prevState) => ({
      ...prevState,
      keysVisible: false,
      recordVisible: true,
    }))
  }, [form]);

  const onClickKeys = React.useCallback(() => {
    setState((prevState) => ({ ...prevState, keysVisible: true }));
  }, [])

  const oneClickRetry = state.submitCount <= 1;
  const nextToRecordVisible = state.submitCount >= 1;

  return (
    <div>
      <Card>
        <CardHeader>
          <Row justify="center">
            <audio src={props.question?.audioLink} controls />
          </Row>
        </CardHeader>
        <Form
          form={form}
          name="basic"
          autoComplete="off"
          onFinish={onFinish}
        >
          <CardBody>
            <span className="text-primary" style={{ fontSize: 18 }}>
              {!state.recordVisible ?
                ReactHtmlParser(props.question?.text, { transform }) :
                <div dangerouslySetInnerHTML={{ __html: props.question.correctText }}
                />}
            </span>
          </CardBody>
          <CardFooter>
            {!state.recordVisible && (
              <React.Fragment>
                {!state.submitted && (
                  <Form.Item style={{ flex: 1, flexDirection: 'row' }}>
                    <Row justify="center">
                      <Button color="primary">Sumbit</Button>
                    </Row>
                  </Form.Item>
                )}
                {state.submitted && (
                  <Row justify="center">
                    {oneClickRetry && <Button color="primary" onClick={onClickRetry}>Retry</Button>}
                    <Button color="primary" onClick={onClickKeys}>Keys</Button>
                    {nextToRecordVisible && <Button color="primary" onClick={onClickShowRecord}>Record</Button>}
                  </Row>
                )}
              </React.Fragment>
            )}
            {state.recordVisible && (
              <Row justify="center">
                {renderRecorder}
              </Row>
            )}
          </CardFooter>
        </Form>
      </Card>
    </div>
  );
};

Type37.propTypes = {
  studentId: PropTypes.number,
  onNext: PropTypes.func.isRequired,
  takeExamTime: PropTypes.string.isRequired,
  question: PropTypes.instanceOf(Object).isRequired,
}

export default Type37;
