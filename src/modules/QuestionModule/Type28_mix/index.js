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

class Type17 extends Component {

  constructor(props) {
    super(props);

    this.Arrow = [];

    this.state = {
      styleImage: {
        width: null
      },
      answer: [],
      question: props.questions,
      arraysound: JSON.parse(props.questions.answers),
      next: false,
      cards: [],
    };
    this.props.allProps.history.push({ state: { next_question: false, selectClass: this.props.selectedClass, } })

    this.disabledNext = true;
    this.questionIndex = this.props.indexQuestion;
    this.studentId = functions.getUser().studentId;
  }


  componentWillMount() {
    this.setState({ cards: functions.getRandomArray(JSON.parse(this.props.questions.answers)) });
    this.state.arraysound.map((item) => {
      this.Arrow.push({ color: "#002140" })
    })
  }


  componentWillReceiveProps = (nextProps) => {
    if (nextProps.allProps.location.state.next_question === true) {
      nextProps.allProps.history.push({ state: { next_question: false, selectClass: this.props.selectedClass, } }
      )
      this.Arrow = [];
      this.setState({
        question: nextProps.questions,
        arraysound: JSON.parse(nextProps.questions.answers),
        cards: functions.getRandomArray(JSON.parse(nextProps.questions.answers))
      })
      this.state.arraysound.map((item) => {
        this.Arrow.push({ color: "#002140" })
      })
    }
  }

  moveCard = (dragIndex, hoverIndex) => {
    if (this.state.next === false) {
      const { cards } = this.state;
      const dragCard = cards[dragIndex];

      this.setState(
        update(this.state, {
          cards: {
            $splice: [[dragIndex, 1], [hoverIndex, 0, dragCard]]
          }
        })
      );
    }
  };

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
    if (next === false) {
      this.setState({ next: true })
      let { cards, arraysound } = this.state;
      let score = 0;
      var arrayAnswer = [];

      for (let i = 0; i < JSON.parse(this.props.questions.answers).length; i++) {
        cards[i].ImageUrl === arraysound[i].ImageUrl ? arrayAnswer.push(true) : arrayAnswer.push(false)
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
      this._postAnswerToAPI({ score: 100 / JSON.parse(this.props.questions.answers).length * score });
      this.checkAnswer(arrayAnswer);
    }
    else {
      this.setState({ next: false })
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
    }

  };

  checkAnswer = arrayAnswer => {
    let { onSaveAnswers } = this.props;
    let score = 0;
    arrayAnswer.map((item, index) => {
      if (item === true) {
        score++;
      }
    })

    if (score > 2) {
      onSaveAnswers({ key: this.questionIndex, isCorrect: true, score: score * 25, type: "" });
      openNotificationWithIcon("success", "CORRECT");
    } else {
      onSaveAnswers({ key: this.questionIndex, isCorrect: false, score: score * 25, type: "" });
      openNotificationWithIcon("error", "INCORRECT");
    }
  };



  _postAnswerToAPI = ({ score }) => {

    let answerModel = {
      studentId: this.studentId,
      sessionId: this.props.sessionId,
      assignmentId: this.props.assignmentId,
      questionEntityName: this.state.question.entityName,
      groupName: this.props.groupName,
      questionId: this.state.question.id,
      questionGuid: "", // empty if question type is not GRAMMAR
      answerType: functions.getAnswerType(__typeText.Type17),
      notes: "",
      takeExamTime: this.props.takeExamTime,
      studentChoice: JSON.stringify({
        score: parseInt(score),
        pairs: {
          left: JSON.parse(this.props.questions.answers),
          right: this.state.cards,
        }
      })
    };
    console.log(answerModel)
    functions
      .postAnswerToAPI(answerModel)
      .then(v => { console.log(v) })
      .catch(err => {
        console.log(err);
      });
  };

  render() {

    let { arraysound, next, cards } = this.state;

    var sound = arraysound.map((item, index) => {
      return (
        <div>
          <Button
            style={{ height: 150, width: 150 }}
            className={classNames(["question-type__boxText"])}
          >
            <Listen
              custom
              audioURL={item.SoundUrl}
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
          key={item.Id}
          index={i}
          id={item.Id}
          text={item.ImageUrl}
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
)(DragDropContext(HTML5Backend)(Type17));