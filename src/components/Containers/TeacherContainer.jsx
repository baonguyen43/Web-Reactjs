/* eslint-disable react/prop-types */
import withAuthenticator from 'HOCs/withAuthenticator';
import React from 'react';

const TeacherContainer = ({ loggedInUser, children }) => {
  if (loggedInUser && loggedInUser.role === 'teacher') {
    return <React.Fragment>{children}</React.Fragment>;
  }
  return null;
};

TeacherContainer.defaultProps = {
  loggedInUser: null,
  children: null,
};

export default withAuthenticator(TeacherContainer);
