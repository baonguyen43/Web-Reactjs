import React from 'react';
import { Rate } from 'antd';
import * as functions from 'components/functions';
import Listen from 'components/Listening';
import RdIcon from 'components/functions/rdIcons';
import PropTypes from 'prop-types'

const Type07Modal = ({ detail, type }) => {

  if (!detail) return null;
  const studentChoices = JSON.parse(detail.studentChoices);

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
      <div className="d-flex flex-column align-items-center">
        <Rate
          disabled
          value={functions.getStarRecord(detail.score)}
          allowHalf
        />
        <img className='mt-2' style={{ width: 400, height: 250 }} alt='...' src={detail.vocabularyQuestion[0].imageUrl} />
      </div>
      <p className='text-red mt-2' style={{ fontSize: 18, fontWeight: '500' }}>{detail.vocabularyQuestion[0].text}</p>

      <p className='mt-3 text-primary' style={{ fontSize: 16, fontWeight: '500' }}>Your Answer</p>
      <Listen
        custom
        audioURL={studentChoices.recordUrl}
        className={'question-type__audioExampleType02'}
      >
        <i className="fas fa-volume-up"></i>
      </Listen>
      <p className='text-red' style={{ fontSize: 16, fontWeight: '500' }}>Correct Answer</p>
      <Listen
        custom
        audioURL={detail.vocabularyQuestion[0].soundUrl}
        className={'question-type__audioExampleType02'}
      >
        <i className="fas fa-volume-up"></i>
      </Listen>

    </div>
  )
}

Type07Modal.propTypes = {
  detail: PropTypes.instanceOf(Object),
  type: PropTypes.string
}
export default Type07Modal