import React from 'react';
import * as functions from 'components/functions';
import Button from 'components/Button';
import * as textTypes from '../typesQuestion'
import { ListGroupItem, Card, ListGroup, Row, Col } from 'reactstrap';
import Listen from 'components/Listening';
import openNotificationWithIcon from 'components/Notification';
import NotData from 'components/Error/NotData';
import PropTypes from 'prop-types';


class Type03 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      exerciseCountdowns: [],
      question: [],
    };
  }

  static getDerivedStateFromProps = (props, state) => {
    if (props.question !== state.question) {
      // eslint-disable-next-line no-unused-vars
      let questions = functions.randomTextAnswersFromAPI(props.data);
      questions = functions.randomFourAnswersOneWay(questions);
    }
    return null;
  }

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
      answerType: functions.getAnswerType(textTypes.Type03),
      studentChoice: JSON.stringify({
        id: answer ? answer.id : question.id,
        text: answer ? answer.text : ''
      }),
    }
    onNext(exerciseCountdowns, postAnswerToApiParams, isPush)
  };

  render = () => {
    const { question } = this.props;

    if (question.length === 0) {
      return <NotData />;
    }
    return (
      <Row className="justify-content-md-center text-center mt-3">
        <Col lg="9">
          <Card>
            <ListGroup className='text-center'>
              <ListGroupItem
                
                style={{
                  // backgroundColor: "#F5365C",
                  borderWidth: 0,
                  fontSize: 20,
                  fontWeight: '500',
                }}
                className="active bg-primary text-center"
              >
                <Listen audioURL={question.soundUrl} onAuto={false} />
              </ListGroupItem>
              <ListGroupItem>
                {question.answers.map((answer) => {
                  return (
                    <Button
                      key={answer.id}
                      value={answer.text}
                      style={{
                        fontWeight: '700',
                        width: '70%',
                        margin: 10,
                      }}
                      onClick={() => this.checkAnswer(answer)}
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


Type03.propTypes = {
  questionIndex: PropTypes.number.isRequired,
  onNext: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  question: PropTypes.instanceOf(Object).isRequired,
  data: PropTypes.instanceOf(Object).isRequired,
}

export default Type03;





