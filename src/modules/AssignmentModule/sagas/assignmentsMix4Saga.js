import { put, takeLatest } from 'redux-saga/effects';
import * as actionTypes from '../actions/types';
import { getAssignmentsByMix4 } from './api';

function* fetchAssignmentsMix4(action) {
  try {
    const { sessionId, studentId } = action;
    const receivedAssignmentsMix4 = yield getAssignmentsByMix4({ sessionId, studentId });
    yield put({
      type: actionTypes.FETCH_ASSIGNMENTS_MIX4_SUCCESS,
      payload: receivedAssignmentsMix4,
    });
  } catch (error) {
    yield put({
      type: actionTypes.FETCH_ASSIGNMENTS_MIX4_FAILURE,
      payload: error,
    });
  }
}

export default function* assignmentsMix4Saga() {
  yield takeLatest(actionTypes.FETCH_ASSIGNMENTS_MIX4_REQUEST, fetchAssignmentsMix4);
}
