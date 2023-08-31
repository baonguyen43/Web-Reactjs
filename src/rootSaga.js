import { all, fork } from 'redux-saga/effects';

// import { default as loginSaga } from "./modules/LoginModule/sagas";
import assignmentSaga from './modules/AssignmentModule/sagas';
import assignmentsMix4Saga from './modules/AssignmentModule/sagas/assignmentsMix4Saga';
import classSaga from './modules/ClassModule/sagas';
import loginSaga from './modules/LoginAmes_AiModule/sagas';
import questionsMixSaga from './modules/QuestionModule/sagas/questionsMixSaga';
import questionsSaga from './modules/QuestionModule/sagas/questionsSaga';
import sessionSaga from './modules/SessionModule/sagas';

import resultSaga from './modules/ResultModule/sagas';
// import { default as logSaga } from './modules/LogModule/sagas';
import registerSaga from './modules/RegisterModule/sagas';
// import { default as UpdateProfileSaga } from './modules/profileModule/ChangeProfile/sagas';
// import { default as IeltsSelectSaga } from './modules/IeltsSelectModule/sagas';
import VOASaga from './modules/VOAModule/sagas';
// import studentCalendarSaga  from './modules/StudentCalendar/sagas';
import ieltsMindsetSaga from './modules/IeltsMindsetModule/sagas';
import teacherSaga from './modules/TeacherModule/sagas';

export default function* rootSaga() {
  yield all([
    fork(loginSaga),
    fork(registerSaga),
    fork(VOASaga),
    fork(classSaga),
    fork(sessionSaga),
    fork(assignmentSaga),
    fork(questionsMixSaga),
    fork(assignmentsMix4Saga),
    fork(questionsSaga),
    fork(resultSaga),
    fork(ieltsMindsetSaga),
    fork(teacherSaga),

    // fork(assignmentSaga.watchFetchAssignments),
    // fork(questionsSaga.watchFetchQuestions),
    // fork(questions_newSaga.watchFetchQuestions_new),
    // fork(resultSaga.watchGetResult),
    // fork(saveAnswerSaga.watchSaveAnswers),
    // fork(logSaga.watchFetchLogs),

    // fork(UpdateProfileSaga.watchUpdateInfo),
    // fork(IeltsSelectSaga.watchIeltsSelect),
    // fork(VOASaga.watchVOASelect),
    // fork(studentCalendarSaga),
  ]);
}
