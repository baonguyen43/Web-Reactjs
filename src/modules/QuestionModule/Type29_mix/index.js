import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { connect } from "react-redux";
import JRoutes from "src/configs/routes.json";
import { getClassId } from "src/components/functions";
import * as __typeText from "../typesQuestion";
import { default as functions } from "src/components/functions";
import queryString from "query-string";

import { Row, Col } from "antd";
import { saveAnswerAction } from "../actions/saveAnswerAction";
import AMES247Loading from "src/components/Loading";
import { default as AMES247Button } from "src/components/Button";

import { openNotificationWithIcon } from "src/components/Notifications";
import { default as NotData } from 'src/components/Error/NotData';

const A_Z = "abcdefghijklmnopqrstuvwxyz";

class Type13 extends React.Component {
  constructor(props) {
    super(props);
    this.resultAnswer = "";
    this.correctText = "";

    let alphabet = [],
      characters = [];

    this.state = {
      show: "",
      loading: true,
      question: props.questions,
      styleImage: {
        width: null
      },
      characters,
      alphabet,
      correctText: this.correctText
    };

    props.onSaveAnswers({});
    this.questionIndex = this.props.indexQuestion;
    this.takeExamTime = this.props.takeExamTime;
    this.studentId = functions.getUser().studentId;
  }

