import React from 'react';
import PropTypes from 'prop-types';
import { Button, Col, Row, UncontrolledTooltip } from 'reactstrap';
import ExerciseKey from 'components/ExerciseKey';
// Question Types
import { useSelector, useDispatch } from 'react-redux';
import { useParams, useLocation, useHistory } from 'react-router-dom';
import queryString from 'query-string';
import styles from './styles.module.css';
import * as functions from 'components/functions';
import { FETCH_QUESTIONS_REQUEST } from 'modules/QuestionModule/actions/types';
import VideoModal from 'components/Modal/videoModal';
import ListeningTranstript from 'components/ListeningTranscript';
import { Fragment } from 'react';

const FooterIeltsMindset = ({ isDisabledSubmit, isDisabledRetry, onRetry, onSubmit, videoUrl, audioUrl }) => {
  const location = useLocation();
  const videoRef = React.useRef();
  // const audioRef = React.useRef();
  const [state, setState] = React.useState({
    onRetrying: false,
    keysVisible: false,
    videoVisible: false,
    audioVisible: false,
    tapescriptVisible: false,
    exerciseKey: [],
    tapescript: '',
  });
  const allQuestions = useSelector((rootState) => rootState.questionReducer.data.questions);
  const selectedClass = useSelector((rootState) => rootState.classReducer.selectedClass);
  const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));

  const { assignmentId, classId, sessionId } = useParams();
  const history = useHistory();
  const dispatch = useDispatch();

  // -----------------------------------------------------------

  const onNextQuestion = React.useCallback(() => {
    const { questionId, asrId } = queryString.parse(location.search);
    const indexQuestion = allQuestions.findIndex((x) => x.id === parseInt(questionId));

    const nextIndex = indexQuestion + 1;

    const takeExamTime = functions.uuid();
    if (nextIndex === allQuestions.length) {
      // Submit trước khi next.
      onSubmit();
      const linkStart = `/ames/class/${classId}/session/${sessionId}/assignments`;
      history.push(linkStart);
    } else {
      // Submit trước khi next.
      onSubmit();
      const linkStart = `/ames/class/${classId}/session/${sessionId}/assignment/${assignmentId}/IELTSMindSetQuestion`;
      const type = `${allQuestions[nextIndex].questionType}`;
      const typeApp = selectedClass.courseType;
      const userId = typeApp === 'AMES' ? loggedInUser.userMyames.StudentId : loggedInUser.userMyai?.StudentId;
      const payload = {
        type,
        sessionId,
        assignmentId,
        takeExamTime,
        userId,
        asrId,
      };
      history.push({
        pathname: linkStart,
        search: `?type=${type}&asrId=${asrId}&takeExamTime=${takeExamTime}&questionId=${allQuestions[nextIndex].id}`,
      });

      dispatch({ type: FETCH_QUESTIONS_REQUEST, payload });
    }
  }, [
    allQuestions,
    assignmentId,
    classId,
    dispatch,
    history,
    location.search,
    loggedInUser,
    onSubmit,
    selectedClass?.courseType,
    sessionId,
  ]);

  const toggleState = React.useCallback(
    (fieldName) => () => {
      setState((prevState) => ({
        ...prevState,
        [fieldName]: !prevState[fieldName],
      }));
    },
    []
  );

  // const onReload = React.useCallback(() => {
  //   // audioRef.current.pause();
  //   return audioRef.current?.load();
  // },[])

  // let audioArray = audioUrl && audioUrl[0] === '[' && JSON.parse(audioUrl);

  React.useEffect(() => {
    // onReload()
    const questionId = queryString.parse(location.search).questionId;

    const indexQuestion = allQuestions.findIndex((x) => parseInt(x.id) === parseInt(questionId));
    setState((prevState) => ({
      ...prevState,
      exerciseKey: allQuestions[indexQuestion],
      tapescript: allQuestions[indexQuestion].listenTranscript,
    }));
  }, [allQuestions, location.search, state.queryString]);

  return (
    <React.Fragment>
      <Row
        style={{ padding: 0, margin: 0, paddingTop: 15 }}
        className="modal-footer d-flex justify-content-between align-items-center"
      >
        <Col style={{ padding: 0, margin: 0 }} className={`${styles.wrapColLeft}`}>
          {/* Button Key */}
          <React.Fragment>
            <Button
              id="key"
              color="default"
              disabled={!isDisabledSubmit} // Nút Key được hiển thị sau khi submit.
              type="button"
              className="btn-icon btn-2"
              onClick={toggleState('keysVisible')}
            >
              <span className="btn-inner--icon">
                <i className="fas fa-key"></i>
              </span>
            </Button>
            <UncontrolledTooltip delay={0} placement="top" target="key">
              Key
            </UncontrolledTooltip>
          </React.Fragment>

          {/* Button TAPESCRIPT */}
          {state.tapescript !== '' ? (
            audioUrl?.length > 2 ? (
              <Fragment>
                <Button
                  id="tapescript"
                  color="default"
                  disabled={!isDisabledSubmit}
                  type="button"
                  className="btn-icon btn-2"
                  onClick={toggleState('tapescriptVisible')}
                >
                  <span className="btn-inner--icon">
                    <i className="fas fa-scroll"></i>
                  </span>
                </Button>
                <UncontrolledTooltip delay={0} placement="top" target="tapescript">
                  Tapescript
                </UncontrolledTooltip>
              </Fragment>
            ) : (
              <Fragment />
            )
          ) : (
            <Fragment />
          )}

          {/* Button AUDIO */}
          {/* <React.Fragment>
            <Button
              id="Audio"
              color="default"
              type="button"
              className="btn-icon btn-2"
              onClick={toggleState("audioVisible")}
            >
              <span className="btn-inner--icon">
                <i className="fas fa-headphones-alt"></i>
              </span>
            </Button>
            <UncontrolledTooltip delay={0} placement="top" target="Audio">
              Audio
            </UncontrolledTooltip>
          </React.Fragment> */}

          {/* Button VIDEO */}
          {/* <React.Fragment>
            <Button
              id="Video"
              color="default"
              type="button"
              className="btn-icon btn-2"
              onClick={() => videoRef.current?.toggleModal('isVisibled')}
            >
              <span className="btn-inner--icon">
                <i className="fas fa-video"></i>
              </span>
            </Button>
            <UncontrolledTooltip delay={0} placement="top" target="Video">
              Video
            </UncontrolledTooltip>
          </React.Fragment> */}

          {/* Button Next */}
          <React.Fragment>
            <Button id="Next" color="default" type="button" className="btn-icon btn-2" onClick={onNextQuestion}>
              <span className="btn-inner--icon">
                <i className="fas fa-arrow-circle-right"></i>
              </span>
            </Button>
            <UncontrolledTooltip delay={0} placement="top" target="Next">
              Next question
            </UncontrolledTooltip>
          </React.Fragment>
        </Col>

        {/* {!state.audioVisible && audioArray && (
          <div
            className={`${styles.wrapColCenter} ${styles.flexDirection} justify-center items-center`}
            style={{
              display: 'flex',
              height: audioArray.length > 1 && 43,
              // overflowY: "auto",
              overflowX: 'auto',
              margin: 0,
            }}
          >
            {audioArray.map((audio, index) => {
              return (
                <div key={index}>
                  <audio
                    ref={audioRef}
                    style={{ height: 43 }}
                    // className={styles.audio}
                    id="myAudio"
                    // autoPlay={false}
                    controls
                  >
                    <source src={audio} type="audio/mpeg" />
                  </audio>
                </div>
              );
            })}
          </div>
        )} */}

        <Col style={{ padding: 0, margin: 0 }} className={`${styles.wrapColRight}`}>
          <Button
            type="button"
            color="danger"
            // className="ml-2"
            data-dismiss="modal"
            disabled={isDisabledRetry}
            onClick={() => {
              onRetry();
              // onReload()
            }}
          >
            Try again
          </Button>
          <Button
            type="button"
            color="danger"
            // className="ml-auto"
            data-dismiss="2"
            disabled={isDisabledSubmit}
            onClick={() => {
              onSubmit();
              // onReload();
            }}
          >
            Submit
          </Button>
        </Col>
      </Row>

      <ExerciseKey visible={state.keysVisible} exerciseKey={state.exerciseKey} onClose={toggleState('keysVisible')} />

      <ListeningTranstript
        onClose={toggleState('tapescriptVisible')}
        tapescript={state.tapescript}
        visible={state.tapescriptVisible}
      />

      <VideoModal ref={videoRef} videoUrl={videoUrl} />
    </React.Fragment>
  );
};

FooterIeltsMindset.propTypes = {
  questions: PropTypes.instanceOf(Object),
  isVisibled: PropTypes.bool,
  toggleModal: PropTypes.func,
  isDisabledSubmit: PropTypes.bool,
  isDisabledRetry: PropTypes.bool,
  onRetry: PropTypes.func,
  onSubmit: PropTypes.func,
  onPlayVideo: PropTypes.func,
  audioUrl: PropTypes.string,
  videoUrl: PropTypes.string,
};

export default FooterIeltsMindset;
