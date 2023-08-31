import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import RecordRTC from 'recordrtc';

import { captureUserMedia } from './utils';
import Notify from '../Notification';

import { LoadingOutlined } from '@ant-design/icons';
var sdk = require('microsoft-cognitiveservices-speech-sdk');

const hasGetUserMedia = !!(
  navigator.getUserMedia ||
  navigator.webkitGetUserMedia ||
  navigator.mozGetUserMedia ||
  navigator.msGetUserMedia
);

class Recorder extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      src: null,
      recognizer: null,
      recordAudio: undefined,

      statusRecord: 'start',
      classNames__btnRecord: null
    }
  }

  componentDidMount() {
    if (!hasGetUserMedia) {
      Notify('danger', 'Your browser does not support recording', 'Please use chrome or firefox browser')
      return;
    }

    this.initialRecord();
  }

  initialRecord = () => {
    captureUserMedia(stream => {
      try {
        // eslint-disable-next-line react/no-direct-mutation-state
        this.state.recordAudio = RecordRTC(stream, {
          type: 'audio',
          recorderType: RecordRTC.MediaStreamRecorder
        });
      } catch (error) {
        console.log(error)
      }
    });
  };

  onRecord = () => {
    if (this.state.statusRecord === 'start') {
      this.setState(
        {
          statusRecord: 'stop',
          classNames__btnRecord: ['pulse', 'infinite']
        },
        () => {
          // =============================================
          // recordRTC
          this.recordRTCStart();

          // =============================================
          // azure
          var audioConfig = sdk.AudioConfig.fromDefaultMicrophoneInput();
          var speechConfig = sdk.SpeechConfig.fromSubscription('3ffddb2001cc4a6fa1230a10111cc2e4', 'eastasia');

          speechConfig.speechRecognitionLanguage = 'en-US';
          speechConfig.outputFormat = 1;

          this.recognizer = new sdk.SpeechRecognizer(speechConfig, audioConfig);

          this.recognizer.recognized = (s, e) => {
            if (e.result.reason === sdk.ResultReason.NoMatch) {
              this.setState({
                statusRecord: 'start',
                classNames__btnRecord: null
              });
              this.recordRTCStop();
              // var noMatchDetail = sdk.NoMatchDetails.fromResult(e.result);

            } else {
              this.setState({
                statusRecord: 'start',
                classNames__btnRecord: null
              });
              this.recordRTCStop();
              this.props.__receivedResultsFromAzure(e.result.json);
            }
          };

          // start the recognizer and wait for a result.
          this.recognizer.recognizeOnceAsync(
            function (result) {
              this.recognizer.close();
              this.recognizer = undefined;
            },
            function (err) {
              this.recognizer.close();
              this.recognizer = undefined;
            });
        }
      );
    } else {
      this.setState(
        {
          statusRecord: 'cal',
          classNames__btnRecord: null
        },
        () => {
          this.recordRTCStop();
        }
      );
    }
  }

  recordRTCStart = () => {
    let { recordAudio } = this.state;
    if (!recordAudio) return;
    try {
      this.state.recordAudio.startRecording();
    } catch (error) {
      console.log(error);
    }
    if (this.props.__onRecording) {
      this.props.__onRecording();
    }
  }

  recordRTCStop = () => {
    let { recordAudio } = this.state;
    if (!recordAudio) return;
    recordAudio.stopRecording(() => {
      try {
        if (!recordAudio.blob) return;
        let src = window.URL.createObjectURL(recordAudio.blob);

        this.setState(
          {
            src,
            blobs: recordAudio.getBlob(),
            classNames__btnRecord: []
          },
          () => {
            this.recordRTCClear();
            if (this.props.__onStopRecording) {
              let result = {
                src: this.state.src,
                blobs: this.state.blobs
              };
              this.props.__onStopRecording(result);
            }
          }
        );
      } catch (error) {
        console.log(error);
      }
    });
  }

  recordRTCClear = () => {
    let { recordAudio } = this.state;
    if (!recordAudio) return;

    recordAudio.clearRecordedData();
  }

  render() {
    let { src, statusRecord, classNames__btnRecord } = this.state;
    if (this.props.__custom) {
      let { __className, __icon } = this.props;
      return (
        <div>
          <button
            className={classNames([
              'animated',
              classNames__btnRecord,
              __className
            ])}
            onClick={this.onRecord}
          >
            {statusRecord === 'cal' ?
              <LoadingOutlined style={{ fontSize: 30 }} />
              :
              statusRecord === 'start'
                    ? __icon
                      ? __icon
                      : <i style={{ fontSize: '25px' }} className="fas fa-microphone" />
                    : <i style={{ fontSize: '25px' }} className="fas fa-stop"></i>
            }
          </button>
          {this.props.children}
          <br />
          {this.props.__listenAgain && (
            <audio
              controls
              src={src}
              className={classNames(['btn-record__soundClips', 'mt-10'])}
            />
          )}
        </div>
      );
    }

    return null;
  }
}

Recorder.propTypes = {
  __custom: PropTypes.bool,
  __className: PropTypes.string,
  __listenAgain: PropTypes.bool,
  __onRecording: PropTypes.func,
  __onStopRecording: PropTypes.func,
  __receivedResultsFromAzure: PropTypes.func
};

export default Recorder;