import React from "react";
import classNames from "classnames";
import { connect } from "react-redux";
import JRoutes from "src/configs/routes.json";
import { getClassId } from "src/components/functions";
import * as __typeText from "../typesQuestion";
import { default as functions } from "src/components/functions";
import { default as LoadDataError } from "src/components/Error/LoadDataError";

import queryString from "query-string";
import { Rate, Button, Row, Col, Popover } from "antd";
import { Icon } from "src/components/Icon";
import { saveAnswerAction } from "../actions/saveAnswerAction";
import Listen from "src/components/Listening";
import AMES247Loading from "src/components/Loading";
import Recorder from "src/components/Recording/react_mic_S";
import CountdownTimer from "src/components/countdownTimer";
import { postMediaAnswerToApi } from "src/components/postMediaAnswer";
import { openNotificationWithIcon } from "src/components/Notifications";
import { postMediaAnswerToAzure } from "src/components/postMediaAnswerToAzure";
import { DictionaryText } from "src/components/Dictionary";
import { default as NotData } from 'src/components/Error/NotData';

const text =
  <div style={{ display: "table" }}>
    <div style={{ display: "table-cell", width: 100, textAlign: "center" }}>Vần</div>
    <div style={{ display: "table-cell", width: 100, textAlign: "center" }}>Đơn Âm</div>
    <div style={{ display: "table-cell", width: 100, textAlign: "center" }}>Đánh Giá</div>
  </div>;

class Type12 extends React.Component {
  constructor(props) {
    super(props);
    this.soundUrl = "";
    this.arrayQuestion = "";
    this.state = {
      question: {},
      resultRecord: undefined,
      questions: props.questions,
    };

    props.onSaveAnswers({});

    this.questionIndex = 0;
    this.takeExamTime = this.props.takeExamTime;
    this.studentId = functions.getUser().studentId;
    //this.recordUrlFromApi = null;
    this.refRecorder = React.createRef();
    this.refCountdownTimer = React.createRef();
  }

  getRandomInt = (min, max) =>
    Math.floor(Math.random() * (max - min + 1)) + min;

