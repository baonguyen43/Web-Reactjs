import React from 'react';
import classNames from 'classnames';
import * as textTypes from '../typesQuestion';
import * as functions from 'components/functions';
import { Rate } from 'antd';
import { CardTitle, Card, Row, Col, Button, ListGroup, ListGroupItem, UncontrolledTooltip, CardImg, CardBody, CardText, Container } from 'reactstrap';
import Listen from 'components/Listening';
import CountdownTimer from 'components/countdownTimer';
import openNotificationWithIcon from 'components/Notification';
import Recorder from 'components/Recording/react_mic';
import PropTypes from 'prop-types';

class Type07 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

      resultRecord: undefined,
      questionContent: null,
      exerciseCountdowns:[],
    };
    //this.recordUrlFromApi = null;
    this.refRecorder = React.createRef();
    this.refCountdownTimer = React.createRef();
  }

  onLoadImage = ({ target: img }) => {
    if (img.offsetWidth > 490) {
      this.setState({
        styleImage: {
          width: '450px'
        }
      });
    }
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
      answerType: functions.getAnswerType(textTypes.Type07),
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
    const { resultRecord } = this.state;
    const { studentId, takeExamTime, question } = this.props;
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
        <div style={{ borderRadius: 5 }} className='bg-gradient-danger text-center'>
          <CardImg
            style={{ maxHeight: 300 }}
            alt="..."
            src='https://image.freepik.com/free-psd/arrangement-music-elements-white-background_23-2148688408.jpg'
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
                  {/* <Col style={{ minWidth: '90%' }}> */}
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
    const { question } = this.props;
    return (
      <Container>
        <Row className="justify-content-md-center">
          <Col lg="6">
            <Card style={{ height: 515 }} className="bg-gradient-info text-white text-center p-4">
              <CardImg
                style={{ maxHeight: 280 }}
                alt="..."
                src={question.imageUrl}
                top
              />
              <CardBody>
                <CardTitle style={{ fontSize: 30 , fontWeight:'600' }}>
                  {question.text}
                </CardTitle>
                <CardText style={{ fontSize: 15 }}>
                  {question.description}
                </CardText>
              </CardBody>

            </Card>
          </Col>
          <Col lg="6">
            {this.renderRecorder()}
          </Col>
        </Row>
      </Container>
    );
  }
}


Type07.propTypes = {
  studentId: PropTypes.number,
  questionIndex: PropTypes.number,
  takeExamTime: PropTypes.string,
  startRecord: PropTypes.func,
  onNext: PropTypes.func,
  question: PropTypes.instanceOf(Object).isRequired,
}

export default Type07;
