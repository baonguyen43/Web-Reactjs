import React from 'react';
import classNames from 'classnames';

import * as typeText from '../typesQuestion';
import * as functions from 'components/functions';
import moment from 'moment';
import { Rate } from 'antd';
import { CardTitle, Card, Row, Col, Button, ListGroup, ListGroupItem, UncontrolledTooltip, Container } from 'reactstrap';
import Listen from 'components/Listening';
import Loading from 'components/Loading';
import NotData from 'components/Error/NotData';
import Recorder from 'components/Recording/react_mic';
import CountdownTimer from 'components/countdownTimer';
import openNotificationWithIcon from 'components/Notification';
import { DictionaryText } from 'components/Dictionary';
import PropTypes from 'prop-types';

class Type12_Mix_A extends React.Component {
  constructor(props) {
    super(props);
    this.soundUrl = '';
    this.arrayQuestion = '';
    this.state = {
      question: [],
      resultRecord: undefined,
      questionContent: null,
      examplesFormat: null,
      questionSentence: null,
    };
    this.questionIndex = this.props.questionIndex;
    this.refRecorder = React.createRef();
    this.refCountdownTimer = React.createRef();
  }

  static getDerivedStateFromProps = (props, state) => {

    if (props.question !== state.question) {
      const questionContent = JSON.parse(props.question.questionContent);
      // Lấy câu hỏi trong examplesFormat
      const examplesFormat = JSON.parse(questionContent[0].examplesFormat);
      // Lấy random 1 câu trong mảng 3 câu hỏi
      const questionSentenceIndex = Math.floor(Math.random() * 3);
      const questionSentence = examplesFormat.sentences[questionSentenceIndex];
      return {
        question: props.question,
        questionContent,
        examplesFormat,
        questionSentence
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
    const { resultRecord, questionContent } = this.state;
    this.checkAnswer(resultRecord);
    await this.postAnswerToAPI(resultRecord, questionContent);
    this.props.nextQuestion();
  
  };

  checkAnswer = (resultRecord) => {
    if (resultRecord.score > functions.satisfactoryResults) {
      openNotificationWithIcon('success', 'CORRECT');
    } else {
      openNotificationWithIcon('danger', 'INCORRECT');
    }
  };

  postAnswerToAPI = (resultRecord, questionContent) => {
    const { studentInfo, question, selectedPart, partQuestion, timeStart } = this.props;
    const { questionSentence } = this.state;
    const duration = moment().diff(timeStart);
    const originalSentence = questionSentence.text;
    const soundUrl = questionSentence.soundUrl;
    const answerModel = {
      studentId: studentInfo.StudentId,
      sessionId: question.sessionId,
      assignmentId: question.assignmentId,
      questionEntityName: questionContent[0].entityName,
      groupName: partQuestion ? selectedPart.GroupName : '',
      questionId: questionContent[0].id,
      questionGuid: '', // empty if question type is not GRAMMAR
      answerType: functions.getAnswerType(typeText.Type12),
      notes: '',
      takeExamTime: question.takeExamTime,
      studentChoice: JSON.stringify({
        score: resultRecord.score || 0,
        originalSentence,
        recordUrl: resultRecord.recordUrl || '',
        example: { soundUrl }
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
    const { resultRecord, question, questionSentence } = this.state;
    const { studentInfo } = this.props;
    const recordParams = {
      questionId: question.questionId,
      questionText: questionSentence.text,
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
    const { question, loading, questionSentence } = this.state;

    if (loading) {
      return <Loading />;
    }

    if (question.length === 0) {
      return <NotData />;
    }

    return (
      <Container>
        <Row style={{ paddingTop: 50 }} className="justify-content-md-center">
          <Col>
            <Card className="bg-primary text-white text-center p-4">
              {/* ////////////////////////////////// */}
              {/* Listen */}
              <CardTitle>
                <Listen audioURL={questionSentence.soundUrl} onAuto={false} />
              </CardTitle>
              <blockquote className="blockquote mb-0">
                <p style={{ fontSize: 20, fontWeight: '600' }}>
                  <DictionaryText text={questionSentence.text} />
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

Type12_Mix_A.propTypes = {
  questionIndex: PropTypes.number.isRequired,
  timeStart: PropTypes.string.isRequired,
  speechRecognitionAPI: PropTypes.string.isRequired,
  nextQuestion: PropTypes.func.isRequired,
  startRecord: PropTypes.func,
  loading: PropTypes.bool,
  partQuestion: PropTypes.bool,
  question: PropTypes.instanceOf(Object).isRequired,
  selectedPart: PropTypes.instanceOf(Object).isRequired,
  studentInfo: PropTypes.instanceOf(Object).isRequired
}

export default Type12_Mix_A;
