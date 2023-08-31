import React from 'react';
import classNames from 'classnames';
import queryString from 'query-string';
import { connect } from 'react-redux';
import { Row, Col, Progress, Button } from 'reactstrap'
// import { default as Title } from "components/Title";
import ResultAnswers from './resultAnswers';
import Loading from 'components/Loading';
import LogAssi from './LogAssi';
import NotData from 'components/Error/NotData';
import * as ActionTypes from './actions/types';
import PropTypes from 'prop-types';
import * as functions from 'components/functions';
class Result extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      isHide: false,
    }
  }

  componentDidMount = () => {
    this.getResult();
  };

  getResult = () => {
    const { getResult, match, location, loggedInUser, selectedClass } = this.props;
    const { assignmentId, sessionId } = match.params;
    const typeApp = selectedClass.courseType;
    const studentId = typeApp === 'AMES' ? loggedInUser.userMyames.StudentId : loggedInUser.userMyai.StudentId;
    const { takeExamTime } = queryString.parse(location.search);
    const payload = {
      studentId, sessionId, assignmentId, takeExamTime
    }
    getResult(payload);
  };

  goBack = () => {
    let { match, history } = this.props;
    let { classId, sessionId } = match.params;
    let pathname = `/ames/class/${classId}/session/${sessionId}/assignments`;

    return (
      <Button
        // htmlType="submit"
        size="sm"
        color="default"
        onClick={() => history.push(pathname)}
      >
        <span className="btn-inner--icon mr-2">
          <i className="ni ni-bold-left" />
        </span>
        <span className="btn-inner--text">Quay lại</span>
      </Button>
    );
  };


  goAssignmentNew = () => {
    let newAsm = null;
    let { match, assignments, history } = this.props;
    let { classId, sessionId, assignmentId } = match.params;
    if (assignments.data) {
      let { data } = assignments;
      if (data.length > 0) {
        let iAsm = data.findIndex((a) => a.id === assignmentId);
        if (iAsm > -1) {
          iAsm++;
          if (iAsm < data.length) {
            newAsm = data[iAsm];
          } else {
            return null;
          }
        }
      } else {
        return;
      }
    }
    const takeExamTime = functions.uuid();
    let search = `?type=${newAsm.questionType}&asrId=${newAsm.asrId}&takeExamTime=${takeExamTime}`;
    let pathname = `/ames/class/${classId}/session/${sessionId}/assignment/${newAsm.id}/questions${search}`;
    return (
      <Button
        size="sm"
        color="default"
        onClick={() => history.push(pathname)}
      >
        <span className="btn-inner--icon mr-2">
          <i className="ni ni-bold-right" />
        </span>
        <span className="btn-inner--text">Tiếp theo</span>
      </Button>
    );
  };

  render = () => {
    const { results, loading, location } = this.props;
    // console.log('🚀 ~ file: index.js ~ line 99 ~ Result ~ results', results)
    if (loading) {
      return <Loading />;
    }
    if (!results || results.length === 0) {
      return <NotData />;
    }

    return (
      <React.Fragment>
        <div
          style={{ paddingTop: 20 }}
          className={classNames(['ames__result-progress'])}
        >
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
            <Progress max="100" value="100" color="info" />
          </div>
          <h3 className={classNames(['result'])}>Kết quả</h3>
          <ResultAnswers results={results} location={location} />
        </div>
        <div className={classNames(['text-align_center'])}>
          {this.goBack()}
          {this.goAssignmentNew()}
        </div>
        <p style={{ margin: '25px' }}></p>
        {/* Đánh giá chi tiết */}
        <Row>
          <Col span={20} offset={2}>
            <LogAssi results={results} location={location} />
          </Col>
        </Row>
      </React.Fragment>
    );
  };
}

const mapStateToProps = state => ({
  results: state.resultReducer.results,
  loading: state.resultReducer.loading,
  selectedClass: state.classReducer.selectedClass,
  loggedInUser: state.loginReducer.loggedInUser,
  assignments: state.assignmentReducer,
});

const mapDispatchToProps = dispatch => ({
  getResult: (payload) => dispatch({ type: ActionTypes.GET_RESULT_REQUEST, payload })
});

Result.propTypes = {
  getResult: PropTypes.func,
  loading: PropTypes.bool.isRequired,
  match: PropTypes.instanceOf(Object).isRequired,
  assignments: PropTypes.instanceOf(Object).isRequired,
  history: PropTypes.instanceOf(Object).isRequired,
  location: PropTypes.instanceOf(Object).isRequired,
  loggedInUser: PropTypes.instanceOf(Object).isRequired,
  selectedClass: PropTypes.instanceOf(Object).isRequired,
  results: PropTypes.instanceOf(Object),

}


export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Result);
