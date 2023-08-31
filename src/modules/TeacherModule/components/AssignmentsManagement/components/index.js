import React from 'react';
import Container from 'components/Containers/Container';
import Card from 'components/Containers/Card';
import Folders from '../../Folders';

const AssignmentsManagement = props => {
  return (
    <React.Fragment>
      <Container name='QUẢN LÝ BÀI TẬP'>
        <Card>
          <Folders />
        </Card>
      </Container>
    </React.Fragment>
  );
};

AssignmentsManagement.propTypes = {

};

export default AssignmentsManagement;
