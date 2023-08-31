import React from 'react';
import classNames from 'classnames';
import * as __typeText from '../typesQuestion';
import * as functions from 'components/functions';
import moment from 'moment';
import { Rate } from 'antd';
import { CardTitle, Card, Row, Col, Button, ListGroup, ListGroupItem, UncontrolledTooltip, CardImg, CardBody, CardText, Container } from 'reactstrap';

import Listen from 'components/Listening';
import AMES247Loading from 'components/Loading';
import CountdownTimer from 'components/countdownTimer';
import openNotificationWithIcon from 'components/Notification';
import Recorder from 'components/Recording/react_mic';
import PropTypes from 'prop-types';

class Type07_Mix_A extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      question: [],
      resultRecord: undefined,
      resultRecordWithAzure: undefined,
      questionContent: null,
    };

    this.questionIndex = this.props.questionIndex;
    this.takeExamTime = '';
    this.studentId = functions.getUser().StudentId;
    //this.recordUrlFromApi = null;
    this.refRecorder = React.createRef();
    this.refCountdownTimer = React.createRef();
  }

  static getDerivedStateFromProps = (props, state) => {
    let questionContent = '';
    if (props.question !== state.question) {
      questionContent = JSON.parse(props.question.questionContent);
      return {
        question: props.question,
        questionContent,
      };
    }
    return null;
  };

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

  onNext = async () => {
    const { resultRecord, question, questionContent } = this.state;
    this.checkAnswer(resultRecord);
    await this.postAnswerToAPI(resultRecord, question, questionContent);
    this.props.nextQuestion();
  
  };

  checkAnswer = () => {
    if (this.state.resultRecord.score > functions.satisfactoryResults) {
      openNotificationWithIcon('success', 'CORRECT');
    } else {
      openNotificationWithIcon('danger', 'INCORRECT');
    }
  };

  postAnswerToAPI = (resultRecord, question, questionContent) => {
    const { selectedPart, timeStart, partQuestion } = this.props;
    let duration = moment().diff(timeStart);
    const answerModel = {
      studentId: this.props.studentInfo.StudentId,
      sessionId: question.sessionId,
      assignmentId: question.assignmentId,
      questionEntityName: questionContent[0].entityName,
      groupName: partQuestion ? selectedPart.GroupName : '',
      questionId: questionContent[0].id,
      questionGuid: '', // empty if question type is not GRAMMAR
      answerType: functions.getAnswerType(__typeText.Type07),
      notes: '',
      takeExamTime: question.takeExamTime,
      studentChoice: JSON.stringify({
        score: resultRecord.score || 0,
        wordShows: resultRecord.wordShows || [],
        recordUrl: resultRecord.recordUrl || ''
      }),
      duration
    };

    const request = functions
      .postAnswerToAPI(answerModel);

    request
      .then((response) => { this.setState({ resultRecord: undefined }); })
      .catch((err) => {
        console.log(err);
      });
    return request;
  };

  renderRecorder = () => {
    const { resultRecord, question, questionContent } = this.state;
    const { studentInfo } = this.props;
    const recordParams = {
      questionId: question.questionId,
      questionText: questionContent[0].text,
      studentId: studentInfo.StudentId,
      takeExamTime: question.takeExamTime,
    };
    return (
      <>
        {/* ///////////////////// */}
        {/* Ghi âm */}
        <div style={{ borderRadius: 5 }} className='bg-gradient-danger'>
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
    let {
      question,
      questionContent
    } = this.state;

    if (!question) {
      return <AMES247Loading />;
    } else {
      return (
        <Container>
          <Row className="justify-content-md-center">
            <Col lg="6">
              <Card style={{ height: 515 }} className="bg-gradient-info text-white text-center p-4">
                <CardImg
                  style={{ maxHeight: 280 }}
                  alt="..."
                  src={questionContent[0].imageUrl}
                  top
                />
                <CardBody>
                  <CardTitle>
                    <Listen
                      audioURL={questionContent[0].soundUrl}
                      onListened={this.onListened}
                      onAuto={false}
                    /></CardTitle>
                  <CardText style={{ fontSize: 15 }}>
                    {questionContent[0].description}
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
}



Type07_Mix_A.propTypes = {
  questionIndex: PropTypes.number.isRequired,
  timeStart: PropTypes.string.isRequired,
  speechRecognitionAPI: PropTypes.string.isRequired,
  nextQuestion: PropTypes.func.isRequired,
  startRecord: PropTypes.func,
  partQuestion: PropTypes.bool,
  question: PropTypes.instanceOf(Object).isRequired,
  selectedPart: PropTypes.instanceOf(Object).isRequired,
  studentInfo: PropTypes.instanceOf(Object).isRequired
}

export default Type07_Mix_A;
