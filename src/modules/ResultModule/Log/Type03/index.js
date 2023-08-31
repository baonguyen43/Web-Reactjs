import React from 'react';
import { Rate } from 'antd';
import * as functions from 'components/functions';
import Listen from 'components/Listening';
import RdIcon from 'components/functions/rdIcons';
import PropTypes from 'prop-types'

const Type03Modal = ({ detail, type }) => {

  if(!detail) return null;
  const studentChoices =  JSON.parse(detail.studentChoices);

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
      <p className='text-red mt-2' style={{ fontSize: 18, fontWeight: '500' }}>Bài nghe:</p>

      <Listen audioURL={detail.vocabularyQuestion[0].soundUrl} onAuto={false} />

      <p className='mt-3 text-primary' style={{ fontSize: 16, fontWeight: '500' }}>Your Answer: {studentChoices.text}</p>
      <p className='text-red' style={{ fontSize: 16, fontWeight: '500' }}>Correct Answer: {detail.vocabularyQuestion[0].text}</p>

    </div>
  )
}

Type03Modal.propTypes = {
  detail: PropTypes.instanceOf(Object),
  type: PropTypes.string
}
export default Type03Modal