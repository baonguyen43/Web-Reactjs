import React from 'react'
import PropTypes from 'prop-types'
import { Select, Space } from 'antd'
import ReactAudioPlayer from 'react-audio-player';

function AudioList({ audioUrl }) {
  let audioArray = [];
  try {
    audioArray = JSON.parse(audioUrl);
  } catch (e) {
    audioArray = [];
  }
  // const audioArray = JSON.parse(audioUrl);
  //
  const countAudio = audioArray.length;
  const audioOptions = audioArray.map((item, i) => ({ label: `Track ${i + 1}`, value: item }));
  const [AudioUrl, setAudioUrl] = React.useState('')
  const audioRef = React.useRef();
  //
  React.useEffect(() => {
    if (audioUrl && countAudio) {
      setAudioUrl(audioOptions[0].value)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [audioUrl])
  //
  if (!countAudio) return null;
  //
  return (
    <Space direction='horizontal' align='center'>
      <div className="d-flex justify-content-center align-items-center rounded" style={{ backgroundColor: '#022F63', height: 43, width: 43 }}>
        <i className="fas fa-headphones-alt fa-2x text-white" />
      </div>
      {countAudio > 1 &&
        (<div style={{ height: 43, }}>
          <Select style={{ fontSize: 18 }}
            size='large'
            value={AudioUrl}
            bordered={false}
            options={audioOptions}
            // showArrow={countAudio > 1}
            onChange={(value) => { setAudioUrl(value) }}
          />
        </div>)
      }
      <ReactAudioPlayer
        ref={audioRef}
        id="myAudio"
        style={{ height: 43 }}
        src={AudioUrl}
        // autoPlay
        controls
      />
    </Space>
  )
}

AudioList.propTypes = {
  audioUrl: PropTypes.string,
}

export default AudioList


