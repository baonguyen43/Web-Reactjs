import React from 'react';
import { Spin } from 'antd';

export default function Loading() {
  return (
    <>
      <div
        style={{
          width: '100%',
          height: '75vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Spin size="large" />
      </div>
    </>
  );
}
