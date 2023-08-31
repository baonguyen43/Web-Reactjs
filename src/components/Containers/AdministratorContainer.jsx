/* eslint-disable react/prop-types */
import withAuthenticator from 'HOCs/withAuthenticator';
import React from 'react';

const AdministratorContainer = ({ loggedInUser, children }) => {
  if (loggedInUser && loggedInUser.role === 'administrator') {
    return <React.Fragment>{children}</React.Fragment>;
  }
  return null;
};

AdministratorContainer.defaultProps = {
  loggedInUser: null,
  children: null,
};

export default withAuthenticator(AdministratorContainer);
