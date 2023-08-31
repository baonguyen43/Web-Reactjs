import { put, takeLatest } from 'redux-saga/effects';
import * as actionTypes from '../actions/types';
import openNotificationWithIcon from 'components/Notification';

function* postlogin(action) {
  try {
    if (action.result.ok) {
      const loggedInUser = {
        userTeacher: action.result.items[0],
        typeLogin: 'teacher',
      };
      localStorage.setItem('loggedInUser', JSON.stringify(loggedInUser));
      yield put({
        type: actionTypes.POST_TEACHER_LOGIN_SUCCESS,
        payload: loggedInUser,
      });
      openNotificationWithIcon('success', 'Thông báo', 'Đăng nhập thành công.');
    } else {
      openNotificationWithIcon(
        'danger',
        'Thông báo',
        'Có lỗi xảy ra vui lòng thử lại'
      );
      yield put({
        type: actionTypes.POST_TEACHER_LOGIN_FAILURE,
        payload: {
          message: 'Đăng nhập không thành công.\nVui lòng thử lại!',
        },
      });
    }
  } catch (error) {
    openNotificationWithIcon(
      'danger',
      'Thông báo',
      'Có lỗi xảy ra vui lòng thử lại'
    );
  }
}

function LOGOUT() {
  localStorage.clear();
}

export default function* teacherSaga() {
  yield takeLatest(actionTypes.POST_TEACHER_LOGIN_REQUEST, postlogin);
  yield takeLatest(actionTypes.POST_LOGOUT, LOGOUT);
}
