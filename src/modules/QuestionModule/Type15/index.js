import React, { Component } from 'react';
import * as textTypes from '../typesQuestion';
import { Row, Button, Col, Container } from 'reactstrap';
import * as functions from 'components/functions';
import openNotificationWithIcon from 'components/Notification';
import PropTypes from 'prop-types';
import CardDrag from './Card';

const update = require('immutability-helper');

class Type15 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      question: [],
      arrow: [],
      // arraysound: JSON.parse(props.questions.answers),
      next: false,
      cards: [],
      arrayText: [],
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
        arrayText: answers,
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
    const { cards, arrayText, next, exerciseCountdowns } = this.state;
    const { onNext } = this.props;
    if (!next) {
      this.checkAnswer();
      return;
    }
    const isPush = false;
    const postAnswerToApiParams = {
      notes: '',
      questionGuid: '',
      answerType: functions.getAnswerType(textTypes.Type15),
      studentChoice: JSON.stringify({
        score: parseInt(this.score),
        pairs: {
          left: arrayText,
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
    const { cards, arrayText, arrow, exerciseCountdowns } = this.state;
    const resultAnswer = { cards, arrayText };
    for (let i = 0; i < arrayText.length; i++) {
      if (cards[i].id === arrayText[i].id) {
        arrow[i].color = 'Green';
        this.score += parseInt(100 / arrayText.length);
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

  textRender = () => {
    const { arrayText } = this.state;
    return arrayText.map((item, index) => {
      return (
        <div key={index} style={{ marginTop: 10 }}>
          <Button style={{ height: 150, width: 190 }} color="info">
            {item.text}
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
          <Col>{this.textRender()}</Col>
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

Type15.propTypes = {
  questionIndex: PropTypes.number.isRequired,
  onNext: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  question: PropTypes.instanceOf(Object).isRequired,
  data: PropTypes.instanceOf(Object).isRequired,
};

export default Type15;
