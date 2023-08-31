import React from 'react';
import classNames from 'classnames';
import * as typeText from '../typesQuestion';
import * as functions from 'components/functions';
import moment from 'moment';
import { Row, Col, Container, Card, CardBody, CardTitle } from 'reactstrap';
import PropTypes from 'prop-types';
import openNotificationWithIcon from 'components/Notification';
import NotData from 'components/Error/NotData';
import Listen from 'components/Listening';


class Type26_Mix extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      question: [],
      questionContent: [],
      answers: []
    };
  }

  static getDerivedStateFromProps = (props, state) => {
    if (props.question !== state.question) {
      const questionContent = JSON.parse(props.question.questionContent);
      const answers = JSON.parse(questionContent[0].answers)
      return {
        question: props.question,
        questionContent,
        answers
      };
    }
    return null;
  };

  onNext = async (answer) => {
    const { questionContent } = this.state;
    this.checkAnswer(answer, questionContent);
    await this.postAnswerToAPI(answer, questionContent);
    this.props.nextQuestion();

  };

  checkAnswer = (answer, questionContent) => {
    answer.Id === questionContent[0].id ? openNotificationWithIcon('success', 'CORRECT') : openNotificationWithIcon('danger', 'INCORRECT');
  };


  postAnswerToAPI = answer => {
    const { question, studentInfo, timeStart, partQuestion, selectedPart } = this.props;
    const { questionContent } = this.state;
    const duration = moment().diff(timeStart);
    const answerModel = {
      studentId: studentInfo.StudentId,
      sessionId: question.sessionId,
      assignmentId: question.assignmentId,
      questionEntityName: questionContent[0].entityName,
      groupName: partQuestion ? selectedPart.GroupName : '',
      questionId: questionContent[0].id,
      questionGuid: '', // empty if question type is not GRAMMAR
      answerType: functions.getAnswerType(typeText.Type04),
      notes: '',
      takeExamTime: question.takeExamTime,
      studentChoice: JSON.stringify({
        id: answer ? answer.Id : questionContent[0].id,
        imageUrl: answer ? answer.ImageUrl : '',
      }),
      duration
    };
    const request = functions
      .postAnswerToAPI(answerModel);

    request
      .then(() => { })
      .catch((err) => {
        console.log(err);
      });
    return request;
  };

  render() {
    const { question, questionContent, answers } = this.state;

    if (!question) {
      return <NotData />;
    }
    return (
      <Container>
        <Card className='bg-gradient-info'>
          <Row className="justify-content-md-center">
            <Col
              className={classNames(['question-type__info'])}
              xs={6}
              sm={12}
              lg={12}
              md={12}
            >
              <Row>
                {answers.map(answer => (
                  <Col
                    key={answer.Id}
                    className={classNames(['p-20'])}
                  >
                    <img
                      alt='...'
                      src={answer.ImageUrl}
                      className={classNames(['img-answer'])}
                      onClick={() => this.onNext(answer)}
                    />
                  </Col>
                ))}
              </Row>
            </Col>
          </Row>
        </Card>
        <Card className="bg-gradient-info">
          <CardBody>
            <CardTitle className="text-white" tag="h3">
              <Listen audioURL={questionContent[0].soundUrl} onAuto={false} />
            </CardTitle>
            <blockquote className="blockquote text-white mb-0">
              <p style={{ fontSize: 20, fontWeight: '500' }}>
                {questionContent[0].text}
              </p>
              <footer className="blockquote-footer text-white">
                Listen and choose the right picture
              </footer>
            </blockquote>
          </CardBody>
        </Card>

      </Container>
    );

  }
}



Type26_Mix.propTypes = {
  questionIndex: PropTypes.number.isRequired,
  timeStart: PropTypes.string.isRequired,
  speechRecognitionAPI: PropTypes.string.isRequired,
  nextQuestion: PropTypes.func,
  loading: PropTypes.bool,
  partQuestion: PropTypes.bool,
  question: PropTypes.instanceOf(Object).isRequired,
  selectedPart: PropTypes.instanceOf(Object).isRequired,
  studentInfo: PropTypes.instanceOf(Object).isRequired
}


export default Type26_Mix;
