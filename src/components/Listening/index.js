import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Row, Col, Popover } from 'antd';
import Tooltip from 'antd/es/tooltip';
class Listen extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      statusListen: 'start',
      classNames__btnRecord: null,
    };

    this.onListen = this.onListen.bind(this);
    this.audioPlayer = new Audio(this.props.audioURL);
    // this.audioPlayer.addEventListener('play',()=>{
    //   this.props.changeColor()
    // })
  }

  componentWillUnmount = () => {
    this.onStop();
  };

  componentDidMount = () => {
    if (this.props.onAuto) this.onListen();
  };

  UNSAFE_componentWillReceiveProps = (nextProps) => {
    if (this.props.audioURL !== nextProps.audioURL) {
      if (nextProps.onAuto) this.onListen();
      this.onStop();
      this.setState({
        statusListen: 'start',
        classNames__btnRecord: null,
      });
      this.audioPlayer = new Audio(nextProps.audioURL);
    }
  };

  onListen = () => {
    if (!this.props.audioURL) return;
    if (!this.audioPlayer) return;
    else {
      if (this.state.statusListen === 'start') {
        this.setState(
          {
            statusListen: 'stop',
            // classNames__btnRecord: ['pulse', 'infinite'],
          },
          () => {
            this.onPlay();
          }
        );
      } else {
        this.setState(
          {
            statusListen: 'start',
            classNames__btnRecord: null,
          },
          () => {
            this.onPause();
          }
        );
      }
    }
  };

  /**
  |--------------------------------------------------
  | audio play
  |--------------------------------------------------
  */
  onPlay = () => {
    if (!this.audioPlayer) return;

    // do something
    if (this.props.onListened) {
      this.props.onListened();
    }

    this.audioPlayer.play();

    // eventListen when audio ended
    this.audioPlayer.onended = this.onEnded;
  };

  /**
  |--------------------------------------------------
  | audio pause
  |--------------------------------------------------
  */
  onPause = () => {
    if (this.audioPlayer) this.audioPlayer.pause();
  };

  /**
  |--------------------------------------------------
  | audio stop 
  |--------------------------------------------------
  */
  onStop = () => {
    this.onPause();
    this.audioPlayer = null;
  };

  /**
  |--------------------------------------------------
  | audio reset 
  |--------------------------------------------------
  */
  onReset = () => {
    if (this.audioPlayer) this.audioPlayer.currentTime = 0;
  };

  /**
  |--------------------------------------------------
  | audio ended
  |--------------------------------------------------
  */
  onEnded = () => {
    this.setState({
      statusListen: 'start',
      classNames__btnRecord: null,
    });
  };

  /** UI -----------------------------------------**/
  render() {
    let { classNames__btnRecord, statusListen } = this.state;
    // if(this.props.click === true)
    // {
    //   this.onListen();
    // }
    if (!this.props.custom) {
      return (
        <Row type="flex" justify="center" align="top">
          <Col className={classNames(['text-align_center'])}>
            <div
              //  style={{backgroundColor: "#5E72E4"}}
              style={{ width: 80, height: 80 }}
              className={classNames([
                'btn-dashed',
                'animated',
                classNames__btnRecord,
                'icon icon-shape bg-gradient-danger text-white rounded-circle',
              ])}
              onClick={this.onListen}
            >
              {statusListen === 'start' ? (
                <Tooltip
                  style={{ top: 200 }}
                  placement="top"
                  title="Nhấn để nghe"
                >
                  <i
                    style={{ fontSize: '25px', color: 'white' }}
                    className="fas fa-volume-up"
                  />
                </Tooltip>
              ) : (
                <Tooltip
                  style={{ top: 200 }}
                  placement="top"
                  title="Nhấn để dừng"
                >
                  <i
                    style={{ fontSize: '25px', color: 'white' }}
                    className="fas fa-pause"
                  />
                </Tooltip>
              )}
            </div>
            <Popover
              trigger="hover"
              placement="right"
              content={'click on resets the recorder'}
            ></Popover>
          </Col>
        </Row>
      );
    } else {
      let { className, style, children } = this.props;
      return (
        <button
          style={style}
          className={classNames(['animated', classNames__btnRecord, className])}
          onClick={this.onListen}
        >
          {children}
        </button>
      );
    }
  }
}

Listen.propTypes = {
  audioURL: PropTypes.string,
  className: PropTypes.string,
  style: PropTypes.instanceOf(Object),
  children: PropTypes.instanceOf(Object),
  onListened: PropTypes.func,
  onAuto: PropTypes.bool,
  custom: PropTypes.bool,
};

export default Listen;
