import { put, takeLatest } from 'redux-saga/effects';
import * as actionTypes from '../actions/types'
import { getIeltsMindsetScore } from './apiMyAmes';

function* fetchIeltsMindsetScore(action) {
  try {
    yield put({ type: actionTypes.FETCH_SCORE_REQUEST })
    const { studentId, sessionId, assignmentId, takeExamTime } = action.payload
    const receivedIeltsMindsetScore = yield getIeltsMindsetScore({
      studentId, sessionId, assignmentId, takeExamTime,
    })
    yield put({
      type: actionTypes.FETCH_SCORE_SUCCESS,
      payload: receivedIeltsMindsetScore,
    })
  } catch (error) {
    yield put({
      type: actionTypes.FETCH_SCORE_FAILURE,
      payload: error,
    })
  }
}

export default function* ieltsMindsetSaga() {
  yield takeLatest(actionTypes.FETCH_SCORE, fetchIeltsMindsetScore)
}