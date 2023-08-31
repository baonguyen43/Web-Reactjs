import * as actionTypes from '../actions/types';

const initialState = {
  loading: false,
  data: [],
  error: false,
};

const assignmentsMix4Reducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case actionTypes.FETCH_ASSIGNMENTS_MIX4_REQUEST:
      return { ...state, error: false, loading: true };

    case actionTypes.FETCH_ASSIGNMENTS_MIX4_SUCCESS:
      return { ...state, error: false, loading: false, data: payload };

    case actionTypes.FETCH_ASSIGNMENTS_MIX4_FAILURE:
      return { ...state, error: true, loading: false, data: [] };

    default:
      return state;
  }
};
export default assignmentsMix4Reducer;
