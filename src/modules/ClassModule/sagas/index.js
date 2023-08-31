import { put, takeLatest } from 'redux-saga/effects';
import { getClassFromApi } from './api';
import * as actionTypes from '../actions/types';

function* fetchClass(action) {
  try {
    yield put({ type: actionTypes.FETCH_CLASS_REQUEST });

    const { MyAmesStudentId, MyAiUserId } = action;
    const receivedClass = yield getClassFromApi({
      MyAmesStudentId,
      MyAiUserId,
    });
   
 
    yield put({
      type: actionTypes.FETCH_CLASS_SUCCESS,
      payload: receivedClass,
    });
  } catch (error) {

    yield put({
      type: actionTypes.FETCH_CLASS_FAILURE,
      payload: error,
    });
  }
}

export default function* classSaga() {
  yield takeLatest(actionTypes.FETCH_CLASS, fetchClass);
}
