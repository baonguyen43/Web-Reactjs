import _ from 'lodash';
import React from 'react';
import { FolderOutlined } from '@ant-design/icons';

const Title = ({ text, color = '#32325d' }) => {
  return (
    <React.Fragment>
      <FolderOutlined style={{ color, fontSize: 16 }} className='tw-mr-1' />
      <span style={{ fontWeight: 400 }}>{` ${text}`}</span>
    </React.Fragment>
  );
};

export function buildTreeData(records) {
  const treeData = [];

  // Level 0
  const l0Records = records
  _.forEach(l0Records, (l0) => {
    const item0 = { key: l0.id, title: l0.folderName, color: 'blue', children: [] };
    treeData.push(item0);

    // Level 1
    const l1Records = l0.childrens
    _.forEach(l1Records, (l1) => {
      const item1 = { key: l1.id, title: l1.folderName, color: 'green', children: [] };
      item0.children.push(item1);

      // Level 2
      const l2Records = l1.courses
      _.forEach(l2Records, (l2) => {
        const item2 = { key: l2.id, title: l2.folderName, color: 'purple', children: [] };
        item1.children.push(item2);

        // Level 3
        const l3Records = l2.sessions
        _.forEach(l3Records, (l3) => {
          const item3 = { key: l3.id, title: l3.folderName, color: 'red', children: [], type: 'sessions' };
          item2.children.push(item3);
        });
      });
    });
  });

  return treeData;
}

export function buildSelectTreeData(records) {
  const treeData = [];

  // Level 0
  const l0Records = _.filter(records, (r) => r.parentId === null);
  _.forEach(l0Records, (l0) => {
    const item0 = { value: l0.id, title: <Title text={l0.folderName} color={l0.color} />, color: l0.color, children: [] };
    treeData.push(item0);

    // Level 1
    const l1Records = _.filter(records, (l1) => l1.parentId === l0.id);
    _.forEach(l1Records, (l1) => {
      const item1 = { value: l1.id, title: <Title text={l1.folderName} color={l1.color} />, color: l1.color, children: [] };
      item0.children.push(item1);

      // Level 2
      const l2Records = _.filter(records, (l2) => l2.parentId === l1.id);
      _.forEach(l2Records, (l2) => {
        const item2 = { value: l2.id, title: <Title text={l2.folderName} color={l2.color} />, color: l2.color, children: [] };
        item1.children.push(item2);

        // Level 3
        const l3Records = _.filter(records, (l3) => l3.parentId === l2.id);
        _.forEach(l3Records, (l3) => {
          const item3 = { value: l3.id, title: <Title text={l3.folderName} color={l3.color} />, color: l3.color, children: [], type: 'sessions' };
          item2.children.push(item3);
        });
      });
    });
  });

  return treeData;
}
