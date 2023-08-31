import * as actionTypes from '../actions/types';

const initialVOA = {
  loading: false,
  loadingVOAList: false,
  data: [],
  dataVOAList: [],
  error: false,
  message: null,
};

const VOAReducer = (state = initialVOA, action) => {
  switch (action.type) {
    case actionTypes.FETCH_VOA_LIST:
      return { ...state, loading: true };

    case actionTypes.FETCH_VOA_LIST_SUCCESS:
      return { ...state, error: false, data: action.payload, loading: false };

    case actionTypes.FETCH_VOA_LIST_FAILURE:
      return {
        ...state,
        error: true,
        data: [],
        message: action.payload,
        loading: false,
      };

    case actionTypes.FETCH_VOA_DETAIL:
      return { ...state, loadingVOAList: true };
      
    case actionTypes.FETCH_VOA_DETAIL_SUCCESS:
      return {
        ...state,
        error: false,
        dataVOAList: action.payload,
        loadingVOAList: false,
      };

    case actionTypes.FETCH_VOA_DETAIL_FAILURE:
      return { ...state, error: true, dataVOAList: [], loadingVOAList: false };

    default:
      return state;
  }
};
export default VOAReducer;
