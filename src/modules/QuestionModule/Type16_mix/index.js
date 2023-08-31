import React, { Component } from 'react';
import moment from 'moment';
import * as typeText from '../typesQuestion';
import Listen from 'components/Listening';
import { Row, Button, Col, Container } from 'reactstrap';
import * as functions from 'components/functions';
import openNotificationWithIcon from 'components/Notification';
import PropTypes from 'prop-types';
import CardDrag from './Card';

const update = require('immutability-helper');

class Type16_Mix extends Component {
  constructor(props) {
    super(props);
    this.state = {
      question: [],
      arrow: [],
      // arraysound: JSON.parse(props.questions.answers),
      next: false,
      cards: [],
      arraysound: [],
      questionContent: [],
    };
    this.questionIndex = this.props.questionIndex;
  }

  static getDerivedStateFromProps(props, state) {
    if (props.question !== state.question) {
      const question = props.question;
      const questionContent = JSON.parse(question.questionContent);
      const answers = JSON.parse(questionContent[0].answers);

      let arrow = [];
      answers.forEach(() => {
        arrow.push({ color: 'Yellow' });
      });

      const cards = functions.getRandomArray(JSON.parse(JSON.stringify(answers)));

      return {
        question: props.question,
        arraysound: answers,
        questionContent,
        cards,
        arrow,
      };
    }
    return null;
  }

  moveCard = (dragIndex, hoverIndex) => {
    if (this.state.next === false) {
      const { cards } = this.state;
      const dragCard = cards[dragIndex];

      this.setState(
        update(this.state, {
          cards: {
            $splice: [
              [dragIndex, 1],
              [hoverIndex, 0, dragCard],
            ],
          },
        })
      );
    }
  };

  onNext = () => {
    const { answers, questionContent, next } = this.state;
    if (!next) {
      this.checkAnswer(answers, questionContent);
      return;
    }
    this.setState({ next: false });
    this.props.nextQuestion();
  };

  checkAnswer = async () => {
    const { cards, arraysound, arrow } = this.state;
    let score = 0;

    for (let i = 0; i < arraysound.length; i++) {
      if (cards[i].Id === arraysound[i].Id) {
        arrow[i].color = 'Green';
        score += 25;
      } else {
        arrow[i].color = 'Red';
      }
    }

    if (score > 50) {
      openNotificationWithIcon('success', 'CORRECT');
    } else {
      openNotificationWithIcon('danger', 'INCORRECT');
    }
    await this.postAnswerToAPI(score);
    this.setState({ next: true });
  };

  postAnswerToAPI = (score) => {
    const { timeStart, studentInfo, question, selectedPart, partQuestion } = this.props;
    const { questionContent, arraysound, cards } = this.state;

    const duration = moment().diff(timeStart);
    const answerModel = {
      studentId: studentInfo.StudentId,
      sessionId: question.sessionId,
      assignmentId: question.assignmentId,
      questionEntityName: questionContent[0].entityName,
      groupName: partQuestion ? selectedPart.GroupName : '',
      questionId: questionContent[0].id,
      questionGuid: '', // empty if question type is not GRAMMAR
      answerType: functions.getAnswerType(typeText.Type17),
      notes: '',
      takeExamTime: question.takeExamTime,
      studentChoice: JSON.stringify({
        score: parseInt(score),
        pairs: {
          left: arraysound,
          right: cards,
        },
      }),
      duration,
    };
    const request = functions.postAnswerToAPI(answerModel);

    request
      .then((response) => {})
      .catch((err) => {
        console.log(err);
      });
    return request;
  };

  soundRender = () => {
    const { arraysound } = this.state;
    return arraysound.map((item, index) => {
      return (
        <div key={index} style={{ marginTop: 10 }}>
          <Button style={{ height: 150, width: 190 }}>
            <Listen audioURL={item.SoundUrl}>
              <i style={{ fontSize: 15 }} className="fas fa-volume-up"></i>
            </Listen>
          </Button>
        </div>
      );
    });
  };

  imageRender = () => {
    const { cards } = this.state;
    return cards.map((item, index) => {
      return <CardDrag key={item.Id} index={index} id={item.Id} text={item.Text} moveCard={this.moveCard} />;
    });
  };

  arrowRender = () => {
    const { arrow } = this.state;
    return arrow.map((item, index) => {
      const imageUrl = require(`assets/img/Arrow${item.color}.png`);
      return (
        <div key={index} style={{ height: 150, marginTop: 10 }}>
          <img style={{ maxHeight: 80, marginTop: 30, maxWidth: 80 }} src={imageUrl} alt="..." />
        </div>
      );
    });
  };

  render() {
    const { next } = this.state;

    return (
      <Container>
        <Row className="bg-gradient-secondary justify-content-md-center">
          <Col>{this.soundRender()}</Col>
          <Col className="text-white">{this.arrowRender()}</Col>
          <Col>{this.imageRender()}</Col>
        </Row>
        <Row>
          <Col className="mt-2">
            <Button color="primary" size="lg" onClick={() => this.onNext()}>
              {next === false ? 'Kiểm tra' : 'Tiếp tục'}
            </Button>
          </Col>
        </Row>
      </Container>
    );
  }
}

Type16_Mix.propTypes = {
  questionIndex: PropTypes.number.isRequired,
  timeStart: PropTypes.string.isRequired,
  speechRecognitionAPI: PropTypes.string.isRequired,
  nextQuestion: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  partQuestion: PropTypes.bool,
  question: PropTypes.instanceOf(Object).isRequired,
  selectedPart: PropTypes.instanceOf(Object).isRequired,
  studentInfo: PropTypes.instanceOf(Object).isRequired,
};

export default Type16_Mix;
