import { DictionaryText } from 'components/Dictionary';
import NotData from 'components/Error/NotData';
import * as functions from 'components/functions';
import Listen from 'components/Listening';
import openNotificationWithIcon from 'components/Notification';
import Recorder from 'components/Recording/react_mic';
import PropTypes from 'prop-types';
import React from 'react';
import { CardTitle } from 'reactstrap';
import RecorderTypeContent from '../RecorderTypeContent';
import RenderRecordTypeBody from '../RenderRecordTypeBody';
import * as textTypes from '../typesQuestion';

// const color = ['success', 'info', 'default','primary'];
// const randomIndex = Math.floor(Math.random(color) * 4);
const name = 'text-black text-center p-2';
// const name = 'bg-default text-white text-center p-4';

class Type02 extends React.Component {
  constructor(props) {
    super(props);
    this.soundUrl = '';
    this.arrayQuestion = '';
    this.state = {
      question: [],
      resultRecord: undefined,
      questionContent: null,
      exerciseCountdowns: [],
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
    if (typeof this.props.startRecord === 'function') {
      this.props.startRecord();
    }
    this.refCountdownTimer.current.startTimer();
  };

  onStopRecording = (result) => {
    this.setState({ resultRecord: result });
  };

  onStopTimer = () => {
    if (typeof this.refCountdownTimer.current.stopTimer == 'function') {
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
      notes: 'A',
      questionGuid: '',
      answerType: functions.getAnswerType(textTypes.Type02),
      studentChoice: JSON.stringify({
        score: resultRecord.score || 0,
        wordShows: resultRecord.wordShows || [],
        recordUrl: resultRecord.recordUrl || '',
      }),
    };
    onNext(exerciseCountdowns, postAnswerToApiParams, isPush);
    this.setState({ resultRecord: undefined });
  };

  checkAnswer = (resultRecord) => {
    /// Kiểm tra type kiểu Ghi âm
    resultRecord.score > functions.satisfactoryResults
      ? openNotificationWithIcon('success', 'CORRECT', 'Chúc mừng bạn đã phát âm đúng')
      : openNotificationWithIcon('danger', 'INCORRECT', 'Vui lòng kiểm tra lại phần phát âm');
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
            <p style={{ fontSize: 15, fontWeight: '400', fontStyle: 'italic' }}>/{question.phonetic}/</p>
            <p style={{ fontSize: 15, fontWeight: '400' }}>({question.wordType})</p>
            <footer className="blockquote-footer">
              <small>Nhấp vào để tra cứu nghĩa từng từ </small>
            </footer>
          </blockquote>
        </RenderRecordTypeBody>
      </div>
    );
  }
}

Type02.propTypes = {
  studentId: PropTypes.number,
  questionIndex: PropTypes.number,
  takeExamTime: PropTypes.string,
  startRecord: PropTypes.func,
  onNext: PropTypes.func,
  question: PropTypes.instanceOf(Object).isRequired,
};

export default Type02;
