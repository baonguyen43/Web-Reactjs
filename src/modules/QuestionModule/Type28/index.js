import React, { Component } from 'react';
import classNames from "classnames";
import JRoutes from "src/configs/routes.json";
import { getClassId } from "src/components/functions";
import { saveAnswerAction } from "../actions/saveAnswerAction";
import { connect } from "react-redux";

import queryString from "query-string";
import * as __typeText from "src/modules/QuestionModule/textTypes";
import Listen from "src/components/Listening";

import Card from "./Card";
import { DragDropContext } from "react-dnd";
import HTML5Backend from "react-dnd-html5-backend";

import { Row, Button } from "antd";
import { default as functions } from "src/components/functions";
import { default as AMES247Button } from "src/components/Button";
import { openNotificationWithIcon } from "src/components/Notifications";
import { Icon } from "src/components/Icon";
import { default as NotData } from 'src/components/Error/NotData';

const update = require("immutability-helper");

class Type28 extends Component {

  constructor() {
    super();

    this.arraysound = [];
    this.arrayimage = [];
    this.arraytext = [];
    this.arrayquestion = [];
    this.Arrow = [];

    this.state = {
      styleImage: {
        width: null
      },
      dotFirst: undefined,
      dotSecord: undefined,
      answer: [],
      question: {},
      questions: [],
      nameFirst: '',
      nameSecond: '',
      arraytext: [],
      arrayimage: [],
      arraysound: [],
      next: false,
      cards: this.arrayimage,
    };

    this.i = 0;
    this.j = 4;

    this.disabledNext = true;
    this.refFirst = [];
    this.refSecond = [];
    this.questionIndex = 0;
    //this.takeExamTime = this.props.takeExamTime;
    this.positionFirst = ['0,75', '0,235', '0,395', '0,555']
    this.positionSecond = ['300,75', '300,235', '300,395', '300,555']
  }

  moveCard = (dragIndex, hoverIndex) => {
    const { cards } = this.state;
    const dragCard = cards[dragIndex];

    this.setState(
      update(this.state, {
        cards: {
          $splice: [[dragIndex, 1], [hoverIndex, 0, dragCard]]
        }
      })
    );
  };

  getFourQuestion = (questions, index) => {
    let { i, j } = this;
    if(this.props.questions.length < 4)
    {
      j = this.props.questions.length;
    }

    if (index === this.arrayquestion.length - 1) {
      let ExcessQuestion = this.props.questions.length % 4;
      for (i; i < j; i++) {
        this.arrayquestion[index].ques.push(questions[i])
      }
    }
    else {
      for (i; i < j; i++) {
        this.arrayquestion[index].ques.push(questions[i])
      }
    }
    return this.arrayquestion;
  }

  componentWillMount() {
    if (this.props.questions.length < 4) {
      this.arrayquestion.push({ ques: [] })
    }
    else {
      let maxquestion = this.props.questions.length / 4;
      for (let i = 0; i < maxquestion; i++) {
        this.arrayquestion.push({ ques: [] })
      }
    }

    let questions = this.getFourQuestion(this.props.questions, this.questionIndex)
    this.setState({
      questions,
      question: questions[this.questionIndex]
    });


    for (let i = 0; i < questions[this.questionIndex].ques.length; i++) {
      this.arraytext.push(questions[0].ques[i]);
      this.arrayimage.push({
        soundUrl: questions[0].ques[i].soundUrl,
        imageUrl: questions[0].ques[i].imageUrl
      });
      this.arraysound.push({
        soundUrl: questions[0].ques[i].soundUrl,
        imageUrl: questions[0].ques[i].imageUrl
      });
      this.Arrow.push({ color: "#002140" });
    }

    functions.getRandomArray(this.arraytext);
    functions.getRandomArray(this.arrayimage);
    functions.getRandomArray(this.arraysound);
    this.setState({ arraytext: this.arraytext, arrayimage: this.arrayimage, arraysound: this.arraysound })
  }

