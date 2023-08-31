
import { put, takeLatest } from 'redux-saga/effects';
import { getQuestionsMix_FromApi } from './api';
import * as actionTypes from '../actions/types';

function* fetchQuestions(action) {
  try {
    const { sessionId, userId, takeExamTime } = action;
    const receivedQuestions = yield getQuestionsMix_FromApi({ sessionId, userId, takeExamTime });
    yield put({
      type: actionTypes.FETCH_QUESTIONS_MIX_SUCCESS,
      payload: receivedQuestions.data.items
    });
  } catch (error) {
 
    yield put({
      type: actionTypes.FETCH_QUESTIONS_MIX_FAILURE,
      payload: error
    });
  }
}

export default function* questionsMixSaga (){
  yield takeLatest(actionTypes.FETCH_QUESTIONS_MIX_REQUEST, fetchQuestions);
} 
  
  


