import * as actionTypes from '../actions/types';
const initialState = { 
  loading: false, 
  error: null, 
  loggedInUser: null, 
  loadingResetPass: false,

};

const LoginReducer = (state = initialState, { type, payload }) => {

  switch (type) {
    case actionTypes.POST_LOGIN_REQUEST:
      return { ...state, loading: true, loggedInUser: null, error: null };

    case actionTypes.POST_LOGIN_SUCCESS:
      return {
        ...state,
        loading: false,
        loggedInUser: payload,
        error: null
      };

    case actionTypes.POST_LOGIN_FAILURE:
      return {
        ...state,
        loading: false,
        loggedInUser: null,
        error: payload.error
      };

    case actionTypes.POST_LOGOUT:
      return {
        ...state,
        loading: false,
        error: null,
        loggedInUser: null
      };

    case actionTypes.POST_RESET_PASS_REQUEST: {
      return {
        ...state,
        loadingResetPass: true
      };
    }

    case actionTypes.POST_RESET_PASS_SUCCESS: {
      return {
        ...state,
        loadingResetPass: false,
        error: true,
      };
    }

    case actionTypes.POST_RESET_PASS_FAILURE: {
      return {
        ...state,
        loadingResetPass: false,
        error: false,
      };
    }


    default:
      return state;
  }
};
export default LoginReducer;
