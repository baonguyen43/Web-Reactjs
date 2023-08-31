import * as actionTypes from '../actions/types';

const initialAssignments = {
  loading: true,
  data: [],
  error: false,
  message: null,
};

const assignmentReducer = (state = initialAssignments, action) => {
  switch (action.type) {
    case actionTypes.FETCH_ASSIGNMENT_REQUEST:
      return { ...state, error: false, data: [], loading: true };

    case actionTypes.FETCH_ASSIGNMENT_SUCCESS:
      return { ...state, error: false, data: action.payload, loading: false };

    case actionTypes.FETCH_ASSIGNMENT_FAILURE:
      return { ...state, error: true, loading: false };

    default:
      return state;
  }
};

export default assignmentReducer;
