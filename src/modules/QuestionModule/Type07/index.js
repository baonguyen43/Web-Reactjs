import React from 'react';
import * as textTypes from '../typesQuestion';
import * as functions from 'components/functions';
import { CardTitle, CardImg, CardBody, CardText } from 'reactstrap';
import openNotificationWithIcon from 'components/Notification';
import Recorder from 'components/Recording/react_mic';
import PropTypes from 'prop-types';
import RecorderTypeContent from '../RecorderTypeContent';
import RenderRecordTypeBody from '../RenderRecordTypeBody';

class Type07 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

      resultRecord: undefined,
      questionContent: null,
      exerciseCountdowns: [],
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
        <div style={{ borderRadius: 5 }} className='text-center'>
          {/* <CardImg
            style={{ maxHeight: 300 }}
            alt="..."
            src='https://image.freepik.com/free-psd/arrangement-music-elements-white-background_23-2148688408.jpg'
            top
          /> */}
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
        </div>
      </>
    );
  };

  render() {
    const { question } = this.props;
    return (

      <div>
        <RenderRecordTypeBody
          // name={name}
          isSentence={true}
          onNext={this.onNext}
          renderRecorder={this.renderRecorder}
          resultRecord={this.state.resultRecord}
        >
          <CardImg
            style={{ maxHeight: 400 }}
            alt="..."
            src={question.imageUrl}
            top
          />
          <CardBody>
            <CardTitle style={{ fontSize: 30, fontWeight: '600' }}>
              {question.text}
            </CardTitle>
            <CardText style={{ fontSize: 15 }}>
              {question.description}
            </CardText>
          </CardBody>

        </RenderRecordTypeBody>
      </div>
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
