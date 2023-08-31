/* eslint-disable react/prop-types */
import React from 'react';
import { Dropdown, Menu, Button, Descriptions, message, Space, Tooltip, Popconfirm } from 'antd';
import { execute, queryFirst } from 'helpers/QueryHelper';
import { useQuery, useQueryClient } from 'react-query';
import colors from 'constants/colors';
import { CopyOutlined, DeleteOutlined, EditOutlined, MoreOutlined } from '@ant-design/icons';
import withTeacherAuthenticator from 'HOCs/withTeacherAuthenticator';
import Card from 'components/Containers/Card';
import jsonData from './jsonData';
// import withAuthenticator from 'HOCs/withAuthenticator';
// import Update from '../Update';

const sqlCommand = 'p_MYAMES_CLASSES_GetById';

const fetcher = (classId) => () => {
  return queryFirst(sqlCommand, { id: classId });
};

const ClassInfomationHeader = ({ loggedInUser, classId, showActions = true }) => {
  // HOOKS
  const queryClient = useQueryClient();

  const isTeacher = loggedInUser.role === 'teacher';

  const QUERY_KEY = [sqlCommand, classId];

  const [updateModalVisible, setUpdateModalVisible] = React.useState(false);

  const { data, isSuccess } = useQuery(QUERY_KEY, fetcher(classId));
  // const isSuccess = true;
  // const data = jsonData;

  const handleDelete = async () => {
    await execute('p_SACHSO_CLASSES_DeleteClass', { classCode: data.code, teacherId: loggedInUser.id });
    message.success({
      content: `Đã xóa lớp có mã: ${data.code}`,
      onClose: () => {
        window.history.go(-1);
      },
    });
  };

  const extra = (
    <React.Fragment>
      <Dropdown
        overlay={
          <Menu
            onClick={(info) => {
              switch (info.key) {
                case 'edit':
                  setUpdateModalVisible(true);
                  break;
                default:
                  break;
              }
            }}
          >
            <Menu.Item key="edit" icon={<EditOutlined />}>
              Sửa thông tin
            </Menu.Item>
            <Menu.Divider />
            <Popconfirm
              okText="Xác nhận"
              placement="topRight"
              title="Bạn có muốn xóa lớp học này không?"
              onConfirm={() => {
                handleDelete();
              }}
            >
              <Menu.Item danger key="delete" icon={<DeleteOutlined />}>
                Xóa lớp học
              </Menu.Item>
            </Popconfirm>
          </Menu>
        }
        trigger={['click']}
      >
        <Button icon={<MoreOutlined />} type="default" shape="circle" />
      </Dropdown>
    </React.Fragment>
  );
  if (!data) return null;
  return (
    <React.Fragment>
      {/* <Update
        classId={classId}
        visible={updateModalVisible}
        onOk={() => {
          setUpdateModalVisible(false);
          queryClient.invalidateQueries(QUERY_KEY);
        }}
        onCancel={() => {
          setUpdateModalVisible(false);
        }}
      /> */}

      <Card title="Thông tin lớp học" extra={isTeacher && showActions && extra}>
        {isSuccess && (
          <Descriptions
            labelStyle={{ fontWeight: 600, color: colors.font, width: '1%', whiteSpace: 'nowrap' }}
            layout="horizontal"
            bordered
            column={{ lg: 3, md: 2, sm: 1, xs: 1 }}
            size="small"
          >
            <Descriptions.Item label="Mã lớp học">
              <Space>
                {data.id}
                <Tooltip title="Nhấp chuột để sao chép mã lớp học">
                  <Button
                    type="dashed"
                    size="small"
                    shape="circle"
                    icon={<CopyOutlined />}
                    onClick={() => {
                      window.navigator.clipboard.writeText(data.id);
                      message.success({ content: 'Đã sao chép mã lớp học', duration: 1.5 });
                    }}
                  />
                </Tooltip>
              </Space>
            </Descriptions.Item>
            <Descriptions.Item label="Tên lớp học">{data.className}</Descriptions.Item>
            <Descriptions.Item label="Sĩ số">{`${data.numberOfStudent} (học sinh)`}</Descriptions.Item>
            <Descriptions.Item label="Giáo viên">{data.teacherName}</Descriptions.Item>
            <Descriptions.Item label="Điện thoại">{data.teacherPhone ?? ''}</Descriptions.Item>
            <Descriptions.Item label="Email">{data.teacherEmail ?? ''}</Descriptions.Item>
          </Descriptions>
        )}
      </Card>
    </React.Fragment>
  );
};
export default withTeacherAuthenticator(ClassInfomationHeader);