  componentWillMount = () => {
    let questions = functions.randomTextAnswersFromAPI(this.props.questions);
    questions = functions.randomFourAnswersOneWay(questions);
    this.setState({
      questions,
      loading: false,
      question: questions[this.questionIndex]
    });
    var random = this.getRandomInt(0, 2);
    if (this.state.questions[0].examplesFormat === null) {
      this.questionIndex++;
      this.moveOnToAnotherQuestion(this.questionIndex);
    }
    else {
      let ques = JSON.parse(this.state.questions[0].examplesFormat).sentences[random];
      this.soundUrl = ques.soundUrl;
      this.arrayQuestion = ques.text;
    }
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
      //this._getRecordUrlFromApi()
    }
  };

  onNext = (type, _) => {
    const questionParent = this.state.question;
    const originalSentence = this.arrayQuestion;
    const soundUrl = this.soundUrl;

    // check answer true or false
    this.checkAnswer(type);

    this._postAnswerToAPI(this.state.resultRecord, questionParent, originalSentence, soundUrl)

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

    if (
      type === "NEXT" &&
      this.state.resultRecord.score > functions.satisfactoryResults
    ) {
      onSaveAnswers({ key: this.questionIndex, isCorrect: true, score: this.state.resultRecord.score, type: "record" });
      openNotificationWithIcon("success", "CORRECT");
    } else {
      onSaveAnswers({ key: this.questionIndex, isCorrect: false, score: this.state.resultRecord.score, type: "record" });
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
    var random = this.getRandomInt(0, 2);
    if (this.state.questions[ix].examplesFormat === null) {
      this.questionIndex++;
      this.moveOnToAnotherQuestion(this.questionIndex);
    }
    else {
      let ques = JSON.parse(this.state.questions[ix].examplesFormat).sentences[random];
      this.soundUrl = ques.soundUrl;
      this.arrayQuestion = ques.text;
    }
  };

  _postAnswerToAPI = (resultRecord, questionParent, originalSentence, soundUrl) => {
    let { allProps } = this.props;

    let answerModel = {
      studentId: this.studentId,
      sessionId: allProps.match.params.sessionId,
      assignmentId: allProps.match.params.assignmentId,
      questionEntityName: allProps.results.data.questionEntityName,
      questionId: questionParent.id,
      questionGuid: "", // empty if question type is not GRAMMAR
      answerType: functions.getAnswerType(__typeText.Type09),
      notes: "",
      takeExamTime: this.takeExamTime,
      studentChoice: JSON.stringify({
        score: resultRecord.score || 0,
        originalSentence,
        recordUrl: resultRecord.recordUrl || "",
        example: { soundUrl }
      })
    };
    functions
      .postAnswerToAPI(answerModel)
      .then((_) => {
        this.setState({ resultRecord: undefined });
      })
      .catch(err => {
        console.log(err);
      });
  };

  render() {
    let { question, resultRecord } = this.state;

    const recordParams = {
      questionId: question.id,
      questionText: this.arrayQuestion,
      student: functions.getUser(),
      takeExamTime: this.takeExamTime,
      // user: {
      //   mode: functions.getUser().Mode,
      // },
    };

    let content = [];

    if (resultRecord !== undefined) {
      content = <div className={'ames-scrollbar'} style={{ maxHeight: 350 }}>
        {resultRecord.wordShows.map((item, index) => {
          return (
            item.syllables.map((it, i) => {
              return (
                <div style={{ display: "table", "border": "1px solid #d3baba", borderRadius: 5, marginBottom: 5, textAlign: "center", marginRight: 5 }}>
                  <div style={{ display: "table-cell", width: 100, "vertical-align": "middle" }}>
                    <div style={{ color: it.color, fontWeight: 'bold' }}>{it.letters}</div>
                    <div style={{ fontSize: 12 }}>{it.score}%</div>
                  </div>
                  <div style={{ display: "table-cell", width: 100, "vertical-align": "middle" }}>
                    {it.phonemes.map((it, ix) => {
                      return (
                        <div style={{ color: it.color }}>{item.word === 'a' ? 'ə' : it.ipa}</div>
                      )
                    })}
                  </div>
                  <div style={{ display: "table-cell", width: 100, "vertical-align": "middle" }}>
                    {it.phonemes.map((it_phonemes, ix) => {
                      return (
                        <div style={{ color: it_phonemes.color }}>{it_phonemes.sound_most_like_ipa === null ? 'Missing' : it_phonemes.sound_most_like_ipa === it_phonemes.ipa ? 'Good' : `Sound like ${it_phonemes.sound_most_like_ipa}`}</div>
                      )
                    })}
                  </div>
                </div>
              )
            })
          )
        })}
      </div>
    }

    if (this.props.questions.length === 0 || JSON.parse(question.examplesFormat).sentences < 0) {
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
              <Listen audioURL={this.soundUrl} onAuto={true} />
              <h2 className={classNames(["question-type__grammar_text"])}>
                <DictionaryText text={this.arrayQuestion} />
              </h2>
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
                recordParams={recordParams}
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
                {resultRecord && (
                  <div>
                    <Popover placement="top" title={text} content={content}>
                      {resultRecord.wordShows.map((t, i) => (
                        <span
                          key={i}
                          style={{ color: t.color, cursor: "pointer", backgroundColor: "#ffffff", padding: 2 }}
                          className={classNames(["question-type__textReply"])}
                        >
                          {`${t.word} `}
                          {/* <div style={{ fontSize: 12, width: 20, display: "table-row" }}>{t.score}%</div> */}
                        </span>
                      ))}
                    </Popover>
                    <br />
                    <div className="record--result">
                      {resultRecord && (
                        <div className={""}>
                          <Listen
                            custom
                            className={
                              "record--content record--result__listen"
                            }
                            audioURL={resultRecord.recordUrl}
                          >
                            <Icon icon={"volume-up"} size={"lg"} />
                          </Listen>
                        </div>
                      )}
                      {/* <Recorder
                        ref={this.refRecorder}
                        __custom
                        __icon={"redo"}
                        __className={
                          "record--content record--result__btn-reset"
                        }
                        __onRecording={this.onRecording}
                        __onStopRecording={this.onStopRecording}
                        recordParams={recordParams}
                      /> */}
                      <div
                        className={classNames([
                          "record--result__rate",
                          "record--content"
                        ])}
                      >
                        <Rate
                          allowHalf
                          disabled
                          value={functions.getStarRecord(resultRecord.score)}
                        />
                      </div>
                      <div
                        className={classNames([
                          "record--result__btn-score",
                          "record--content"
                        ])}
                      >
                        <strong>{`${parseInt(resultRecord.score)}%`}</strong>
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
)(Type12);
