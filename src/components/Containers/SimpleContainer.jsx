/* eslint-disable react/display-name */
/* eslint-disable react/prop-types */
import React from 'react';
import { Container } from 'reactstrap';

export default ({ children }) => {
  return (
    <React.Fragment>
      <Container className='mt--6' fluid>
        {children}
      </Container>
    </React.Fragment>
  );
};
