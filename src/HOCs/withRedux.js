/* eslint-disable react/jsx-props-no-spreading */
import { useDispatch, useSelector } from 'react-redux';

export default (WrappedComponent) => {
  return (props) => {
    const dispatch = useDispatch();
    const rootState = useSelector((state) => state);
    return <WrappedComponent dispatch={dispatch} rootState={rootState} {...props} />;
  };
};
