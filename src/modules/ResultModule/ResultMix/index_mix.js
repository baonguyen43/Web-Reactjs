/* eslint-disable react/jsx-pascal-case */
import classNames from 'classnames';
import queryString from 'query-string';
import React from 'react';
import { connect } from 'react-redux';
import { Button, Col, Progress, Row } from 'reactstrap';
// import { default as Title } from "components/Title";
import NotData from 'components/Error/NotData';
import Loading from 'components/Loading';
import Notification from 'components/Notification';
import { dynamicApiAxios } from 'configs/api';
import PropTypes from 'prop-types';
import { TOGGLE_DOING_LATEST_ASSIGNMENTS } from '../../ClassModule/actions/types';
import { SAVE_SELECTED_PART } from '../../SessionModule/actions/types';
import * as ActionTypes from '../actions/types';
import LogAssi_mix from './LogAssi_mix';
import ResultAnswers from './resultAnswers_Mix';
class Result extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isHide: false,
      results: null,
      objResult: null,
      loading: true,
    };
  }

  componentDidMount = () => {
    this.getResult();
  };

  getResult = async () => {
    let { match, location, selectedClass, loggedInUser } = this.props;

    let { sessionId } = match.params;
    let { takeExamtime } = queryString.parse(location.search);
    const typeApp = selectedClass.courseType;
    const StudentId = typeApp === 'AMES' ? loggedInUser.userMyames.StudentId : loggedInUser.userMyai.StudentId;

    const body = {
      sqlCommand: '[dbo].[p_AMES247_Session_Results]',
      parameters: {
        Version: 'v1',
        SessionId: sessionId,
        StudentId,
        TakeExamTime: takeExamtime,
      },
    };

    const results = await dynamicApiAxios.query.post('', body);

    const log = results.data.items;
    const passedQuestionCount = log[0].passedQuestionCount;
    const totalQuestions = log[0].totalQuestionCount;
    const totalAnswer = totalQuestions;
    const totalPointResult = log[0].totalScore / totalQuestions;
    const objResult = { totalPointResult, passedQuestionCount, totalAnswer, totalQuestions };
    this.setState({
      log,
      objResult,
      results: results.data.items,
      loading: false,
    });
  };

  goBack = () => {
    const { match, history } = this.props;
    const { classId } = match.params;
    const pathname = `/ames/class/${classId}/sessions/`;

    return (
      <Button
        // htmlType="submit"
        size="sm"
        color="primary"
        onClick={() => history.push(pathname)}
      >
        <span className="btn-inner--icon mr-2">
          <i className="ni ni-bold-left" />
        </span>
        <span className="btn-inner--text">Quay lại</span>
      </Button>
    );
  };

  goNext = () => {
    return (
      <Button
        // htmlType="submit"
        size="sm"
        color="primary"
        onClick={this.onClickGoNext}
      >
        <span className="btn-inner--text">Tiếp tục</span>
        <span className="btn-inner--icon ml-2">
          <i className="ni ni-bold-right" />
        </span>
      </Button>
    );
  };

  onClickGoNext = () => {
    const { match, history, dispatch, selectedPart, groupPart, isDoingLatestAssignments } = this.props;

    const { classId, sessionId } = match.params;
    let pathname = `/ames/class/${classId}/session/${sessionId}/questionsMix`;
    // if(!selectedPart && !groupPart) return null;
    if (!selectedPart || selectedPart?.index === groupPart?.length - 1) {
      if (isDoingLatestAssignments) {
        pathname = `/ames/classes`;
        dispatch({ type: TOGGLE_DOING_LATEST_ASSIGNMENTS });
      } else {
        pathname = `/ames/class/${classId}/sessions`;
      }
      Notification('warning', 'Thông báo', 'Bạn đã hoàn thành các bài tập trong session này!!');
    } else {
      const indexNextPart = selectedPart?.index + 1;
      const newSelectedPart = { ...groupPart?.[indexNextPart], index: indexNextPart };
      const action = {
        selectedPart: newSelectedPart,
        groupPart,
        partQuestion: true,
      };
      dispatch({ type: SAVE_SELECTED_PART, ...action });
    }
    history.push(pathname);
  };

  render = () => {
    const { location } = this.props;
    const { results, objResult, loading } = this.state;

    if (loading) {
      return <Loading />;
    }
    if (!results) {
      return <NotData />;
    }

    return (
      <React.Fragment>
        <div style={{ paddingTop: 20 }} className={classNames(['ames__result-progress'])}>
          {/* PROCCESS */}
          <div className="progress-wrapper">
            <div className="progress-info">
              <div className="progress-label">
                <span>Tiến độ hoàn thành</span>
              </div>
              <div className="progress-percentage">
                <span>100%</span>
              </div>
            </div>
            <Progress max="100" value="100" color="success" />
          </div>
          <h3 className={classNames(['result'])}>Kết quả</h3>
          <ResultAnswers results={results} objResult={objResult} location={location} />
        </div>
        <div className={classNames(['text-align_center'])}>
          {this.goBack()}
          {this.goNext()}
        </div>
        <p style={{ margin: '25px' }}></p>
        <Row>
          <Col span={20} offset={2}>
            <LogAssi_mix results={results} location={location} />
          </Col>
        </Row>
      </React.Fragment>
    );
  };
}

const mapStateToProps = (state) => {
  return {
    results: state.resultReducer.results,
    loading: state.resultReducer.loading,
    selectedClass: state.classReducer.selectedClass,
    isDoingLatestAssignments: state.classReducer.isDoingLatestAssignments,
    loggedInUser: state.loginReducer.loggedInUser,
    assignments: state.assignmentReducer,
    selectedPart: state.sessionReducer.selectedPart,
    groupPart: state.sessionReducer.groupPart,
  };
};

const mapDispatchToProps = (dispatch) => ({
  getResult: (payload) => dispatch({ type: ActionTypes.GET_RESULT_REQUEST, payload }),
  dispatch,
});

Result.propTypes = {
  getResult: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  match: PropTypes.instanceOf(Object).isRequired,
  assignments: PropTypes.instanceOf(Object).isRequired,
  history: PropTypes.instanceOf(Object).isRequired,
  location: PropTypes.instanceOf(Object).isRequired,
  loggedInUser: PropTypes.instanceOf(Object).isRequired,
  selectedClass: PropTypes.instanceOf(Object).isRequired,
  results: PropTypes.instanceOf(Object),
  selectedPart: PropTypes.instanceOf(Object),
  groupPart: PropTypes.instanceOf(Object),
  dispatch: PropTypes.instanceOf(Object),
};

export default connect(mapStateToProps, mapDispatchToProps)(Result);
