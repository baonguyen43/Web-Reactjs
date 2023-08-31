import React from "react";
import classNames from "classnames";
import { connect } from "react-redux";
import JRoutes from "src/configs/routes.json";
import { getClassId } from "src/components/functions";
import * as __typeText from "../typesQuestion";

import queryString from "query-string";
import { Rate, Row, Col } from "antd";
import { Icon } from "src/components/Icon";
import { saveAnswerAction } from "../actions/saveAnswerAction";
import { default as functions } from "src/components/functions";
import Listen from "src/components/Listening";
import AMES247Loading from "src/components/Loading";
import Recorder from "src/components/Recording/azure";
import CountdownTimer from "src/components/countdownTimer";
import { postMediaAnswerToApi } from "src/components/postMediaAnswer";
import { openNotificationWithIcon } from "src/components/Notifications";
import { postMediaAnswerToAzure } from "src/components/postMediaAnswerToAzure";
import { default as NotData } from 'src/components/Error/NotData';

class Type27 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      question: {},
      resultRecord: undefined,
      questions: props.questions,
      resultRecordWithAzure: undefined,
      disabledBack: true,
      disabledNext: false
    };

    props.onSaveAnswers({});

    this.questionIndex = 0;
    this.takeExamTime = this.props.takeExamTime;
    this.recordUrlFromApi = null;
    this.refRecorder = React.createRef();
    this.refCountdownTimer = React.createRef();
  }

  componentWillMount = () => {
    this.setState({ question: this.state.questions[this.questionIndex] });
  };

  // componentDidMount() {
  //   if (this.state.question) {
  //     Notify.confirm({
  //       title: "Do you want to check your microphone",
  //       content: <RecordNotification />
  //     });
  //   }
  // }


  receivedResultsFromAzure = jsonAzure => {
    let params = {
      jsonAzure,
      readingText: this.state.question.text
    };
    postMediaAnswerToAzure(params, resultRecordWithAzure => {
      this.setState({ resultRecordWithAzure });
    });
  };

  onRecording = () => {
    this.setState({ disabledNext: true }, () => {
      if (typeof this.props.startRecord === "function") {
        this.props.startRecord();
      }
      this.refCountdownTimer.current.startTimer();
    });
  };

  onStopRecording = result => {
    if (typeof this.refCountdownTimer.current.stopTimer == "function") {
      this.refCountdownTimer.current.stopTimer();
      this.setState({ resultRecord: result, disabledNext: false });
    }
  };

  onBack = (type, _) => {
    this.questionIndex--;
    this.moveOnToAnotherQuestion(this.questionIndex);
    if (this.questionIndex === 0) {
      this.setState({ disabledBack: true });
    }
  };

  onNext = (type, _) => {
    // check answer true or false
    this.checkAnswer(type);

    if (this._getRecordUrlFromApi()) {
      this._postAnswerToAPI();
    }

    if (this.checkCompletedOrNo()) return;

    // nextQuestion
    this.questionIndex++;
    this.moveOnToAnotherQuestion(this.questionIndex);
    // if (this.questionIndex !== 0) {
    //   this.setState({ disabledBack: false, resultRecordWithAzure: undefined });
    // }
  };

  checkAnswer = async type => {
    let { onSaveAnswers } = this.props;
    let { resultRecordWithAzure } = this.state;

    if (
      type === "NEXT" &&
      resultRecordWithAzure &&
      resultRecordWithAzure.score > functions.satisfactoryResults
    ) {
      onSaveAnswers({ key: this.questionIndex, isCorrect: true, score: resultRecordWithAzure.score, type: "record" });
      openNotificationWithIcon("success", "CORRECT");
    } else {
      onSaveAnswers({ key: this.questionIndex, isCorrect: false, score: resultRecordWithAzure.score, type: "record" });
      openNotificationWithIcon("error", "INCORRECT");
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
  };

  _getRecordUrlFromApi = () => {
    let { question, resultRecord } = this.state;
    if (!resultRecord) return false;

    let params = {
      blobFile: resultRecord.blobs,
      extensionInput: "wav",
      readingText: question.text,
      studentID: this.studentId,
      questionId: question.id,
      takeExamTime: this.takeExamTime,
      device: "WEB"
    };
    postMediaAnswerToApi(params, result => {
      if (result !== "error") {
        this.recordUrlFromApi = result.data.recordUrl;
      }
    });

    return true;
  };

  _postAnswerToAPI = () => {
    let { question, resultRecordWithAzure } = this.state;
    let { allProps } = this.props;
    const studentId = allProps.selectedClass.studentId
    let answerModel = {
      studentId,
      sessionId: allProps.match.params.sessionId,
      assignmentId: allProps.match.params.assignmentId,
      questionEntityName: allProps.results.data.questionEntityName,
      questionId: question.id,
      questionGuid: "", // empty if question type is not GRAMMAR
      answerType: functions.getAnswerType(__typeText.Type27),
      notes: "",
      takeExamTime: this.takeExamTime,
      studentChoice: JSON.stringify({
        score: resultRecordWithAzure ? resultRecordWithAzure.score : 0,
        wordShows: resultRecordWithAzure ? resultRecordWithAzure.wordShows : [],
        recordUrl: this.recordUrlFromApi ? this.recordUrlFromApi : ""
      })
    };

    functions
      .postAnswerToAPI(answerModel)
      .then(response => {
        this.recordUrlFromApi = null;
      })
      .catch(err => {
        console.log(err);
      });
  };

  render() {
    let { question, resultRecordWithAzure, resultRecord } = this.state;

    if(this.props.questions.length === 0)
    {
      return <NotData />;
    }
    if (!question) {
      return <AMES247Loading />;
    } else {
      return (
        <React.Fragment>
          <Row className={classNames(["question-type"])}>
            <Col
              className={classNames(["question-type__left"])}
              xs={24}
              sm={24}
              lg={12}
              md={12}
            >
              <Listen audioURL={question.soundUrl} />

              <p className={classNames(["question-type__word"])}>
                {question.text}
              </p>
              {/* <p className={classNames(["question-type__kindOfWord"])}>
                {`( ${question.wordType} )`}
              </p> */}
            </Col>
            <Col
              className={classNames(["question-type__info"])}
              xs={24}
              sm={24}
              lg={12}
              md={12}
            >
              <Recorder
                ref={this.refRecorder}
                __custom
                __className={"question-type__recordType02"}
                __onRecording={this.onRecording}
                __onStopRecording={this.onStopRecording}
                __receivedResultsFromAzure={this.receivedResultsFromAzure}
              >
                <div className={classNames(["mt-15"])}>
                  <CountdownTimer
                    seconds={15}
                    ref={this.refCountdownTimer}
                    onStopRecording={this.onStopRecording}
                  >
                    <span>Recording in: </span>
                  </CountdownTimer>
                </div>
                <br />
                {resultRecordWithAzure && (
                  <div>
                    {resultRecordWithAzure.WordShows.map((t, i) => (
                      <span
                        key={i}
                        style={{ color: t.color }}
                        className={classNames(["question-type__textReply"])}
                      >{`${t.word} `}</span>
                    ))}
                    <br />
                    <div className="record--result">
                      {resultRecord && (
                        <div className={""}>
                          <Listen
                            custom
                            className={"record--content record--result__listen"}
                            audioURL={resultRecord.src}
                          >
                            <Icon icon={"volume-up"} size={"lg"} />
                          </Listen>
                        </div>
                      )}
                      <Recorder
                        ref={this.refRecorder}
                        __custom
                        __icon={"redo"}
                        __className={
                          "record--content record--result__btn-reset"
                        }
                        __onRecording={this.onRecording}
                        __onStopRecording={this.onStopRecording}
                        __receivedResultsFromAzure={
                          this.receivedResultsFromAzure
                        }
                      />
                      <div
                        className={classNames([
                          "record--result__rate",
                          "record--content"
                        ])}
                      >
                        <Rate
                        allowHalf
                          disabled
                          value={functions.getStarRecord(resultRecordWithAzure.score)}
                        />
                      </div>
                      <div
                        className={classNames([
                          "record--result__btn-score",
                          "record--content"
                        ])}
                      >
                        <strong>{`${parseInt(
                          resultRecordWithAzure.score
                        )}%`}</strong>
                      </div>
                      <div
                        className={classNames([
                          "record--result__btn-next",
                          "record--content"
                        ])}
                        onClick={this.onNext.bind(this, "NEXT")}
                      >
                        <Icon icon={"arrow-right"} />
                      </div>
                    </div>
                  </div>
                )}
              </Recorder>
            </Col>
          </Row>
        </React.Fragment>
      );
    }
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
)(Type27);
