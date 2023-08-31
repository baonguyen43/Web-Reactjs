import React from 'react';
import classNames from 'classnames';
import * as textTypes from '../typesQuestion';
import * as functions from 'components/functions';

import { Rate } from 'antd';
import {  Row, Col, Button, ListGroup, ListGroupItem, UncontrolledTooltip, CardImg,Container } from 'reactstrap';
import Listen from 'components/Listening';
import CountdownTimer from 'components/countdownTimer';
import openNotificationWithIcon from 'components/Notification';
import Recorder from 'components/Recording/react_mic';
import PropTypes from 'prop-types';
import NotData from 'components/Error/NotData';

const color = ['warning', 'success', 'danger', 'info', 'default'];
const randomIndex = Math.floor(Math.random(color) * 5);
const name = `bg-gradient-${color[randomIndex]}`;

class Type10 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      question: [],
      resultRecord: undefined,
      exerciseCountdowns: [],
    };

    this.questionIndex = this.props.questionIndex;
    this.takeExamTime = '';
    this.studentId = functions.getUser().StudentId;
    //this.recordUrlFromApi = null;
    this.refRecorder = React.createRef();
    this.refCountdownTimer = React.createRef();
  }

  static getDerivedStateFromProps = (props, state) => {

    if (props.question !== state.question) {
      return {
        question: props.question,

      };
    }
    return null;
  };

  onRecording = () => {
    if (typeof this.props.startRecord === 'function') {
      this.props.startRecord();
    }
    this.refCountdownTimer.current.startTimer();
  };

  onStopRecording = result => {
    if (typeof this.refCountdownTimer.current.stopTimer == 'function' && result !== undefined) {
      this.refCountdownTimer.current.stopTimer();
      this.setState({ resultRecord: result });
    }

    if (result === undefined) {
      this.refCountdownTimer.current.stopTimer();
    }
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
      answerType: functions.getAnswerType(textTypes.Type10),
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
        <div style={{ borderRadius: 5 }} className={name}>
          <CardImg
           style={{ maxHeight: 300 }}
            alt="..."
            src={question.imageUrl}
            top
          />
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
              <CountdownTimer color='white' seconds={15} ref={this.refCountdownTimer} onStopRecording={this.onStopRecording}>
                <span style={{ color: 'white' }}>Recording in: </span>
              </CountdownTimer>
            </div>
            <br />
            {/* ///////////////////////// */}
            {/* Sau khi ghi âm có kết quả */}
            {resultRecord && (
              <div>

                <br />
                <Row className="justify-content-md-center">
                <Col lg="5" style={{minWidth:400}}>
                    <ListGroup>
                      <ListGroupItem>
                        {resultRecord.wordShows.map((item, i) => (
                          <span key={i} style={{ color: item.color }} className={classNames(['question-type__textReply'])}>{item.word} </span>
                        ))}</ListGroupItem>
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
                          <Button color="info" onClick={this.onNext} id='tooltipNextButton'>
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
        </div>
      </>
    );
  };

  render() {
    const { question } = this.state;

    if (!question) {
      return <NotData />;
    }
    return (
      <Container>
        <Row className="justify-content-md-center">
          <Col lg={6} className='text-center'>
            {this.renderRecorder()}
          </Col>
        </Row>
      </Container>
    );

  }
}

Type10.propTypes = {
  studentId: PropTypes.number,
  questionIndex: PropTypes.number,
  takeExamTime: PropTypes.string,
  startRecord: PropTypes.func,
  onNext: PropTypes.func,
  question: PropTypes.instanceOf(Object).isRequired,
}

export default Type10;
