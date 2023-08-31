import React from 'react';
import imgNotData from 'assets/img/NoData.gif';


const NotData = (props) => (

  <div
    style={{

      justifyContent: 'center',
      display: 'flex',
      alignItems: 'center',
      backgroundColor: 'white',
    }}
  >
    <span>
      <img src={imgNotData} alt={'not data'} />
    </span>
  </div>
);

export default NotData;
