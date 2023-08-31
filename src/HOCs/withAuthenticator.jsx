/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable react/jsx-props-no-spreading */
import { useSelector } from 'react-redux';
import React from 'react';

export default function withAuthenticator(WrappedComponent) {
  const ComponentWithAuthenticator = (props) => {
    const loggedInUser = useSelector((state) => state.loginReducer.loggedInUser);

    return <WrappedComponent loggedInUser={loggedInUser} {...props} />;
  };

  return ComponentWithAuthenticator;
}
