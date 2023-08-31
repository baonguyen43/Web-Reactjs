import React from 'react';
import { CardTitle, Card, Row, Col, Button, CardImg, CardBody, CardText } from 'reactstrap';
import Listen from 'components/Listening';
import * as textTypes from '../typesQuestion';
import openNotificationWithIcon from 'components/Notification';
import PropTypes from 'prop-types';
import * as functions from 'components/functions';
import ButtonText from 'components/Button';
import { Markup } from 'interweave';

const arrayText = ['A', 'B', 'C', 'D', 'E', 'F'];

class Type31 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      exerciseCountdowns: [],
      checkbox: null,
      question: [],
      isDoing: false,
      isDisabled: true,
    };
    this.answerArray = [];
  }

  static getDerivedStateFromProps = (props, state) => {
    if (props.question !== state.question && !state.isDoing) {
      return {
        question: props.question,
        isDoing: true,
      };
    }
    return null;
  };

  onNext = (answer) => {
    const { exerciseCountdowns, question } = this.state;

    const { onNext, questionIndex } = this.props;

    let isCorrect = false;
    let score = 0;
    if (question.type === 'MULTIPLE') {
      answer.forEach((item) => {
        const isCorrectTypeMuti = question.questions[item.questionsIndex].answers[item.answerIndex].isCorrect;
        if (isCorrectTypeMuti) {
          score++;
        }
      });
      isCorrect = score >= 2 ? true : false;
    } else {
      isCorrect = answer.isCorrect;
    }

    this.checkAnswer(isCorrect);

    exerciseCountdowns.push({ answer, questionIndex, isDone: isCorrect });
    const isPush = false;

    let isSingleQuestion = question.type === 'SINGLE';
    const isRecorderVisible = false;
    const isButtonListVisible = true;
    const isPart6 = question.part === 6 || question.part === 7;
    isSingleQuestion = question.type === 'SINGLE';
    const isImageVisible = typeof question.imageUrl === 'string' && question.imageUrl.length > 0;
    const isSpeakerVisible = typeof question.audioUrl === 'string' && question.audioUrl.length > 0 && isPart6 === false;
    const isPart6QuestionTextVisible = isPart6 && question.questions instanceof Array && question.questions.length > 0;
    const isABCD_Button = isSpeakerVisible;
    const questionGuid = isSingleQuestion ? question.id : question.questions[0].id;

    const postAnswerToApiParams = {
      notes: '',
      questionGuid,
      answerType: functions.getAnswerType(textTypes.Type31),
      studentChoice: JSON.stringify({
        isPart6,
        isABCD_Button,
        isImageVisible,
        isSingleQuestion,
        isSpeakerVisible,
        isRecorderVisible,
        isButtonListVisible,
        //
        type: question.type,
        part: question.part,
        //
        question: {
          part: question.part,
          answers: question.answers,
          audioUrl: question.audioUrl,
          imageUrl: question.imageUrl,
          questions: question.questions,
          selectedItem: answer,
          questionText: question.questionText,
        },
        isPart6QuestionTextVisible,
      }),
    };
    onNext(exerciseCountdowns, postAnswerToApiParams, isPush);
    this.setState({ resultRecord: undefined, isDoing: false, isDisabled: true });
    this.answerArray = [];
  };

  checkAnswer = (isCorrect) => {
    /// Kiểm tra type kiểu Ghi âm
    if (isCorrect) {
      openNotificationWithIcon('success', 'CORRECT', 'Chúc mừng bạn đã trả lời đúng');
    } else {
      openNotificationWithIcon('danger', 'INCORRECT', 'Vui lòng kiểm tra lại kết quả');
    }
  };

  onNextPartMultiple = () => {};

  /// Part 3 -4 -6
  choiceAnwsers = (questionsIndex, answerIndex) => {
    const { question } = this.state;

    question.questions[questionsIndex].answers.map((item) => (item.choice = false));
    // Push anwer dc chon vao mảng để đổi màu khi chọn
    question.questions[questionsIndex].answers[answerIndex].choice = true;

    // Tìm xem vị trí đã push
    const indexArray = this.answerArray.findIndex((x) => x.questionsIndex === questionsIndex);
    const isPushToArray = indexArray > -1;

    // Thêm trường selectedItem vào param to API
    question.questions[questionsIndex].selectedItem = {
      ...question.questions[questionsIndex].answers[answerIndex],
      index: answerIndex,
    };

    // Kiểm tra đã chèn vào mảng câu trả lời chưa
    if (isPushToArray) {
      this.answerArray[indexArray].answerIndex = answerIndex;
    } else {
      this.answerArray.push({ questionsIndex, answerIndex });
    }

    this.setState({ question, isDisabled: false });
  };

  renderMultiple = () => {
    const { question, isDisabled } = this.state;

    let answers = null;

    if (typeof question.answers === 'string') {
      answers = JSON.parse(question.answers);
    }
    return (
      <>
        {/* PART 1-2-5 */}
        {question.type !== 'MULTIPLE' && answers && (
          <>
            <Card className="text-center mt-4">
              <CardBody className="bg-red text-white" style={{ borderRadius: 5 }}>
                {question.part === 1 && (
                  <CardText style={{ fontSize: 15, fontWeight: '400' }}>
                    Listen and select the one statement that best describes what you see in the picture.
                  </CardText>
                )}

                {question.part === 2 && (
                  <CardText style={{ fontSize: 15, fontWeight: '400' }}>
                    Listen and select the best response to the question or statement and mark the letter (A), (B), or
                    (C)
                  </CardText>
                )}

                {question.part === 5 && (
                  <CardText style={{ fontSize: 18, fontWeight: '500' }}>{question.questionText}</CardText>
                )}
              </CardBody>

              <CardBody className="align-items-center">
                {answers.map((answer, index) => {
                  answer.index = index;
                  return answer.answer === '' ? (
                    <Button
                      className="mt-3"
                      key={index}
                      style={{ width: 60, height: 60, borderRadius: 30, fontSize: 15, fontWeight: '500' }}
                      color="info"
                      outline
                      onClick={() => this.onNext(answer)}
                    >
                      {arrayText[index]}
                    </Button>
                  ) : (
                    <ButtonText
                      key={index}
                      value={answer.answer}
                      style={{
                        fontWeight: '700',
                        width: '80%',
                        margin: 10,
                      }}
                      onClick={() => this.onNext(answer)}
                    >
                      {answer.answer}
                    </ButtonText>
                  );
                })}
              </CardBody>
            </Card>
          </>
        )}
        {/* PART 3 4 6 */}
        {question.type === 'MULTIPLE' && (
          <>
            <div
              style={{
                overflowY: 'scroll',
                height: '470px',
              }}
            >
              <CardBody className="text-center">
                {question.questions.map((item, index) => {
                  return (
                    <React.Fragment key={index}>
                      <CardBody className="bg-red text-white" style={{ borderRadius: 5 }}>
                        <CardText style={{ fontSize: 15, fontWeight: '400' }}>
                          Questions {index + 1}: {item.questionText}
                        </CardText>
                      </CardBody>
                      {question.questions[index].answers.map((answer, indexAnswer) => {
                        return (
                          // <ButtonText
                          //   key={indexAnswer}
                          //   value={answer.answer}
                          //   style={{
                          //     fontWeight: '700',
                          //     width: '80%',
                          //     margin: 10,
                          //   }}
                          // // onClick={() => this.onNextPartMultiple(answer)}
                          // >{answer.answers}</ButtonText>
                          <Button
                            key={indexAnswer}
                            style={{ width: 400 }}
                            className="mt-2 mb-2"
                            color={answer.choice ? 'primary' : 'secondary'}
                            onClick={() => this.choiceAnwsers(index, indexAnswer)}
                          >
                            {answer.answer}
                          </Button>
                        );
                      })}
                    </React.Fragment>
                  );
                })}
              </CardBody>
            </div>
            <div style={{ borderRadius: 5 }}>
              <Button
                onClick={() => this.onNext(this.answerArray)}
                disabled={isDisabled}
                className="btn-block"
                color="primary"
              >
                Submit
              </Button>
            </div>
          </>
        )}
      </>
    );
  };

  render() {
    const { question } = this.state;
    return (
      <>
        <Row className="justify-content-md-center align-items-center">
          <Col lg="6">
            <Card style={{ height: 515 }} className="bg-gradient-info text-white text-center p-4">
              {question.imageUrl && <CardImg style={{ maxHeight: 280 }} alt="..." src={question.imageUrl} top />}
              <CardBody>
                <CardTitle>
                  {question.audioUrl && (
                    <Listen audioURL={question.audioUrl} onListened={this.onListened} onAuto={true} />
                  )}
                </CardTitle>
                {question.questionText && <CardText style={{ fontSize: 15 }}>{question.questionText}</CardText>}
              </CardBody>
            </Card>
          </Col>
          {question.part === 6 && (
            <Col lg="6">
              <Card className="bg-gradient-info text-white text-center p-4">
                {/* <CardImg
                  style={{ maxHeight: 280 }}
                  alt="..."
                  src={question.imageUrl ? question.imageUrl : 'https://image.freepik.com/free-vector/headphone-concept-illustration_114360-2222.jpg'}
                  top
                /> */}
                <CardBody>
                  <CardText style={{ fontSize: 15 }}>
                    <Markup content={question.questionText} />
                  </CardText>
                </CardBody>
              </Card>
            </Col>
          )}

          <Col lg="6">{this.renderMultiple()}</Col>
        </Row>
      </>
    );
  }
}

Type31.propTypes = {
  studentId: PropTypes.number,
  questionIndex: PropTypes.number,
  takeExamTime: PropTypes.string,
  startRecord: PropTypes.func,
  onNext: PropTypes.func,
  question: PropTypes.instanceOf(Object).isRequired,
};

export default Type31;
