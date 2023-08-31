/* eslint-disable react/prop-types */
import React from 'react';
import classNames from 'classnames';
import { Progress , Rate } from 'antd';
import {
  ClockCircleOutlined,
  HourglassOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  RedoOutlined,
  QuestionCircleOutlined
} from '@ant-design/icons';
import PropTypes from 'prop-types';
import './styles.css';

const _class = {
  session: classNames(['box-session-content']),
  session__left: classNames(['box-session-left']),
  session__info: classNames(['box-session-info']),
  session__info_header: classNames(['info-header']),
  session__info_header_avg_time: classNames(['avg-time']),
  session__info_header_total_time: classNames(['total-time']),
  session__info_footer: classNames(['info-footer'])
};

const ResultFrame = ({ result }) => {

  const renderInfoHeader = ({ responsetime, playedTime }) => {
    return (
      <React.Fragment>
        <div className={_class.session__info_header_avg_time}>
          <ClockCircleOutlined style={{ fontSize: 23 }} />
          <span className={'time'}>{responsetime}</span>
          <div className={'legend'}>Thời gian trung bình</div>
        </div>

        <div className={_class.session__info_header_total_time}>
          <HourglassOutlined style={{ fontSize: 23 }} />
          <span className={'time'}>{playedTime}</span>
          <div className={'legend'}>Tổng thời gian</div>
        </div>
      </React.Fragment>
    );
  };

  const renderInfoFooter = (passedQuestionCount, totalAnswer, totalQuestionCount) => {
    return (
      <div className={_class.session__info_header_avg_time}>
        <ul>
          <li>
            <div>
              <span>
                <CheckCircleOutlined
                  style={{ fontSize: 23, color: '#1bd171' }}
                />
                <span className={'details'}>{passedQuestionCount}</span>
              </span>
              <span className={'type'}>
                <b>{'Trả lời đúng'}</b>

              </span>
            </div>
          </li>
          <li>
            <div>
              <span>
                <CloseCircleOutlined
                  style={{ fontSize: 23, color: '#f27474' }}
                />
                <span className={'details'}>{totalQuestionCount - passedQuestionCount}</span>
              </span>
              <span className={'type'}>
                <b>{'Trả lời sai'}</b>
                {/* {'\nanswers'} */}
              </span>
            </div>
          </li>
          <li>
            <div>
              <span>
                <RedoOutlined
                  style={{ fontSize: 23, color: '#f9c631' }}
                />
                <span className={'details'}>{totalAnswer}</span>
              </span>
              <span className={'type'}>
                <b>{'Câu trả lời'}</b>
                {/* {'\nanswers'} */}
              </span>
            </div>
          </li>
          <li>
            <div>
              <span>
                <QuestionCircleOutlined
                  style={{ fontSize: 23, color: '#5d6670' }}
                />
                <span className={'details'}>{totalQuestionCount}</span>
              </span>
              <span className={'type'}>
                <b>{'Tổng câu hỏi'}</b>
                {/* {'\nquestions'} */}
              </span>
            </div>
          </li>
        </ul>
      </div>
    );
  };

  const renderComponent = () => {
    const { playedTime, passedQuestionCount, totalAnswer, totalQuestionCount, totalScore } = result;

    const a = playedTime.split(':')
    const time = ((parseInt(a[0]) * 60) + parseInt(a[1])) / (totalAnswer ? totalAnswer : 10);
    const minute = parseInt(time / 60) < 10 ? '0' + parseInt(time / 60) : parseInt(time / 60);
    const seconds = parseInt(time % 60) < 10 ? '0' + parseInt(time % 60) : parseInt(time % 60);
    const responsetime = minute + ':' + seconds

    return (
      <div className={_class.session}>
        <div className={_class.session__left}>
          {/* <Progress width={130} type="dashboard" percent={parseInt((passedQuestionCount / totalAnswer) * 100)} /> */}
          <Progress width={130} type="circle" percent={Math.floor(totalScore)} />
          <Rate
            style={{ whiteSpace: 'nowrap' }}
            disabled
            value={totalScore / 100 * 5}
            allowHalf
          />
        </div>
        <div className={_class.session__info}>
          <div className={_class.session__info_header}>
            {renderInfoHeader({ responsetime, playedTime })}
          </div>
          <div className={_class.session__info_footer}>
            {renderInfoFooter(passedQuestionCount, totalAnswer, totalQuestionCount)}
          </div>
        </div>
      </div>
    );
  }

  return renderComponent();
}

ResultFrame.propTypes = {
  log: PropTypes.instanceOf(Object),
  totalPointResult: PropTypes.number,
  correctAnswers: PropTypes.number,
  totalAnswer: PropTypes.number,
  totalQuestions: PropTypes.number,
  playTime: PropTypes.string,
}

export default ResultFrame;
