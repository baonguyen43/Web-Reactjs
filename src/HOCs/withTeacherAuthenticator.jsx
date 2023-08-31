/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable react/jsx-props-no-spreading */
import { useSelector } from 'react-redux';
import React from 'react';

export default function withTeacherAuthenticator(WrappedComponent) {
  const ComponentWithTeacherAuthenticator = (props) => {
    const loggedInUser = useSelector(
      (state) => state.teacherReducer.loggedInUser.userTeacher
    );

    return <WrappedComponent loggedInUser={loggedInUser} {...props} />;
  };

  return ComponentWithTeacherAuthenticator;
}
