import React from 'react';
import classNames from 'classnames';
import * as typeText from '../typesQuestion';
import * as functions from 'components/functions';

import { Rate } from 'antd';
import { CardTitle, Card, Row, Col, Button, ListGroup, ListGroupItem, UncontrolledTooltip, Container } from 'reactstrap';
import moment from 'moment';
import Listen from 'components/Listening';
import Loading from 'components/Loading';
import Recorder from 'components/Recording/react_mic';
import CountdownTimer from 'components/countdownTimer';
import openNotificationWithIcon from 'components/Notification';
import { DictionaryText } from 'components/Dictionary';
import NotData from 'components/Error/NotData';
import PropTypes from 'prop-types';


class Type02_Mix extends React.Component {
  constructor(props) {
    super(props);
    this.soundUrl = '';
    this.arrayQuestion = '';
    this.state = {
      question: [],
      resultRecord: undefined,
      questionContent: null,
    };

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

  ///// Chuyển sang câu tiếp theo
  onNext = async () => {
    const { resultRecord, question, questionContent } = this.state;
    this.checkAnswer(resultRecord);
    await this.postAnswerToAPI(resultRecord, question, questionContent);
    this.props.nextQuestion();

  };

  ///////////////////////////////
  //////// Kiểm tra chấm điểm phần ghi âm
  checkAnswer = (resultRecord) => {
    // console.log("resultRecord", resultRecord)
    if (resultRecord.score > functions.satisfactoryResults) {
      openNotificationWithIcon('success', 'CORRECT', 'Chúc mừng bạn đã phát âm đúng');
    } else {
      openNotificationWithIcon('danger', 'INCORRECT', 'Vui lòng kiểm tra lại phần phát âm');
    }
  };

  ////////////////////////////
  /////Gởi câu trả lời lên API
  postAnswerToAPI = (resultRecord, question, questionContent) => {
    const { studentInfo, selectedPart, partQuestion, speechRecognitionAPI, timeStart } = this.props;
    const duration = moment().diff(timeStart);
    const answerModel = {
      studentId: studentInfo.StudentId,
      sessionId: question.sessionId,
      assignmentId: question.assignmentId,
      questionEntityName: questionContent[0].entityName,
      groupName: partQuestion ? selectedPart.GroupName : '',
      questionId: questionContent[0].id,
      questionGuid: '', // empty if question type is not GRAMMAR
      answerType: functions.getAnswerType(typeText.Type02),
      notes: speechRecognitionAPI,
      takeExamTime: question.takeExamTime,
      studentChoice: JSON.stringify({
        score: resultRecord.score || 0,
        wordShows: resultRecord.wordShows || [],
        recordUrl: resultRecord.recordUrl || '',
      }),
      duration,
    };

    const request = functions
      .postAnswerToAPI(answerModel);

    request
      .then((response) => { this.setState({ resultRecord: undefined }) })
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
      </>
    );
  };

  render() {
    const { question, questionContent, loading } = this.state;


    if (loading) {
      return <Loading />;
    }

    if (question.length === 0) {
      return <NotData />;
    }

    return (
      <Container>
        <Row className="justify-content-md-center mt-3">
          <Col>
            <Card className="bg-primary text-white text-center p-4">
              {/* ////////////////////////////////// */}
              {/* Listen */}
              <CardTitle>
                <Listen audioURL={questionContent[0].soundUrl} onAuto={false} />
              </CardTitle>
              <blockquote className="blockquote mb-0">
                <p style={{ fontSize: 20, fontWeight: '600' }}>
                  <DictionaryText text={questionContent[0].text} />
                </p>
                <p style={{ fontSize: 15, fontWeight: '400', fontStyle: 'italic' }}>
                  /{questionContent[0].phonetic}/
                </p>
                <p style={{ fontSize: 15, fontWeight: '400' }}>
                  ({questionContent[0].wordType})
                </p>
                <footer className="blockquote-footer">
                  <small>Nhấp vào để tra cứu nghĩa từng từ </small>
                </footer>
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


Type02_Mix.propTypes = {
  questionIndex: PropTypes.number.isRequired,
  timeStart: PropTypes.string.isRequired,
  partQuestion: PropTypes.bool.isRequired,
  speechRecognitionAPI: PropTypes.string.isRequired,
  nextQuestion: PropTypes.func.isRequired,
  startRecord: PropTypes.func,
  question: PropTypes.instanceOf(Object).isRequired,
  selectedPart: PropTypes.instanceOf(Object),
  studentInfo: PropTypes.instanceOf(Object).isRequired
}

export default Type02_Mix;
