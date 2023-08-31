import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import JRoutes from "src/configs/routes.json";
import { getClassId } from "src/components/functions";
import * as __typeText from "../typesQuestion";
import { default as functions } from "src/components/functions";
import { Input } from "antd";
import { connect } from "react-redux";
import { saveAnswerAction } from "../actions/saveAnswerAction";
import Listen from "src/components/Listening";
import AMES247Loading from "src/components/Loading";
import { default as AMES247Button } from "src/components/Button";
import { default as LoadDataError } from "src/components/Error/LoadDataError";
import queryString from "query-string";
import { default as NotData } from 'src/components/Error/NotData';
import { openNotificationWithIconType19 } from "src/components/Notifications";

class Type19 extends React.Component {
  constructor(props) {
    super(props);

    this.arrayQuestion = "";
    this.soundUrl = "";
    this.showquestion = "";
    this.text = "";

    this.state = {
      answer: "",
      disabled: true,
      loading: true,
      question: undefined,
      questions: props.questions ? props.questions : [],
      disabledBack: true,
    };

    props.onSaveAnswers({});

    this.TrueAnswer = "";
    this.questionIndex = 0;
    this.takeExamTime = this.props.takeExamTime;
  }

  componentWillMount = () => {
    this.setState({ question: this.state.questions[0], loading: false });

    var random = this.getRandomInt(0, 2);
    if (this.state.questions[0].examplesFormat !== null) {
      let ques = JSON.parse(this.state.questions[0].examplesFormat).sentences[random];
      this.soundUrl = ques.soundUrl;
      this.arrayQuestion = ques.text;
    }
  };

  onChange = e => {
    this.setState(
      e.target.value === ""
        ? { answer: e.target.value, disabled: true }
        : { answer: e.target.value, disabled: false }
    );
  };

  onListened = () => {
    this.setState({ onListened: true });
  };

  onNext = answer => {
    let { question, randomsound } = this.state;
    let ques = this.showquestion.replace(" ... ", answer).trim();

    ques.toLowerCase() == this.arrayQuestion.toLowerCase().trim()
      ? this.checkAnswer(true)
      : this.checkAnswer(false);
    this.setState({ answer: "", disabled: true });

    // post answer to api
    this._postAnswerToAPI({
      answer: answer.trim().toLowerCase(),
      showquestion: this.showquestion,
      examble: this.arrayQuestion,
      soundExambleUrl: this.soundUrl
    });

    if (this.checkCompletedOrNo()) return;

    // nextQuestion
    this.questionIndex++;
    this.moveOnToAnotherQuestion(this.questionIndex);
    if (this.questionIndex !== 0) {
      this.setState({ disabledBack: false });
    }
  };

  checkAnswer = isCorrect => {
    let { onSaveAnswers } = this.props;
    if (isCorrect === true) {
      onSaveAnswers({ key: this.questionIndex, isCorrect, score: 100, type: "" });
      openNotificationWithIconType19("success",
       //"CORRECT"
       <div style={{color: 'green'}}>
        <b>Correct answer:</b> {this.TrueAnswer}
      </div>
       );
      this.text = this.state.question.text;
    } else {
      onSaveAnswers({ key: this.questionIndex, isCorrect, score: 0, type: "" });
      openNotificationWithIconType19("error", 
      //"INCORRECT"
      <div style={{color: 'red'}}>
        <b>Correct answer:</b> {this.TrueAnswer}
      </div>
      );
      this.text = " ";
    }
    
  };

  checkCompletedOrNo = () => {
    let { questions, allProps, takeExamTime } = this.props;

    if (this.questionIndex + 1 === questions.length) {
      let { classId } = getClassId();
      let { assignmentId, sessionId } = allProps.match.params;
      let { type } = queryString.parse(window.location.search);


      allProps.history.push(`${JRoutes.HOME}classes/${classId}/sessions/${sessionId}/assignments/${assignmentId}/results?length=${questions.length}&type=${type}&takeExamtime=${takeExamTime}`);
      return true;
    }
    return false;
  };

  moveOnToAnotherQuestion = ix => {
    this.setState({ question: this.state.questions[ix] });
    var random = this.getRandomInt(0, 2);
    let ques = JSON.parse(this.state.questions[ix].examplesFormat).sentences[random];
    this.soundUrl = ques.soundUrl;
    this.arrayQuestion = ques.text;
  };

  _postAnswerToAPI = ({ answer, showquestion, examble, soundExambleUrl }) => {
    let { question } = this.state;
    let { allProps } = this.props;
    const studentId = allProps.selectedClass.studentId
    let answerModel = {
      studentId,
      sessionId: allProps.match.params.sessionId,
      assignmentId: allProps.match.params.assignmentId,
      questionEntityName: allProps.results.data.questionEntityName,
      questionId: question.id,
      questionGuid: "", // empty if question type is not GRAMMAR
      answerType: functions.getAnswerType(__typeText.Type19),
      notes: "",
      takeExamTime: this.takeExamTime,
      studentChoice: JSON.stringify({
        text: this.text,
        answer,
        showquestion,
        examble,
        soundExambleUrl
      })
    };
    functions
      .postAnswerToAPI(answerModel)
      .then(response => { })
      .catch(err => {
        console.log(err);
      });
  };

  getRandomInt = (min, max) =>
    Math.floor(Math.random() * (max - min + 1)) + min;

  render() {
    let { loading, question, randomsound } = this.state;

    if(this.props.questions.length === 0)
    {
      return <NotData />;
    }
    if (question.examplesFormat != null) {
      let arraytext = question.text.split(" ");
      let length = arraytext.length - 1;
      let index = this.arrayQuestion.indexOf(arraytext[0]);
      let last =
        this.arrayQuestion.indexOf(arraytext[length]) + arraytext[length].length;
      let TrueAnswer = this.arrayQuestion.substring(index, last);
      this.TrueAnswer = TrueAnswer;
      this.showquestion = this.arrayQuestion
        .replace(TrueAnswer + "s", " ... ")
        .replace(TrueAnswer + "es", " ... ")
        .replace(TrueAnswer + "ing", " ... ")
        .replace(TrueAnswer + "ed", " ... ")
        .replace(TrueAnswer, " ... ");
    }

    if (loading) {
      return <AMES247Loading />;
    } else {
      return (
        question.examplesFormat === null ? <LoadDataError /> :
          <div>
            <Listen audioURL={this.soundUrl} />

            <p className={classNames(["question-type__word"])}>
              {this.showquestion}
            </p>
            <br />
            <Input
              size="large"
              placeholder="Input your answer here"
              value={this.state.answer}
              onChange={this.onChange}
              style={{ width: "400px" }}
            />
            <hr className={classNames(["hr-style", "mt-20"])} />
            <AMES247Button
              value={"Submit"}
              disabled={this.state.disabled}
              onClick={() => this.onNext(this.state.answer)}
              htmlType="submit"
            />
          </div>
      );
    }
  }
}

Type19.propTypes = {};

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
)(Type19);
