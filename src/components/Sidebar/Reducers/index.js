import * as ActionTypes from '../actions/types'

const initialState = {
  isVisibled: true,
}

const toggleSidenavReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.TOGGLE_MENU_BAR: {
      return {
        isVisibled: !state.isVisibled
      }
    }
    default: return state;
  }
}
export default toggleSidenavReducer;