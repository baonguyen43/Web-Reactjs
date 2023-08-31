import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Button, Form, Input, Space } from 'antd';
import { DiffOutlined } from '@ant-design/icons';

function ScoresInput({ data, onDataChange, onPush }) {
  const [form] = Form.useForm();
  // const isEmpty = Object.values(data).some((x) => !x); // x = '' | null | undefined => true
  const isEmpty = !data.ExName; // ExName = '' | null | undefined => true
  useEffect(() => {
    form.setFieldsValue(data);
    return () => {};
  }, [data, form]);

  const onFinish = (values) => {
    onPush(values);
  };
  const handleValuesChange = (changedValues, allValues) => {
    onDataChange(allValues);
  };

  return (
    <Form form={form} onFinish={onFinish} onValuesChange={handleValuesChange} size="small" style={{ height: 18 }}>
      <Space size="small">
        <Form.Item name="ExName">
          <Input placeholder="ExName" />
        </Form.Item>
        <Form.Item name="ExScore">
          <Input placeholder="Score" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" disabled={isEmpty} icon={<DiffOutlined />} />
        </Form.Item>
      </Space>
    </Form>
  );
}

ScoresInput.propTypes = {
  data: PropTypes.object,
  onDataChange: PropTypes.func,
  onPush: PropTypes.func,
};

export default ScoresInput;
