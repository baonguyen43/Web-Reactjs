/* eslint-disable jsx-a11y/media-has-caption */
/* eslint-disable no-unused-vars */
/* eslint-disable no-nested-ternary */
/* eslint-disable no-eval */
/* eslint-disable react/prop-types */
import React from 'react';
import numeral from 'numeral';
import moment from 'moment';
import _ from 'lodash';
import { Button, Checkbox, Modal, Popconfirm, Progress, Rate, Tag } from 'antd';

import { remove } from 'helpers/QueryHelper';
import { renderDetails } from './renderDetails';

import renderSachSoFunctions from './renderSachSoFunctions';

function truncate(str, n) {
  if (str) return str.length > n ? `${str.substr(0, n - 1)} ...` : str;
  return '';
}

// --------------------------------------------------------------------------------------------------------------------
const LongTextModal = ({ text }) => {
  const [visible, setVisible] = React.useState(false);

  return (
    <React.Fragment>
      <Button
        type='link'
        size='small'
        onClick={() => {
          setVisible(true);
        }}
      >
        {_.upperFirst(truncate(text, 26))}
      </Button>

      <Modal
        title='Thông tin chi tiết'
        centered
        visible={visible}
        onCancel={() => {
          setVisible(false);
        }}
      >
        <p>{_.upperFirst(text)}</p>
      </Modal>
    </React.Fragment>
  );
};
// --------------------------------------------------------------------------------------------------------------------
const renderCheckbox = (formatString, prefix, suffix, formatConditions, style) => (text, record, index) => {
  return <Checkbox checked={text} />;
};
// --------------------------------------------------------------------------------------------------------------------
const renderNumber = (formatString, prefix, suffix, formatConditions, style) => (text, record, index) => {
  let number = 0;
  if (text) number = text;
  let format = '0,0';
  if (formatString) format = formatString;

  let formatStyle = {};
  let formatClassName = '';
  if (formatConditions) {
    for (let i = 0; i < formatConditions.length; i++) {
      const condition = eval(formatConditions[i].condition);
      if (condition) {
        formatStyle = formatConditions[i].style;
        formatClassName = formatConditions[i].className;
      }
    }
  }

  return {
    props: {
      className: formatClassName,
      style: { minWidth: 72, whiteSpace: 'nowrap', textAlign: 'right', ...style, ...formatStyle },
    },
    children: (
      <span>
        {prefix}
        {`${text === null || text === undefined ? '' : numeral(number).format(format)}`}
        {suffix}
      </span>
    ),
  };
};
// --------------------------------------------------------------------------------------------------------------------
const renderMoney = (formatString, prefix, suffix, formatConditions, style) => (text, record, index) => {
  let number = 0;
  if (text) number = text;
  let format = '0,0';
  let suffixElement = ' đ';

  if (formatString) format = formatString;
  if (suffix) suffixElement = suffix;

  return renderNumber(format, prefix, suffixElement, formatConditions, style)(text, record, index);
};
// --------------------------------------------------------------------------------------------------------------------
const renderProgress = (formatString, prefix, suffix, formatConditions, style) => (text, record, index) => {
  let number = 0;
  if (text) number = text;
  let format = '0,0';
  let suffixElement = '%';

  if (formatString) format = formatString;
  if (suffix) suffixElement = suffix;

  let formatStyle = {};
  let formatClassName = '';
  if (formatConditions) {
    for (let i = 0; i < formatConditions.length; i++) {
      const condition = eval(formatConditions[i].condition);
      if (condition) {
        formatStyle = formatConditions[i].style;
        formatClassName = formatConditions[i].className;
      }
    }
  }

  return {
    props: {
      className: formatClassName,
      style: { ...style, ...formatStyle },
    },
    children: (
      <div style={{ display: 'flex', flex: 1, justifyContent: 'center' }}>
        <Progress type='line' percent={text} showInfo={false} strokeWidth={14} strokeLinecap='round' status={number >= 80 ? 'success' : text >= 50 ? '' : 'exception'} style={{ width: 75 }} />
        <div style={{ whiteSpace: 'nowrap', marginTop: 3, paddingLeft: 6, fontSize: 12 }}>
          {prefix}
          {`${numeral(number).format(format)}`}
          {suffixElement}
        </div>
      </div>
    ),
  };
};
// --------------------------------------------------------------------------------------------------------------------
const renderPercent = (formatString, prefix, suffix, formatConditions, style) => (text, record, index) => {
  let number = 0;
  if (text) number = text;
  let format = '0,0';
  let suffixElement = '%';

  if (formatString) format = formatString;
  if (suffix) suffixElement = suffix;

  return renderNumber(format, prefix, suffixElement, formatConditions, style)(text, record, index);
};
// --------------------------------------------------------------------------------------------------------------------
const renderUpperCase = (formatString, prefix, suffix, formatConditions, style) => (text, record, index) => {
  let content = '';
  if (text) content = text.toUpperCase();

  return renderText(formatString, prefix, suffix, formatConditions, style)(content, record, index);
};
// --------------------------------------------------------------------------------------------------------------------
const renderLowerCase = (formatString, prefix, suffix, formatConditions, style) => (text, record, index) => {
  let content = '';
  if (text) content = text.toLowerCase();

  return renderText(formatString, prefix, suffix, formatConditions, style)(content, record, index);
};
// --------------------------------------------------------------------------------------------------------------------
const renderDate = (formatString, prefix, suffix, formatConditions, style) => (text, record, index) => {
  let format = 'DD/MM/YYYY';
  if (formatString) format = formatString;
  return renderDateTime(format, prefix, suffix, formatConditions, style)(text, record, index);
};
// --------------------------------------------------------------------------------------------------------------------
const renderTime = (formatString, prefix, suffix, formatConditions, style) => (text, record, index) => {
  let format = 'HH:mm';
  if (formatString) format = formatString;
  return renderDateTime(format, prefix, suffix, formatConditions, style)(text, record, index);
};
// --------------------------------------------------------------------------------------------------------------------
const renderDateTime = (formatString, prefix, suffix, formatConditions, style) => (text, record, index) => {
  if (!text) return <span />;

  let date = '';
  if (text) date = text;
  let format = 'DD/MM/YYYY HH:mm';
  if (formatString) format = formatString;

  let formatStyle = {};
  let formatClassName = '';
  if (formatConditions) {
    for (let i = 0; i < formatConditions.length; i++) {
      const condition = eval(formatConditions[i].condition);
      if (condition) {
        formatStyle = formatConditions[i].style;
        formatClassName = formatConditions[i].className;
      }
    }
  }

  return {
    props: {
      className: formatClassName,
      style: { ...style, ...formatStyle },
    },
    children: (
      <span style={{ whiteSpace: 'nowrap' }}>
        {prefix}
        {moment(date).format(format)}
        {suffix}
      </span>
    ),
  };
};
// --------------------------------------------------------------------------------------------------------------------
const renderText = (formatString, prefix, suffix, formatConditions, style) => (text, record, index) => {
  if (!text) return <span />;

  let content = '';
  if (text) content = text;
  let format = '';
  if (formatString) format = formatString;

  let formatStyle = {};
  let formatClassName = '';
  if (formatConditions) {
    for (let i = 0; i < formatConditions.length; i++) {
      const condition = eval(formatConditions[i].condition);
      if (condition) {
        formatStyle = formatConditions[i].style;
        formatClassName = formatConditions[i].className;
      }
    }
  }

  return {
    props: {
      className: formatClassName,
      style: { ...style, ...formatStyle },
    },
    children: (
      <span>
        {prefix}
        {content}
        {suffix}
      </span>
    ),
  };
};
// --------------------------------------------------------------------------------------------------------------------
const renderNoWrap = (formatString, prefix, suffix, formatConditions, style) => (text, record, index) => {
  return renderText(formatString, prefix, suffix, formatConditions, { whiteSpace: 'nowrap', ...style })(text, record, index);
};
// --------------------------------------------------------------------------------------------------------------------
const renderRate = (formatString, prefix, suffix, formatConditions, style) => (text, record, index) => {
  return <Rate style={style} allowHalf defaultValue={text} />;
};

