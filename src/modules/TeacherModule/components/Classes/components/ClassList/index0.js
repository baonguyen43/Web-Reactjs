import React from 'react';
import PropTypes from 'prop-types';
import { Space, Card } from 'antd';
import data from './data';
import styles from './create-class.module.css';
import withTeacherAuthenticator from 'HOCs/withTeacherAuthenticator';

const ClassList = (props) => {
  return (
    <Space style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
      {data.map((item) => {
        const grade = item.className.split(' ');
        return (
          <Card
            key={item.id}
            style={{
              border: '2px solid',
              backgroundColor: '#036',
              borderRadius: 8,
              color: 'white',
              marginBottom: 10,
            }}
            className={styles.cardHover}
            // onClick={() => onMoveToSubjects(item)}
          >
            <div
              style={{
                width: 252,
                height: 152,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                fontSize: 32,
              }}
            >
              <span>{grade[0]}</span>
              <span
                style={{
                  fontSize: 72,
                  transform: 'skewX(-10deg)',
                  marginLeft: 20,
                }}
              >
                {grade[1]}
              </span>
            </div>
          </Card>
        );
      })}
    </Space>
  );
};

ClassList.propTypes = {};

export default withTeacherAuthenticator(ClassList);
