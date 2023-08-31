/* eslint-disable react/display-name */
/* eslint-disable react/prop-types */
import React from 'react';
import { Container } from 'reactstrap';
import SimpleHeader from 'components/Headers/SimpleHeader';

export default ({ name, parentName = 'LMS', children }) => {
  return (
    <React.Fragment>
      <SimpleHeader name={name} parentName={parentName} />
      <Container className='mt--6' fluid>
        {children}
      </Container>
    </React.Fragment>
  );
};
