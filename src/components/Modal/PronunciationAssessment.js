import React from 'react';
import PropTypes from 'prop-types';
import { Space, Progress as AntdProgress, Badge, Avatar, Divider } from 'antd';
import Container from 'reactstrap/lib/Container';
import _ from 'lodash'

const PronunciationAssessment = ({ assessment, isSentence }) => {
  if (!assessment) return ''
  const errorTypeNumbers = _.countBy(assessment.words, 'errorType')
  return (
    <Container className='d-flex flex-column justify-content-center pb-5 mt--2'>
      <div className="row justify-content-center align-items-center">
        <Space size='large' className="px-3 py-1" >
          <Space direction='vertical' className='justify-content-center align-items-center'>
            <AntdProgress type='circle' status='active' percent={assessment.pronunciationScore} width={70} strokeColor='#52c41a' />
            <small><strong>Phát âm</strong></small>
          </Space>
          <Space direction='vertical' className='justify-content-center align-items-center'>
            <AntdProgress type='circle' status='active' percent={assessment.accuracyScore} width={70} strokeColor='#722ed1' />
            <small><strong>Chính xác</strong></small>
          </Space>
        </Space>
        <Space size='large' className="px-2 py-1">
          <Space direction='vertical' className='justify-content-center align-items-center'>
            <AntdProgress type='circle' status='active' percent={assessment.completenessScore} width={70} strokeColor='#2f54eb' />
            <small><strong>Hoàn thiện</strong></small>
          </Space>
          <Space direction='vertical' className='justify-content-center align-items-center'>
            <AntdProgress type='circle' status='active' percent={assessment.fluencyScore} width={70} strokeColor='#eb2f96' />
            <small><strong>Lưu loát</strong></small>
          </Space>
        </Space>
      </div>
      {isSentence &&
        <React.Fragment>
          <Divider />
          <section id='recognition-legend' className='d-flex justify-content-center'>
            <Space size='large' className='mt-2'>
              <Space className="d-flex flex-column flex-md-row">
                <Badge showZero count={errorTypeNumbers?.Omission ?? 0}>
                  <Avatar size='default' shape='circle' style={{ backgroundColor: '#f5365c' }} />
                </Badge>
                <strong>Đọc thiếu từ</strong>
              </Space>
              <Space className="d-flex flex-column flex-md-row">
                <Badge showZero count={errorTypeNumbers?.Mispronunciation ?? 0}>
                  <Avatar size='default' shape='circle' style={{ backgroundColor: '#11cdef' }} />
                </Badge>
                <strong>Phát âm sai</strong>
              </Space>
              <Space className="d-flex flex-column flex-md-row">
                <Badge showZero count={errorTypeNumbers?.Insertion ?? 0}>
                  <Avatar size='default' shape='circle' style={{ backgroundColor: '#FFAF24' }} />
                </Badge>
                <strong>Đọc thừa từ</strong>
              </Space>
            </Space>
          </section>
        </React.Fragment>
      }
    </Container>
  );
};

PronunciationAssessment.propTypes = {
  assessment: PropTypes.any,
  isSentence: PropTypes.bool,
};

export default PronunciationAssessment;