  onLoadImage = ({ target: img }) => {
    if (img.offsetWidth > 400) {
      this.setState({
        styleImage: {
          width: "380px"
        }
      });
    }
  };

  onNext = (next) => {
    this.setState({ next: true })
    if (next === false) {
      let { cards } = this.state;
      let score = 0;
      var arrayAnswer = [];

      for (let i = 0; i < this.arrayquestion[this.questionIndex].ques.length; i++) {
        cards[i].imageUrl === this.arraysound[i].imageUrl ? arrayAnswer.push(true) : arrayAnswer.push(false)
      }

      for (let i = 0; i < arrayAnswer.length; i++) {
        if (arrayAnswer[i] === true) {
          this.Arrow[i].color = "green";
          score++;
        }
        else {
          this.Arrow[i].color = "red";
        }
      }

      // postAnswerToAPI()
      this._postAnswerToAPI({ score: 100 / this.arrayquestion[this.questionIndex].ques.length * score });
      this.checkAnswer(arrayAnswer);
    }
    else {
      if (this.checkCompletedOrNo()) return;

      // nextQuestion
      this.questionIndex++;
      this.moveOnToAnotherQuestion(this.questionIndex);
    }

  };

  checkAnswer = arrayCheckAnswer => {
    let { onSaveAnswers } = this.props;
    arrayCheckAnswer.map((item, index) => {
      if (item === true) {
        onSaveAnswers({ key: (this.questionIndex * arrayCheckAnswer.length + index), isCorrect: true, score: 100, type: "" });
        openNotificationWithIcon("success", "CORRECT");
      } else {
        onSaveAnswers({ key: (this.questionIndex * arrayCheckAnswer.length + index), isCorrect: false, score: 0, type: "" });
        openNotificationWithIcon("error", "INCORRECT");
      }
    })
  };

  checkCompletedOrNo = () => {
    let { allProps, takeExamTime } = this.props;
    let questions = this.arrayquestion;
    if (this.questionIndex + 1 === questions.length) {
      let { classId } = getClassId();
      let { assignmentId, sessionId } = allProps.match.params;
      let { type } = queryString.parse(window.location.search);


      allProps.history.push(`${JRoutes.HOME}classes/${classId}/sessions/${sessionId}/assignments/${assignmentId}/results?length=${questions.length}&type=${type}&takeExamtime=${takeExamTime}`);
      return true;
    }
    return false;
  };

  _postAnswerToAPI = ({ score }) => {
    let { question } = this.state;
    let { allProps } = this.props;
    const studentId = allProps.selectedClass.studentId
    let answerModel = {
      studentId,
      sessionId: allProps.match.params.sessionId,
      assignmentId: allProps.match.params.assignmentId,
      questionEntityName: allProps.results.data.questionEntityName,
      questionId: question.ques[0].id,
      questionGuid: "", //empty if question type is not GRAMMAR
      answerType: functions.getAnswerType(__typeText.Type15),
      notes: "",
      takeExamTime: this.props.takeExamTime,
      studentChoice: JSON.stringify({
        score: parseInt(score),
        pairs: {
          left: this.arraysound,
          right: this.state.cards,
        }
      })
    };
    functions
      .postAnswerToAPI(answerModel)
      .then(v => { })
      .catch(err => {
        console.log(err);
      });
  };

