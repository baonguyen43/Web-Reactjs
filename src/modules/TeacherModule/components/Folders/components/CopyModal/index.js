import { Modal, Select, Space } from 'antd';
import { dynamicApiAxios } from 'configs/api';
import { query } from 'helpers/QueryHelper';
import React, { useEffect, useRef, useState } from 'react';
import { useQuery } from 'react-query';

const fetcher = () => {
  return query('p_MYAMES_SHARE_Folders');
};

const { Option } = Select;

const selectProps = {
  showSearch: true,
  optionFilterProp: 'children',
  filterOption: (input, option) => option.children.toLowerCase().includes(input.toLowerCase()),
  getPopupContainer: (triggerNode) => {
    return triggerNode.parentNode;
  },
  style: { width: 320 },
};

export default function CopyModal({ visible, setVisible, copyId }) {
  const { data, isLoading } = useQuery('p_MYAMES_SHARE_Folders', fetcher);
  const records = data?.[0]?.dataJson;
  const [firstFolderIndex, setFirstFolderIndex] = useState(undefined);
  const [secondFolderIndex, setSecondFolderIndex] = useState(undefined);
  const [thirdFolderIndex, setThirdFolderIndex] = useState(undefined);
  const [fourthFolderIndex, setFourthFolderIndex] = useState(undefined);

  const firstFolder = records?.[firstFolderIndex];
  const secondFolder = firstFolder?.childrens?.[secondFolderIndex];
  const thirdFolder = secondFolder?.courses?.[thirdFolderIndex];
  const fourthFolder = thirdFolder?.sessions?.[fourthFolderIndex];

  const firstRef = useRef(null);
  const secondRef = useRef(null);
  const thirdRef = useRef(null);
  const fourthRef = useRef(null);

  useEffect(() => {
    // UX sau khi chọn thì nhảy tới folder bậc tiếp theo
    if (visible) firstRef.current.focus();
    if (visible && firstFolder) secondRef.current.focus();
    if (visible && firstFolder && secondFolder) thirdRef.current.focus();
    if (visible && firstFolder && secondFolder && thirdFolder) fourthRef.current.focus();
    if (visible && firstFolder && secondFolder && thirdFolder && fourthFolder) fourthRef.current.blur();
  }, [visible, firstFolder, secondFolder, thirdFolder, fourthFolder]);

  const renderOptions = (dataOptions) => {
    return dataOptions?.map((item, index) => <Option value={index}>{item.folderName}</Option>);
  };
  const handleChangeFirst = (values) => {
    setFirstFolderIndex(values);
    setSecondFolderIndex(undefined);
    setThirdFolderIndex(undefined);
    setFourthFolderIndex(undefined);
  };
  const handleChangeSecond = (values) => {
    setSecondFolderIndex(values);
    setThirdFolderIndex(undefined);
    setFourthFolderIndex(undefined);
  };
  const handleChangeThird = (values) => {
    setThirdFolderIndex(values);
    setFourthFolderIndex(undefined);
  };
  const handleChangeFourth = (values) => {
    setFourthFolderIndex(values);
  };

  const resetAllIndexes = () => {
    setFirstFolderIndex(undefined);
    setSecondFolderIndex(undefined);
    setThirdFolderIndex(undefined);
    setFourthFolderIndex(undefined);
  };

  const handleOk = async () => {
    if (!fourthFolder) return alert('Bạn chưa chọn buổi học để copy');
    if (!copyId) return alert('LiveWorksheet này không tồn tại');

    const params = {
      id: copyId,
      sessionId: fourthFolder?.id,
    };

    const response = await dynamicApiAxios.query.post('', {
      sqlCommand: 'dbo.p_MYAMES_SHARE_Attachments__Copy',
      parameters: params,
    });
    if (response.data.ok) {
      alert('Copy thành công');
      setTimeout(function () {
        resetAllIndexes();
        setVisible(false);
      }, 500);
    } else {
      alert('Copy không thành công');
      console.error(response.error);
    }
  };

  const handleCancel = () => {
    resetAllIndexes();
    setVisible(false);
  };
  return (
    <Modal title="Copy LiveWorksheet" visible={visible} onCancel={handleCancel} onOk={handleOk} width={520}>
      <Space direction="vertical">
        Hướng dẫn: Chọn thư mục cha &gt; thư mục con &gt; khóa học &gt; buổi học
        <Select
          ref={firstRef}
          {...selectProps}
          onSelect={handleChangeFirst}
          value={firstFolder?.folderName ?? 'Chọn thư mục cha'}
        >
          {renderOptions(records)}
        </Select>
        {(firstFolderIndex || typeof firstFolderIndex === 'number') && (
          <Select
            ref={secondRef}
            {...selectProps}
            onSelect={handleChangeSecond}
            value={secondFolder?.folderName ?? 'Chọn thư mục con'}
          >
            {renderOptions(firstFolder?.childrens)}
          </Select>
        )}
        {(secondFolderIndex || typeof secondFolderIndex === 'number') && (
          <Select
            ref={thirdRef}
            {...selectProps}
            onSelect={handleChangeThird}
            value={thirdFolder?.folderName ?? 'Chọn khóa học'}
          >
            {renderOptions(secondFolder?.courses)}
          </Select>
        )}
        {(thirdFolderIndex || typeof thirdFolderIndex === 'number') && (
          <Select
            ref={fourthRef}
            {...selectProps}
            onSelect={handleChangeFourth}
            value={fourthFolder?.folderName ?? 'Chọn buổi học'}
          >
            {renderOptions(thirdFolder?.sessions)}
          </Select>
        )}
      </Space>
    </Modal>
  );
}
