import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col, Button, Card, CardTitle, CardText, CardImg, CardBody, CardFooter } from 'reactstrap';
import Recorder from '../../../components/Recording/react_mic';
import CountdownTimer from '../../../components/countdownTimer';
import openNotificationWithIcon from 'components/Notification';
import axios from 'axios';
import _get from 'lodash/get';
import ModalConfirmType32 from 'components/Modal/ModalConfirmType32';

const color = ['warning', 'success', 'danger', 'info', 'default'];
const randomIndex = Math.floor(Math.random(color) * 5);
const name = `bg-${color[randomIndex]} justify-content-md-center align-items-center mt-2`;

export default class Type36 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      question: [],
      resultRecord: undefined,
      isVisibled: false,
      disableSubmit: false,
      isSeen: false,
      exerciseCountdowns: [],
    };
    // this.takeExamTime = props.takeExamTime;
    // this.questionIndex = props.takeExamTime;

    this.refRecorder = React.createRef();
    this.refCountdownTimer = React.createRef();
  }

  static getDerivedStateFromProps = (props, state) => {
    if (props.question !== state.question) {
      return {
        question: props.question,
      }
    }
    return null;
  }

  onRecording = () => {
    const { startRecord } = this.props;
    this.setState({ resultRecord: undefined }, () => {
      if (typeof startRecord === 'function') {
        startRecord();
      }
      this.refCountdownTimer.current.startTimer();
    });
  };

  onStopRecording = (result) => {
    if (typeof this.refCountdownTimer.current.stopTimer == 'function') {
      this.refCountdownTimer.current.stopTimer();
      this.setState({ resultRecord: result });
    }
  }

  onNext = () => {
    const { resultRecord, exerciseCountdowns } = this.state;
    const { onNext, questionIndex } = this.props;
    const isPush = false;
    const isCorrect = true;
    exerciseCountdowns.push({ resultRecord, questionIndex, isDone: isCorrect });
    const postAnswerToApiParams = null
    onNext(exerciseCountdowns, postAnswerToApiParams, isPush);
    // this.postAnswerToAPI();

  };

  onFinish = () => {
    const isCorrect = true;
    this.onNext();
    this.checkAnswer(isCorrect);
    this.postAnswerToAPI();
  }

  checkAnswer = (isCorrect) => {
    if (isCorrect) {
      openNotificationWithIcon(
        'success',
        'Chính xác',
        'Chúc mừng bạn đã hoàn thành bài nói vui lòng đợi kết quả'
      );

    } else {
      openNotificationWithIcon(
        'danger',
        'Không chính xác',
        'Bạn chưa hoàn thành bài nói vui lòng kiểm tra lại'
      );
    }
  };

  postAnswerToAPI = () => {
    let { question, resultRecord } = this.state;

    let { takeExamTime, studentId, sessionId, classId } = this.props;


    var bodyFormData = new FormData();

    bodyFormData.append('Device', 'WEB');
    bodyFormData.append('mode', 'Dictation');
    bodyFormData.append('questionId', question.id);
    bodyFormData.append('studentID', studentId);
    bodyFormData.append('takeExamTime', takeExamTime);
    bodyFormData.append('extensionInput', 'wav');
    bodyFormData.append('input', resultRecord.base64data);
    bodyFormData.append('sessionId', sessionId);
    bodyFormData.append('classId', classId);

    try {
      axios({
        method: 'POST',
        url: 'https://ames.edu.vn/ames/api/amesapi/SaveAnswerTypeSpeak',
        data: bodyFormData,
        config: { headers: { 'Content-Type': 'multipart/form-data' } }
      }).then(response => {

        this.setState({ isVisibled: false, resultRecord: '' })
      }).catch(function (error) {

      });
    }
    catch (error) {

    }
  };

  renderRecorder = () => {
    const { question, resultRecord, isSeen } = this.state;
    const { takeExamTime, studentId } = this.props;
    const linkYoutube = _get(question, 'linkYoutube') || ''

    const recordParams = {
      questionId: question.id,
      // questionText: question.text,
      studentId,
      takeExamTime,
    };

    const recordUrl = question.isPlayed ? question.recordUrl : resultRecord?.recordedBlob.blobURL;

    const onClick = () => question.isPlayed ? this.onNext() : this.toggleModal()

    return (
      <Card>

        {/* Kiểm tra đã trả lời câu hỏi chưa */}
        {question.isPlayed ? (
          <div style={{ fontWeight: 'bold' }}>Bạn đã hoàn thành câu hỏi này, vui lòng tiếp tục câu tiếp theo</div>
        ) : (
            <div className='text-center'>
              <Recorder
                ref={this.refRecorder}
                __custom
                __className={'question-type__recordType02'}
                __onRecording={this.onRecording}
                __onStopRecording={this.onStopRecording}
                recordParams={recordParams}
                SpeakPractice
              />
              <div>
                <CountdownTimer
                  seconds={90}
                  ref={this.refCountdownTimer}
                  onStopRecording={this.onStopRecording}
                >
                  <span>Recording in: </span>
                </CountdownTimer>
              </div>
              <p style={{ color: '#5d6670', marginTop: 15 }}>Lưu ý: Bạn hãy dành thời gian chuẩn bị ý chính cho bài nói trước khi bắt đầu ghi âm!</p>
            </div>
          )}
        {resultRecord && (
          <div>
            <div className="record--result">
              <audio controls="controls" src={recordUrl} />
              <Button
                color='info'
                className='ml-2'
                onClick={onClick}
              >
                {question.isPlayed ? 'Tiếp tục' : 'Nộp bài'}
              </Button>
            </div>
          </div>
        )}

        <CardFooter className='text-center'>
          {linkYoutube && (
            <Button
              style={{
                // position: 'absolute',
                height: 45,
                top: 10,
                color: '#fff',
                background: '#09386d',
                fontWeight: 'bold',
                // boxShadow: '-4px 5px 7px 2px darkgrey',
                borderColor: '#09386d',
              }}
              onClick={() => {
                this.setState({ isSeen: true })
                window.open(linkYoutube)
              }}
            >
              {isSeen ? 'Xem lại bài giảng' : 'Xem bài giảng'}
            </Button>
          )}
        </CardFooter>

      </Card>
    )
  }

  toggleModal = () => {
    const { isVisibled } = this.state;
    this.setState({ isVisibled: !isVisibled })
  }

  render = () => {
    const { question, isVisibled } = this.state;
    return (
      <Row className={name}>
        <Col className='mt-4'>
          <Card>
            <CardImg
              alt="..."
              src={question.imageUrl}
              top
            />
            <CardBody>
              <CardTitle style={{ fontSize: 15, fontWeight: '500' }}>Bạn hãy thuyết trình về chủ đề dưới đây trong vòng 2 phút.</CardTitle>
              <CardText>
                <p style={{ textAlign: 'left' }} dangerouslySetInnerHTML={{ __html: question.text }} />
              </CardText>
            </CardBody>
          </Card>
        </Col>
        <Col className='align-items-center'>
          {this.renderRecorder()}
        </Col>
        <ModalConfirmType32 onFinish={this.onFinish} isVisibled={isVisibled} toggleModal={this.toggleModal} />
      </Row >
    );
  }
}

Type36.propTypes = {
  startRecord: PropTypes.func,
  onNext: PropTypes.func,
  takeExamTime: PropTypes.string,
  sessionId: PropTypes.string,
  classId: PropTypes.string,
  studentId: PropTypes.number,
  questionIndex: PropTypes.number,
  questions: PropTypes.instanceOf(Array),
  allProps: PropTypes.instanceOf(Object),
  question: PropTypes.instanceOf(Object),
}