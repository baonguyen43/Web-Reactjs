/* eslint-disable react/prop-types */
import React from 'react';
import * as functions from 'components/functions';
import { Card, Row, Col, Button, ListGroup, ListGroupItem, UncontrolledPopover, PopoverBody } from 'reactstrap';
import * as textTypes from '../typesQuestion'
import Recorder from 'components/Recording/react_mic';

import NotData from 'components/Error/NotData';
import PropTypes from 'prop-types';
import openNotificationWithIcon from 'components/Notification';
import PronunciationAssessment from 'components/Modal/PronunciationAssessment';
import CardFooter from 'reactstrap/lib/CardFooter';
import CardBody from 'reactstrap/lib/CardBody';
import RecorderTypeContent from '../RecorderTypeContent';

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
          assessment={true}
        >
          <RecorderTypeContent
            refCountdownTimer={this.refCountdownTimer}
            onStopRecording={this.onStopRecording}
            resultRecord={resultRecord}
            functions={functions}
          />
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
      <div>
        <Row className="justify-content-md-center mt-3">
          <Col className='col-12 col-lg-7 text-center mb-3'>
            <Card style={{ height: '100%' }} className="text-center">
              {/* ////////////////////////////////// */}
              <CardBody>
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
                        <ListGroupItem className="active" style={{ fontWeight: '600' }}>Choice: 1 in {question.answers.length}</ListGroupItem>
                        {question.answers.map((answer, index) => {
                          return (
                            <ListGroupItem key={index}>{answer.text}</ListGroupItem>
                          )
                        })}
                      </ListGroup>
                    </PopoverBody>
                  </UncontrolledPopover>
                </blockquote>
              </CardBody>
              {this.state.resultRecord &&
                <CardFooter style={{ textAlign: 'end', padding: 10 }}>
                  <Button color="primary" onClick={() => this.onNext()} id='tooltipNextButton'>
                    Next
                    <i style={{ fontSize: 15, marginLeft: 5 }} className="fas fa-arrow-circle-right" />
                  </Button>
                </CardFooter>
              }
            </Card>
          </Col>
          <Col className='col-12 col-lg-5 text-center mb-3'>
            <Card style={{ height: '100%' }}>
              {this.renderRecorder()}
              <PronunciationAssessment assessment={this.state.resultRecord} isSentence={true} />
            </Card>
          </Col>
        </Row>
      </div>
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
