import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import * as textTypes from '../typesQuestion';
import * as functions from 'components/functions';
import { Row } from 'antd';
import { Button } from 'reactstrap';
import NotData from 'components/Error/NotData';

import openNotificationWithIcon from 'components/Notification';

const Random = (array) => {
  var m = array.length,
    t,
    i;
  // Chừng nào vẫn còn phần tử chưa được xáo trộn thì vẫn tiếp tục
  while (m) {
    // Lấy ra 1 phần tử
    i = Math.floor(Math.random() * m--);
    // Sau đó xáo trộn nó
    t = array[m];
    array[m] = array[i];
    array[i] = t;
  }
  return array;
}

class Type14 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      show: '',
      question: [],
      styleImage: {
        width: 400,
      },
      characters: [],
      alphabet: [],
      questionText: [],
      questionSentence: [],
      exerciseCountdowns: [],
    };
  }

  static getDerivedStateFromProps = (props, state) => {
    if (props.question !== state.questionSentence) {

      if (!props.question?.examplesFormat) return null;
      const randomIndex = Math.floor(Math.random() * 2);
      const examplesFormat = JSON.parse(props.question?.examplesFormat);
      const questionFormat = examplesFormat.sentences[randomIndex];
      if (!questionFormat) return null;
      questionFormat.imageUrl = props.question.imageUrl;
      // Lấy text trong câu hỏi
      const questionText = questionFormat.text.trim();

      let data = questionText.split(' ');

      let alphabet = [];
      for (let i = 0; i < data.length; i++) {
        alphabet.push({
          id: i,
          selectedId: 0,
          character: data[i],
          status: 'on'
        });
      }

      let characters = [];
      for (let i = 0; i < data.length; i++) {
        characters.push({
          id: i,
          selectedId: 0,
          character: '',
          status: 'off'
        });
      }

      Random(alphabet)

      return {
        question: questionFormat,
        questionSentence: props.question,
        questionText,
        alphabet,
        characters,

      };

    }
    return null;
  };


  removeCharacter(item) {
    const characters = this.state.characters.slice();
    const index = characters.findIndex(x => x.id === item.id);
    if (index >= 0) {
      // UPDATE ALPHABET
      const alphabet = this.state.alphabet.slice();
      const indexAlphabet = alphabet.findIndex(
        x => x.id === characters[index].selectedId
      );
      if (indexAlphabet >= 0) {
        alphabet[indexAlphabet].status = 'on';
        this.setState({ alphabet });
      }

      // UPDATE CHARACTERS
      characters[index].status = 'off';
      characters[index].character = '';
      characters[index].selectedId = 0;
      this.setState({ characters, show: this.state.characters.map(x => x.character).join(' ') });
    }
  }

  addCharacter(item) {
    const alphabet = this.state.alphabet.slice();
    const indexAlphabet = alphabet.findIndex(x => x.id === item.id);
    if (indexAlphabet >= 0) {
      alphabet[indexAlphabet].status = 'off';
      this.setState({ alphabet });

      var characters = this.state.characters.slice();
      const index = characters.findIndex(x => x.status === 'off');
      if (index >= 0) {
        characters[index].status = 'on';
        characters[index].character = item.character;
        characters[index].selectedId = item.id;
        this.setState({ characters, show: this.state.characters.map(x => x.character).join(' ') });
      }
    }
  }

  onLoadImage = ({ target: img }) => {
    if (img.offsetWidth > 490) {
      this.setState({
        styleImage: {
          width: '100%'
        }
      });
    }
  };
  onNext = () => {
    const { characters, exerciseCountdowns, questionText } = this.state;
    const { onNext, questionIndex } = this.props;
    const resultAnswer = characters.map(x => x.character).join(' ');

    const isPush = false;
    const isCorrect = resultAnswer === questionText;
    exerciseCountdowns.push({ resultAnswer, questionIndex, isDone: isCorrect });
    const postAnswerToApiParams = {
      notes: '',
      questionGuid: '',
      answerType: functions.getAnswerType(textTypes.Type14),
      studentChoice: JSON.stringify({
        text: resultAnswer,
        example: questionText.trim()
      }),
    }
    this.checkAnswer(isCorrect);
    onNext(exerciseCountdowns, postAnswerToApiParams, isPush);
    this.setState({ show: '' });
  };


  checkAnswer = (isCorrect) => {
    isCorrect ? openNotificationWithIcon('success', 'CORRECT') : openNotificationWithIcon('danger', 'INCORRECT');
  };

  render() {
    const {
      alphabet,
      characters,
      show,
      question
    } = this.state;
    if (!question.text) return <NotData />;
    const splitQuestion = question.text.trim().split(' ');

    const isDisabled = characters.filter((x) => x.character !== '').length !== splitQuestion?.length;
    const char = characters.map((item, index) => {
      return (
        <span
          key={index}
          className={
            item.status === 'on'
              ? classNames(['question-type__btnMove-question1'])
              : classNames(['question-type__btnMove_type13'])
          }
          style={item.status === 'on' ? { cursor: 'pointer' } : { cursor: '' }}
          onClick={() => {
            if (item.status === 'on') {
              this.removeCharacter(item);
            }
          }}
        >
          {item.character}
        </span>
      );
    });

    var alp = alphabet.map((item, index) => {
      return item.status === 'on' ? (
        <span
          key={index}
          className={classNames(['question-type__btnMove'])}
          style={{ cursor: 'pointer' }}
          onClick={
            isDisabled === true
              ? () => {
                if (item.status === 'on') {
                  this.addCharacter(item);
                }
              }
              : () => { }
          }
        >
          {item.character}
        </span>
      ) : (
        <span
          key={index}
          className={classNames(['question-type__btnMove_type13'])}
          style={{ background: '#97a4e6' }}
        />
      );
    });

    if (question.length === 0) {
      return <NotData />;
    }

    return (
      <React.Fragment>
        <Row
          className='text-center'
          style={{ display: 'block' }}
        >

          {/* <img
            alt=""
            src={question.imageUrl}
            style={styleImage}
            onLoad={this.onLoadImage}
            className={classNames(['question-type__image mt-15 mb-15'])}
          />

          <p className={classNames(['question-type__word'])}>
            {question.description}
          </p> */}
          <Row
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Row className={classNames(['mt-15 mb-15'])}>{char}</Row>
            <p className={classNames(['question-type__show'])}>{show}</p>
            {/* <hr style={{ border: "1px solid #b1b7d2", width: 300 }} /> */}
            <Row className={classNames(['mb-15 mt-15'])}>{alp}</Row>
          </Row>
        </Row>
        <Row
          className='text-center'
          style={{ display: 'block' }}
        >
          <Button
            disabled={isDisabled}
            // size="lg"
            type="primary"
            onClick={this.onNext}
            color="info"
          >
            <span className="btn-inner--icon mr-2">
              <i className="fas fa-chevron-circle-right"></i>
            </span>
            <span className="btn-inner--text">Next</span>
          </Button>
        </Row>
      </React.Fragment>
    );
  }
}

Type14.propTypes = {
  questionIndex: PropTypes.number.isRequired,
  timeStart: PropTypes.string,
  speechRecognitionAPI: PropTypes.string,
  onNext: PropTypes.func,
  question: PropTypes.instanceOf(Object).isRequired,
  selectedPart: PropTypes.instanceOf(Object),
  studentInfo: PropTypes.instanceOf(Object)
}


export default Type14;
