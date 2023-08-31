/* eslint-disable react/prop-types */
import React from 'react';
import classNames from 'classnames';
import CountdownTimer from 'components/countdownTimer';
import { Divider, Popover, Rate, Space } from 'antd';
import numeral from 'numeral';
import Row from 'reactstrap/lib/Row';
import Col from 'reactstrap/lib/Col';

const RecorderTypeContent = ({ refCountdownTimer, onStopRecording, resultRecord, functions }) => {
  return (
    <React.Fragment>
      <div className={classNames(['mt--2'])}>
        <CountdownTimer seconds={15} ref={refCountdownTimer} onStopRecording={onStopRecording}>
          <span>Thời gian ghi âm: </span>
        </CountdownTimer>
      </div>
      <br />
      {/* ///////////////////////// */}
      {/* Sau khi ghi âm có kết quả */}
      {resultRecord && (
        <div style={{ width: '100%', marginInline: 15 }}>
          <div>
            <audio src={resultRecord.recordUrl} controls />
          </div>
          <Divider />
          {resultRecord.wordShows.map((item, i) => {
            const { words } = resultRecord;
            return (
              <Popover
                key={i}
                // visible={word.errorType === 'None'}
                title={`${words[i].word}: ${numeral(words[i].accuracyScore / 100).format('0%')}`}
                content={() => {
                  return (
                    <Space className='d-flex'>
                      {words[i].phonemes.map((p) => {
                        return (
                          <div key={p.phoneme} className='d-flex flex-column align-items-center'>
                            <div style={{ fontSize: 16 }}>{p.phoneme}</div>
                            <div style={{ fontSize: 12 }}>{p.accuracyScore}</div>
                          </div>
                        );
                      })}
                    </Space>
                  );
                }}
              >
                <span style={{
                  fontSize: 20,
                  cursor: 'pointer',
                  color: item.color,
                }} className={classNames(['question-type__textReply'])}>{item.word} </span>
              </Popover>
            )
          }
          )}
          <Row className="justify-content-md-center">
            <Col lg="5" style={{ minWidth: 350 }}>
              <div>
                <div className="d-flex justify-content-center align-items-center mt-2">

                  <Rate className="mx-1" allowHalf disabled value={functions.getStarRecord(resultRecord.score)} />
                  <strong className="mx-1">{`${parseInt(resultRecord.score)}%`}</strong>
                </div>
              </div>
            </Col>
          </Row>
        </div>
      )}
    </React.Fragment>
  );
};

export default RecorderTypeContent;