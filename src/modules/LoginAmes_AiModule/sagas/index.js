import { put, takeLatest } from 'redux-saga/effects';
import CryptoJS from 'crypto-js';
import { postResetPassApi } from './api';
import * as actionTypes from '../actions/types';
import { ames247Axios } from 'configs/api';
import openNotificationWithIcon from 'components/Notification';


function* postlogin(action) {

  const { username, password } = action.values;

 try {
  const response = yield ames247Axios.post('/login-ames-app', {

    UserName: username,
    Password: CryptoJS.MD5(password).toString(),
  });
 
  if (response.data.message === 'OK') {
    const { users } = response.data;
    const loginMyAi = JSON.parse(users.loginMyAi);
  
    const loginMyAmes = JSON.parse(users.loginMyAmes);
  
  
    let typeLogin = null;
    //////////////////////TYPE AMES && AI
    if (loginMyAi.message === 'OK' && loginMyAmes.status === 'success') {
      typeLogin = 'ames&ai';
      const userMyai = loginMyAi.user;
      loginMyAmes.data[0].Students[0].UserCode = loginMyAmes.data[0].UserCode;
      loginMyAmes.data[0].Students[0].UserId = loginMyAmes.data[0].UserId;
      const userMyames = loginMyAmes.data[0].Students;
      const loggedInUser = { userMyai, userMyames, typeLogin };
      yield put({
        type: actionTypes.POST_LOGIN_SUCCESS,
        payload: loggedInUser,
      });
      return;
    }
    //////////////////////////LOGIN TYPE A.I
    if (loginMyAi.message === 'OK') {
      typeLogin = 'ai';
      const userMyai = loginMyAi.user;
      const userMyames = null;
      const loggedInUser = { userMyai, userMyames, typeLogin };
      localStorage.setItem(
        'loggedInUser',
        JSON.stringify(loggedInUser)
      );
      yield put({
        type: actionTypes.POST_LOGIN_SUCCESS,
        payload: loggedInUser,
      });
      return;
    }
    ///////////////////////////// LOGIN TYPE AMES
    if (loginMyAmes.status === 'success') {
      typeLogin = 'ames';
      const userMyai = null;
      loginMyAmes.data[0].Students[0].UserCode = loginMyAmes.data[0].UserCode;
      loginMyAmes.data[0].Students[0].UserId = loginMyAmes.data[0].UserId;
      const userMyames = loginMyAmes.data[0].Students;
      const loggedInUser = { userMyames, userMyai, typeLogin };
      yield put({
        type: actionTypes.POST_LOGIN_SUCCESS,
        payload: loggedInUser,
      });
      return;
    } else {
      openNotificationWithIcon(
        'danger',
        'Thông báo',
        'Có lỗi xảy ra vui lòng thử lại'
      );
      yield put({
        type: actionTypes.POST_LOGIN_FAILURE,
        payload: {
          message: 'Đăng nhập không thành công.\nVui lòng thử lại!',
        },
      });
    }
  }
 } catch (error) {
  openNotificationWithIcon(
    'danger',
    'Thông báo',
    'Có lỗi xảy ra vui lòng thử lại'
  );
 }
}

function* fetchResetPass(action) {
  try {
    yield put({ type: actionTypes.POST_RESET_PASS_REQUEST });

    let data = action.values.phone;
    const activeResult = yield postResetPassApi(data);

    if (activeResult.message === 'OK') {
      yield put({
        type: actionTypes.POST_RESET_PASS_SUCCESS,
        payload: activeResult,
      });
      openNotificationWithIcon(
        'success',
        'Thông báo',
        activeResult.description
      );
    }
    if (activeResult.message === 'ERROR') {
      yield put({
        type: actionTypes.POST_RESET_PASS_FAILURE,
      });
      openNotificationWithIcon('danger', 'Thông báo', activeResult.description);
    }
  } catch (error) {
    yield put({
      type: actionTypes.POST_RESET_PASS_FAILURE,
      payload: error,
    });
    openNotificationWithIcon('danger', 'Đăng ký thất bại', error, 4);
  }
}

function LOGOUT() {
  localStorage.clear();
}

export default function* loginSaga() {
  yield takeLatest(actionTypes.POST_LOGIN_REQUEST, postlogin);
  yield takeLatest(actionTypes.POST_RESET_PASS, fetchResetPass);
  yield takeLatest('POST_LOGOUT', LOGOUT);
}
