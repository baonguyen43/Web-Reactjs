import { dynamicApiAxios } from 'configs/api';
import { put, takeLatest } from 'redux-saga/effects';
import * as actionTypes from '../actions/types';
import { getSessionsMyai } from './apiMyai';
import { getSessionsMyames } from './apiMyames';

function* fetchSessions(action) {

  try {
    yield put({ type: actionTypes.FETCH_SESSION_REQUEST });

    let { classId, typeClass, studentId, classItem } = action.payload;
    let receivedSessions = [];
    if (typeClass === 'AMES') {
      receivedSessions = yield getSessionsMyames({ classId, studentId });


      if (receivedSessions === 'Error') {
        fetchSessionsError(receivedSessions)
      }
    } else {
      receivedSessions = yield getSessionsMyai({ classId, studentId });
      if (receivedSessions === 'Error') {
        fetchSessionsError(receivedSessions)
      }
    }
    const { checkTypeNext, isMix4 } = yield checkTypeToNextPage({ classId, classItem })

    yield put({
      type: actionTypes.FETCH_SESSION_SUCCESS,
      payload: receivedSessions,
      apptype: typeClass,
      checkTypeNext,
      isMix4,
    });
  } catch (error) {
    fetchSessionsError(error)
  }
}

function* checkTypeToNextPage({ classId, classItem }) {

  let checkTypeNext = false;
  let isMix4 = false;
  if (classItem.courseType === 'AMES') {
    // MY AMES
    const bodyNewUIAmes = {
      sqlCommand: '[dbo].[p_AMES247_Course_NewUI]',
      parameters: {
        EBMCourseId: classItem.ebmCourseId,
        CourseId: classItem.amesCourseId,
      },
    };
    const responseNewUIAmes = yield dynamicApiAxios.query.post(
      '',
      bodyNewUIAmes
    );
    if (responseNewUIAmes.data.items.length > 0) {
      checkTypeNext = true;
      isMix4 = responseNewUIAmes.data.items[0].isMix4;
    }
  } else {
    // MY AI
    const bodyNewUIAi = {
      sqlCommand: '[dbo].[p_AMES247_MyAI_Course_NewUI]',
      parameters: {
        EBMCourseId: 0,
        CourseId: classId,
      },
    };

    const responseNewUIAi = yield dynamicApiAxios.query.post('', bodyNewUIAi);

    if (responseNewUIAi.data.items.length > 0) {
      checkTypeNext = true
    }
  }
  return { checkTypeNext, isMix4 };
}

function* fetchSessionsError(response) {
  yield put({
    type: actionTypes.FETCH_SESSION_FAILURE,
    payload: response,
  });
}

export default function* sessionSaga() {
  yield takeLatest(actionTypes.FETCH_SESSION, fetchSessions);
}
