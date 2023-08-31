import React from 'react';
import classNames from 'classnames';

import { Button, Row, Col, ListGroup, ListGroupItem, Card, CardBody, CardImg, CardFooter } from 'reactstrap';
import Listen from 'components/Listening';
import { DictionaryText } from 'components/Dictionary';
import NotData from 'components/Error/NotData';
import PropTypes from 'prop-types';
import openNotificationWithIcon from 'components/Notification';

// const color = ['warning', 'success', 'danger', 'info', 'default'];
// const randomIndex = Math.floor(Math.random(color) * 5);
const name = 'bg-default justify-content-md-center mt-4';

class Type01 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isDone: false,
      question: [],
      exerciseCountdowns: []
    };
    this.score = 0;
  }

  static getDerivedStateFromProps = (props, state) => {
    if (props.question !== state.question) {
      return {
        isDone: false,
        question: props.question,
      }
    }
    return null;
  }

  onListened = () => {
    this.setState({ isDone: true });
  }

  onNext = () => {
    this.checkAnswer();
  }

  checkAnswer = () => {
    const { onNext, questionIndex } = this.props;
    const { exerciseCountdowns } = this.state;
    const { isDone } = this.state;
    const isPush = exerciseCountdowns.findIndex((x) => x.questionIndex === questionIndex) > -1;
    if (!isPush) {
      if (isDone) {
        this.score = 100;
        openNotificationWithIcon('success', 'Notification', 'Correct');
      } else {
        this.score = 0;
        openNotificationWithIcon('danger', 'Notification', 'Incorrect');

      }
      exerciseCountdowns.push({ isDone, questionIndex });

      this.setState({ exerciseCountdowns })
    }
    const postAnswerToApiParams = {
      answerType: 'NEWWORD',
      questionGuid: '',
      notes: '',
      studentChoice: JSON.stringify({
        score: this.score
      }),
    }
    //Gọi props onNext tại questionIndex
    onNext(exerciseCountdowns, postAnswerToApiParams, isPush)
  }

  renderQuestion = (question) => {
    const { disabledBack, disabledNext, onBack } = this.props;
    return (
      <React.Fragment>
        <CardImg
          style={{ height: 300 }}
          alt="..."
          src={question.imageUrl}
        />
        <CardBody className='text-center'>
          <Listen
            audioURL={question.soundUrl}
            onListened={this.onListened}
            onAuto={false}
          />
          <p className={classNames(['question-type__word'])}>
            {question.text}
          </p>
          {question.phonetic !== '' ?
            <p className={classNames(['question-type__kindOfWord'])}>
              <i>{`/${question.phonetic}/`}</i>
            </p>
            : <span></span>
          }
          <p className={classNames(['question-type__kindOfWord'])}>
            <i>{`(${question.wordType})`}</i>
          </p>
          <p className={classNames(['question-type__kindOfWord'])}>
            {question.text_VN}
          </p>
        </CardBody>
        <CardFooter className="d-flex justify-content-between">
          <Button
            disabled={disabledBack}
            onClick={onBack}
          >Back
          </Button>
          <Button
            disabled={disabledNext}
            onClick={() => this.onNext()}
          >Next
          </Button>
        </CardFooter>
      </React.Fragment>
    )
  }

  renderAudio = (question) => {
    if (!question.examplesFormat) return null;
    return JSON.parse(question?.examplesFormat).sentences.map((item, index) => {
      return (
        <ListGroupItem className='text-center' key={index}>
          <strong className='text-center ml-2'>
            <DictionaryText text={item.text} />
          </strong>
          <div>
            <Listen
              custom
              audioURL={item.soundUrl}
              className={'question-type__audioExampleType02'}
            >
              <i className="fas fa-volume-up"></i>
            </Listen>
          </div>
        </ListGroupItem>
      )
    })
  }

  render() {
    const { question } = this.props;

    if (!question) {
      return <NotData />;
    }

    return (
      <div>
        {question.examplesFormat !== null ?
          <Row className={name}>
            <Col className='my-2 col-12 col-lg-6 text-center'>
              <Card style={{ height: '100%' }}>
                {this.renderQuestion(question)}
              </Card>
            </Col>
            <Col className="col-12 col-lg-6 text-center my-2">
              <Card style={{ height: '100%' }}>
                <CardBody>
                  <h4 className='text-warning'>Examples</h4>
                  <ListGroup>
                    {this.renderAudio(question)}
                  </ListGroup>
                </CardBody>
              </Card>
            </Col>
          </Row>
          :
          <Row>
            <Col className='mt-4'>
              <Card>{this.renderQuestion(question)}</Card>
            </Col>
          </Row>
        }
      </div>
    );
  }
}

Type01.propTypes = {
  // renderExerciseCountdowns: PropTypes.func.isRequired,
  onNext: PropTypes.func.isRequired,
  onBack: PropTypes.func.isRequired,
  questionIndex: PropTypes.number.isRequired,
  disabledNext: PropTypes.bool.isRequired,
  disabledBack: PropTypes.bool.isRequired,
  question: PropTypes.instanceOf(Object).isRequired,
}

export default Type01
