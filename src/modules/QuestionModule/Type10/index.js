import React from 'react';
import * as textTypes from '../typesQuestion';
import * as functions from 'components/functions';

import { CardImg } from 'reactstrap';
import openNotificationWithIcon from 'components/Notification';
import Recorder from 'components/Recording/react_mic';
import PropTypes from 'prop-types';
import NotData from 'components/Error/NotData';
import RecorderTypeContent from '../RecorderTypeContent';
import RenderRecordTypeBody from '../RenderRecordTypeBody';

// const color = ['warning', 'success', 'danger', 'info', 'default'];
// const randomIndex = Math.floor(Math.random(color) * 5);
// const name = `bg-gradient-${color[randomIndex]}`;

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
        <div
          style={{ borderRadius: 5 }}
        // className={name}
        >
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
    const { question } = this.state;

    if (!question) {
      return <NotData />;
    }
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
            style={{ height: '100%' }}
            alt="..."
            src={question.imageUrl}
            top
          />
        </RenderRecordTypeBody>
      </div>
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
