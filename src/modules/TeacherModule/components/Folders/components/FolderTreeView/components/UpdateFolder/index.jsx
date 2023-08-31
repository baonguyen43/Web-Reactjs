/* eslint-disable no-nested-ternary */
/* eslint-disable react/prop-types */
import { message, Form, Input, Modal, TreeSelect, InputNumber } from 'antd';
import React from 'react';

import { add, update } from 'helpers/QueryHelper';

import ColorPicker from 'components/ColorPicker';

const UpdateFolder = ({ updateMode, data, visible, onOk, onCancel, treeData }) => {
  const initialValues = {
    parentId: updateMode === 'add' ? data?.id : data?.parentId,
    name: updateMode === 'add' ? '' : data?.name,
    color: updateMode === 'add' ? '#32325d' : data && data.color ? data.color : '#32325d',
    sortOrder: updateMode === 'add' ? 0 : data?.sortOrder,
  };

  const [form] = Form.useForm();
  //
  React.useEffect(() => {
    if (visible) {
      form.resetFields();
    }
  }, [form, visible]);

  //
  const onFinish = async (values) => {
    const parameters = {
      ...values,
      classId: 0, // id = 0 là của giáo viên không thuộc lớp nào
      createdBy: data.createdBy,
    };

    if (updateMode === 'add') {
      const response = await add('Folders', parameters, 'CLASSES');
      if (response) {
        message.success('Tạo dữ liệu thành công!');
        onOk();
      } else {
        message.error('Có lỗi xảy ra trong quá trình tạo dữ liệu!');
      }
    } else if (updateMode === 'edit') {
      const response = await update('Folders', data.id, parameters, 'CLASSES');
      if (response) {
        message.success('Cập nhật dữ liệu thành công!');
        onOk();
      } else {
        message.error('Có lỗi xảy ra trong quá trình cập nhật dữ liệu!');
      }
    }
  };

  return (
    <Modal
      maskClosable={false}
      centered
      title={updateMode === 'add' ? 'Thêm mới' : 'Cập nhật'}
      visible={visible}
      onOk={() => {
        form.submit();
      }}
      onCancel={onCancel}
      okText={updateMode === 'add' ? 'Thêm mới' : 'Cập nhật'}
      cancelText='Đóng'
    >
      <Form form={form} layout='vertical' onFinish={onFinish} requiredMark={false} initialValues={initialValues}>
        <Form.Item label='Thư mục cha' name='parentId'>
          <TreeSelect treeData={treeData} allowClear dropdownStyle={{ maxHeight: 400, overflow: 'auto', zIndex: 10000 }} treeDefaultExpandAll />
        </Form.Item>

        <Form.Item label='Tên thư mục' name='name' rules={[{ required: true, message: 'Chưa nhập tên thư mục' }]}>
          <Input />
        </Form.Item>

        <Form.Item label='Thứ tự hiển thị' name='sortOrder' rules={[{ required: true, message: 'Chưa nhập thứ tự hiển thị' }]}>
          <InputNumber min={0} />
        </Form.Item>

        <Form.Item label='Màu' name='color'>
          <ColorPicker />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UpdateFolder;
