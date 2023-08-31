import React from 'react';
// react plugin for creating notifications over the dashboard
import { notificationAlert } from 'variables/common';
// reactstrap components

const Notifications = (type, title, message, place, time) => {
  // console.log('🚀 ~ file: index.js ~ line 7 ~ Notifications ~ time', time)
  let options = {
    place: place ?? 'tc',
    message: (
      <div className="alert-text">
        <span className="alert-title" data-notify="title">
          {title}
        </span>
        <span data-notify="message">{message}</span>
      </div>
    ),
    type: type,
    icon: 'ni ni-bell-55',
    autoDismiss: time ?? 2,
  };
  // eslint-disable-next-line no-unused-expressions
  notificationAlert.current?.notificationAlert(options);
  if (type === 'success' || type === 'warning') {
    const audio = new Audio(require('../../assets/audioGame/soundtrue.mp3'))
    audio.play()
  } else {
    const audio = new Audio(require('../../assets/audioGame/soundfalse.mp3'))
    audio.play()
  }
  // type:default,info,success,warning,danger
};

export default Notifications;
