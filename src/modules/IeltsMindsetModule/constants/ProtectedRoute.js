import React from "react";
import { useSelector } from "react-redux";
import { Route, Redirect } from "react-router-dom";
import { routePaths } from "./routes";


export const ProtectedRoute = ({
  component: Component,
  ...rest
}) => {
  const isAuth = useSelector((reduxState) => reduxState.myReducer.isAuth);

  const { pathname } = rest.location;

  // Force to navigate to Login
  if (!isAuth && pathname !== routePaths.Login) {
    return <Redirect to={routePaths.Login} />
  };

  // Force to navigate to Dashboard
  if (isAuth && !pathname.includes(routePaths.Dashboard)) {
    return <Redirect to={routePaths.Dashboard} />;
  }

  return <Route {...rest} component={Component} />;
};