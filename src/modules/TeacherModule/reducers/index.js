import * as actionTypes from '../actions/types';

const initialState = {
  loading: false,
  error: null,
  loggedInUser: null,
};

export default function TeacherReducer(
  state = initialState,
  { type, payload }
) {
  switch (type) {
    case actionTypes.POST_TEACHER_LOGIN_REQUEST:
      return { ...state, loading: true, loggedInUser: null, error: null };
    case actionTypes.POST_TEACHER_LOGIN_SUCCESS:
      return {
        ...state,
        loading: false,
        loggedInUser: payload,
        error: null,
      };
    case actionTypes.POST_TEACHER_LOGIN_FAILURE:
      return {
        ...state,
        loading: false,
        loggedInUser: null,
        error: payload.error,
      };
    case actionTypes.POST_LOGOUT:
      return {
        ...state,
        loading: false,
        error: null,
        loggedInUser: null,
      };

    default:
      // throw new Error('Invalid Action');
      return state;
  }
}
