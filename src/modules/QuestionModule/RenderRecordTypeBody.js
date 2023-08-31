/* eslint-disable react/prop-types */
import React from 'react';
import { Row, Col, Card, CardBody, CardFooter, Button } from 'reactstrap';
import PronunciationAssessment from 'components/Modal/PronunciationAssessment';

const RenderRecordTypeBody = ({ children, name, resultRecord, isSentence, onNext, renderRecorder }) => {
  return (
    <div>
      <Row className="justify-content-md-center mt-3">
        <Col className='col-12 col-lg-7 text-center mb-3'>
          <Card style={{ height: '100%' }} className={`${name} `}>
            {/* ////////////////////////////////// */}
            {/* Listen */}
            <CardBody>
              {children}
            </CardBody>
            {resultRecord &&
              <CardFooter style={{ textAlign: 'end', padding: 10 }}>
                <Button color="primary" onClick={() => onNext()} id='tooltipNextButton'>
                  Next
                  <i style={{ fontSize: 15, marginLeft: 5 }} className="fas fa-arrow-circle-right" />
                </Button>
              </CardFooter>
            }
          </Card>
        </Col>
        <Col className='col-12 col-lg-5 text-center mb-3'>
          <Card style={{ height: '100%' }}>
            {renderRecorder()}
            <PronunciationAssessment assessment={resultRecord} isSentence={isSentence} />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default RenderRecordTypeBody;