import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import * as typeText from '../typesQuestion';
import * as functions from 'components/functions';
import moment from 'moment';

import { Row } from 'antd';
import { Button } from 'reactstrap';
import NotData from 'components/Error/NotData';
import openNotificationWithIcon from 'components/Notification';

const A_Z = 'abcdefghijklmnopqrstuvwxyz';

const getRandomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const getAlphabet = (data, type) => {
  let alphabet = [];

  // get invisible words
  for (const iterator of data) {
    if (iterator.status === 'off' && !iterator.fixed) {
      alphabet.push({ ...iterator, status: 'on' });
    }
  }

  //get more characters
  if (type !== 'CompleteWord_A') {
    for (let i = alphabet.length; i < data.length; i++) {
      let randomIndex = getRandomInt(0, A_Z.length - 1);
      alphabet.push({ character: A_Z[randomIndex], status: 'on' });
    }
  }
  // random
  alphabet.forEach(() => {
    let firstRandomIndex = getRandomInt(0, alphabet.length - 1);
    let secondRandomIndex = getRandomInt(0, alphabet.length - 1);
    let tmp = { ...alphabet[firstRandomIndex] };
    alphabet[firstRandomIndex] = alphabet[secondRandomIndex];
    alphabet[secondRandomIndex] = tmp;
  });
  // sort index
  alphabet.forEach((_, index) => {
    alphabet[index].id = index;
  });
  return alphabet;
};

class Type18_Mix extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      question: [],
      styleImage: {
        width: 300,
      },
      time: 40,
      characters: [],
      alphabet: [],
      isDoing: false
    };
  }

  static getDerivedStateFromProps = (props, state) => {
    if (props.question !== state.question) {
      if (!state.isDoing) {

        const data = props.questionContent[0].text;

        let characters = [];
        for (let i = 0; i < data.length; i++) {
          characters.push({
            id: i,
            selectedId: 0,
            character: data[i],
            fixed: true,
            status: 'on'
          });
        }

        // random hide
        const maxRandom = getRandomInt(2, characters.length - 1);
        for (let i = 0; i < maxRandom; i++) {
          let randomIndex = getRandomInt(0, characters.length - 1);
          while (
            characters[randomIndex].status === 'off' &&
            !characters[randomIndex].fixed
          ) {
            randomIndex = getRandomInt(0, characters.length - 1);
          }
          characters[randomIndex].status = 'off';
          characters[randomIndex].fixed = false;
        }

        const alphabet = getAlphabet(characters.slice(), props.type);

        characters = characters.map((item, index) => {
          if (item.status === 'off' && !item.fixed) {
            return { ...item, character: '' };
          }
          return item;
        });

        return { characters, alphabet, questionContent: props.questionContent, question: props.question, isDoing: true }
      }
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

  removeCharacter(item) {
    if (item.fixed === false) {
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
        this.setState({ characters });
        this.show = this.state.characters.map(x => x.character).join('');
      }
    }
  }

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

  onNext = async () => {

    const { characters, questionContent } = this.state;
    const charactersResult = characters.map((x) => x.character).join('');

    const isCorrect = charactersResult === questionContent[0].text;

    this.checkAnswer(isCorrect);
    await this.postAnswerToAPI({ text: characters });
    this.props.nextQuestion();

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

  postAnswerToAPI = ({ text }) => {
    const { question, questionContent } = this.state;

    const { timeStart, studentInfo, selectedPart, partQuestion } = this.props;

    const duration = moment().diff(timeStart);
    const answerModel = {
      studentId: studentInfo.StudentId,
      sessionId: question.sessionId,
      assignmentId: question.assignmentId,
      questionEntityName: questionContent[0].entityName,
      groupName: partQuestion ? selectedPart.GroupName : '',
      questionId: questionContent[0].id,
      questionGuid: '', // empty if question type is not GRAMMAR
      answerType: functions.getAnswerType(typeText.Type18),
      notes: '',
      takeExamTime: question.takeExamTime,
      studentChoice: JSON.stringify({ text }),
      duration
    };

    const request = functions
      .postAnswerToAPI(answerModel);

    request
      .then(() => { this.setState({ isDoing: false }); })
      .catch((err) => {
        console.log(err);
      });
    return request;
  };

  render() {
    const {
      question,
      alphabet,
      characters,
      styleImage,
      show,
      questionContent
    } = this.state;

    const isDisabled =
      characters.filter((x) => x.character !== '').length !== questionContent[0].text.length;
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
          className={classNames(['question-type1'])}
          style={{ display: 'block' }}
        >
          {/* <div style={{
              border: '5px solid green',
              borderRadius: '50%',
              width: 55,
              height: 55,
            }}>
              <div>
                40s
              </div>
            </div> */}

          <img
            alt=""
            src={questionContent[0].imageUrl}
            style={styleImage}
            onLoad={this.onLoadImage}
            className={classNames(['question-type__image mt-15 mb-15'])}
          />

          <p className={classNames(['question-type__word'])}>
            {questionContent[0].description}
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
          className={classNames(['question-type__actions'])}
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

Type18_Mix.propTypes = {
  questionIndex: PropTypes.number.isRequired,
  timeStart: PropTypes.string.isRequired,
  type: PropTypes.string,
  speechRecognitionAPI: PropTypes.string.isRequired,
  nextQuestion: PropTypes.func.isRequired,
  startRecord: PropTypes.func,
  loading: PropTypes.bool,
  partQuestion: PropTypes.bool,
  question: PropTypes.instanceOf(Object).isRequired,
  selectedPart: PropTypes.instanceOf(Object).isRequired,
  studentInfo: PropTypes.instanceOf(Object).isRequired,
  questionContent: PropTypes.instanceOf(Object).isRequired
}



export default Type18_Mix;
