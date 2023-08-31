/* eslint-disable no-unused-vars */
/* eslint-disable react/jsx-no-target-blank */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable no-script-url */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/media-has-caption */
/* eslint-disable no-param-reassign */
/* eslint-disable no-nested-ternary */
/* eslint-disable no-eval */
/* eslint-disable react/prop-types */
import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Modal, Tooltip } from 'antd';
import colors from 'constants/colors';
import { cdnServerUrl } from 'constants/serverUrls';
import { DownloadOutlined } from '@ant-design/icons';

function truncate(str, n) {
  if (str) return str.length > n ? `${str.substr(0, n - 1)} ...` : str;
  return '';
}

// --------------------------------------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------------------------------------

const renderLink = (linkText, linkExpression, linkCondition, formatConditions, style) => (text, record, index) => {
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
      <React.Fragment>
        {eval(linkCondition) ? (
          <Link to={eval(linkExpression)}>
            <Button type='link' size='small'>
              {linkText}
            </Button>
          </Link>
        ) : (
          <React.Fragment />
        )}
      </React.Fragment>
    ),
  };
};

const PreviewFile = ({ record, text, style }) => {
  const [visible, setVisible] = React.useState(false);

  return (
    <>
      {/* <Tooltip title={text} color={colors.primary}>
        {record.contentType.indexOf('application') >= 0 ? (
          <a href={`https://docs.google.com/viewer?url=${cdnServerUrl}${record.fileUrl}&embedded=true`} target='_blank' rel='noreferrer' style={{ whiteSpace: 'nowrap', ...style }}>
            {truncate(text, 24)}
          </a>
        ) : (
          <span
            onClick={() => {
              setVisible(true);
            }}
            style={{ whiteSpace: 'nowrap', ...style }}
          >
            {truncate(text, 24)}
          </span>
        )}
      </Tooltip> */}
      <Tooltip title={text} color={colors.primary}>
        <span
          onClick={() => {
            setVisible(true);
          }}
          style={{ whiteSpace: 'nowrap', ...style }}
        >
          {truncate(text, 24)}
        </span>
      </Tooltip>
      <Modal
        style={{ zIndex: 999 }}
        centered
        width={record.contentType.indexOf('audio') >= 0 ? 'auto' : '90%'}
        title='Preview'
        visible={visible}
        footer={null}
        onCancel={() => {
          setVisible(false);
        }}
      >
        <div className='tw-mb-4 tw-flex tw-justify-between tw-items-center'>
          <a href={`${cdnServerUrl}${record.fileUrl}`} target='_blank' rel='noreferrer' className='ant-btn-link tw-font-semibold tw-mr-8'>
            {text}
          </a>
          <a href={`${cdnServerUrl}${record.fileUrl}`} target='_blank' rel='noreferrer' className='ant-btn ant-btn-primary'>
            <DownloadOutlined className='tw-mr-1' />
            <span>Tải về</span>
          </a>
        </div>
        {/* IMAGE */}
        {record.contentType.indexOf('image') >= 0 && (
          <div style={{ overflow: 'auto', height: '80vh' }}>
            <img src={`${cdnServerUrl}${record.fileUrl}`} alt='' />
          </div>
        )}

        {/* AUDIO */}
        {record.contentType.indexOf('audio') >= 0 && (
          <div className='tw-flex tw-justify-center' style={{ overflow: 'auto', height: 'auto' }}>
            <audio controls style={{ width: '100%' }}>
              <source src={`${cdnServerUrl}${record.fileUrl}`} type={record.contentType} />
            </audio>
          </div>
        )}
        {/* VIDEO */}
        {record.contentType.indexOf('video') >= 0 && (
          <div className='tw-flex tw-justify-center' style={{ overflow: 'auto', height: '80vh' }}>
            <video controls>
              <source src={`${cdnServerUrl}${record.fileUrl}`} type={record.contentType} />
            </video>
          </div>
        )}

        {/* APPLICATION */}
        {record.contentType.indexOf('application') >= 0 && (
          <div className='tw-flex tw-justify-center' style={{ overflow: 'auto', height: '80vh', border: `1px solid ${colors.border}`, padding: 4, borderRadius: 4 }}>
            <iframe src={`https://docs.google.com/viewer?url=${cdnServerUrl}${record.fileUrl}&embedded=true`} title={record.title} width='100%' height='100%' />
          </div>
        )}
      </Modal>
    </>
  );
};

const renderPreviewFile = (formatString, prefix, suffix, formatConditions, style) => (text, record, index) => {
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
      <div>
        {prefix}
        <PreviewFile style={style} record={record} text={content} />
        {suffix}
      </div>
    ),
  };
};

const renderSachSoFunctions = {
  renderLink,
  renderPreviewFile,
};

export default renderSachSoFunctions;
