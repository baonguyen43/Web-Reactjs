/* eslint-disable react/prop-types */
import React from 'react';
import classNames from 'classnames';
import * as textTypes from '../typesQuestion';
import * as functions from 'components/functions';
import { Rate } from 'antd';
import {
  CardTitle,
  Card,
  Row,
  Col,
  Button,
  ListGroup,
  ListGroupItem,
  UncontrolledTooltip,
  CardImg,
  CardBody,
  CardText,
  Container
} from 'reactstrap';
import Listen from 'components/Listening';
import CountdownTimer from 'components/countdownTimer';
import openNotificationWithIcon from 'components/Notification';
import Recorder from 'components/Recording/react_mic';
import PropTypes from 'prop-types';
import ReactHtmlParser from 'react-html-parser';

class Type08 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      questions: [],
      resultRecord: undefined,
      questionContent: false,
      exerciseCountdowns: [],
    };
    //this.recordUrlFromApi = null;
    // this.questionIndex = 0;
    this.refRecorder = React.createRef();
    this.refCountdownTimer = React.createRef();
  }

  // componentDidMount = () => {
  //   const sentences = JSON.parse(this.props.question.jsonData);
  //   const { bookLevel: level, folderName: folder } = this.props.question
  //   let questions = []
  //   const baseUri = `https://ames.edu.vn/Data/Reading/${level}/${folder}`;
  //   const imageBaseUri = `${baseUri}/images/{index}.jpg`;
  //   const soundBaseUri = `${baseUri}/sounds/{index}.mp3`;
  //   sentences.forEach((sen, senIndex) => {
  //     const soundUri = soundBaseUri.replace('{index}', senIndex + 1);
  //     const imageUri = imageBaseUri.replace('{index}', senIndex + 1);
  //     const tmpSen = [...sen];
  //     const data = [];
  //     const second = [];
  //     tmpSen.forEach((word) => {
  //       data.push([word[0]]);
  //       second.push(word[1]);
  //       // tmpSen[wordIndex].push(new Animated.Value(0));
  //     });
  //     questions.push({
  //       id: senIndex,
  //       text: data.join(' '),
  //       second,
  //       imageUrl: imageUri,
  //       soundUrl: soundUri,
  //       // played: false
  //     });
  //   });
  //   this.setState({ questions })
  // }

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

  changeQuestion = (type) => () => {
    type === 'next' ? this.questionIndex++ : this.questionIndex--
    this.setState({ resultRecord: null })
  }


  onNext = () => {
    const { resultRecord, exerciseCountdowns } = this.state;
    // eslint-disable-next-line no-unused-expressions
    this.refRecorder.current?.resetRecord();
    this.checkAnswer(resultRecord);
    const { onNext, questionIndex } = this.props;
    exerciseCountdowns.push({ resultRecord, questionIndex });
    const isPush = false;
    const postAnswerToApiParams = {

      notes: '',
      questionGuid: '',
      answerType: functions.getAnswerType(textTypes.Type07),
      studentChoice: JSON.stringify({
        score: resultRecord?.score || 0,
        wordShows: resultRecord?.wordShows || [],
        recordUrl: resultRecord?.recordUrl || ''
      }),
    }
    onNext(exerciseCountdowns, postAnswerToApiParams, isPush);
    // eslint-disable-next-line no-unused-expressions
    this.setState({ resultRecord: undefined, resetRecord: true });
  }

  checkAnswer = (resultRecord) => {
    /// Kiểm tra type kiểu Ghi âm
    if (resultRecord?.score > functions.satisfactoryResults) {
      openNotificationWithIcon('success', 'CORRECT', 'Chúc mừng bạn đã phát âm đúng');
    } else {
      openNotificationWithIcon('danger', 'INCORRECT', 'Vui lòng kiểm tra lại phần phát âm');
    }
  };

  renderRecorder = () => {
    const { resultRecord } = this.state;
    const { studentId, takeExamTime, assignmentId, question } = this.props;
    const text = question?.text.replace(/<[^>]*>?/gm, '');// Remove html tags except br tag

    const recordParams = {
      questionId: assignmentId,
      questionText: text,
      studentId,
      takeExamTime,
      // isTypeIELTS_DICTATION:true,
    };
    return (
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
          <CountdownTimer color='white' seconds={15} ref={this.refCountdownTimer} onStopRecording={this.onStopRecording}>
            <span style={{ color: 'white' }}>Recording in: </span>
          </CountdownTimer>
        </div>
        <br />
        {/* ///////////////////////// */}
        {/* Sau khi ghi âm có kết quả */}
        {resultRecord && (
          <div>

            <br />
            <Row className="justify-content-md-center">
              <Col lg="5" style={{ minWidth: 400 }}>
                <ListGroup>
                  <ListGroupItem>
                    {resultRecord.wordShows.map((item, i) => (
                      <span key={i} style={{ color: item.color }} className={classNames(['question-type__textReply'])}>{item.word} </span>
                    ))}</ListGroupItem>
                  <ListGroupItem className="d-flex justify-content-between align-items-center">
                    <div>
                      <Listen custom className={'record--content record--result__listen'} audioURL={resultRecord.recordUrl}>
                        <Button color="info" id="tooltipRepeat">
                          <i style={{ fontSize: 15 }} className="fas fa-volume-up" />
                        </Button>
                        <UncontrolledTooltip
                          delay={0}
                          placement="top"
                          target="tooltipRepeat"
                        >
                          Nhấn để nghe lại
                          </UncontrolledTooltip>
                      </Listen>
                    </div>
                    <Rate allowHalf disabled value={functions.getStarRecord(resultRecord.score)} />
                    <strong>{`${parseInt(resultRecord.score)}%`}</strong>
                    <div>
                      <Button color="info" onClick={this.onNext} id='tooltipNextButton'>
                        <i style={{ fontSize: 15 }} className="fas fa-arrow-circle-right" />
                      </Button>
                      <UncontrolledTooltip
                        delay={0}
                        placement="top"
                        target="tooltipNextButton"
                      >
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

    );
  };

  transform = (node, index) => {

    if (node.type === 'text') {
      const element = node.data.split(' ');
      return element.map((item, index) => {
        return (
          <span key={index}>
            {item}{' '}
          </span>
        )
      })
    }
  }

  changeColor = () => {
  }

  render() {
    const {
      // disabledBack,
      // disabledNext,
      question,
      // onBack
    } = this.props;

    return (
      <Container>
        <Row className="justify-content-md-center">

          <Card className="bg-gradient-info text-white text-center p-4">
            <CardImg
              style={{ maxHeight: 400, minWidth: 400 }}
              alt="..."
              src={question?.imageUrl}
              top
            />
            <CardBody>
              <CardTitle >
                <Listen
                  // changeColor={this.changeColor()}
                  audioURL={question?.soundUrl}
                  onAuto={false}
                />
              </CardTitle>
              <CardText style={{ fontSize: 16, fontWeight: '600' }}>
                {question?.text && ReactHtmlParser(question?.text, { transform: this.transform })}
                {/* <div dangerouslySetInnerHTML={{ __html: question?.text }} /> */}
              </CardText>
            </CardBody>
            <CardBody style={{ padding: 0 }}>
              {this.renderRecorder()}
              {/* <Button
                disabled={disabledBack}
                onClick={onBack}
              >Back
              </Button>
              <Button
                disabled={disabledNext}
                onClick={() => this.onNext()}
              >Next
              </Button> */}
            </CardBody>
          </Card>

          {/* <Col lg="6">
            {this.renderRecorder()}
          </Col> */}
        </Row>

      </Container>
    );
  }
}


Type08.propTypes = {
  studentId: PropTypes.number,
  questionIndex: PropTypes.number,
  takeExamTime: PropTypes.string,
  assignmentId: PropTypes.string,
  startRecord: PropTypes.func,
  onNext: PropTypes.func,
  question: PropTypes.instanceOf(Object).isRequired,
}

export default Type08;