  Random(array) {
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

  getRandomInt = (min, max) =>
    Math.floor(Math.random() * (max - min + 1)) + min;

  getCharacters = data => {
    // { id: 1, selectedId: 0, character: 't', fixed: true, status: 'on' },
    let alphabet = [];
    for (let i = 0; i < data.length; i++) {
      alphabet.push({
        id: i,
        selectedId: 0,
        character: data[i],
        status: "on"
      });
    }

    let characters = [];
    for (let i = 0; i < data.length; i++) {
      characters.push({
        id: i,
        selectedId: 0,
        character: "",
        status: "off"
      });
    }

    this.Random(alphabet)
    return { characters, alphabet };
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
        alphabet[indexAlphabet].status = "on";
        this.setState({ alphabet, alphabet });
      }

      // UPDATE CHARACTERS
      characters[index].status = "off";
      characters[index].character = "";
      characters[index].selectedId = 0;
      this.setState({ characters, characters, show: this.state.characters.map(x => x.character).join("") });
    }
  }

  addCharacter(item) {

    const alphabet = this.state.alphabet.slice();
    const indexAlphabet = alphabet.findIndex(x => x.id === item.id);
    if (indexAlphabet >= 0) {
      alphabet[indexAlphabet].status = "off";
      this.setState({ alphabet, alphabet });

      var characters = this.state.characters.slice();
      const index = characters.findIndex(x => x.status === "off");
      if (index >= 0) {
        characters[index].status = "on";
        characters[index].character = item.character;
        characters[index].selectedId = item.id;
        this.setState({ characters, characters, show: this.state.characters.map(x => x.character).join("") });
      }
    }
  }

  componentWillMount = () => {
    let tmpData = this.getCharacters(this.state.question.text);
    let { alphabet, characters } = tmpData;
    this.setState({ characters, alphabet });
  };

  componentWillReceiveProps = (nextProps) => {
    let tmpData = this.getCharacters(nextProps.questions.text);
    let { alphabet, characters } = tmpData;
    this.setState({ characters, alphabet, question: nextProps.questions });
  }

  onLoadImage = ({ target: img }) => {
    if (img.offsetWidth > 490) {
      this.setState({
        styleImage: {
          width: "100%"
        }
      });
    }
  };

  onNext = () => {
    this.resultAnswer = this.state.characters.map(x => x.character).join("");

    // check answer true or false
    this.resultAnswer === this.state.question.text
      ? this.checkAnswer(true)
      : this.checkAnswer(false);

    // post answer to api
    this._postAnswerToAPI({ text: this.resultAnswer });

    const { classId, sessionId } = this.props.allProps.match.params;
    this.props.allProps.history.push(
      {
        pathname: `${JRoutes.HOME}classes/${classId}/sessions/${sessionId}/questions`,
        state: {
          next_question: true,
          selectClass: this.props.selectedClass,
        }
      }
    )
  };

  checkAnswer = isCorrect => {
    let { onSaveAnswers } = this.props;
    if (isCorrect === true) {
      onSaveAnswers({ key: this.questionIndex, isCorrect, score: 100, type: "" });
      openNotificationWithIcon("success", "CORRECT");
    } else {
      onSaveAnswers({ key: this.questionIndex, isCorrect, score: 0, type: "" });
      openNotificationWithIcon("error", "INCORRECT");
    }
  };

  _postAnswerToAPI = ({ text }) => {

    let answerModel = {
      studentId: this.studentId,
      sessionId: this.props.sessionId,
      assignmentId: this.props.assignmentId,
      questionEntityName: this.state.question.entityName,
      groupName: this.props.groupName,
      questionId: this.state.question.id,
      questionGuid: "", // empty if question type is not GRAMMAR
      answerType: functions.getAnswerType(__typeText.Type13),
      notes: "",
      takeExamTime: this.takeExamTime,
      studentChoice: JSON.stringify({ text })
    };
    functions
      .postAnswerToAPI(answerModel)
      .then(response => {
      })
      .catch(err => {
        //console.log(err);
      });
  };

  render() {
    let {  question, alphabet, characters, disabled, show } = this.state;
    let isDisabled =
      characters.filter(x => x.character !== "").length !==
      question.text.length;
    var char = characters.map((item, index) => {
      return (
        <span
          key={index}
          className={
            item.status === "on"
              ? classNames(["question-type__btnMove-question1"])
              : classNames(["question-type__btnMove_type13"])
          }
          style={
            item.status === "on"
              ? { cursor: 'pointer' } :
              { cursor: '' }
          }
          onClick={() => {
            if (item.status === "on") {
              this.removeCharacter(item);
            }
          }}
        >
          {item.character}
        </span>
      );
    });

    var alp = alphabet.map((item, index) => {
      return item.status === "on" ? (
        <span
          key={index}
          className={classNames(["question-type__btnMove"])}
          style={{ cursor: 'pointer' }}
          onClick={
            isDisabled === true
              ? () => {
                if (item.status == "on") {
                  this.addCharacter(item);
                }
              }
              : () => { }
          }
        >
          {item.character}
        </span>
      ) : (
          <span className={classNames(["question-type__btnMove_type13"])} style={{ background: '#97a4e6' }} />
        );
    });

    if (!question) {
      return <AMES247Loading />;
    } else {
      return (
        <React.Fragment>
          <Row className={classNames(["question-type1"])}>
            <img
              src={question.imageUrl}
              style={this.state.styleImage}
              onLoad={this.onLoadImage}
              className={classNames(["question-type__image mt-15 mb-15"])}
            />
            <p className={classNames(["question-type__word"])}>
              {question.description}
            </p>
            <Row style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <Row className={classNames(["mt-15 mb-15"])}>
                {char}
              </Row>
              <p className={classNames(["question-type__show"])}>
                {show}
              </p>
              <hr style={{ 'border': '1px solid #b1b7d2', width: 300 }} />
              <Row className={classNames(["mb-15 mt-15"])}>
                {alp}
              </Row>
            </Row>
          </Row>
          <Row className={classNames(["question-type__actions"])}>
            <AMES247Button
              value={"Submit"}
              disabled={isDisabled}
              onClick={this.onNext}
            />
          </Row>
        </React.Fragment >
      );
    }
  }
}

Type13.propTypes = {};

const mapStateToProps = state => ({
  exerciseCountdowns: state.AMES247SaveAnswerReducer
});

const mapDispatchToProps = dispatch => ({
  onSaveAnswers: ({ key, isCorrect, score, type }) => {
    dispatch(saveAnswerAction({ key, isCorrect, score, type }));
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Type13);
