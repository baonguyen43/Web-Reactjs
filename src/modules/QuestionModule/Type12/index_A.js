import React from 'react';
import * as functions from 'components/functions';
import { CardTitle } from 'reactstrap';
import * as textTypes from '../typesQuestion'
import Listen from 'components/Listening';
import Recorder from 'components/Recording/react_mic';
import { DictionaryText } from 'components/Dictionary';
import NotData from 'components/Error/NotData';
import PropTypes from 'prop-types';
import openNotificationWithIcon from 'components/Notification';
import RecorderTypeContent from '../RecorderTypeContent';
import RenderRecordTypeBody from '../RenderRecordTypeBody';

// const color = ['warning', 'success', 'info', 'default'];
// const randomIndex = Math.floor(Math.random(color) * 4);
// const name = 'bg-default text-white text-center p-4';
const name = 'text-center p-4';

class Type12 extends React.Component {
  constructor(props) {
    super(props);
    this.soundUrl = '';
    this.arrayQuestion = '';
    this.state = {
      question: [],
      resultRecord: undefined,
      questionContent: null,
      exerciseCountdowns: [],
      isDoing: false,
    };

    this.refRecorder = React.createRef();
    this.refCountdownTimer = React.createRef();
  }

  static getDerivedStateFromProps = (props, state) => {

    if (props.question !== state.question) {

      if (!props.question || typeof props.question.examplesFormat !== 'string' || state.isDoing) return null;
      const examplesFormat = JSON.parse(props.question.examplesFormat);
      const randomIndex = Math.floor(Math.random() * 3);
      const question = examplesFormat.sentences[randomIndex]
      return {
        question,
        isDoing: true
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
    const { resultRecord, exerciseCountdowns, question } = this.state;
    this.checkAnswer(resultRecord);
    const { onNext, questionIndex } = this.props;
    const soundUrl = question.soundUrl;
    exerciseCountdowns.push({ resultRecord, questionIndex });
    const isPush = false;
    const postAnswerToApiParams = {
      notes: '',
      questionGuid: '',
      answerType: functions.getAnswerType(textTypes.Type12),
      studentChoice: JSON.stringify({
        score: resultRecord.score || 0,
        originalSentence: question.text,
        recordUrl: resultRecord.recordUrl || '',
        example: { soundUrl },
        wordShows: resultRecord.wordShows
      }),
    }
    onNext(exerciseCountdowns, postAnswerToApiParams, isPush)
    this.setState({ resultRecord: undefined, isDoing: false })
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
      questionId: question.Id,
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
        <RenderRecordTypeBody
          name={name}
          isSentence={true}
          onNext={this.onNext}
          renderRecorder={this.renderRecorder}
          resultRecord={this.state.resultRecord}
        >
          <CardTitle>
            <Listen audioURL={question.soundUrl} onAuto={false} />
          </CardTitle>
          <blockquote className="blockquote mb-0">
            <p style={{ fontSize: 20, fontWeight: '600' }}>
              <DictionaryText text={question.text} />
            </p>
            <footer className="blockquote-footer">
              <small>Nhấp vào để tra cứu nghĩa từng từ </small>
            </footer>
          </blockquote>
        </RenderRecordTypeBody>
      </div>
    );
  }
}


Type12.propTypes = {
  studentId: PropTypes.number,
  questionIndex: PropTypes.number,
  takeExamTime: PropTypes.string,
  startRecord: PropTypes.func,
  onNext: PropTypes.func,
  question: PropTypes.instanceOf(Object).isRequired,
}

export default Type12;
