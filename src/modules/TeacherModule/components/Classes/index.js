import React from 'react';
import PropTypes from 'prop-types';
import Container from 'components/Containers/Container';
import Card from 'components/Containers/Card';
import ClassList from './components/ClassList';
import StudentList from './components/StudentList';

const Classes = (props) => {
  return (
    <React.Fragment>
      <Container name="QUẢN LÝ LỚP HỌC">
        <Card>
          <ClassList />
        </Card>
      </Container>
    </React.Fragment>
  );
};

Classes.propTypes = {};

export default Classes;
