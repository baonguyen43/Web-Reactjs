/* eslint-disable react/prop-types */
import _ from 'lodash';
import React from 'react';
import { useQuery } from 'react-query';
import { Tree, Skeleton } from 'antd';
import { FolderOutlined, FolderOpenFilled } from '@ant-design/icons';

import withTeacherAuthenticator from 'HOCs/withTeacherAuthenticator';
import { query } from 'helpers/QueryHelper';
import { buildTreeData, buildSelectTreeData } from 'utils';

import UpdateFolder from './components/UpdateFolder';

const fetcher = (loggedInUser) => () => {
  return query('p_MYAMES_SHARE_Folders');
};

const FolderTreeView = ({ loggedInUser, onSelect }) => {
  const [refresh, setRefresh] = React.useState(new Date());
  const [updateModalVisible, setUpdateModalVisible] = React.useState(false);
  const [selectedFolder, setSelectedFolder] = React.useState(null);

  const [updateMode, setUpdateMode] = React.useState('');

  const key = ['p_MYAMES_SHARE_Folders'];
  // QUERY
  const { data, isLoading } = useQuery(key, fetcher(loggedInUser));
  const [treeData, setTreeData] = React.useState([])
  const [selectTreeData, setSelectTreeData] = React.useState([])

  React.useEffect(() => {
    if (data) {
      const records = data[0]?.dataJson;
      setSelectTreeData(buildSelectTreeData(records));
      setTreeData(buildTreeData(records))
    }
  }, [data])

  return (
    <React.Fragment>
      <Skeleton active loading={isLoading}>
        <div>
          <UpdateFolder
            updateMode={updateMode}
            treeData={selectTreeData}
            data={{ createdBy: loggedInUser.id, ...selectedFolder }}
            visible={updateModalVisible}
            onOk={() => {
              setRefresh(new Date());
              setUpdateModalVisible(false);
            }}
            onCancel={() => {
              setUpdateModalVisible(false);
            }}
            loggedInUser={undefined}
          />

          {/* <Space size='small' wrap="true">
            <Tooltip title='Tạo thư mục' placement='bottom'>
              <Button
                shape='circle'
                type='dashed'
                icon={<PlusOutlined />}
                onClick={() => {
                  setUpdateMode('add');
                  setUpdateModalVisible(true);
                }}
              />
            </Tooltip>
            {selectedFolder && (
              <React.Fragment>
                <Tooltip title='Sửa thư mục' placement='bottom'>
                  <Button
                    shape='circle'
                    type='dashed'
                    icon={<EditOutlined />}
                    style={{ alignSelf: 'flex-end' }}
                    onClick={() => {
                      setUpdateMode('edit');
                      setUpdateModalVisible(true);
                    }}
                  />
                </Tooltip>

                <Popconfirm
                  title='Bạn có muốn xóa thư mục này không?'
                  onConfirm={async () => {
                    await remove('Folders', selectedFolder.id, 'CLASSES');
                    setRefresh(new Date());
                  }}
                  okText='Xác nhận'
                  cancelText='Không'
                >
                  <Tooltip title='Xóa thư mục' placement='bottom'>
                    <Button shape='circle' type='dashed' danger icon={<DeleteOutlined />} style={{ alignSelf: 'flex-end' }} />
                  </Tooltip>
                </Popconfirm>
              </React.Fragment>
            )}
          </Space> */}
          {/* <Divider style={{ marginBottom: 12 }} /> */}
        </div>
        <Tree.DirectoryTree
          icon={(props) => {
            return (
              <React.Fragment>
                {props.selected ? <FolderOpenFilled className='tw-mr-1' style={{ color: props.data.color, fontSize: 16 }} /> : <FolderOutlined className='tw-mr-1' style={{ color: props.data.color, fontSize: 16 }} />}
              </React.Fragment>
            );
          }}
          multiple={false}
          // defaultExpandAll
          onSelect={(selectedKeys, info) => {
            if (info.selected && info.node.type === 'sessions') {
              const folder = { ...info.node, id: info.node.key }
              setSelectedFolder(folder);
              onSelect(folder);
            } else {
              setSelectedFolder(null);
              onSelect(null);
            }
          }}
          treeData={treeData}
        />
      </Skeleton>
    </React.Fragment>
  );
};

FolderTreeView.defaultProps = {
  loggedInUser: null,
};

export default withTeacherAuthenticator(FolderTreeView);
