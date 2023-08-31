/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-props-no-spreading */
import _ from 'lodash';
import React from 'react';
import { Button, Upload, message, Tooltip, Space } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

import { sachsoServerUrl } from 'constants/serverUrls';
import { updateTags } from 'components/CanvasToolPlus/CanvasToolPage/api';


export default ({ folderId, onSuccess }) => {
  const [fileList, setFileList] = React.useState([]);

  const uploadSettings = {
    name: 'files',
    action: `${sachsoServerUrl}/api/v1.0/dynamic/upload-files`,
    headers: {
      Authorization: 'Basic 12C1F7EF9AC8E288FBC2177B7F54D',
      ApplicationName: 'SmartEducation',
    },
    fileList,
    maxCount: 5,
    onChange(info) {
      setFileList(info.fileList);
      if (info.file.status === 'error') {
        message.error(`Tập tin ${info.file.name} tải lên bị lỗi.`);
      }
      else{
        const id= info.fileList[0].response?.files[0].id
        updateTags(id,'AZOTA')
      }
      // Check completed all.
      const isCompleted = _.every(info.fileList, { status: 'done' });
      if (isCompleted) {
        setFileList([]);
        message.success('Upload files: Hoàn thành.');
        onSuccess();
      }
    },
  };

  return (
    <React.Fragment>
      {folderId && (
        <Upload multiple {...uploadSettings} data={{ entityId: folderId, entityName: 'Sessions', moduleName: 'AMES247', sqlCommand: 'p_MYAMES_SHARE_Attachments_Add' }}>
          <Space>
            <Tooltip title='Upload files'>
              <Button type='primary' icon={<UploadOutlined />}>Giao bài nhanh </Button>
            </Tooltip>
            {/* <span style={{ fontWeight: 400 }}>(Chọn tối đa 5 tập tin)</span> */}
          </Space>
        </Upload>
      )}
    </React.Fragment>
  );
};
