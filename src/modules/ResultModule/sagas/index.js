import { put, takeLatest } from 'redux-saga/effects';
import * as actionTypes from '../actions/types';
import { axiosAMES } from 'configs/api';

function* getResult(action) {
  const { studentId, sessionId, assignmentId, takeExamTime } = action.payload;
  try {
    const response = yield axiosAMES.get(`GetResultOfPlayedTime/${studentId}/${sessionId}/${assignmentId}/${takeExamTime}`);
    yield put({
      type: actionTypes.GET_RESULT_SUCCESS,
      payload: response.data.results
    });
  } catch (error) {
    yield put({
      type: actionTypes.GET_RESULT_FAILURE,
      payload: { error }
    });
  }
}

export default function* resultSaga() {
  yield takeLatest(actionTypes.GET_RESULT_REQUEST, getResult);
}
