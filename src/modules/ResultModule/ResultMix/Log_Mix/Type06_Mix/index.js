import React from 'react';
import { Rate } from 'antd';
import * as functions from 'components/functions';
import Listen from 'components/Listening';
import RdIcon from 'components/functions/rdIcons';
import PropTypes from 'prop-types'

const Type06Modal_Mix = ({ detail, type }) => {

  if (!detail) return null;
  const studentChoices = JSON.parse(detail.studentChoices);
  const vocabularyQuestion = JSON.parse(detail.vocabularyQuestion);

  const renderIcons = () => {
    const iconArray = RdIcon(type);
    return iconArray?.map((item, index) => {
      return (
        // eslint-disable-next-line jsx-a11y/anchor-is-valid
        <a
          key={index}
          className="avatar avatar-sm rounded-circle"
          onClick={(e) => e.preventDefault()}
        >
          <img alt="..." src={item} />
        </a>
      );
    });
  };
  return (
    <div className="modal-body text-center">
      <p>{renderIcons()}</p>
      <p className='text-red' style={{ fontSize: 18, fontWeight: '500' }}>Your Rate:</p>
      <Rate
        disabled
        value={functions.getStarRecord(detail.score)}
        allowHalf
      />
      <p className='text-red mt-2' style={{ fontSize: 18, fontWeight: '500' }}>{vocabularyQuestion[0].Text}</p>

      <p className='mt-3 text-primary' style={{ fontSize: 16, fontWeight: '500' }}>
        Your Answer:
        <Listen
          custom
          audioURL={studentChoices.recordUrl}
          className={'question-type__audioExampleType02 ml-2'}
        >
          <i className="fas fa-volume-up"></i>
        </Listen>
      </p>

      <p className='text-red' style={{ fontSize: 16, fontWeight: '500' }}>
        Correct Answer:
        <Listen
          custom
          audioURL={vocabularyQuestion[0].SoundUrl}
          className={'question-type__audioExampleType02 ml-2'}
        >
          <i className="fas fa-volume-up"></i>
        </Listen>
      </p>

    </div>
  )
}

Type06Modal_Mix.propTypes = {
  detail: PropTypes.instanceOf(Object),
  type: PropTypes.string
}
export default Type06Modal_Mix