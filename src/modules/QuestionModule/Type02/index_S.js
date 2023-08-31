import React from "react";
import classNames from "classnames";
import { connect } from "react-redux";
import JRoutes from "src/configs/routes.json";
import { getClassId } from "src/components/functions";
import * as __typeText from "../typesQuestion";

import queryString from "query-string";
import { Popover, Rate, Row, Col } from "antd";
import { Icon } from "src/components/Icon";
import { saveAnswerAction } from "../actions/saveAnswerAction";
import { default as functions } from "src/components/functions";
import Listen from "src/components/Listening";
import AMES247Loading from "src/components/Loading";
import Recorder from "src/components/Recording/react_mic_S";
import CountdownTimer from "src/components/countdownTimer";
import { openNotificationWithIcon } from "src/components/Notifications";
import { default as NotData } from 'src/components/Error/NotData';

import "./Type2.css";

const text =
  <div style={{ display: "table" }}>
    <div style={{ display: "table-cell", width: 100, textAlign: "center" }}>Vần</div>
    <div style={{ display: "table-cell", width: 100, textAlign: "center" }}>Đơn Âm</div>
    <div style={{ display: "table-cell", width: 100, textAlign: "center" }}>Đánh Giá</div>
  </div>;

class Type02 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      question: {},
      resultRecord: undefined,
      questions: props.questions,
    };

    props.onSaveAnswers({});

    this.questionIndex = 0;
    this.takeExamTime = this.props.takeExamTime;
    this.studentId = functions.getUser().studentId;
    this.refRecorder = React.createRef();
    this.refCountdownTimer = React.createRef();
  }

  componentWillMount = () => {
    this.setState({ question: this.state.questions[this.questionIndex] });
  };

  onRecording = () => {
    if (typeof this.props.startRecord === "function") {
      this.props.startRecord();
    }
    this.refCountdownTimer.current.startTimer();
  };

  onStopRecording = result => {
    if (typeof this.refCountdownTimer.current.stopTimer == "function") {
      this.refCountdownTimer.current.stopTimer();
      this.setState({ resultRecord: result });
    }
  };

  onNext = (type, _) => {
    const questionParent = this.state.question;

    // check answer true or false
    this.checkAnswer(type);

    // this._getRecordUrlFromApi(result => {
    //   if (result != "" || result != "error") {
    //     this._postAnswerToAPI(result.data.recordUrl, questionParent)
    //   }
    // });

    this._postAnswerToAPI(this.state.resultRecord, questionParent)

    if (this.checkCompletedOrNo()) return;

    // nextQuestion
    this.questionIndex++;
    this.moveOnToAnotherQuestion(this.questionIndex);
    if (this.questionIndex !== 0) {
      this.setState({ disabledBack: false });
    }
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
  };

  _postAnswerToAPI = (resultRecord, questionParent) => {
    const { allProps } = this.props;

    const answerModel = {
      studentId: this.studentId,
      sessionId: allProps.match.params.sessionId,
      assignmentId: allProps.match.params.assignmentId,
      questionEntityName: allProps.results.data.questionEntityName,
      questionId: questionParent.id,
      questionGuid: "", // empty if question type is not GRAMMAR
      answerType: functions.getAnswerType(__typeText.Type02),
      notes: "S",
      takeExamTime: this.takeExamTime,
      studentChoice: JSON.stringify({
        score: resultRecord.score || 0,
        wordShows: resultRecord.wordShows || [],
        recordUrl: resultRecord.recordUrl || ""
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
      questionText: question.text,
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

    if (this.props.questions.length === 0) {
      return <NotData />;
    }

    if (!question) {
      return <AMES247Loading />;
    } else {
      return (
        <React.Fragment>
          <Row className={classNames(["question-type"])}>
            <Col className={classNames(["question-type__left"])} xs={24} sm={24} lg={12} md={12}>
              <Listen audioURL={question.soundUrl} onAuto={true} />

              <p className={classNames(["question-type__word"])}>
                {question.text}
              </p>
              {question.phonetic !== null ?
                <p className={classNames(["question-type__kindOfWord"])}>
                  <i>{`/${question.phonetic}/`}</i>
                </p>
                : <div></div>
              }
              <p className={classNames(["question-type__kindOfWord"])}>
                {`( ${question.wordType} )`}
              </p>
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
                            className={"record--content record--result__listen"}
                            audioURL={resultRecord.recordUrl}
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
                        recordParams={recordParams}
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
                          value={functions.getStarRecord(resultRecord.score)}
                        />
                      </div>
                      <div
                        className={classNames([
                          "record--result__btn-score",
                          "record--content"
                        ])}
                      >
                        <strong>{`${parseInt(
                          resultRecord.score
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
)(Type02);
