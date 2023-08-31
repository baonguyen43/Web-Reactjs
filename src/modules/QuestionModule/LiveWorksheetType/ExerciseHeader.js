import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col, Badge, Progress } from 'reactstrap';

const ExerciseHeader = (props) => {
  return (
    <div>
      <Row className="mt-4">
        <Badge className="badge-default text-default" style={{ fontSize: 15, fontWeight: '500' }}>
          TOTAL QUESTION
        </Badge>
        <Badge className="badge-lg" color="danger">{`${10}/${10}`}</Badge>
        <Badge className="badge-default text-warning" style={{ fontSize: 15, fontWeight: '500' }}>
          SCORE
        </Badge>
        <Badge className="badge-lg" color="warning">{`${parseInt(27)}/100`}</Badge>
        <Badge className="badge-default text-success" style={{ fontSize: 15, fontWeight: '500' }}>
          PASSED
        </Badge>
        <Badge className="badge-lg" color="success">{`${7}/${10}`}</Badge>
      </Row>
      <div style={{ display: 'flex', flexDirection: 'column', padding: 0, margin: 0 }}>
        <span style={{ padding: 0, margin: 0, color: '#002958', marginTop: 5, fontSize: 16 }}>
          Live WorkSheet
          <span style={{ color: '#002958', fontSize: 16, fontStyle: 'italic' }}> (Bài tập chấm điểm tự động).</span>
        </span>
      </div>
      <Row>
        <Col>
          <div className="progress-wrapper" style={{ paddingTop: 5 }}>
            <div className="progress-info">
              <div className="progress-label">
                <span>Completed</span>
              </div>
              <div className="progress-percentage">
                <span>{`${parseInt(0.27 * 100)} %`}</span>
              </div>
            </div>
            <Progress max="100" value={0.27 * 100} color="default" />
          </div>
        </Col>
      </Row>
    </div>
  );
};

ExerciseHeader.propTypes = {};

export default ExerciseHeader;
