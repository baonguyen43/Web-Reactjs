import React from 'react';
import { Rate } from 'antd';
import * as functions from 'components/functions';
import RdIcon from 'components/functions/rdIcons';
import PropTypes from 'prop-types'

const Type13Modal_Mix = ({ detail, type }) => {

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
      <p>
       <img className='mt-2' style={{ width: 400, height: 250 }} alt='...' src={vocabularyQuestion[0].ImageUrl} />
      </p>
      <p className='mt-3 text-primary' style={{ fontSize: 16, fontWeight: '500' }}>Your Answer: {studentChoices.text}</p>

      <p className='text-red' style={{ fontSize: 16, fontWeight: '500' }}>Correct Answer: {vocabularyQuestion[0].Text}</p>
    
    </div>
  )
}

Type13Modal_Mix.propTypes = {
  detail: PropTypes.instanceOf(Object),
  type: PropTypes.string
}
export default Type13Modal_Mix