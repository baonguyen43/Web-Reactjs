import * as actionTypes from '../actions/types';

const initialSessions = {
  loading: true,
  data: [],
  groupPart: [],
  selectedPart: [],
  selectedSession: [],
  checkTypeNext: false,
};

const sessionReducer = (state = initialSessions, action) => {
 
  switch (action.type) {
    case actionTypes.FETCH_SESSION_REQUEST:
      return { ...state, loading: true, error: false };

    case actionTypes.FETCH_SESSION_SUCCESS: {
      if (action.payload.length === 0) {
        return { ...state, data: [], error: false, loading: false };
      } else {
        if (action.apptype === 'MYAMES') {
          let sessionList = action.payload;
          sessionList.forEach((_, index) => {
            let splitTitle = sessionList[index].title.split('-');
            let course = splitTitle[0].substring(0, 3);
            let unit = parseInt(splitTitle[1]);
            sessionList[index].course = course;
            sessionList[index].unit = unit;
          });

          action.payload.results = sessionList;
          return {
            ...state,
            data: action.payload,
            error: false,
            loading: false,
            checkTypeNext:action.checkTypeNext,
          };
        } else {
          return {
            ...state,
            data: action.payload,
            error: false,
            loading: false,
            checkTypeNext: action.checkTypeNext,
            isMix4: action.isMix4,
          };
        }
      }
    }
    case actionTypes.FETCH_SESSION_FAILURE:
      return { ...state, loading: false, error: true, message: action.payload };

    case actionTypes.SAVE_SELECTED_SESSION:
     
      return {
        ...state,
        selectedSession: action.selectedSession,
      };

    case actionTypes.SAVE_SELECTED_PART:
      return {
        ...state,
        selectedPart: action.selectedPart,
        groupPart: action.groupPart,
        partQuestion: action.partQuestion,
      };

    default:
      return state;
  }
};
export default sessionReducer;
