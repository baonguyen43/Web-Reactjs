import React from 'react';
import classNames from 'classnames';
import * as functions from 'components/functions';
import { Rate } from 'antd';
import { Card, Row, Col, Button, ListGroup, ListGroupItem, UncontrolledTooltip, CardImg, CardBody, Container, Media, } from 'reactstrap';
import Listen from 'components/Listening';
import CountdownTimer from 'components/countdownTimer';
import openNotificationWithIcon from 'components/Notification';
import Recorder from 'components/Recording/azure';
import PropTypes from 'prop-types';
import ChoiceTurnModal from 'components/Modal/ChoiceTurnType33';
import { postMediaAnswerToAzure } from 'components/Recording/postMediaAnswerToAzure';
import { postMediaAnswerToApi } from 'components/Recording/postMediaAnswer';
class Type33 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      resultRecord: undefined,
      resultRecordWithAzure: undefined,
      questionContent: null,
      exerciseCountdowns: [],
      yourTurn: null,
      isVisibled: true,
      idTurn: null
    };
    //this.recordUrlFromApi = null;
    this.refRecorder = React.createRef();
    this.refCountdownTimer = React.createRef();
    this.sentencesIndex = 0;
    this.sentencesArray = [];
    this.text = '';
  }

  saveAccount = (index) => {
    const { isVisibled } = this.state;
    const isYourTurn = index === 0 ? true : false;
    this.setState({ isVisibled: !isVisibled, yourTurn: isYourTurn, idTurn: index + 1 })
  }

  onRecording = () => {
    if (typeof this.props.startRecord === 'function') {
      this.props.startRecord();
    }
    this.refCountdownTimer.current.startTimer();
  };

  onStopRecording = result => {
    if (typeof this.refCountdownTimer.current.stopTimer == 'function') {
      this.refCountdownTimer.current.stopTimer();
      this.setState({ resultRecord: result });
    }
  };
  // Post kết quả ghi âm
  receivedResultsFromAzure = jsonAzure => {
    let params = {
      jsonAzure,
      readingText: this.text,
    };
    postMediaAnswerToAzure(params, resultRecordWithAzure => {
      this.setState({ resultRecordWithAzure });
    });
  };
  // Nhận kết quả ghi âm

  // Chuyển sang câu nói tiếp theo trong câu hỏi
  nextSentence = () => {
    const { yourTurn, resultRecordWithAzure, resultRecord } = this.state;
    const { questionIndex } = this.props;
    this.checkAnswer(resultRecordWithAzure);
    const { question } = this.props;
    const questionjsonFormat = JSON.parse(question.jsonFormat)
    // Chèn phần mới ghi âm vào câu nói của học viên
    if (resultRecord) {
      const sentencesArrayIndex = this.sentencesArray.findIndex((x) => x.sentencesIndex === this.sentencesIndex && x.questionIndex === questionIndex);
      this.sentencesArray[sentencesArrayIndex].soundUrl = resultRecord.src;
    }

    if (this.sentencesIndex + 1 === questionjsonFormat.length) {
      return this.onNext()
    }

    this.setState({ yourTurn: !yourTurn, resultRecord: undefined, resultRecordWithAzure: undefined })
    this.sentencesIndex++;
  }

  checkAnswer = (resultRecordWithAzure) => {
    if (!resultRecordWithAzure) return null;
    /// Kiểm tra type kiểu Ghi âm
    if (resultRecordWithAzure.score > functions.satisfactoryResults) {
      openNotificationWithIcon('success', 'CORRECT', 'Chúc mừng bạn đã phát âm đúng');
    } else {
      openNotificationWithIcon('danger', 'INCORRECT', 'Vui lòng kiểm tra lại phần phát âm');
    }
  };

  // Chuyển sang câu hỏi tiếp theo
  onNext = async () => {
    const { exerciseCountdowns, yourTurn, resultRecordWithAzure, resultRecord, idTurn } = this.state;

    const { onNext, questionIndex, takeExamTime } = this.props;
    exerciseCountdowns.push({ resultRecordWithAzure, questionIndex });
    let isPush = true;
    let postAnswerToApiParams = '';

    if (resultRecordWithAzure) {
      isPush = false;
      let recordUrl = ''

      const answerUsingToSave = {
        isRobot: !yourTurn,
        id: idTurn,
        text: this.sentencesArray[this.sentencesArray.length - 1].text,

        soundUrl: this.sentencesArray[this.sentencesArray.length - 1].soundQuestion,
        questionIdParent: this.sentencesArray[this.sentencesArray.length - 1].questionIdParent,
        Url: {
          src: resultRecord.src,
          blobs: {}
        },
        recordedResult: resultRecordWithAzure
      }
      const result = await this.getRecordUrlFromApi(answerUsingToSave);
      recordUrl = result.data.recordUrl;
      const fullLogs = {}
      postAnswerToApiParams = {
        notes: '',
        questionGuid: '',
        answerType: 'CONVERSATIONONEPERSON',
        takeExamTime,
        studentChoice: JSON.stringify([answerUsingToSave, { fullLogs }, { recordUrl }])
      }
    }

    // const postAnswerToApiParams = null;

    this.setState({ resultRecord: undefined, resultRecordWithAzure: undefined, yourTurn: !yourTurn }, () => {
      onNext(exerciseCountdowns, postAnswerToApiParams, isPush)
      this.sentencesIndex = 0;
    }) 
  }

  getRecordUrlFromApi = async (answerUsingToSave) => {
    const { resultRecord } = this.state;
    const { studentId, takeExamTime } = this.props;
    if (!resultRecord) return { data: { recordUrl: '' } };

    let params = {
      blobFile: resultRecord.blobs,
      extensionInput: 'wav',
      readingText: answerUsingToSave.text,
      studentID: studentId,
      questionId: answerUsingToSave.questionIdParent,
      takeExamTime: takeExamTime,
      device: 'WEB'
    };

    return new Promise((resolve) => postMediaAnswerToApi(params, resolve));
  };

  renderRecorder = () => {
    const { resultRecordWithAzure, yourTurn } = this.state;
    return (
      <>
        {/* ///////////////////// */}
        {/* Ghi âm */}
        <div style={{ borderRadius: 5, minHeight: 400 }} className='bg-gradient-danger text-center'>
          <CardImg
            style={{ maxHeight: 300 }}
            alt="..."
            src='https://image.freepik.com/free-psd/arrangement-music-elements-white-background_23-2148688408.jpg'
            top
          />
          {yourTurn ? (
            <Recorder
              ref={this.refRecorder}
              __custom
              __className={'question-type__recordType02'}
              __onRecording={this.onRecording}
              __onStopRecording={this.onStopRecording}
              __receivedResultsFromAzure={this.receivedResultsFromAzure}
            >
              <div className={classNames(['mt-15'])}>
                <CountdownTimer color='white' seconds={15} ref={this.refCountdownTimer} onStopRecording={this.onStopRecording}>
                  <span style={{ color: 'white' }}>Recording in: </span>
                </CountdownTimer>
              </div>
              <br />
              {/* ///////////////////////// */}
              {/* Sau khi ghi âm có kết quả */}
              {resultRecordWithAzure && (
                <div>
                  <br />
                  <Row className="justify-content-md-center">
                  <Col lg="5" style={{minWidth:400}}>
                      <ListGroup>
                        <ListGroupItem>
                          {resultRecordWithAzure.WordShows.map((item, i) => (
                            <span key={i} style={{ color: item.color }} className={classNames(['question-type__textReply'])}>{item.word} </span>
                          ))}</ListGroupItem>
                        <ListGroupItem className="d-flex justify-content-between align-items-center">
                          <div>
                            <Listen custom className={'record--content record--result__listen'} audioURL={resultRecordWithAzure.recordUrl}>
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
                          <Rate allowHalf disabled value={functions.getStarRecord(resultRecordWithAzure.score)} />
                          <strong>{`${parseInt(resultRecordWithAzure.score)}%`}</strong>
                          <div>
                            <Button color="info" onClick={this.nextSentence} id='tooltipNextButton'>
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
          ) : (
              <Button className='mt-4' color='secondary' onClick={this.nextSentence}>Next</Button>
            )}

        </div>
      </>
    );
  };

  renderConversation = () => {
    const { question, questionIndex } = this.props;
    const { yourTurn } = this.state;
    if (yourTurn === null || !question.jsonFormat) return null;

    const questionjsonFormat = JSON.parse(question.jsonFormat)

    //Push sentence to array
    const isPush = this.sentencesArray.findIndex((x) => x.sentencesIndex === this.sentencesIndex && x.questionIndex === questionIndex) > -1

    if (!isPush) {
      this.sentencesArray.push({
        text: questionjsonFormat[this.sentencesIndex].text,
        yourTurn,
        soundUrl: yourTurn ? null : questionjsonFormat[this.sentencesIndex].soundUrl,
        soundQuestion: questionjsonFormat[this.sentencesIndex].soundUrl,
        sentencesIndex: this.sentencesIndex,
        questionIndex,
        questionIdParent: question.id,
        onAuto: yourTurn ? false : true,
        // questionId: question.id
      })
    }

    return this.sentencesArray.map((item, index) => {
      this.text = item.text;
      const name = item.yourTurn ? 'You' : 'Robot'
      const imageUrl = item.yourTurn ? 'https://image.freepik.com/free-vector/man-shows-gesture-great-idea_10045-637.jpg' : 'https://image.freepik.com/free-vector/cute-bot-say-users-hello-chatbot-greets-online-consultation_80328-195.jpg'
      const audioURL = item.yourTurn ? item.soundUrl : item.soundUrl
      return (
        <Media key={index} className='media-comment'>
          <img alt='...' className='avatar avatar-lg media-comment-avatar rounded-circle' src={imageUrl} />
          <Media>
            <div className='media-comment-text'>
              <p className="text-sm mb-0 h3 text-left">
                {name}
              </p>
              <div className=' d-flex justify-content-between align-items-center'>
                <p className='text-primary'>{item.text}</p>
                {item.soundUrl && (
                  <Listen
                    custom
                    audioURL={audioURL}
                    className='question-type__audioExampleType02 ml-2'
                    onAuto={item.onAuto}
                  >
                    <i className="fas fa-volume-up"></i>
                  </Listen>
                )}
              </div>
            </div>
          </Media>
        </Media>
      )
    })
  }

  render() {
    const { isVisibled, yourTurn } = this.state;

    return (
      <Container>
        <Row className="justify-content-md-center">
          <Col lg="6">
            <div style={{
              overflowY: 'scroll',
              height: '515px',
            }} >
              <Card style={{ minHeight: 515 }} className="bg-gradient-info text-white text-center p-4">
                <CardBody>
                  <div className='mb-1'>
                    {this.renderConversation()}
                  </div>
                </CardBody>

              </Card>
            </div>
          </Col>
          <Col lg="6">
            {this.renderRecorder()}
          </Col>
          {yourTurn === null && (
            <ChoiceTurnModal isVisibled={isVisibled} saveAccount={this.saveAccount} />
          )}
        </Row>
      </Container>
    );
  }
}


Type33.propTypes = {
  studentId: PropTypes.number,
  questionIndex: PropTypes.number,
  takeExamTime: PropTypes.string,
  startRecord: PropTypes.func,
  onNext: PropTypes.func,
  question: PropTypes.instanceOf(Object).isRequired,
}

export default Type33;


