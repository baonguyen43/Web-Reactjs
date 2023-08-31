import React from 'react';
import PropTypes from 'prop-types';
function Listen({ data }) {
  if (!data) return null;
  const ref = React.useRef();
  ref.current = new Audio();
  return <React.Fragment>
    {data.map((value, index) => {
      const { top, left, height, width, text } = value
      return (
        <div key={`listen-${index}`}
          style={{
            position: 'absolute', top: top, left: left, height: height, width: width, fontSize: (width * 0.5),
            display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer'
          }}
          onClick={() => {
            if (text) {
              ref.current.pause();
              ref.current.currentTime = 0;
              ref.current.src = text;
              ref.current.play();
            }
          }}
        ><i className="fas fa-volume-up" /></div>
      )
    })}
  </React.Fragment>;
}
Listen.propTypes = { data: PropTypes.array };
export default Listen;
