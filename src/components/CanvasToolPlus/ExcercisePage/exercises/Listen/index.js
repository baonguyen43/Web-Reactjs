/* eslint-disable react/no-array-index-key */
/* eslint-disable react/jsx-first-prop-new-line */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react/jsx-wrap-multilines */
import ReactAudioPlayer from 'react-audio-player';
import React from 'react';
import PropTypes from 'prop-types';

function Listen({ listen, data }) {
  const [AudioUrl, setAudioUrl] = React.useState({});
  const [isPlay, setIsPlay] = React.useState(false);
  const [arrayListened, setArrayListened] = React.useState([]);

  React.useEffect(() => {
    Object.assign(listen.current, {
      submit: () => {
        // handle submit
        const res = handleResult(arrayListened);
        return { listen: res };
      },
    });
  }, [arrayListened, listen]);

  React.useEffect(() => {
    setArrayListened((pre) => {
      if (pre.length === 0) {
        return data.map((item) => false);
      }
      return pre;
    });
  }, [data]);

  const handleClick = (text, index) => {
    setAudioUrl({ text, index });

    setArrayListened((pre) => {
      const newArrayListened = pre.map((item, i) => (i === index ? true : item));
      return newArrayListened;
    });
  };

  const renderAudioFooter = (src) => {
    const elementFooter = document.getElementById('Footer-ExcercisePage-Audio');
    if (!elementFooter) return null;
    const res = elementFooter.getBoundingClientRect();
    const { top, left } = res;
    return (
      <div style={{ position: 'fixed', top, left, zIndex: 1, transform: 'translate(-50%,-50%)' }}>
        {AudioUrl.text && (
          <ReactAudioPlayer
            src={src}
            autoPlay
            controls
            controlsList="nodownload"
            style={{ height: '40px' }}
            onPlay={() => setIsPlay(true)}
            onPause={() => setIsPlay(false)}
            onEnded={() => {
              setIsPlay(false);
              setAudioUrl({});
            }}
          />
        )}
      </div>
    );
  };

  if (!data) return null;
  return (
    <React.Fragment>
      {renderAudioFooter(AudioUrl.text)}
      {data.map((value, index) => {
        const { top, left, height, width, text } = value;
        const color = AudioUrl.index === index && isPlay ? 'green' : '';
        return (
          <div
            key={`listen-${index}`}
            style={{
              position: 'absolute',
              top,
              left,
              height,
              width,
              fontSize: Math.min(width, height),
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
            onClick={() => handleClick(text, index)}
          >
            <i className="fas fa-volume-up" style={{ color }} />
          </div>
        );
      })}
    </React.Fragment>
  );
}
Listen.propTypes = {
  listen: PropTypes.object,
  data: PropTypes.array,
};
Listen.defaultProps = { data: [] };
export default Listen;
//
const handleResult = (array) => {
  const total = array.length;
  const count = array.filter((x) => x === true).length;
  const complete = `${count}/${total}`;

  const percent = parseInt((count * 100) / total);
  const star = percent / 20;

  return { percent, resultString: complete, star, complete };
};
