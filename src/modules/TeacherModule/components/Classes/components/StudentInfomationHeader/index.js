import { Card, Descriptions } from 'antd';
import colors from 'constants/colors';
import PropTypes from 'prop-types';
import React from 'react';

function StudentInfomationHeader({ fullName, email, phone, address, divitions, sex }) {
  return (
    <>
      <Card title="Thông tin học sinh" style={{ marginBottom: 30 }}>
        {
          <Descriptions
            labelStyle={{ fontWeight: 600, color: colors.font, width: '1%', whiteSpace: 'nowrap' }}
            layout="horizontal"
            bordered
            column={{ lg: 3, md: 2, sm: 1, xs: 1 }}
            size="small"
          >
            <Descriptions.Item label="Tên học sinh">{fullName}</Descriptions.Item>
            <Descriptions.Item label="Giới tính">{sex}</Descriptions.Item>
            <Descriptions.Item label="Email">{email}</Descriptions.Item>
            <Descriptions.Item label="Điện Thoại">{phone}</Descriptions.Item>
            <Descriptions.Item label="Chi nhánh">{divitions}</Descriptions.Item>
            <Descriptions.Item label="Địa chỉ">{address}</Descriptions.Item>
          </Descriptions>
        }
      </Card>
    </>
  );
}

StudentInfomationHeader.propTypes = {
  fullName: PropTypes.string,
  email: PropTypes.string,
  phone: PropTypes.string,
  address: PropTypes.string,
  divitions: PropTypes.string,
  sex: PropTypes.string,
};

export default StudentInfomationHeader;
