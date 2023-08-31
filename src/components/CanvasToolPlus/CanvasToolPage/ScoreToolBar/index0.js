import React from 'react';
import PropTypes from 'prop-types';
import { Button, Form, Input } from 'antd';

function ScoreToolBar({ canvas }) {
  const [form] = Form.useForm();

  const onFinish = (values) => {
    console.log('🚀 ~ values', values);
    const ActiveObjects = canvas.getActiveObjects();
    if (ActiveObjects.length === 0) {
      alert('Chưa chọn đối tượng!');
      return null;
    }
    ActiveObjects.forEach((item) => {
      Object.assign(item.data, values);
    });
    console.log(canvas.getObjects('rect'));
    return null;
  };

  return (
    <div>
      <p>ScoreToolBar</p>
      <Form form={form} onFinish={onFinish} layout="inline" size="small">
        <Form.Item label="Exercise name:" name="ExName">
          <Input />
        </Form.Item>
        <Form.Item label="Score:" name="ExScore">
          <Input />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            OK
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}

ScoreToolBar.propTypes = {
  canvas: PropTypes.object,
};

export default ScoreToolBar;