  moveOnToAnotherQuestion = ix => {
    this.setState({
      next: false,
      choosedAnswer: undefined,
      question: this.state.questions[ix]
    });

    if (ix === this.arrayquestion.length - 1) {
      let ExcessQuestion = this.props.questions.length % 4;
      if (ExcessQuestion > 0) {
        this.i += 4;
        this.j += ExcessQuestion;
      }
      else {
        this.i += 4;
        this.j += 4;
      }
    }
    else {
      this.i += 4;
      this.j += 4;
    }

    let questions = this.getFourQuestion(this.props.questions, ix)
    this.arraytext = [];
    this.arrayimage = [];
    this.arraysound = [];
    this.arrayQuestionText = [];
    this.Arrow = [];
    this.setState({ answer: [] })

    let ExcessQuestion = this.props.questions.length % 4;
    if (ExcessQuestion > 0) {
      if (ix === this.arrayquestion.length - 1) {
        for (let i = 0; i < ExcessQuestion; i++) {
          this.arraytext.push(questions[ix].ques[i]);
          this.arrayimage.push({
            soundUrl: questions[ix].ques[i].soundUrl,
            imageUrl: questions[ix].ques[i].imageUrl
          });
          this.arraysound.push({
            soundUrl: questions[ix].ques[i].soundUrl,
            imageUrl: questions[ix].ques[i].imageUrl
          });
          this.Arrow.push({ color: "#002140" })
        }
      }
      else {
        for (let i = 0; i <= 3; i++) {
          this.arraytext.push(questions[ix].ques[i]);
          this.arrayimage.push({
            soundUrl: questions[ix].ques[i].soundUrl,
            imageUrl: questions[ix].ques[i].imageUrl
          });
          this.arraysound.push({
            soundUrl: questions[ix].ques[i].soundUrl,
            imageUrl: questions[ix].ques[i].imageUrl
          });
          this.Arrow.push({ color: "#002140" })
        }
      }

    }
    else {
      for (let i = 0; i <= 3; i++) {
        this.arraytext.push(questions[ix].ques[i]);
        this.arrayimage.push({
          soundUrl: questions[ix].ques[i].soundUrl,
          imageUrl: questions[ix].ques[i].imageUrl
        });
        this.arraysound.push({
          soundUrl: questions[ix].ques[i].soundUrl,
          imageUrl: questions[ix].ques[i].imageUrl
        });
        this.Arrow.push({ color: "#002140" })
      }
    }


    functions.getRandomArray(this.arraytext);
    functions.getRandomArray(this.arrayimage);
    functions.getRandomArray(this.arraysound);
    this.setState({ cards: this.arrayimage })
    this.setState({ arraytext: this.arraytext, arrayimage: this.arrayimage, arraysound: this.arraysound })
  };


  render() {

    let { answer, arraytext, arrayimage, arraysound, next, cards } = this.state;

    if (this.props.questions.length === 0) {
      return <NotData />;
    }
    var sound = arraysound.map((item, index) => {
      return (
        <div>
          <Button
            style={{ height: 150, width: 150 }}
            className={classNames(["question-type__boxText"])}
          >
            <Listen
              custom
              audioURL={item.soundUrl}
              className={classNames([
                "question-type__boxSound",
              ])}
            >
              <Icon icon={"volume-up"} size={"2x"} />
            </Listen>
          </Button>
        </div>
      );
    });

    var image = cards.map((item, i) => {
      return (
        <Card
          key={item.id}
          index={i}
          id={item.id}
          text={item.imageUrl}
          moveCard={this.moveCard}
        />
      )
    })

    var mid = this.Arrow.map((item, index) => {
      return (
        <div
          style={{ height: 150, width: 150, padding: "50px", margin: "0 0 10px 0" }}
        >
          <Icon icon={"arrow-right"} color={item.color} size={"3x"} />
        </div>
      )
    })

    return (
      <div>
        <Row type="flex" justify="center">
          <div style={{ float: 'left', textAlign: "right" }}>
            {sound}
          </div>
          <div style={{ float: 'left' }} >
            {mid}
          </div>
          <div>
            <div style={{ float: 'left' }}>
              {image}
            </div>
          </div>
        </Row>
        <Row>
          <div className={classNames(["ml-30", "mt-20"])}>
            <AMES247Button
              value={next == false ? "Submit" : "Next"}
              onClick={() => this.onNext(next)}
            />
          </div>
        </Row>
      </div>
    );
  }
}


const mapStateToProps = state => ({});

const mapDispatchToProps = dispatch => ({
  onSaveAnswers: ({ key, isCorrect, score, type }) => {
    dispatch(saveAnswerAction({ key, isCorrect, score, type }));
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DragDropContext(HTML5Backend)(Type28));