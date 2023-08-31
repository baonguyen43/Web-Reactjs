import React, { Component } from 'react';
import * as textTypes from '../typesQuestion';
import { Row, Button, Col, Container } from 'reactstrap';
import * as functions from 'components/functions';
import openNotificationWithIcon from 'components/Notification';
import PropTypes from 'prop-types';
import CardDrag from './Card';
import Listen from 'components/Listening';

const update = require('immutability-helper');

class Type17 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      question: [],
      arrow: [],
      // arraysound: JSON.parse(props.questions.answers),
      next: false,
      cards: [],
      arraySound: [],
      exerciseCountdowns: [],
    };

    this.score = 0;
  }

  static getDerivedStateFromProps(props, state) {
    if (props.question !== state.question) {
      // eslint-disable-next-line no-unused-vars
      let questions = functions.randomTextAnswersFromAPI(props.data);
      questions = functions.randomFourAnswersOneWay(questions);

      const answers = props.question.answers;

      let arrow = [];
      answers.forEach(() => {
        arrow.push({ color: 'Yellow' });
      });

      const cards = functions.getRandomArray(JSON.parse(JSON.stringify(answers)));
      return {
        question: props.question,
        arraySound: answers,
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
    const { cards, arraySound, next, exerciseCountdowns } = this.state;
    const { onNext } = this.props;
    if (!next) {
      this.checkAnswer();
      return;
    }
    const isPush = false;
    const postAnswerToApiParams = {
      notes: '',
      questionGuid: '',
      answerType: functions.getAnswerType(textTypes.Type16),
      studentChoice: JSON.stringify({
        score: parseInt(this.score),
        pairs: {
          left: arraySound,
          right: cards,
        },
      }),
    };
    onNext(exerciseCountdowns, postAnswerToApiParams, isPush);
    this.setState({ next: false });
    this.score = 0;
  };

  checkAnswer = () => {
    const { questionIndex } = this.props;
    const { cards, arraySound, arrow, exerciseCountdowns } = this.state;
    this.score = 0;
    const resultAnswer = { cards, arraySound };
    for (let i = 0; i < arraySound.length; i++) {
      if (cards[i].id === arraySound[i].id) {
        arrow[i].color = 'Green';
        this.score += 25;
      } else {
        arrow[i].color = 'Red';
      }
    }
    let isCorrect = '';

    if (this.score > 50) {
      isCorrect = true;
      openNotificationWithIcon('success', 'CORRECT');
    } else {
      openNotificationWithIcon('danger', 'INCORRECT');
    }

    exerciseCountdowns.push({ resultAnswer, questionIndex, isDone: isCorrect });

    this.setState({ next: true });
    // this.postAnswerToAPI(score)
  };

  soundRender = () => {
    const { arraySound } = this.state;
    return arraySound.map((item, index) => {
      return (
        <div key={index} style={{ marginTop: 10 }}>
          <Button style={{ height: 150, width: 190 }}>
            <Listen audioURL={item.soundUrl}>
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
      return <CardDrag key={item.id} index={index} id={item.id} text={item.imageUrl} moveCard={this.moveCard} />;
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
        <Row className="bg-gradient-secondary justify-content-md-center text-center">
          <Col>{this.soundRender()}</Col>
          <Col className="text-white">{this.arrowRender()}</Col>
          <Col>{this.imageRender()}</Col>
        </Row>
        <Row className="text-center">
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

Type17.propTypes = {
  questionIndex: PropTypes.number.isRequired,
  onNext: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  question: PropTypes.instanceOf(Object).isRequired,
  data: PropTypes.instanceOf(Object).isRequired,
};

export default Type17;