const renderAudio = (formatString, prefix, suffix, formatConditions, style) => (text, record, index) => {
  return (
    <audio controls>
      <source src={text} type='audio/mpeg' />
    </audio>
  );
};

// --------------------------------------------------------------------------------------------------------------------
const renderRateDisabled = (formatString, prefix, suffix, formatConditions, style) => (text, record, index) => {
  return <Rate style={style} allowHalf disabled defaultValue={text} />;
};
// --------------------------------------------------------------------------------------------------------------------
const renderHtml = (formatString, prefix, suffix, formatConditions, style) => (text, record, index) => {
  // eslint-disable-next-line react/no-danger
  return <div style={style} dangerouslySetInnerHTML={{ __html: text }} />;
};
// --------------------------------------------------------------------------------------------------------------------
const renderClassStatus = (formatString, prefix, suffix, formatConditions, style) => (text, record, index) => {
  if (text) {
    let color = '#1890ff';
    switch (text) {
      case 'Not Ready':
        color = '#ff8f00';
        break;
      case 'Ready':
        color = '#1890ff';
        break;
      case 'Finish':
        color = '#00c853';
        break;
      default:
        color = '#1890ff';
    }

    return (
      <Tag color={color} style={{ width: '100%', textAlign: 'center', ...style }}>
        {text}
      </Tag>
    );
  }
  return <span />;
};
// --------------------------------------------------------------------------------------------------------------------
const renderLongText = (formatString, prefix, suffix, formatConditions, style) => (text, record, index) => {
  return <LongTextModal text={text} />;
};
// --------------------------------------------------------------------------------------------------------------------

