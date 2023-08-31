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

class Type14_Mix extends React.Component {
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
      questionContent: [],
      questionSentence: [],
    };
  }

  static getDerivedStateFromProps = (props, state) => {
    if (props.question !== state.questionSentence) {
      const randomIndex = Math.floor(Math.random() * 2);
      const examplesFormat = JSON.parse(props.questionContent[0].examplesFormat);
      const questionFormat = examplesFormat.sentences[randomIndex];

      questionFormat.imageUrl = props.questionContent[0].imageUrl;
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
        questionContent: props.questionContent,
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

  onNext = async () => {

    const { characters, questionText } = this.state
    const { nextQuestion } = this.props;
    const resultAnswer = characters.map(x => x.character).join(' ');
    this.setState({ show: '' });
    //check answer true or false
    const isCorrect = resultAnswer === questionText.trim();
    this.checkAnswer(isCorrect)
    // post answer to api
    await this.postAnswerToAPI({
      text: resultAnswer,
      example: questionText.trim()
    });
    nextQuestion();
  };

  checkAnswer = (isCorrect) => {
    isCorrect ? openNotificationWithIcon('success', 'CORRECT') : openNotificationWithIcon('danger', 'INCORRECT');
  };

  postAnswerToAPI = ({ text, example }) => {
    const { studentInfo, question, selectedPart, partQuestion } = this.props;
    const { questionContent } = this.state;
    let duration = moment().diff(this.props.timeStart);
    let answerModel = {
      studentId: studentInfo.StudentId,
      sessionId: question.sessionId,
      assignmentId: question.assignmentId,
      questionEntityName: questionContent[0].entityName,
      groupName: partQuestion ? selectedPart.GroupName : '',
      questionId: questionContent[0].id,
      questionGuid: '', // empty if question type is not GRAMMAR
      answerType: functions.getAnswerType(typeText.Type14),
      notes: '',
      takeExamTime: question.takeExamTime,
      studentChoice: JSON.stringify({
        text,
        example,
        questionTypeText: 'Reorder the words to make a sentence'
      }),
      duration,
    };
    const request = functions
      .postAnswerToAPI(answerModel);

    request
      .then(() => { })
      .catch((err) => {
        console.log(err);
      });
    return request;

  };


  render() {
    const {
      alphabet,
      characters,
      show,
      question,
    } = this.state;

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
          className={classNames(['question-type1'])}
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

Type14_Mix.propTypes = {
  questionIndex: PropTypes.number.isRequired,
  timeStart: PropTypes.string.isRequired,
  speechRecognitionAPI: PropTypes.string.isRequired,
  nextQuestion: PropTypes.func.isRequired,
  startRecord: PropTypes.func,
  loading: PropTypes.bool,
  partQuestion: PropTypes.bool,
  question: PropTypes.instanceOf(Object).isRequired,
  questionContent: PropTypes.instanceOf(Object).isRequired,
  selectedPart: PropTypes.instanceOf(Object).isRequired,
  studentInfo: PropTypes.instanceOf(Object).isRequired
}

export default Type14_Mix;
