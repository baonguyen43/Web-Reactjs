import React from 'react';

export default class CountDownTimer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      time: {},
      seconds: props.seconds
    };
    this.timer = null;
    this.startTimer = this.startTimer.bind(this);
    this.countDown = this.countDown.bind(this);
  }

  secondsToTime(secs) {
    let hours = Math.floor(secs / (60 * 60));

    let divisor_for_minutes = secs % (60 * 60);
    let minutes = Math.floor(divisor_for_minutes / 60);

    let divisor_for_seconds = divisor_for_minutes % 60;
    let seconds = Math.ceil(divisor_for_seconds);

    let obj = {
      h: hours,
      m: minutes,
      s: seconds
    };
    return obj;
  }

  componentDidMount() {
    let timeLeftVar = this.secondsToTime(this.state.seconds);
    this.setState({ time: timeLeftVar });
  }

  startTimer() {
    if (this.timer === null) {
      this.timer = setInterval(this.countDown, 1000);
    }
  }

  stopTimer() {
    // this.countDown();
    clearInterval(this.timer);
    this.timer = null;
    let seconds = this.props.seconds;
    this.setState({
      time: this.secondsToTime(seconds),
      seconds: seconds
    });
  }

  countDown() {
    // Remove one second, set state so a re-render happens.
    let seconds = this.state.seconds - 1;
    this.setState({
      time: this.secondsToTime(seconds),
      seconds: seconds
    });

    // Check if we're at zero.
    if (seconds === 0) {
      if (typeof this.props.onStopRecording === 'function') {
        this.props.onStopRecording();
      }
      this.stopTimer();
    }
  }

  render() {
    const { children, color } = this.props;
    let { m, s } = this.state.time;
    m = m < 10 ? `0${m}` : m;
    s = s < 10 ? `0${s}s` : `${s}s`;
    return (
      <div>
        {children}
        <span style={{ color: color }} >
          {m}:{s}
        </span>
      </div >
    );
  }
}
