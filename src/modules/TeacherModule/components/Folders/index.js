/* eslint-disable react/display-name */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useRef, useState } from 'react';
import { useQuery } from 'react-query';
import { Button, Space, Popconfirm, Row, Col, Tooltip, Modal, Popover, Input, Checkbox } from 'antd';
import {
  CaretDownOutlined,
  CaretUpOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  CheckOutlined,
  CopyOutlined,
} from '@ant-design/icons';
import { query, remove } from 'helpers/QueryHelper';
import withTeacherAuthenticator from 'HOCs/withTeacherAuthenticator';
import DynamicTable from 'packages/DynamicForm/components/DynamicTable';
import colors from 'constants/colors';
import CanvasToolPage from 'components/CanvasToolPlus/CanvasToolPage';
import notificationWithIcon from 'components/Notification/notificationWithIcon';
import ExcercisePage from 'components/CanvasToolPlus/ExcercisePage';
import Footer, { footerKey } from 'components/CanvasToolPlus/ExcercisePage/Footer';
import tableData from './tableData';
import FolderTreeView from './components/FolderTreeView';
import UploadFiles from './components/UploadFiles';
import Axios from 'axios';
import { useHistory } from 'react-router';
import CopyModal from './components/CopyModal';

const fetcher = (folderId) => () => {
  if (!folderId) return [];
  return query('dbo.p_MYAMES_SHARE_Attachments', { SessionId: folderId });
};

