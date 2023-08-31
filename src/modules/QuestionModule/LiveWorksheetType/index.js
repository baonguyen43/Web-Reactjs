import { useParams, useLocation, useHistory } from 'react-router-dom';
import React, { useEffect, useState, useRef } from 'react';
import { Button, Col, Row } from 'antd';
import { CardFooter } from 'reactstrap';
import queryString from 'query-string';
import PropTypes from 'prop-types';

import ExcercisePage from 'components/CanvasToolPlus/ExcercisePage';
import Result from 'components/CanvasToolPlus/ExcercisePage/Result';
import NotData from 'components/Error/NotData';
import Loading from 'components/Loading';

import ExerciseBreadcrumb from './ExerciseBreadcrumb';
import withAuthenticator from 'HOCs/withAuthenticator';
import { fetcher } from './api';
// import ExerciseHeader from './ExerciseHeader';
import * as functions from 'components/functions';

const LiveWorksheetType = ({ loggedInUser }) => {
  const { assignmentsMix4Id, assignmentId, attachmentId, sessionId, classId } = useParams();
  const assignmentID = assignmentId ?? assignmentsMix4Id;

  const location = useLocation();
  const history = useHistory();

  const refSubmit = useRef({});
  const { takeExamTime, asrId } = queryString.parse(location.search);

  const [resultData, setResultData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isTry, setIsTry] = useState(false);
  const [file, setFile] = useState(null);
  const [user, setUser] = useState(null);

  const handleSubmit = async () => {
    const rs = await refSubmit.current.submit();
    if (rs && rs.info === 'ok') {
      const result = refSubmit.current.result();
      setResultData(result);
      setIsTry(true);
    }
  };

  const handleTryAgain = () => {
    refSubmit.current.tryAgain();
    setResultData({});
    setIsTry(false);
  };

  const handleNext = () => {
    const type = 'LIVEWORKSHEET';
    const pathname = `/ames/class/${classId}/session/${sessionId}/${
      assignmentId ? `assignment` : `assignmentsMix4Id`
    }/${assignmentID}/attachment/${attachmentId}/results`;
    const linkQuestion = {
      pathname,
      search: `?type=${type}&asrId=${asrId}&takeExamTime=${takeExamTime}`,
    };
    history.push(linkQuestion);
  };

  useEffect(() => {
    if (loggedInUser) {
      const { typeLogin, userMyames } = loggedInUser;

      fetcher({
        attachmentId,
        sessionId,
        assignmentId: assignmentID,
        takeExamTime,
        userId: userMyames?.StudentId,
        asrId,
      })
        .then((res) => {
          if (res[0] === undefined) return;
          const { id, fileName, jsonData } = res[0];
          setFile({ id, fileName, jsonData });
          setIsLoading(false);
        })
        .catch(() => {
          setIsLoading(false);
        });

      if (typeLogin === 'ames') {
        setUser(userMyames);
      }
    }
    return () => {
      setFile();
    };
  }, [asrId, assignmentID, attachmentId, location.search, loggedInUser, sessionId, takeExamTime]);

  if (isLoading) return <Loading />;
  if (!file) return <NotData />;

  return (
    <div>
      <ExerciseBreadcrumb assignmentId={assignmentId} assignmentsMix4Id={assignmentsMix4Id} />
      <Result data={resultData} />
      <div style={{ height: 'calc(100vh - 194px - 90px)', overflowY: 'auto' }}>
        {/* <div className='px-4'>
        <ExerciseHeader />
      </div> */}
        {file ? (
          <ExcercisePage
            file={file}
            refSubmit={refSubmit}
            isVisibleResult={false}
            styles={{ height: '100vh - 50px' }}
            studentData={{
              studentId: user?.StudentId ?? functions.getUser().StudentId,
              sessionId,
              assignmentId: assignmentID,
              attachmentId,
            }}
          />
        ) : (
          <NotData />
        )}
      </div>
      <CardFooter style={{ textAlign: 'end', padding: 10 }}>
        <Row>
          <Col span={8}>
            <div />
          </Col>
          <Col span={8} className="d-flex justify-content-center align-items-center">
            <div id="Footer-ExcercisePage-Audio" />
          </Col>
          <Col span={8}>
            <Row justify="end">
              <Row span={12} className="mx-2">
                {isTry ? (
                  <Button onClick={handleTryAgain} type="primary">
                    Try again
                  </Button>
                ) : (
                  <Button onClick={handleSubmit} type="primary">
                    Submit
                  </Button>
                )}
              </Row>
              <Row span={12}>
                <Button onClick={handleNext} type="primary">
                  Next
                </Button>
              </Row>
            </Row>
          </Col>
        </Row>
      </CardFooter>
    </div>
  );
};

LiveWorksheetType.propTypes = {
  loggedInUser: PropTypes.object,
};

export default withAuthenticator(LiveWorksheetType);
