import React from 'react';
import classNames from 'classnames';
import { Progress } from 'antd';
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  RedoOutlined,
  QuestionCircleOutlined
} from '@ant-design/icons';
import queryString from 'query-string';
import PropTypes from 'prop-types';

const _class = {
  session: classNames(['box-session-content']),
  session__left: classNames(['box-session-left']),
  session__info: classNames(['box-session-info']),
  session__info_header: classNames(['info-header']),
  session__info_header_avg_time: classNames(['avg-time']),
  session__info_header_total_time: classNames(['total-time']),
  session__info_footer: classNames(['info-footer'])
};

class ResultAnswers extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      results: null,
      objResult: null,
    }
    this.queryString = queryString.parse(props.location.search);
  }

  static getDerivedStateFromProps = (props, state) => {
    if (props.results !== state.results) {
      return {
        results: props.results,
        objResult: props.objResult,
      }
    }
    return null
  }

  renderInfoFooter = (passedQuestionCount, totalAnswer, totalQuestionCount) => {
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
                <span className={'details'}>{totalQuestionCount}</span>
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

  render = () => {
    const { results, objResult } = this.state;
    if (!results) return null;
    const { passedQuestionCount, totalAnswer } = objResult;
    const totalQuestionCount = this.queryString.length;
    const score = passedQuestionCount/totalQuestionCount *100;
    return (
      <div className={_class.session}>
        <div className={_class.session__left}>
          {parseInt(score) === 100 ?
            <Progress width={130} type="dashboard" percent={parseInt(score)} format={() => '100%'} /> :
            <Progress width={130} type="dashboard" percent={parseInt(score)} />
          }
        </div>
        <div className={_class.session__info}>
          <div className={_class.session__info_header}>
            {/* {this.renderInfoHeader({ playedTime })} */}
          </div>
          <div className={_class.session__info_footer}>
            {this.renderInfoFooter(passedQuestionCount, totalAnswer, totalQuestionCount)}
          </div>
        </div>
      </div>
    );
  };
}

ResultAnswers.propTypes = {
  log: PropTypes.instanceOf(Object),
  objResult:PropTypes.instanceOf(Object),
  location:PropTypes.instanceOf(Object),
  results:PropTypes.string,
  totalPointResult: PropTypes.number,
  correctAnswers: PropTypes.number,
  totalAnswer: PropTypes.number,
  totalQuestions: PropTypes.number,
  playTime: PropTypes.string,
}

export default ResultAnswers;
