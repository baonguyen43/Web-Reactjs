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

class Type30_Mix extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      question: [],
      styleImage: {
        width: 300,
      },
      time: 40,
      characters: [],
      alphabet: []
    };
  }

  static getDerivedStateFromProps = (props, state) => {

    if (props.question !== state.question) {
      const questionContent = JSON.parse(props.question.questionContent);
      // Lấy câu hỏi trong examplesFormat
      const tmpData = getCharacters(questionContent[0].text);
      const { alphabet, characters } = tmpData;

      return {
        question: props.question,
        questionContent,
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
    const { characters, questionContent } = this.state;
    const charactersResult = characters.map((x) => x.character).join('');

    const isCorrect = charactersResult === questionContent[0].text;

    this.checkAnswer(isCorrect);
    this.props.nextQuestion();
    this.postAnswerToAPI({ text: charactersResult });
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
      answerType: functions.getAnswerType(typeText.Type13),
      notes: '',
      takeExamTime: question.takeExamTime,
      studentChoice: JSON.stringify({ text }),
      duration
    };

    functions
      .postAnswerToAPI(answerModel)
      .then((res) => {
      })
      .catch(() => {
      });
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

Type30_Mix.propTypes = {
  questionIndex: PropTypes.number.isRequired,
  timeStart: PropTypes.string.isRequired,
  speechRecognitionAPI: PropTypes.string.isRequired,
  nextQuestion: PropTypes.func.isRequired,
  startRecord: PropTypes.func,
  loading: PropTypes.bool,
  partQuestion: PropTypes.bool,
  question: PropTypes.instanceOf(Object).isRequired,
  selectedPart: PropTypes.instanceOf(Object).isRequired,
  studentInfo: PropTypes.instanceOf(Object).isRequired
}

export default Type30_Mix;
