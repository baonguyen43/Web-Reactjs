import React from 'react';
import * as functions from 'components/functions';
import * as textTypes from '../typesQuestion'
import Recorder from 'components/Recording/react_mic';
import { DictionaryText } from 'components/Dictionary';
import NotData from 'components/Error/NotData';
import PropTypes from 'prop-types';
import openNotificationWithIcon from 'components/Notification';
import RecorderTypeContent from '../RecorderTypeContent';
import RenderRecordTypeBody from '../RenderRecordTypeBody';

// const color = ['warning', 'success', 'danger', 'info', 'default'];
// const randomIndex = Math.floor(Math.random(color) * 5);
const name = 'text-center p-4';

class Type09 extends React.Component {
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
      answerType: functions.getAnswerType(textTypes.Type09),
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
        <RenderRecordTypeBody
          name={name}
          isSentence={true}
          onNext={this.onNext}
          renderRecorder={this.renderRecorder}
          resultRecord={this.state.resultRecord}
        >
          <blockquote className="blockquote mb-0">
            <p style={{ fontSize: 20, fontWeight: '600' }}>
              <DictionaryText text={question.text} />
            </p>
            <p style={{ fontSize: 15, fontWeight: '400', fontStyle: 'italic' }}>
              /{question.phonetic}/
            </p>
            <p style={{ fontSize: 15, fontWeight: '400' }}>
              ({question.wordType})
            </p>
            <footer className="blockquote-footer">
              <small>Nhấp vào để tra cứu nghĩa từ vựng </small>
            </footer>
          </blockquote>
        </RenderRecordTypeBody>
      </div>
    );
  }
}


Type09.propTypes = {
  studentId: PropTypes.number,
  questionIndex: PropTypes.number,
  takeExamTime: PropTypes.string,
  startRecord: PropTypes.func,
  onNext: PropTypes.func,
  question: PropTypes.instanceOf(Object).isRequired,
}

export default Type09;
