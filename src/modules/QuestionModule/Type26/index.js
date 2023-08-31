import React from 'react';
import classNames from 'classnames';
import * as textTypes from '../typesQuestion';
import * as functions from 'components/functions';
import { Row, Col, Container, Card, CardBody, CardTitle } from 'reactstrap';
import PropTypes from 'prop-types';
import openNotificationWithIcon from 'components/Notification';
import NotData from 'components/Error/NotData';
import Listen from 'components/Listening';


class Type26 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      question: [],
      exerciseCountdowns: []
    };
  }

  static getDerivedStateFromProps = (props, state) => {
    if (props.question !== state.question) {

      // eslint-disable-next-line no-unused-vars
      let questions = functions.randomImageAnswersFromAPI(props.data);

      questions = functions.randomFourAnswersOneWay(questions);
      return {
        question: props.question,
      };
    }
    return null;
  };

  checkAnswer = (answer) => {
    const { question, onNext, questionIndex } = this.props;
    const { exerciseCountdowns } = this.state;
    let isDone = false;
    if (answer.id === question.id) {
      openNotificationWithIcon('success', 'CORRECT');
      isDone = true;
    } else {
      openNotificationWithIcon('danger', 'INCORRECT');
    }
    exerciseCountdowns.push({ isDone, questionIndex });
    const isPush = false;
    const postAnswerToApiParams = {
      notes: '',
      questionGuid: '',
      answerType: functions.getAnswerType(textTypes.Type04),
      studentChoice: JSON.stringify({
        id: answer ? answer.id : question.id,
        imageUrl: answer ? answer.imageUrl : ''
      }),
    }
    onNext(exerciseCountdowns, postAnswerToApiParams, isPush)
  };

  render() {
    const { question } = this.state;

    if (!question) {
      return <NotData />;
    }
    if (!question.answers) return null;
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
                {question.answers.map((answer, index) => (
                  <Col
                    key={index}
                    className={classNames(['p-20'])}
                  >
                    <img
                      alt='...'
                      src={answer.imageUrl}
                      className={classNames(['img-answer'])}
                      onClick={() => this.checkAnswer(answer)}
                    />
                  </Col>
                ))}
              </Row>
            </Col>
          </Row>
        </Card>
        <Card className="bg-gradient-info text-center">
          <CardBody>
            <CardTitle className="text-white" tag="h3">
              <Listen
                audioURL={question.soundUrl}
                // onListened={this.onListened}
                onAuto={true}
              />
            </CardTitle>
            <blockquote className="blockquote text-white mb-0">
              <p style={{ fontSize: 20, fontWeight: '500' }}>
                {question.text}
              </p>
              <footer className="blockquote-footer text-white">
                Chọn hình phù hợp với từ trên
              </footer>
            </blockquote>
          </CardBody>
        </Card>

      </Container>
    );

  }
}

Type26.propTypes = {
  questionIndex: PropTypes.number.isRequired,
  onNext: PropTypes.func,
  loading: PropTypes.bool,
  question: PropTypes.instanceOf(Object).isRequired,
}


export default Type26;
