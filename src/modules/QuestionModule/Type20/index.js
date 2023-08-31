import React from 'react';
import classNames from 'classnames';
import * as __typeText from '../typesQuestion';
import * as functions from 'components/functions';

import { Rate } from 'antd';
import { Row, Col, Card, CardTitle, ListGroup, ListGroupItem, UncontrolledTooltip, Button } from 'reactstrap';
import Listen from 'components/Listening';
import AMES247Button from 'components/Button';
import Recorder from 'components/Recording/react_mic';
import CountdownTimer from 'components/countdownTimer';
import openNotificationWithIcon from 'components/Notification';
import { DictionaryText } from 'components/Dictionary';
import PropTypes from 'prop-types';

class Type20 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      resultRecord: undefined,
      change: false,
      text_answer: '',
      exerciseCountdowns: [],
      disibledButton: false,
    };
    this.isCorrect = false;

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
    this.setState({ disabledNext: true }, () => {
      if (typeof this.props.startRecord === 'function') {
        this.props.startRecord();
      }
      this.refCountdownTimer.current.startTimer();
    });
  };

  onStopRecording = (result) => {
    this.setState({ resultRecord: result });
  };

  onStopTimer = () => {
    if (typeof this.refCountdownTimer.current.stopTimer === 'function') {
      this.refCountdownTimer.current.stopTimer();
    }
  };

  onNext_answer = (answer, isCorrect) => {
    this.isCorrect = isCorrect;
    this.setState({ disibledButton: true });
    const type = 'choose';
    this.checkAnswer(type);
    setTimeout(() => {
      this.setState({ change: true, text_answer: answer });
    }, 2000);
  };

  onNext_record = () => {
    this.setState({ change: false, disibledButton: false });
    const { text_answer, exerciseCountdowns, resultRecord } = this.state;
    const { takeExamTime, question, onNext, questionIndex } = this.props;
    let CorrectText = '';
    JSON.parse(question.answers).forEach((answer) => {
      if (answer.isCorrect === true) {
        CorrectText = answer.answer;
      }
    });

    let type = 'record';
    const isPush = false;
    // check answer true or false
    let isCorrect = false;
    if (this.isCorrect && resultRecord.score > 50) {
      isCorrect = true;
    }

    exerciseCountdowns.push({ resultRecord, text_answer, questionIndex, isDone: isCorrect });
    const postAnswerToApiParams = {
      questionGuid: question.id,
      answerType: functions.getAnswerType(__typeText.Type20),
      notes: '',
      takeExamTime: takeExamTime,
      studentChoice: JSON.stringify({
        correctText: CorrectText,
        correctAudioUrl: question.correctAudioUrl,
        text: text_answer,
        recordResult: {
          score: resultRecord.score || 0,
          recordUrl: resultRecord.recordUrl || '',
        },
      }),
    };
    this.checkAnswer(type);

    onNext(exerciseCountdowns, postAnswerToApiParams, isPush);
    this.setState({ resultRecord: undefined });
  };

  checkAnswer = (type) => {
    if (type === 'choose') {
      if (this.isCorrect) {
        openNotificationWithIcon('success', 'Chính xác', 'Chúc mừng bạn đã trả lời đúng');
      } else {
        openNotificationWithIcon('danger', 'Không chính xác', 'Vui lòng kiểm tra lại kết quả');
      }
    }
    // } else {
    //   if (resultRecord.score > functions.satisfactoryResults) {
    //     openNotificationWithIcon(
    //       'success',
    //       'Chính xác',
    //       'Chúc mừng bạn đã trả lời đúng'
    //     );
    //   } else {
    //     openNotificationWithIcon(
    //       'danger',
    //       'Không chính xác',
    //       'Vui lòng kiểm tra lại kết quả'
    //     );
    //   }
    // }
  };

  render = () => {
    const { resultRecord, change } = this.state;
    const { studentId, question, takeExamTime } = this.props;
    console.log('🚀 ~ question', question);

    // chờ dữ liệu từ server mới được xử lý, khi render không có dữ liệu bị undefined nên lỗi
    const textFill = question.correctAnswerText?.replace('\r\n', ' ');

    const recordParams = {
      questionId: question.id,
      questionText: textFill,
      studentId,
      takeExamTime,
    };

    if (!question.answers || typeof question.answers !== 'string') return null;

    return (
      <React.Fragment>
        {!change ? (
          <Row className="justify-content-md-center text-center mt-3">
            <Col lg="8">
              <Card>
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
                    <DictionaryText text={question.questionText} />
                    {question.imageUrl && (
                      <div style={{ padding: '0.25rem' }}>
                        <img src={question.imageUrl} style={{ width: 200, borderRadius: 7 }} />
                      </div>
                    )}
                  </ListGroupItem>
                  <ListGroupItem>
                    {JSON.parse(question.answers).map((answer, index) => {
                      return (
                        <AMES247Button
                          key={index}
                          disabled={this.state.disibledButton}
                          value={answer.answer}
                          style={{
                            fontWeight: '700',
                            width: '70%',
                            margin: 10,
                          }}
                          onClick={() => this.onNext_answer(answer.answer, answer.isCorrect)}
                        />
                      );
                    })}
                  </ListGroupItem>
                </ListGroup>
              </Card>
            </Col>
          </Row>
        ) : (
          // //////////////////////////////////////////////////////////////////////
          // //////////////////////////////////////////////////////////////////////
          // //////////////////////////////////////////////////////////////////////
          // //////////////////////////////////////////////////////////////////////

          <Card className="text-center">
            <Row>
              <Col xs={24} sm={24} lg={12} md={12}>
                <Card className="bg-primary text-white text-center p-4">
                  <CardTitle>
                    <Listen audioURL={question.correctAudioUrl} onAuto={true} />
                  </CardTitle>
                  <blockquote className="blockquote mb-0">
                    <p style={{ fontSize: 20 }}>
                      <DictionaryText text={question.correctAnswerText} />
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
                      {resultRecord?.wordShows.map((item, i) => (
                        <span
                          key={i}
                          style={{ color: item.color }}
                          className={classNames(['question-type__textReply'])}
                        >
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
                                  audioURL={resultRecord?.recordUrl}
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
        )}
      </React.Fragment>
    );
  };
}

Type20.propTypes = {
  questionIndex: PropTypes.number,
  onNext: PropTypes.func,
  startRecord: PropTypes.func,
  studentId: PropTypes.number,
  takeExamTime: PropTypes.string,
  question: PropTypes.instanceOf(Object),
};

export default Type20;
