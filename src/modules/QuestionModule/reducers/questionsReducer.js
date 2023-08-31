import * as actionTypes from '../actions/types';

const initialState = {
  loading: false,
  data: undefined,
  status: undefined,
  message: undefined,
  error: false
};

const questionReducer =  (state = initialState, { type, payload }) => {
 
  switch (type) {
    case actionTypes.FETCH_QUESTIONS_REQUEST:
      return { ...state, error: false, loading: true };

    case actionTypes.FETCH_QUESTIONS_SUCCESS:
  
      return { ...state, error: false, loading: false, data: payload };

    case actionTypes.FETCH_QUESTIONS_FAILURE:
      return { ...state, error: true, loading: false, data: payload };

    // case actionTypes.FETCH_QUESTIONS_TYPE35_REQUEST:
    //   return { ...state, error: false, loading: true };

    // case actionTypes.FETCH_QUESTIONS_TYPE35_SUCCESS:
    //   const data = { ...payload, questions: payload.items }
    //   return { ...state, error: false, loading: false, data };

    // case actionTypes.FETCH_QUESTIONS_TYPE35_FAILURE:
    //   alert('error load data');  return { ...state, error: true, loading: false, data: payload };

    default:
      return state;
  }
};
export default questionReducer;
