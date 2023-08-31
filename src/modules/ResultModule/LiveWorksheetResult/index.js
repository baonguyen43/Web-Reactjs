import React from 'react';
import PropTypes from 'prop-types';
import ResultFrame from './ResultFrame';
import classNames from 'classnames';
import { Progress, Button } from 'reactstrap';
import * as functions from 'components/functions';
import queryString from 'query-string';
import { useHistory, useLocation, useParams } from 'react-router';
import { useSelector } from 'react-redux';
import { getResultOfPlayedTime } from './api';
import withAuthenticator from 'HOCs/withAuthenticator';
import NotData from 'components/Error/NotData';
import Loading from 'components/Loading';
import './styles.css';

const LiveWorksheetResult = ({ loggedInUser }) => {
  const location = useLocation();
  const params = useParams();
  const { assignmentsMix4Id, assignmentId } = params;
  const assignmentID = assignmentId ?? assignmentsMix4Id;

  const history = useHistory();

  const assignments = useSelector((state) => (assignmentId ? state.assignmentReducer : state.assignmentMix4Reducer));
  const query = queryString.parse(location.search);
  const [state, setState] = React.useState({
    result: null,
    isLoading: true,
  });

  const goBack = () => {
    let { classId, sessionId } = params;
    let pathname = `/ames/class/${classId}/session/${sessionId}/${assignmentId ? 'assignments' : 'assignmentsMix4'}`;

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

  const goAssignmentNew = () => {
    const { classId, sessionId } = params;
    let newAsm = null;
    if (assignments.data) {
      let { data } = assignments;
      if (data.length > 0) {
        let iAsm = data.findIndex((a) => {
          return a.id === assignmentID || a.assignmentId === assignmentID;
        });
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
      <Button size="sm" color="default" onClick={() => history.push(pathname)}>
        <span className="btn-inner--icon mr-2">
          <i className="ni ni-bold-right" />
        </span>
        <span className="btn-inner--text">Tiếp theo</span>
      </Button>
    );
  };

  const getResult = React.useCallback(async () => {
    const { userMyames } = loggedInUser;
    if (userMyames) {
      const { takeExamTime } = query;
      const { StudentId } = userMyames;
      const { sessionId, attachmentId } = params;

      const parameters = {
        sessionId,
        assignmentId: assignmentID,
        attachmentId,
        takeExamTime,
        StudentId,
      };
      const response = await getResultOfPlayedTime(parameters);
      setState({ result: response[0], isLoading: false });
    }
  }, [loggedInUser, params, query]);

  React.useEffect(() => {
    if (state.isLoading) {
      getResult();
    }
  }, [getResult, state]);

  if (state.isLoading) return <Loading />;

  if (!state.result) return <NotData />;

  return (
    <div style={{ paddingTop: 20 }} className={classNames(['ames__result-progress'])}>
      <div className="progress-wrapper">
        <div className="progress-info">
          <div className="progress-label">
            <span>Tiến độ hoàn thành</span>
          </div>
          <div className="progress-percentage">
            <span>{state.result.completedPercent}%</span>
          </div>
        </div>
        <Progress max="100" value={state.result.completedPercent} color="info" />
      </div>
      <h3 className={classNames(['result'])}>Kết quả</h3>
      <ResultFrame result={state.result} />
      <div className={classNames(['text-align_center'])}>
        {goBack()}
        {goAssignmentNew()}
      </div>
    </div>
  );
};

LiveWorksheetResult.propTypes = {
  loggedInUser: PropTypes.object,
};

export default withAuthenticator(LiveWorksheetResult);
