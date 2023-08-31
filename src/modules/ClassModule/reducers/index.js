import * as actionTypes from '../actions/types';
const initialState = {
  data: [],
  loading: true,
  error: null,
  message: null,
  selectedClass: null,
  isDoingLatestAssignments: false,
};

const classReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.FETCH_CLASS_REQUEST: {
      return {
        ...state,
        data: [],
        loading: true,
      };
    }

    case actionTypes.FETCH_CLASS_SUCCESS: {
      return {
        ...state,
        data: action.payload,
        loading: false,
        error: null,
        message: 'fetch class successful',
      };
    }

    case actionTypes.FETCH_CLASS_FAILURE: {
      return {
        ...state,
        data: [],
        loading: false,
        error: action.payload,
        message: 'fetch class errored',
      };
    }

    case actionTypes.SAVE_SELECTED_CLASS: {
      return {
        ...state,
        selectedClass: action.selectedClass,
      };
    }

    case actionTypes.TOGGLE_DOING_LATEST_ASSIGNMENTS: {
      const result = {
        ...state,
        isDoingLatestAssignments: !state.isDoingLatestAssignments,
      };
      return result;
    }

    default:
      return state;
  }
};
export default classReducer;