const Folders = ({ classId, loggedInUser }) => {
  const history = useHistory();
  const [refresh, setRefresh] = React.useState(new Date());
  const [selectedFolderId, setSelectedFolderId] = React.useState(null);
  const [expandedRowKeys, setExpandedRowKeys] = React.useState([]);
  const [worksheetFile, setWorksheetFile] = React.useState(null);
  const [visibleCopyModal, setVisibleCopyModal] = React.useState(false);
  const [copyId, setCopyId] = React.useState(''); //Id của Liveworksheet cần copy

  const key = ['t_MYAMES_SHARE_Attachments', selectedFolderId, refresh];
  const { data, isLoading } = useQuery(key, fetcher(selectedFolderId));

  const [modalVisible, setModalVisible] = React.useState(false);

  const [fileType, setFileType] = React.useState('worksheet');

  // GIÁO VIÊN xem trước bài tập sẽ giao.
  const [previewExercise, setPreviewExercise] = useState(false);
  const [file, setFile] = React.useState(null);
  // Dùng trong Preview Exercise Modal.
  const refSubmit = useRef({});

  const [userRole, setUserRole] = React.useState({
    IsAdd: false,
    IsApproved: false,
    IsDelete: false,
    IsEdit: false,
    IsView: false,
    IsAdmin: false,
  });

  const [footerMode, setFooterMode] = useState('');
  //
  const [idCurrent, setidCurrent] = useState('');
  //
  const openEditor = React.useCallback((id, delay = 0) => {
    setTimeout(() => {
      setidCurrent(id);
      setFileType('worksheet');
      setFooterMode(id ? footerKey.EDIT : footerKey.CREATE); // id==='' => CREATE
      setModalVisible(true);
    }, delay);
  }, []);

  const { permissions, userId } = loggedInUser;

  const { IsAdd, IsApproved, IsDelete, IsEdit, IsView, IsAdmin } = userRole;
  // const isAdd = false;
  // const IsApproved = false;
  // const IsEdit = false;
  // const IsAdmin = true;

  const permission = (role, createdBy, IsAdmin) => {
    if (IsAdmin) return true;
    if (createdBy === userId) return true;
    return role;
  };

  const onChange = React.useCallback(
    async (id, status) => {
      const parameters = {
        id, // chính là attachmentId
        status: status ? 0 : 1,
        userId,
        sessionId: selectedFolderId, // chính là folderId
        assignmentId: 'CD14B8FA-4F63-4290-8EA6-3ED5C85B3562', // id live worksheet
      };
      setRefresh(new Date());
      query('p_MYAMES_SHARE_Attachments_Approved_V2', parameters);
    },
    [selectedFolderId, userId]
  );

  const extraColumns = React.useMemo(() => {
    return [
      {
        key: 'status',
        title: 'Đã duyệt',
        width: '1%',
        sort: false,
        render: (text, record, index) => {
          return (
            <div style={{ minWidth: '60px', textAlign: 'center' }}>
              {IsAdmin ? (
                IsApproved ? (
                  <Checkbox defaultChecked={text} onChange={() => onChange(record.id, text)} />
                ) : (
                  text && <CheckOutlined style={{ color: 'green', fontSize: 20 }} />
                )
              ) : (
                text && <CheckOutlined style={{ color: 'green', fontSize: 20 }} />
              )}
            </div>
          );
        },
      },
    ];
  }, [IsAdmin, IsApproved, onChange]);

  React.useEffect(() => {
    if (permissions) {
      const pathname = window.location.pathname;
      const permissionsArray = JSON.parse(permissions);
      const page = permissionsArray.find((x) => x.PageLink === pathname);
      if (page) {
        const { IsAdd, IsApproved, IsDelete, IsEdit, IsView, IsAdmin } = page;
        setUserRole({ IsAdd, IsApproved, IsDelete, IsEdit, IsView, IsAdmin });
      }
    }
  }, [permissions]);
  return (
    <div>
      <Row gutter={[12, 0]}>
        <Col span={24} lg={8}>
          <div
            style={{ border: 'dashed 1px', borderColor: colors.border, padding: 12, minHeight: 400 }}
            className="rounded"
          >
            <FolderTreeView
              classId={classId}
              onSelect={(folder) => {
                if (folder) {
                  setSelectedFolderId(folder.id);
                } else {
                  setSelectedFolderId(undefined);
                }
              }}
            />
          </div>
        </Col>
        <Col span={24} lg={16}>
          <div
            style={{ border: 'dashed 1px', borderColor: colors.border, padding: 12, minHeight: 400 }}
            className="rounded"
          >
            <div>
              {selectedFolderId && (
                <Row gutter={[16, 16]}>
                  {/* <Col>
                    <UploadFiles
                      folderId={selectedFolderId}
                      onSuccess={() => {
                        setRefresh(new Date());
                      }}
                    />
                  </Col> */}
                  {permission(IsAdd, userId, IsAdmin) && (
                    <Col>
                      <Button
                        type="primary"
                        onClick={() => {
                          openEditor('');
                        }}
                      >
                        Tạo bài tập chấm tự động
                      </Button>
                    </Col>
                  )}
                </Row>
              )}
            </div>
            <DynamicTable
              loading={isLoading}
              dataSource={data}
              initialTableData={tableData}
              extraColumns={extraColumns}
              expandable={{
                expandIconColumnIndex: 999,
                expandedRowKeys,
                columnWidth: '1%',
                expandIcon: ({ expanded, onExpand, record }) =>
                  expanded ? (
                    <CaretUpOutlined onClick={(e) => onExpand(record, e)} />
                  ) : (
                    <CaretDownOutlined onClick={(e) => onExpand(record, e)} />
                  ),
                expandRowByClick: true,
                onExpand: (expanded, record) => {
                  const keys = [];
                  if (expanded) {
                    keys.push(record.id);
                  }
                  setExpandedRowKeys(keys);
                },

                expandedRowRender: ({ id, fileName, fileUrl, tags, jsonData, createdBy }) => (
                  <div style={{}} className="d-flex">
                    <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-start' }}>
                      {IsView && (
                        <div className="ml-2">
                          <Tooltip title="Xem trước bài tập" placement="bottom">
                            <Button
                              key="download-file"
                              type="primary"
                              icon={<EyeOutlined />}
                              onClick={() => {
                                if (tags === 'LIVEWORKSHEET') {
                                  setPreviewExercise(true);
                                  setFile({ id, fileName, jsonData });
                                } else {
                                  notificationWithIcon('warning', 'Thông báo', 'Tập tin này không thể xem trước !');
                                }
                              }}
                            >
                              Xem trước
                            </Button>
                          </Tooltip>
                        </div>
                      )}
                      {permission(IsEdit, createdBy, IsAdmin) && (
                        <div className="ml-2">
                          <UpdateTitle entityId={id} setRefresh={setRefresh} userId={loggedInUser.userId} />
                        </div>
                      )}
                    </div>

                    <div>
                      <div style={{ flex: 0, display: 'flex', justifyContent: 'flex-end' }}>
                        <Space>
                          {permission(IsEdit, createdBy, IsAdmin) && (
                            <Tooltip title="Sao chép" placement="bottom">
                              <Button
                                key="move-file"
                                shape="circle"
                                type="dashed"
                                icon={<CopyOutlined />}
                                onClick={() => {
                                  setVisibleCopyModal(true);
                                  setCopyId(id);
                                }}
                              />
                            </Tooltip>
                          )}
                          {permission(IsEdit, createdBy, IsAdmin) && (
                            <Tooltip title="Chỉnh sửa" placement="bottom">
                              <Button
                                key="move-file"
                                shape="circle"
                                type="dashed"
                                icon={<EditOutlined />}
                                onClick={() => {
                                  if (tags === 'LIVEWORKSHEET') {
                                    setWorksheetFile({ id, imgURL: `https://cloud.softech.vn${fileUrl}`, jsonData });
                                    setFile({ id, fileName, jsonData }); // Hỗ trợ chức năng xem trước của phần chỉnh sửa.
                                    //
                                    openEditor(id);
                                  } else {
                                    // TODO: Move file to another folder
                                    // eslint-disable-next-line no-alert
                                    notificationWithIcon('warning', 'Thông báo', 'Tập tin này không thể chỉnh sửa !');
                                  }
                                }}
                              />
                            </Tooltip>
                          )}
                          {permission(IsDelete, createdBy, IsAdmin) && (
                            <Popconfirm
                              title="Bạn có muốn xóa tập tin này không?"
                              onConfirm={async () => {
                                // DELETE
                                await remove('Attachments', id, 'SHARE');
                                // DELETE FILENAME IN FOLDERS
                                // await deleteFile('Folders', selectedFolderId, fileName, 'CLASSES', 'SACHSO');
                                setRefresh(new Date());
                              }}
                              okText="Xác nhận"
                              cancelText="Không"
                            >
                              <Tooltip title="Xóa tập tin" placement="bottom">
                                <Button
                                  key="delete-file"
                                  shape="circle"
                                  type="dashed"
                                  icon={<DeleteOutlined />}
                                  danger
                                />
                              </Tooltip>
                            </Popconfirm>
                          )}
                        </Space>
                      </div>
                    </div>
                  </div>
                ),
              }}
            />
          </div>
        </Col>
      </Row>
      <CopyModal visible={visibleCopyModal} setVisible={setVisibleCopyModal} copyId={copyId} />

      {modalVisible && (
        <Modal
          width="95%"
          style={{ marginTop: 24 }}
          bodyStyle={{ padding: '10px 24px' }}
          centered
          visible={modalVisible}
          title="LIVE WORKSHEET"
          onCancel={() => {
            setModalVisible(false);
            setRefresh(new Date());
            setWorksheetFile(null);
          }}
          footer={
            <Footer
              onSubmit={() => refSubmit.current.submit()}
              tryAgain={() => refSubmit.current.tryAgain()}
              footerMode={footerMode}
              setFooterMode={setFooterMode}
            />
          }
        >
          <div style={{ height: '80vh' }}>
            {(() => {
              switch (true) {
                case fileType !== 'worksheet': {
                  return null;
                }
                case footerMode === footerKey.CREATE: {
                  return (
                    <CanvasToolPage
                      idCurrent=""
                      entityId={selectedFolderId}
                      worksheetFile={null}
                      teacherId={loggedInUser.userId}
                      onUpdateImage={(id) => openEditor(id, 1000)}
                    />
                  );
                }
                case footerMode === footerKey.EDIT: {
                  return (
                    <CanvasToolPage
                      idCurrent={idCurrent}
                      entityId={selectedFolderId}
                      worksheetFile={null}
                      teacherId={loggedInUser.userId}
                      onUpdateImage={(id) => openEditor(id, 1000)}
                    />
                  );
                }
                case footerMode === footerKey.PREVIEW: {
                  return <ExcercisePage file={null} refSubmit={refSubmit} idCurrent={idCurrent} isTeacher />;
                }
                default:
                  break;
              }
            })()}
          </div>
        </Modal>
      )}

      {previewExercise && (
        <Modal
          width="95%"
          style={{ marginTop: 24 }}
          centered
          visible={previewExercise}
          className="workshetModal"
          title="BÀI TẬP LIVE WORKSHEET"
          onCancel={() => {
            setPreviewExercise(false);
          }}
          // footer={loggedInUser.userId && !refSubmit.current.isCompleted ? <Footer onSubmit={() => refSubmit.current.submit()} tryAgain={() => refSubmit.current.tryAgain()} text='Kiểm tra' /> : null}
          footer={
            <Footer
              onSubmit={() => refSubmit.current.submit()}
              tryAgain={() => refSubmit.current.tryAgain()}
              footerMode={footerKey.VIEW}
              setFooterMode={setFooterMode}
            />
          }
        >
          <div style={{ height: 'calc(80vh - 44px)' }}>
            {previewExercise && (
              <ExcercisePage
                file={file}
                studentId={loggedInUser.id}
                isCompleted={false}
                isTeacher
                refSubmit={refSubmit}
              />
            )}
          </div>
        </Modal>
      )}
    </div>
  );
};

export default withTeacherAuthenticator(Folders);
//
const instance = Axios.create({
  baseURL: 'https://server.sachso.edu.vn/api/v1.0/',
  headers: {
    'Content-Type': 'application/json',
    Authorization: 'Basic 12C1F7EF9AC8E288FBC2177B7F54D',
    ApplicationName: 'SmartEducation',
  },
});
//
const UpdateTitle = ({ entityId, setRefresh, userId }) => {
  const [title, setTitle] = useState();
  //
  const handleSubmit = async () => {
    const parameters = {
      sqlCommand: '[dbo].[p_MYAMES_SHARE_Attachments_UpdateTitle]',
      parameters: {
        AttachmentId: entityId,
        title,
        userId,
      },
    };
    await instance.post('/dynamic/execute', parameters);
    setRefresh(new Date());
  };

  return (
    <Popover
      content={
        <div>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} />
          <div className="d-flex justify-content-end mt-1">
            <Button size="small" type="primary" onClick={handleSubmit}>
              Cập nhật
            </Button>
          </div>
        </div>
      }
      title="Cập nhật tiêu đề "
      trigger="click"
    >
      <Button icon={<EditOutlined />}>Chỉnh sửa tên file</Button>
    </Popover>
  );
};
