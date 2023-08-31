import { put, takeLatest } from 'redux-saga/effects';
import { getQuestionsFromApi, getQuestionsTOEIC_LISTENING_READINGFromApi } from './api';
import * as actionTypes from '../actions/types';

function* fetchQuestions(action) {
  try {
    const { type, sessionId, assignmentId, takeExamTime, userId, asrId, toeicSelectedPart } = action.payload;
    let receivedQuestions = ''
    if (type === 'TOEIC_LISTENING_READING') {
      receivedQuestions = yield getQuestionsTOEIC_LISTENING_READINGFromApi({ sessionId, studentId: userId, takeExamTime, toeicSelectedPart });
      
    } else {
      receivedQuestions = yield getQuestionsFromApi({ sessionId, assignmentId, takeExamTime, userId, asrId });
    }
    yield put({
      type: actionTypes.FETCH_QUESTIONS_SUCCESS,
      payload: receivedQuestions
    });
  } catch (error) {
  
    yield put({
      type: actionTypes.FETCH_QUESTIONS_FAILURE,
      payload: error
    });
  }
}

export default function* questionsSaga() {
  yield takeLatest(actionTypes.FETCH_QUESTIONS_REQUEST, fetchQuestions);
}

