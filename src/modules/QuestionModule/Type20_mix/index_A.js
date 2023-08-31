import React from 'react';
import classNames from 'classnames';
import * as typeText from '../typesQuestion';
import * as functions from 'components/functions';
import moment from 'moment';
import { Image, Rate } from 'antd';
import { Row, Col, Card, CardTitle, ListGroup, ListGroupItem, Button, UncontrolledTooltip } from 'reactstrap';
import Listen from 'components/Listening';
import AMES247Button from 'components/Button';
import Recorder from 'components/Recording/react_mic';
import CountdownTimer from 'components/countdownTimer';
import openNotificationWithIcon from 'components/Notification';
import { DictionaryText } from 'components/Dictionary';
import NotData from 'components/Error/NotData';
import PropTypes from 'prop-types';

class Type20 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      resultRecord: undefined,
      change: false,
      styleImage: {
        width: 300,
      },
      text_answer: null,
    };
    this.isCorrect = false;
    this.questionGuid = functions.uuid();
    this.refRecorder = React.createRef();
    this.refCountdownTimer = React.createRef();
  }

  onLoadImage = ({ target: img }) => {
    if (img.offsetWidth > 490) {
      this.setState({
        styleImage: {
          width: '450px',
        },
      });
    }
  };

  onRecording = () => {
    const { startRecord } = this.props;
    this.setState({ disabledNext: true }, () => {
      if (typeof startRecord === 'function') {
        startRecord();
      }
      this.refCountdownTimer.current.startTimer();
    });
  };

  onStopRecording = (result) => {
    this.setState({ resultRecord: result, disabledNext: false });
  };

  onStopTimer = () => {
    if (typeof this.refCountdownTimer.current.stopTimer === 'function') {
      this.refCountdownTimer.current.stopTimer();
    }
  };

  onNext_answer = (answer, isCorrect) => {
    this.setState({ change: true, text_answer: answer });
    const type = 'choose';
    this.checkAnswer(type, isCorrect);
  };

  onNext_record = async () => {
    this.setState({ change: false });
    const { text_answer } = this.state;
    const { questionContent, answers, nextQuestion } = this.props;
    let CorrectText = '';
    answers.forEach((answer) => {
      if (answer.isCorrect === true) {
        CorrectText = answer.answer;
      }
    });
    let type = 'record';
    // check answer true or false
    this.checkAnswer(type);

    await this.postAnswerToAPI({
      correctText: CorrectText,
      correctAudioUrl: questionContent[0].correctAudioUrl,
      text: text_answer,
    });
    nextQuestion();
  };

  checkAnswer = (type, isCorrect) => {
    const { resultRecord } = this.state;

    if (type === 'choose') {
      if (isCorrect === true) {
        openNotificationWithIcon('success', 'Chính xác', 'Chúc mừng bạn đã trả lời đúng');
      } else {
        openNotificationWithIcon('danger', 'Không chính xác', 'Vui lòng kiểm tra lại kết quả');
      }
    } else {
      if (resultRecord.score > functions.satisfactoryResults) {
        openNotificationWithIcon('success', 'Chính xác', 'Chúc mừng bạn đã trả lời đúng');
      } else {
        openNotificationWithIcon('danger', 'Không chính xác', 'Vui lòng kiểm tra lại kết quả');
      }
    }
  };

  postAnswerToAPI = ({ correctText, correctAudioUrl, text }) => {
    const { question, studentInfo, questionContent, selectedPart, partQuestion, speechRecognitionAPI } = this.props;

    const { resultRecord } = this.state;
    const duration = moment().diff(this.state.timeStart);
    const answerModel = {
      studentId: studentInfo.StudentId,
      sessionId: question.sessionId,
      assignmentId: question.assignmentId,
      questionEntityName: questionContent[0].entityName,
      questionId: 0,
      groupName: partQuestion ? selectedPart.GroupName : '',
      questionGuid: questionContent[0].id,
      answerType: functions.getAnswerType(typeText.Type20),
      notes: speechRecognitionAPI,
      takeExamTime: question.takeExamTime,
      studentChoice: JSON.stringify({
        correctText,
        correctAudioUrl,
        text,
        recordResult: {
          score: resultRecord.score || 0,
          recordUrl: resultRecord.recordUrl || '',
        },
      }),
      duration,
    };
    const request = functions.postAnswerToAPI(answerModel);

    request
      .then(() => {
        this.setState({ resultRecord: undefined });
      })
      .catch((err) => {
        console.log(err);
      });
    return request;
  };

  stepRecord = () => {
    const { resultRecord } = this.state;

    const { studentInfo, question, questionContent } = this.props;
    // Truyền param để ghi âm chấm điểm
    const recordParams = {
      questionId: questionContent[0].id,
      questionText: questionContent[0].correctAnswerText,
      studentId: studentInfo.StudentId,
      takeExamTime: question.takeExamTime,
    };

    return (
      <div
        style={{
          width: '90%',
          justifyContent: 'center',
          alignItems: 'center',
          paddingTop: 50,
        }}
      >
        <Card>
          <Row>
            <Col xs={24} sm={24} lg={12} md={12}>
              <Card className="bg-primary text-white text-center p-4">
                <CardTitle>
                  <Listen audioURL={questionContent[0].correctAudioUrl} onAuto={true} />
                </CardTitle>
                <blockquote className="blockquote mb-0">
                  <p style={{ fontSize: 20 }}>
                    <DictionaryText text={questionContent[0].correctAnswerText} />
                  </p>
                  <footer className="blockquote-footer">
                    <small>Nhấp vào để tra cứu nghĩa từng từ </small>
                  </footer>
                </blockquote>
              </Card>
              {/* <h2 className={classNames(["question-type__grammar_text"])}></h2> */}
            </Col>

            <Col
              // style={{ backgroundColor: "#EBECF1" }}

              xs={24}
              sm={24}
              lg={12}
              md={12}
            >
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
                {resultRecord && (
                  <div>
                    {resultRecord.wordShows.map((item, i) => (
                      <span key={i} style={{ color: item.color }} className={classNames(['question-type__textReply'])}>
                        {item.word}{' '}
                      </span>
                    ))}
                    <br />
                    <Row className="justify-content-md-center">
                      <Col lg="5" style={{ minWidth: 400 }}>
                        <ListGroup>
                          <ListGroupItem className="d-flex justify-content-between align-items-center">
                            <div>
                              <Listen
                                custom
                                className={'record--content record--result__listen'}
                                audioURL={resultRecord.recordUrl}
                              >
                                <Button color="info" id="tooltipRepeat">
                                  <i style={{ fontSize: 15 }} className="fas fa-volume-up" />
                                </Button>
                                <UncontrolledTooltip delay={0} placement="top" target="tooltipRepeat">
                                  Nhấn để nghe lại
                                </UncontrolledTooltip>
                              </Listen>
                            </div>
                            <Rate allowHalf disabled value={functions.getStarRecord(resultRecord.score)} />
                            <strong>{`${parseInt(resultRecord.score)}%`}</strong>
                            <div>
                              <Button color="info" onClick={this.onNext_record} id="tooltipNextButton">
                                <i style={{ fontSize: 15 }} className="fas fa-arrow-circle-right" />
                              </Button>
                              <UncontrolledTooltip delay={0} placement="top" target="tooltipNextButton">
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
            </Col>
          </Row>
        </Card>
      </div>
    );
  };

  stepMultiple = () => {
    const { questionContent, answers } = this.props;
    return (
      <>
        <Row className="justify-content-md-center">
          <Card
            style={{
              width: '80%',
              marginTop: 50,
            }}
            // className="border"
          >
            <ListGroup>
              <ListGroupItem
                style={{
                  // backgroundColor: "#F5365C",
                  borderWidth: 0,
                  fontSize: 20,
                  fontWeight: '500',
                }}
                className="active bg-gradient-danger text-center"
              >
                <DictionaryText text={questionContent[0].questionText} />
                {questionContent[0].imageUrl && (
                  <div style={{ padding: '0.25rem' }}>
                    <img src={questionContent[0].imageUrl} style={{ width: 200, borderRadius: 7 }} />
                  </div>
                )}
              </ListGroupItem>
              <ListGroupItem>
                {answers.map((answer, index) => {
                  return (
                    <AMES247Button
                      key={index}
                      value={answer.answer}
                      style={{
                        fontWeight: '700',
                        width: '50%',
                        margin: 10,
                      }}
                      onClick={() => this.onNext_answer(answer.answer, answer.isCorrect)}
                    />
                  );
                })}
              </ListGroupItem>
            </ListGroup>
          </Card>
        </Row>
      </>
    );
  };

  render = () => {
    const { change } = this.state;
    const { question } = this.props;

    if (!question) {
      return <NotData />;
    }

    return <React.Fragment>{change === false ? this.stepMultiple() : this.stepRecord()}</React.Fragment>;
  };
}

Type20.propTypes = {
  questionIndex: PropTypes.number.isRequired,
  timeStart: PropTypes.string.isRequired,
  type: PropTypes.string,
  speechRecognitionAPI: PropTypes.string.isRequired,
  nextQuestion: PropTypes.func.isRequired,
  startRecord: PropTypes.func,
  loading: PropTypes.bool,
  partQuestion: PropTypes.bool,
  question: PropTypes.instanceOf(Object).isRequired,
  questionContent: PropTypes.instanceOf(Object).isRequired,
  answers: PropTypes.instanceOf(Object).isRequired,
  selectedPart: PropTypes.instanceOf(Object).isRequired,
  studentInfo: PropTypes.instanceOf(Object).isRequired,
};
export default Type20;
