import { combineReducers } from 'redux';
import loginReducer from './modules/LoginAmes_AiModule/reducers';
import classReducer from './modules/ClassModule/reducers';
import sessionReducer from './modules/SessionModule/reducers';
import assignmentReducer from './modules/AssignmentModule/reducers';
import questionReducer from './modules/QuestionModule/reducers/questionsReducer';
import questionMixReducer from './modules/QuestionModule/reducers/questionsMixReducer';
import assignmentMix4Reducer from './modules/AssignmentModule/reducers/assignmentsMix4Reducer';
import resultReducer from './modules/ResultModule/reducers';
import toggleSidenavReducer from './components/Sidebar/Reducers'
import registerReducer from './modules/RegisterModule/reducers';
import VOAReducer from './modules/VOAModule/reducers';
import ieltsMindsetReducer from './modules/IeltsMindsetModule/reducers'
import teacherReducer from './modules/TeacherModule/reducers'

const rootReducer = combineReducers({
  loginReducer,
  classReducer,
  sessionReducer,
  assignmentReducer,
  questionReducer,
  questionMixReducer,
  assignmentMix4Reducer,
  resultReducer,
  toggleSidenavReducer,
  registerReducer,
  VOAReducer,
  ieltsMindsetReducer,
  teacherReducer,
});

export default rootReducer;
