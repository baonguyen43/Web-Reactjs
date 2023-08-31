import React from 'react';
import * as typeText from '../typesQuestion';
import * as functions from 'components/functions';
import moment from 'moment';
import Button from 'components/Button';

import { ListGroupItem, Card, ListGroup, Row, Col } from 'reactstrap';
import Loading from 'components/Loading';
import Listen from 'components/Listening';

import openNotificationWithIcon from 'components/Notification';
import NotData from 'components/Error/NotData';
import PropTypes from 'prop-types';


class Type03_Mix extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
    this.questionIndex = this.props.questionIndex;
  }


  onNext = async (answer, questionContent) => {

    this.checkAnswer(answer, questionContent);
    await this.postAnswerToAPI(answer, questionContent);
    this.props.nextQuestion();

  };

  checkAnswer = (answer, questionContent) => {

    if (answer.Id === questionContent[0].id) {
      openNotificationWithIcon('success', 'CORRECT');
    } else {
      openNotificationWithIcon('danger', 'INCORRECT');
    }
  };

  postAnswerToAPI = (answer, questionContent) => {
    const { question, studentInfo, selectedPart, speechRecognitionAPI, partQuestion, timeStart } = this.props;
    const duration = moment().diff(timeStart);
    const answerModel = {
      studentId: studentInfo.StudentId,
      sessionId: question.sessionId,
      assignmentId: question.assignmentId,
      questionEntityName: questionContent[0].entityName,
      groupName: partQuestion ? selectedPart.GroupName : '',
      questionId: questionContent[0].id,
      questionGuid: '', // empty if question type is not GRAMMAR
      answerType: functions.getAnswerType(typeText.Type05),
      notes: speechRecognitionAPI,
      takeExamTime: question.takeExamTime,
      studentChoice: JSON.stringify({
        id: answer ? answer.Id : questionContent[0].id,
        text: answer ? answer.Text : ''
      }),
      duration
    };
    const request = functions
      .postAnswerToAPI(answerModel);

    request
      .then((response) => { })
      .catch((err) => {
        console.log(err);
      });
    return request;
  };


  render = () => {
    const { loading, question } = this.props;
    const questionContent = JSON.parse(question.questionContent);
    const answers = JSON.parse(questionContent[0].answers)

    if (loading) {
      return <Loading />;
    }

    if (!question) {
      return <NotData />;
    }

    return (
      <Row className="justify-content-md-center text-center mt-3">
        <Col lg="9">
          <Card>
            <ListGroup>
              <ListGroupItem
                style={{
                  // backgroundColor: "#F5365C",
                  borderWidth: 0,
                  fontSize: 20,
                  fontWeight: '500',
                }}
                className="active bg-primary text-center"
              >
                <Listen audioURL={questionContent[0].soundUrl} onAuto={true} />
              </ListGroupItem>
              <ListGroupItem>
                {answers.map((answer, index) => {
                  return (
                    <Button
                      key={index}
                      value={answer.Text}
                      style={{
                        fontWeight: '700',
                        width: '70%',
                        margin: 10,
                      }}
                      onClick={() => this.onNext(answer, questionContent)}
                    />
                  );
                })}
              </ListGroupItem>
            </ListGroup>
          </Card>
        </Col>
      </Row>
    );

  };
}

Type03_Mix.propTypes = {
  questionIndex: PropTypes.number.isRequired,
  timeStart: PropTypes.string.isRequired,
  speechRecognitionAPI: PropTypes.string.isRequired,
  nextQuestion: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  partQuestion: PropTypes.bool,
  question: PropTypes.instanceOf(Object).isRequired,
  selectedPart: PropTypes.instanceOf(Object).isRequired,
  studentInfo: PropTypes.instanceOf(Object).isRequired
}

export default Type03_Mix;





