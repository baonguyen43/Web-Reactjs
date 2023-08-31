import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'reactstrap';

import styles from './styles.module.css';

const FooterIeltsMindset = ({ isDisabledSubmit, isDisabledRetry, onRetry, onSubmit, onPlayVideo }) => {

  const [state, setState] = React.useState({
    data: null,
    onRetrying: false,
    keysVisible: false,
    videoVisible: false,
    audioVisible: false,

    exerciseKey: []
  });

  const toggleState = React.useCallback((fieldName) => () => {
    setState((prevState) => ({
      ...prevState,
      [fieldName]: !prevState[fieldName],
    }));
  }, []);

  return (
    <>
      <div className='d-flex' style={{ flexDirection: 'row', width: '-webkit-fill-available' }}>
        {/* Button Key */}
        <div className={`${styles.wrapColLeft}`}>
          <Button
            id="key"
            color="default"
            type="button"
            className="btn-icon btn-2"
            onClick={toggleState('keysVisible')}
          >
            <span className="btn-inner--icon">
              <i className="fas fa-key"></i>
            </span>
          </Button>

          {/* Button AUDIO */}
          <Button
            id="Audio"
            color="default"
            type="button"
            className="btn-icon btn-2"
            onClick={toggleState('audioVisible')}
          >
            <span className="btn-inner--icon">
              <i className="fas fa-headphones-alt"></i>
            </span>
          </Button>

          {/* Button VIDEO */}
          <Button
            id="Video"
            color="default"
            type="button"
            className="btn-icon btn-2"
            onClick={onPlayVideo}
          >
            <span className="btn-inner--icon">
              <i className="fas fa-video"></i>
            </span>
          </Button>

          {/* Button Next */}
          <Button
            id="Next"
            color="default"
            type="button"
            className="btn-icon btn-2"
          // onClick={onNextQuestion}
          >
            <span className="btn-inner--icon">
              <i className="fas fa-arrow-circle-right"></i>
            </span>
          </Button>

        </div>
        {state.audioVisible && (
          <div className={`${styles.wrapColCenter} justify-center items-center`} >

            <div >
              <audio className={styles.audio} id='myAudio' autoPlay controls>
                <source type='audio/mpeg' />
              </audio>
            </div>

          </div>
        )}
        <div className={`${styles.wrapColRight}`}>
          <Button
            type="button"
            color="danger"
            // className="ml-2"
            data-dismiss="modal"
            disabled={isDisabledRetry}
            onClick={onRetry}
          >
            Try again
            </Button>
          <Button
            type="button"
            color="danger"
            // className="ml-auto"
            data-dismiss="2"
            disabled={isDisabledSubmit}
            onClick={onSubmit}
          >
            Submit
            </Button>
        </div>
      </div>
    </>
  );
};

FooterIeltsMindset.propTypes = {
  questions: PropTypes.instanceOf(Object),
  isVisibled: PropTypes.bool,
  toggleModal: PropTypes.func,
};

export default FooterIeltsMindset;
