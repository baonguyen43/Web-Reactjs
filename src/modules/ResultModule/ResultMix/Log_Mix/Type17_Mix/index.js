import React from 'react';
import { Rate, Row, Col, Button } from 'antd';
import * as functions from 'components/functions';
import RdIcon from 'components/functions/rdIcons';
import PropTypes from 'prop-types'
import classNames from 'classnames';
import Listen from 'components/Listening';

const Type17Modal_Mix = ({ detail, type }) => {

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
  const soundRender = () => {
    const arraySound = studentChoices.pairs.left;
    return arraySound.map((item, index) => {
      return (
        <div key={index} style={{ marginTop: 10 }}>
          <Button
            style={{ height: 150, width: 150 }}
          >
            <Listen
              audioURL={item.SoundUrl}
            >
              <i style={{ fontSize: 15 }} className="fas fa-volume-up"></i>
            </Listen>
          </Button>
        </div>
      );
    });
  }

  const imageRender = () => {
    const image = studentChoices.pairs.right;

    return image.map((item, index) => {
      return (
        <div key={index}>
          <Button
            style={{ height: 150, width: 150, marginTop: 10 }}
          >
            <img
              alt='...'
              src={item.ImageUrl}
              className={classNames(['question-type__boxImage_log'])}
            />
          </Button>
        </div>

      )
    })
  }

  const arrowRender = () => {
    let score = [];
    const left = studentChoices.pairs.left;
    const right = studentChoices.pairs.right;
    for (let i = 0; i < left.length; i++) {
      left[i].ImageUrl === right[i].ImageUrl ? score.push({ color: 'Green' }) : score.push({ color: 'Red' })
    }

    return score.map((item, index) => {
      const imageUrl = require(`assets/img/Arrow${item.color}.png`);
      return (
        <div key={index} style={{ height: 150, marginTop: 10, width: 150 }}>
          <img style={{ maxHeight: 80, marginTop: 30 }} src={imageUrl} alt='...' />
        </div>
      )
    })
  }

  const correctImageRender = () => {
    const arrayText = studentChoices.pairs.left;
    return arrayText.map((item, index) => {
      return (
        <div key={index}>
          <Button
            style={{ height: 150, width: 150, marginTop: 10 }}
          >
            <img
              alt='...'
              src={item.ImageUrl}
              className={classNames(['question-type__boxImage_log'])}
            />
          </Button>
        </div>
      );
    });
  }
  return (
    <div className="modal-body text-center">
      <p>{renderIcons()}</p>
      <p className='text-red' style={{ fontSize: 18, fontWeight: '500' }}>Your Rate:</p>
      <Rate
        disabled
        value={functions.getStarRecord(detail.score)}
        allowHalf
      />
      <Row className="bg-gradient-secondary justify-content-md-center text-center">
        <Col>
          {soundRender()}
        </Col>
        <Col className='text-white'>
          {arrowRender()}
        </Col>
        <Col>
          {imageRender()}
        </Col>
        <Col className='ml-8'>
          {correctImageRender()}
        </Col>
      </Row>

    </div>
  )
}

Type17Modal_Mix.propTypes = {
  detail: PropTypes.instanceOf(Object),
  type: PropTypes.string
}
export default Type17Modal_Mix