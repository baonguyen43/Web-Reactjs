import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import * as textTypes from '../typesQuestion';
import * as functions from 'components/functions';
import { Row } from 'antd';
import { Button } from 'reactstrap';
import NotData from 'components/Error/NotData';
import openNotificationWithIcon from 'components/Notification';

const getCharacters = (data) => {
  const alphabet = [];
  for (let i = 0; i < data.length; i++) {
    alphabet.push({
      id: i,
      selectedId: 0,
      character: data[i],
      status: 'on',
    });
  }

  const characters = [];
  for (let i = 0; i < data.length; i++) {
    characters.push({
      id: i,
      selectedId: 0,
      character: '',
      status: 'off',
    });
  }

  functions.getRandomArray(alphabet);
  return { characters, alphabet };
};

class Type21 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      question: [],
      styleImage: {
        width: 300,
      },
      characters: [],
      alphabet: [],
      exerciseCountdowns:[]
    };
  }

  static getDerivedStateFromProps = (props, state) => {
    if (props.question !== state.question) {

      // Lấy câu hỏi trong examplesFormat
      const tmpData = getCharacters(props.question.text);
      const { alphabet, characters } = tmpData;
      return {
        question: props.question,
        alphabet,
        characters
      };
    }
    return null;
  };

  onLoadImage = ({ target: img }) => {
    if (img.offsetWidth > 490) {
      this.setState({
        styleImage: {
          width: '15%',
        },
      });
    }
  };

  getRandomInt = (min, max) =>
    Math.floor(Math.random() * (max - min + 1)) + min;



  removeCharacter = (item) => {
    const characters = this.state.characters.slice();
    const index = characters.findIndex((x) => x.id === item.id);
    if (index >= 0) {
      // UPDATE ALPHABET
      const alphabet = this.state.alphabet.slice();
      const indexAlphabet = alphabet.findIndex(
        (x) => x.id === characters[index].selectedId
      );
      if (indexAlphabet >= 0) {
        alphabet[indexAlphabet].status = 'on';
        this.setState({ alphabet });
      }

      // UPDATE CHARACTERS
      characters[index].status = 'off';
      characters[index].character = '';
      characters[index].selectedId = 0;
      this.setState({
        characters,
        show: this.state.characters.map((x) => x.character).join(''),
      });
    }
  };

  addCharacter = (item) => {
    const alphabet = this.state.alphabet.slice();
    const indexAlphabet = alphabet.findIndex((x) => x.id === item.id);
    if (indexAlphabet >= 0) {
      alphabet[indexAlphabet].status = 'off';
      this.setState({ alphabet });

      var characters = this.state.characters.slice();
      const index = characters.findIndex((x) => x.status === 'off');
      if (index >= 0) {
        characters[index].status = 'on';
        characters[index].character = item.character;
        characters[index].selectedId = item.id;
        this.setState({
          characters,
          show: this.state.characters.map((x) => x.character).join(''),
        });
      }
    }
  };


  onNext = () => {
    const { characters, question, exerciseCountdowns } = this.state;
    const { onNext, questionIndex } = this.props;
    const charactersResult = characters.map((x) => x.character).join('');
    const isPush = false;
    const isCorrect = charactersResult === question.text;
    exerciseCountdowns.push({ charactersResult, questionIndex, isDone:isCorrect });
    const postAnswerToApiParams = {
      notes: '',
      questionGuid: '',
      answerType: functions.getAnswerType(textTypes.Type13),
      studentChoice: JSON.stringify({ text: charactersResult }),
    }
    this.checkAnswer(isCorrect);
    onNext(exerciseCountdowns, postAnswerToApiParams, isPush)
  };

  checkAnswer = (isCorrect) => {
    if (isCorrect) {
      openNotificationWithIcon(
        'success',
        'Chính xác',
        'Chúc mừng bạn đã trả lời đúng'
      );
    } else {
      openNotificationWithIcon(
        'danger',
        'Không chính xác',
        'Vui lòng kiểm tra lại kết quả'
      );
    }
  };

  render() {
    const {
      question,
      alphabet,
      characters,
      styleImage,
      show,
    } = this.state;

    const isDisabled =
      characters.filter((x) => x.character !== '').length !== question.text.length;
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
          <span key={index}
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
          <img
            alt=""
            src={question.imageUrl}
            style={styleImage}
            onLoad={this.onLoadImage}
            className={classNames(['question-type__image mt-15 mb-15'])}
          />

          <p className={classNames(['question-type__word'])}>
            {question.description}
          </p>
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

Type21.propTypes = {
  questionIndex: PropTypes.number.isRequired,
  onNext: PropTypes.func,
  question: PropTypes.instanceOf(Object).isRequired,
}


export default Type21;
