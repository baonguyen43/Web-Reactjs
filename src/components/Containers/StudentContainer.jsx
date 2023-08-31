/* eslint-disable react/prop-types */
import withAuthenticator from 'HOCs/withAuthenticator';
import React from 'react';

const StudentContainer = ({ loggedInUser, children }) => {
  if (loggedInUser && loggedInUser.role === 'student') {
    return <React.Fragment>{children}</React.Fragment>;
  }
  return null;
};

StudentContainer.defaultProps = {
  loggedInUser: null,
  children: null,
};

export default withAuthenticator(StudentContainer);
