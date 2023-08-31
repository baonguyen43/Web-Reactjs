import React from "react";
import { connect } from "react-redux";

import { saveAnswerAction } from "../actions/saveAnswerAction";
import AMES247Loading from "src/components/Loading";
import Line from "src/components/Line/Line";

class Type17 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
    };
  }

  componentDidMount() {
    this.setState({
      loading: false,
    });
  }

  render() {
    let { allProps, questions, onSaveAnswers, takeExamTime } = this.props;
    let { loading } = this.state;

    if (loading) {
      return <AMES247Loading />;
    } else {
      return (
        <div>
          <Line
            takeExamTime={takeExamTime}
            questions={questions}
            allProps={allProps}
            onSaveAnswers={onSaveAnswers}
            type={"image-sound"}
          />
        </div>
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
)(Type17);
