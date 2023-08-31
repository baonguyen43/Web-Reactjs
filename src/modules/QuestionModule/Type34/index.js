import React from "react";
import classNames from "classnames";
import { connect } from "react-redux";
import JRoutes from "src/configs/routes.json";
import { getClassId } from "src/components/functions";
import * as __typeText from "../typesQuestion";

import { Icon } from "src/components/Icon";
import { Row, Col, List, Icon as AntIcon, Avatar, Progress } from "antd";
import queryString from "query-string";
import { saveAnswerAction } from "../actions/saveAnswerAction";
import Listen from "src/components/Listening";
import AMES247Loading from "src/components/Loading";
import { default as Button } from "src/components/Button";
import { openNotificationWithIcon } from "src/components/Notifications";
import { default as functions } from "src/components/functions";
import { default as NotData } from 'src/components/Error/NotData';
import { DictionaryText } from "src/components/Dictionary";


class Type34 extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      onListened: false,
      question: undefined,
      questions: props.questions ? props.questions : [],
      styleImage: {
        width: null
      },
      disabledBack: true,
      disabledNext: false,
      score: 0,
      startAudio: "",
      pause: false,
    };

    this.questionIndex = 0;
    this.studentId = functions.getUser().studentId;
    props.onSaveAnswers({});
  }

  componentWillMount = () => {
    this.setState({ loading: false });
  };

  onListened = () => {
    this.setState({ onListened: true });
  };


  moveOnToAnotherQuestion = ix => {
    this.setState({ question: this.state.questions[ix] });
  };


  renderQuestion = (question) => {
    return (
      <div>
        <p />
        <img
          src={question.imageUrl}
          style={this.state.styleImage}
          onLoad={this.onLoadImage}
          className={classNames(["question-type__image"])}
        />
        <Listen
          audioURL={question.soundUrl}
          onListened={this.onListened}
        />
        <p className={classNames(["question-type__word"])}>
          {question.text}
        </p>
        {question.phonetic !== "" ?
          <p className={classNames(["question-type__kindOfWord"])}>
            <i>{`/${question.phonetic}/`}</i>
          </p>
          : <div></div>
        }
        <p className={classNames(["question-type__kindOfWord"])}>
          <i>{`(${question.wordType})`}</i>
        </p>
        <p className={classNames(["question-type__kindOfWord"])}>
          {question.text_VN}
        </p>
      </div>
    )
  }

  onClick = (startAudio) => {
    this.setState({ startAudio: startAudio });
  }

  render() {
    let { loading, startAudio } = this.state;
    let { questions } = this.props

    if(this.props.questions.length === 0)
    {
      return <NotData />;
    }
    if (loading) {
      return <AMES247Loading />;
    } else {
      return (
        <React.Fragment>
          <Row className={classNames(["question-type"])}>
            <Col
              className={classNames(["question-type__left_listening"])}
              xs={24}
              sm={24}
              lg={12}
              md={12}
            >
              <div style={{ fontWeight: "bold" }}>CHỌN BÀI NGHE</div>
              <p></p>
              <List
                style={{ margin: "0 10px 0 25px", textAlign: "left" }}
                //className="demo-loadmore-list"
                //loading={initLoading}
                //itemLayout="horizontal"
                //loadMore={loadMore}
                dataSource={questions}
                renderItem={item => (
                  <List.Item onClick={() => this.onClick(item)} style={{ cursor: "pointer" }}>
                    <span style={{ margin: "0 10px 0 0" }}>
                      {<Icon icon="file-audio" size={"2x"} />}
                    </span>
                    <span>
                      <List.Item.Meta
                        title={<a style={{ textAlign: "left" }}>{item.name}</a>}
                      //description="Ant Design, a design language for background applications, is refined by Ant UED Team"
                      />
                    </span>
                  </List.Item>
                )}
              />
            </Col>
            <Col
              className={classNames(["question-type__info"])}
              xs={24}
              sm={24}
              lg={12}
              md={12}
            >
              {startAudio !== "" && (
                <div>
                  <div style={{ fontWeight: "bold" }}>Name: {startAudio.name}</div>
                  <p></p>
                  <audio controls src={startAudio.url} autoPlay={true} preload="auto" controlsList="nodownload"></audio>
                </div>
              )}
            </Col>
          </Row>
        </React.Fragment>
      );
    }
  }
}


const mapStateToProps = state => ({});

const mapDispatchToProps = dispatch => ({
  onSaveAnswers: ({ key, isCorrect }) => {
    dispatch(saveAnswerAction({ key, isCorrect }));
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Type34);
