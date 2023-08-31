import * as actionTypes from '../actions/types';
const initialState = { loading: true, error: null, results: null };

const resultReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case actionTypes.GET_RESULT_REQUEST:
      return { ...state, loading: true, results: null, error: null };

    case actionTypes.GET_RESULT_SUCCESS:
      return {
        ...state,
        loading: false,
        results: payload,
        error: null
      };

    case actionTypes.GET_RESULT_FAILURE:
      return {
        ...state,
        loading: false,
        results: null,
        error: payload
      };

    default:
      return state;
  }
};
export default resultReducer
