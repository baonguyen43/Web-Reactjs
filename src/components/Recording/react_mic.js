/* eslint-disable react/prop-types */
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Tooltip from 'antd/es/tooltip';

// import { captureUserMedia } from './utils';
import { LoadingOutlined } from '@ant-design/icons';
import { ReactMic } from '@cleandersonlobo/react-mic';
import notification from 'components/Notification';
import { Button } from 'antd';
import axios from 'axios';
import _ from 'lodash';

class Recorder extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      record: false,
      src: null,
      recognizer: null,
      recordAudio: undefined,
      statusRecord: 'start',
      classNames__btnRecord: null,
      disabled: true,
      statusText: 'Thu âm bị lỗi',
      isRecord: false,
    };
  }

  componentDidMount() {
    this.initialRecord();
  }

  UNSAFE_componentWillReceiveProps = (nextProps) => {
    const { recordParams } = this.props;
    if (recordParams.questionId !== nextProps.recordParams.questionId) {
      this.setState({ isRecord: false });
    }
  };

  resetRecord = () => {
    this.setState({ statusRecord: 'start', isRecord: false });
  };

  initialRecord = async () => {
    // captureUserMedia(() => {
    //   try {
    //     this.setState({ disabled: false, statusText: 'Bắt đầu ghi âm' });
    //   } catch (error) {
    //     // console.log(error)
    //   }
    // });
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      this.setState({ disabled: false, statusText: 'Bắt đầu ghi âm' });
    } catch (error) {
      console.log(error);
      notification('danger', 'Thông báo', 'Trình duyệt của bạn chưa hỗ trợ thu âm vui lòng thiết lập cài đặt.');
      // setRecordEnable(false);
    }
  };

  onRecord = () => {
    if (this.state.statusRecord === 'start') {
      this.setState(
        {
          statusRecord: 'stop',
          classNames__btnRecord: ['pulse', 'infinite'],
          statusText: 'Dừng lại',
        },
        () => {
          // record
          this.recordStart();
        }
      );
    } else {
      this.setState(
        {
          statusRecord: 'cal',
          classNames__btnRecord: null,
        },
        () => {
          this.recordStop();
        }
      );
    }
  };

  recordStart = () => {
    this.setState({
      record: true,
    });
    if (this.props.__onRecording) {
      this.props.__onRecording();
    }
  };

  recordStop = () => {
    this.setState({
      record: false,
      classNames__btnRecord: null,
      isRecord: true,
    });
  };

  onData() {
    // console.log('chunk of real-time data is: ', recordedBlob);
  }

  recognize = async (
    recordData,
    readingText,
    studentId,
    scope,
    questionId = '',
    takeExamTime = '',
    fileType = 'wav'
  ) => {
    const formData = new FormData();
    formData.append('base64String', _.replace(recordData.toString(), 'data:audio/wav;base64,', ''));
    formData.append('readingText', readingText);
    formData.append('studentId', studentId);
    formData.append('questionId', questionId);
    formData.append('takeExamTime', takeExamTime);
    formData.append('mode', 'Dictation');
    formData.append('fileType', fileType);
    formData.append('appName', 'MYAMES-WEB');
    formData.append('device', 'WEB');

    const response = await axios.post('https://softech.cloud/api/v1.0/SpeechRecognition', formData, {
      headers: { 'Content-Type': 'multipart/form-data', Authorization: 'Basic 12C1F7EF9AC8E288FBC2177B7F54D' },
    });
    scope.setState({
      statusRecord: 'start',
      statusText: 'Thu âm lại',
    });

    if (response.data.ok) {
      if (this.props.__onStopRecording) {
        const { json, pronunciationAssessment } = response.data.result;
        const { words } = pronunciationAssessment;
        const { AccuracyScore, PronScore } = json.NBest[0].PronunciationAssessment;
        const score = (AccuracyScore + PronScore) / 2;

        const wordShows = words.map((item, index) => {
          let color = '#1fc41f';
          if (item.errorType === 'Insertion') {
            color = '#FFAF24';
          } else if (item.errorType === 'Omission') {
            color = '#f5365c';
          } else if (item.errorType === 'Mispronunciation') {
            color = '#11cdef';
          }
          return { color, word: item.word, status: true, confidence: json.NBest[0].Confidence };
        });

        const result = {
          recordUrl: recordData,
          responseType: 'A',
          score: Math.floor(score),
          wordShows,
        };
        this.props.__onStopRecording({ ...result, ...pronunciationAssessment });
      }
    } else {
      this.props.__onStopRecording(undefined);
      notification('danger', 'Thông báo', 'Thu âm bị lỗi!, Bạn vui lòng thu âm lại!');
    }
  };

  onStop = async (recordedBlob) => {
    const { SpeakPractice, recordParams, onStopTimer, assessment } = this.props;
    const { questionId, studentId, takeExamTime, questionText, isTypeIELTS_DICTATION } = recordParams;

    if (onStopTimer) {
      onStopTimer();
    }
    const scope = this;

    var reader = new FileReader();
    reader.readAsDataURL(recordedBlob.blob);
    reader.onloadend = async () => {
      var base64data = reader.result;

      if (SpeakPractice) {
        scope.setState({ statusRecord: 'start', statusText: 'Thu âm lại' });
        this.props.__onStopRecording({ recordedBlob, base64data });
      } else {
        if (assessment) {
          this.recognize(
            base64data,
            questionText,
            studentId,
            scope,
            questionId,
            takeExamTime,
            isTypeIELTS_DICTATION ? 'mp3' : 'wav'
          );

          return;
        }

        var bodyFormData = new FormData();
        bodyFormData.append('Device', 'WEB');
        bodyFormData.append('mode', 'Dictation');
        bodyFormData.append('questionId', questionId);
        bodyFormData.append('readingText', questionText);
        bodyFormData.append('studentID', studentId);
        bodyFormData.append('takeExamTime', takeExamTime);
        bodyFormData.append('extensionInput', isTypeIELTS_DICTATION ? 'mp3' : 'wav');
        bodyFormData.append('input', base64data);
        bodyFormData.append('speechRecognitionAPI', 'A');

        try {
          const response = await axios({
            method: 'POST',
            url: isTypeIELTS_DICTATION
              ? 'https://ames.edu.vn/ames/api/amesapi/CompareAudioAndSentence'
              : 'https://ames.edu.vn/ames/api/amesApi/SaveFileAndCalculateScore',
            data: bodyFormData,
            config: { headers: { 'Content-Type': 'multipart/form-data' } },
          });

          console.log(response);

          scope.setState({ statusRecord: 'start', statusText: 'Thu âm lại' });
          if (response.statusText === 'OK') {
            if (this.props.__onStopRecording) {
              this.props.__onStopRecording(response.data);
            }
          }
        } catch (error) {
          scope.setState({
            statusRecord: 'start',
            statusText: 'Thu âm lại',
          });

          this.props.__onStopRecording(undefined);

          notification('danger', 'Thông báo', 'Thu âm bị lỗi!, Bạn vui lòng thu âm lại!');
        }
      }
    };
  };

  render() {
    let { src, statusRecord, classNames__btnRecord, disabled, statusText, isRecord } = this.state;
    if (this.props.__custom) {
      let { __className, __icon } = this.props;
      return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Tooltip style={{ top: 200 }} placement="bottom" title={statusText}>
            <Button
              style={{ display: 'flex', cursor: 'pointer', justifyContent: 'center', alignItems: 'center' }}
              className={classNames([
                'animated',
                classNames__btnRecord,
                __className,
                (statusRecord === 'stop' || statusRecord === 'cal') && 'button-recording-pulse',
              ])}
              onClick={disabled ? null : this.onRecord}
            >
              {disabled ? (
                <i style={{ fontSize: '25px', color: 'black' }} className="fas fa-microphone-slash" />
              ) : statusRecord === 'cal' ? (
                <LoadingOutlined style={{ fontSize: 30, color: 'black' }} />
              ) : statusRecord === 'start' ? (
                __icon ? (
                  __icon
                ) : isRecord ? (
                  <i style={{ fontSize: '25px', color: 'black' }} className="fas fa-undo" />
                ) : (
                  <i style={{ fontSize: '25px', color: 'black' }} className="fas fa-microphone" />
                )
              ) : (
                <i style={{ fontSize: '25px', color: 'black' }} className="fas fa-stop"></i>
              )}
            </Button>
          </Tooltip>
          {this.props.children}
          <br />
          {this.props.__listenAgain && (
            <audio controls src={src} className={classNames(['btn-record__soundClips', 'mt-10'])} />
          )}
          <div
            style={{
              height: 5,
              width: 5,
              display: 'flex',
              flexWrap: 'wrap',
              zIndex: -1,
            }}
          >
            <ReactMic
              record={this.state.record}
              visualSetting="none"
              className="sound-wave d-none"
              onStop={this.onStop}
              onData={this.onData}
              audioBitsPerSecond={128000}
              mimeType={this.props.recordParams?.isTypeIELTS_DICTATION ? 'audio/mp3' : 'audio/wav'}
            />
          </div>
        </div>
      );
    }

    return null;
  }
}

Recorder.propTypes = {
  __custom: PropTypes.bool,
  __className: PropTypes.string,
  __icon: PropTypes.string,
  __listenAgain: PropTypes.bool,
  SpeakPractice: PropTypes.bool,
  onStopTimer: PropTypes.func,
  __onRecording: PropTypes.func,
  __onStopRecording: PropTypes.func,
  recordParams: PropTypes.instanceOf(Object),
  assessment: PropTypes.bool,
};

export default Recorder;
