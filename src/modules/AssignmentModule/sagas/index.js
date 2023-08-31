import { put, takeLatest, call } from 'redux-saga/effects';
import * as actionTypes from '../actions/types';
import { getAssignmentsMyai } from './apiMyai';
import { getAssignmentsMyames } from './apiMyames';
import Notification from 'components/Notification'
import { dynamicApiAxios } from 'configs/api';

function* fetchAssignments(action) {
  try {
    let { studentId, classId, sessionId, typeApp, AppName } = action.payload;
    let receivedAssignments = [];
    if (classId !== '0') {
      if (typeApp === 'AMES') {
        receivedAssignments = yield call(getAssignmentsMyames, { studentId, classId, sessionId });
      }
      else {
        receivedAssignments = yield call(getAssignmentsMyai, { studentId, sessionId, AppName });
      }
    } else {
      // get data type nhấn trọng âm
      let level = sessionId;
      const response = yield dynamicApiAxios.query.post('', {
        sqlCommand: 'p_AMES_READING_Books_GetBooks',
        parameters: { level },
      });
      receivedAssignments = response.data.items
    }
    yield put({
      type: actionTypes.FETCH_ASSIGNMENT_SUCCESS,
      payload: receivedAssignments
    });
  } catch (error) {

    Notification('danger', 'Thông báo', 'Có lỗi xảy ra vui lòng thử lại')
    yield put({
      type: actionTypes.FETCH_ASSIGNMENT_FAILURE,
      payload: error
    });
  }
}

export default function* assignmentSaga() {
  yield takeLatest(actionTypes.FETCH_ASSIGNMENT_REQUEST, fetchAssignments);
}


