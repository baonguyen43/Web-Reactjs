import * as actionTypes from '../actions/types';
const initialState = {
  data: [],
  loading: false,
  loadingActive: false,
  error: null,
  message: null
};

const registerReducer = (state = initialState, action) => {
  
  switch (action.type) {
    case actionTypes.FETCH_REGISTER_REQUEST: {
      return {
        ...state,
        data: [],
        loading: true
      };
    }

    case actionTypes.FETCH_REGISTER_SUCCESS: {
      return {
        ...state,
        data: action.payload,
        loading: false,
        error: null,
        message: 'fetch register successful'
      };
    }

    case actionTypes.FETCH_REGISTER_FAILURE: {
      return {
        ...state,
        data: [],
        loading: false,
        error: action.payload,
        message: 'fetch register errored'
      };
    }

    case actionTypes.FETCH_REGISTER_VIETTEL_REQUEST: {
      return {
        ...state,
        data: [],
        loading: true
      };
    }

    case actionTypes.FETCH_ACTIVE_CODE_REQUEST: {
      return {
        ...state,
        data: [],
        loadingActive: true
      };
    }

    case actionTypes.FETCH_ACTIVE_CODE_SUCCESS: {
      return {
        ...state,
        data: action.payload,
        loadingActive: false,
        error: null,
        message: 'fetch active successful'
      };
    }

    case actionTypes.FETCH_ACTIVE_CODE_FAILURE: {
      return {
        ...state,
        data: [],
        loadingActive: false,
        error: action.payload,
        message: 'fetch active errored'
      };
    }

    case actionTypes.FETCH_CONFRIM_CODE_REQUEST: {
      return {
        ...state,
        data: [],
        loadingActive: true
      };
    }

    case actionTypes.FETCH_CONFRIM_CODE_SUCCESS: {
      return {
        ...state,
        data: action.payload,
        loadingActive: false,
        error: null,
        message: 'fetch active successful'
      };
    }

    case actionTypes.FETCH_CONFRIM_CODE_FAILURE: {
      return {
        ...state,
        data: [],
        loadingActive: false,
        error: action.payload,
        message: 'fetch active errored'
      };
    }
    default:
      return state;
  }
};

export default registerReducer;
