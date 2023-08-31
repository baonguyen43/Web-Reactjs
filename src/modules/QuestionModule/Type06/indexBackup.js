import React from 'react';
import classNames from 'classnames';
import * as functions from 'components/functions';
import { Rate } from 'antd';
import {  Card, Row, Col, Button, ListGroup, ListGroupItem, UncontrolledTooltip, Container, UncontrolledPopover, PopoverBody } from 'reactstrap';
import * as textTypes from '../typesQuestion'
import Listen from 'components/Listening';
import Recorder from 'components/Recording/react_mic';
import CountdownTimer from 'components/countdownTimer';

import NotData from 'components/Error/NotData';
import PropTypes from 'prop-types';
import openNotificationWithIcon from 'components/Notification';

class Type06 extends React.Component {
  constructor(props) {
    super(props);
    this.soundUrl = '';
    this.arrayQuestion = '';
    this.state = {
      question: [],
      resultRecord: undefined,
      questionContent: null,
      exerciseCountdowns: []
    };

    this.refRecorder = React.createRef();
    this.refCountdownTimer = React.createRef();
  }

  static getDerivedStateFromProps = (props, state) => {

    if (props.question !== state.question) {
      // eslint-disable-next-line no-unused-vars
      let questions = functions.randomTextAnswersFromAPI(props.data);
      questions = functions.randomFourAnswersOneWay(questions);
      return {
        question: props.question,
        resultRecord: undefined,
      };
    }
    return null;
  };

  onRecording = () => {
    this.setState({ disabledNext: true }, () => {
      if (typeof this.props.startRecord === 'function') {
        this.props.startRecord();
      }
      this.refCountdownTimer.current.startTimer();
    });
  };
  onStopRecording = (result) => {
    this.setState({ resultRecord: result, disabledNext: false });
  };

  onStopTimer = () => {
    if (typeof this.refCountdownTimer.current.stopTimer == 'function') {
      this.refCountdownTimer.current.stopTimer();
    }
    // this.onStopRecording();
  };

  onNext = () => {

    const { resultRecord, exerciseCountdowns } = this.state;
    this.checkAnswer(resultRecord);
    const { onNext, questionIndex } = this.props;
    exerciseCountdowns.push({ resultRecord, questionIndex });
    const isPush = false;
    const postAnswerToApiParams = {
      notes: '',
      questionGuid: '',
      answerType: functions.getAnswerType(textTypes.Type06),
      studentChoice: JSON.stringify({
        score: resultRecord.score || 0,
        wordShows: resultRecord.wordShows || [],
        recordUrl: resultRecord.recordUrl || ''
      }),
    }
    onNext(exerciseCountdowns, postAnswerToApiParams, isPush)
    this.setState({ resultRecord: undefined })
  }

  checkAnswer = (resultRecord) => {
    /// Kiểm tra type kiểu Ghi âm
    if (resultRecord.score > functions.satisfactoryResults) {
      openNotificationWithIcon('success', 'CORRECT', 'Chúc mừng bạn đã phát âm đúng');
    } else {
      openNotificationWithIcon('danger', 'INCORRECT', 'Vui lòng kiểm tra lại phần phát âm');
    }
  };

  ///// Chuyển sang câu tiếp theo


  ////////////////////////////
  /////Gởi câu trả lời lên API



  renderRecorder = () => {
    const { resultRecord, question } = this.state;
    const { studentId, takeExamTime } = this.props;
    const recordParams = {
      questionId: question.id,
      questionText: question.text,
      studentId,
      takeExamTime,
    };
    return (
      <>
        {/* ///////////////////// */}
        {/* Ghi âm */}
        <Recorder
          ref={this.refRecorder}
          __custom
          __className={'question-type__recordType02'}
          __onRecording={this.onRecording}
          __onStopRecording={this.onStopRecording}
          recordParams={recordParams}
          onStopTimer={this.onStopTimer}
        >
          <div className={classNames(['mt-15'])}>
            <CountdownTimer seconds={15} ref={this.refCountdownTimer} onStopRecording={this.onStopRecording}>
              <span>Recording in: </span>
            </CountdownTimer>
          </div>
          <br />
          {/* ///////////////////////// */}
          {/* Sau khi ghi âm có kết quả */}
          {resultRecord && (
            <div>
              {resultRecord.wordShows.map((item, i) => (
                <span key={i} style={{ color: item.color }} className={classNames(['question-type__textReply'])}>{item.word} </span>
              ))}
              <br />
              <Row className="justify-content-md-center">
                <Col lg="5" style={{minWidth:400}}>
                  <ListGroup>
                    <ListGroupItem className="d-flex justify-content-between align-items-center">
                      <div>
                        <Listen custom className={'record--content record--result__listen'} audioURL={resultRecord.recordUrl}>
                          <Button color="info" id="tooltipRepeat">
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
                      <Rate allowHalf disabled value={functions.getStarRecord(resultRecord.score)} />
                      <strong>{`${parseInt(resultRecord.score)}%`}</strong>
                      <div>
                        <Button color="info" onClick={() => this.onNext()} id='tooltipNextButton'>
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
  };

  render() {
    const { question } = this.state;

    if (question.length === 0) {
      return <NotData />;
    }

    return (
      <Container>
        <Row className="justify-content-md-center mt-3">
          <Col className='text-center'>
            <Card className="bg-primary text-white text-center p-4">
              {/* ////////////////////////////////// */}
              <blockquote className="blockquote mb-0">
                <p style={{ fontSize: 20, fontWeight: '600' }}>
                  {question.text_VN}
                </p>
                <Button color="danger" id="tooltip876279349" type="button">
                  Suggestions
                 </Button>
                <UncontrolledPopover placement="right" target="tooltip876279349">
                  <PopoverBody>
                    <ListGroup className='text-center'>
                      <ListGroupItem className="active" style={{fontWeight:'600'}}>Choice: 1 in {question.answers.length}</ListGroupItem>
                      {question.answers.map((answer, index) => {
                        return (
                          <ListGroupItem key={index}>{answer.text}</ListGroupItem>
                        )
                      })}
                    </ListGroup>
                  </PopoverBody>
                </UncontrolledPopover>
              </blockquote>
            </Card>
            {/* //////////////////////// */}
            {/* Ghi âm */}
            {this.renderRecorder()}
          </Col>
        </Row>
      </Container>
    );
  }
}


Type06.propTypes = {
  studentId: PropTypes.number,
  questionIndex: PropTypes.number,
  takeExamTime: PropTypes.string,
  startRecord: PropTypes.func,
  onNext: PropTypes.func,
  question: PropTypes.instanceOf(Object).isRequired,
}

export default Type06;