const renderPdf = (formatString, prefix, suffix, formatConditions, style) => (text, record, index) => {
  const url = `https://docs.google.com/viewer?url=https://ames.edu.vn/toeiconline/pt/result/${text}`;

  return (
    <div style={{ textAlign: 'center', ...style }}>
      <a href={url} target='_blank' style={{ fontWeight: '700' }} title='Xem thông tin chi tiết' rel='noreferrer'>
        Pdf
      </a>
    </div>
  );
};
// --------------------------------------------------------------------------------------------------------------------
const render_EBM_StudentDetails = (formatString, prefix, suffix, formatConditions, style) => (text, record, index) => {
  const url = `https://softech.edu.vn/screen/StudentDetail.aspx?StudentId=${record.studentId}`;
  return (
    <div style={{ textAlign: 'center', ...style }}>
      <a href={url} target='_blank' style={{ fontWeight: '700' }} title='Xem thông tin chi tiết' rel='noreferrer'>
        {text}
      </a>
    </div>
  );

  // let url = `https://softech.edu.vn/screen/ClassEdit.aspx?tab=student&ClassId=${record.classId}`;
  // return <IFrameModal url={url} text={text} />;
};
// --------------------------------------------------------------------------------------------------------------------
const render_EBM_ClassDetails = (formatString, prefix, suffix, formatConditions, style) => (text, record, index) => {
  const url = `https://softech.edu.vn/screen/ClassEdit.aspx?tab=student&ClassId=${record.classId}`;
  return (
    <div style={{ textAlign: 'center', ...style }}>
      <a href={url} target='_blank' style={{ fontWeight: '700' }} title='Xem thông tin chi tiết' rel='noreferrer'>
        {text}
      </a>
    </div>
  );

  // let url = `https://softech.edu.vn/screen/ClassEdit.aspx?tab=student&ClassId=${record.classId}`;
  // return <IFrameModal url={url} text={text} />;
};
// --------------------------------------------------------------------------------------------------------------------
// renderComplex
const renderExpression = (expression, formatString, prefix, suffix, formatConditions, style) => (text, record, index) => {
  let content = '';
  if (text) content = eval(expression);
  let format = '0,0';
  if (formatString) format = formatString;

  let formatStyle = {};
  let formatClassName = '';
  if (formatConditions) {
    for (let i = 0; i < formatConditions.length; i++) {
      const condition = eval(formatConditions[i].condition);
      if (condition) {
        formatStyle = formatConditions[i].style;
        formatClassName = formatConditions[i].className;
      }
    }
  }

  return {
    props: {
      className: formatClassName,
      style: { ...style, ...formatStyle },
    },
    children: (
      <div style={{ textAlign: formatString ? 'right' : 'inherit', whiteSpace: 'nowrap' }}>
        {prefix}
        {`${formatString ? numeral(content).format(format) : content}`}
        {suffix}
      </div>
    ),
  };
};

// --------------------------------------------------------------------------------------------------------------------
const renderDeleteAction = (params, formatString, prefix, suffix, formatConditions, style) => (text, record, index) => {
  return (
    <React.Fragment>
      <Popconfirm
        title='Bạn có muốn xóa không?'
        onConfirm={async () => {
          await remove(params.entityName, record[params.entityId], params.subModuleName, params.moduleName, params.applicationName);
        }}
        okText='Xác nhận'
        cancelText='Không'
      >
        <Button type='link' size='small' onClick={() => {}} style={{ whiteSpace: 'nowrap', ...style }}>
          Xóa
        </Button>
      </Popconfirm>
    </React.Fragment>
  );
};

// --------------------------------------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------------------------------------
const renderFunctions = {
  renderText,
  renderCheckbox,
  renderNumber,
  renderMoney,
  renderDate,
  renderTime,
  renderDateTime,
  renderPercent,
  renderProgress,
  renderNoWrap,

  // RATE
  renderRate,
  renderRateDisabled,

  // LOWER / UPPER
  renderUpperCase,
  renderLowerCase,

  // HTML
  renderHtml,

  // LONG TEXT WITH MODAL
  renderLongText,

  // DETAILS
  renderDetails,

  // PDF
  renderPdf,
  // EBM
  renderClassStatus,
  render_EBM_ClassDetails,
  render_EBM_StudentDetails,

  // EXPRESSION
  renderExpression,

  // AUDIO
  renderAudio,
  renderDeleteAction,
  // externalRenderFunctions
  ...renderSachSoFunctions,
};

export default renderFunctions;
