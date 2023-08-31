import * as actionTypes from '../actions/types'

const initialState = {
  data: undefined,
  loading: true,
  error: false,
  message: null,
}

const ieltsMindsetReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.FETCH_SCORE_REQUEST:
      return { ...state, loading: true, error: false, }
    case actionTypes.FETCH_SCORE_SUCCESS:
      return { ...state, data: action.payload, loading: false, error: false, message: 'fetch ielts mindset score successful', }
    case actionTypes.FETCH_SCORE_FAILURE:
      return { ...state, data: action.payload, loading: false, error: true, message: 'fetch ielts mindset score failure', }
    default:
      return state
  }
}

export default ieltsMindsetReducer
