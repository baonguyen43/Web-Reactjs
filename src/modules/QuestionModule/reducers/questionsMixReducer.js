import * as actionTypes from "../actions/types";

const initialState = {
  loading: false,
  data: [],
  error: false
};

const questionsMixReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    
    case actionTypes.FETCH_QUESTIONS_MIX_REQUEST:
      return { ...state, error: false, loading: true };

    case actionTypes.FETCH_QUESTIONS_MIX_SUCCESS:
      return { ...state, error: false, loading: false, data: payload };

    case actionTypes.FETCH_QUESTIONS_MIX_FAILURE:
    
      return { ...state, error: true, loading: false, data: [] };

    default:
      return state;
  }
};
export default questionsMixReducer;
