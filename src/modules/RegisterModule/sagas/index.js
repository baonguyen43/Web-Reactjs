
import { put, takeLatest } from 'redux-saga/effects';
import { postRegisterFromApi, postRegisterViettelFromApi, postCodeActiveApi, postCodeConfrimApi, postRegisterAIApi } from './api';
import * as actionTypes from '../actions/types';
import openNotificationWithIcon from 'components/Notification';

function* fetchRegister(action) {
  try {
    yield put({ type: actionTypes.FETCH_REGISTER_REQUEST });

    let { password, email } = action.values;

    const receivedRegister = yield postRegisterFromApi({ password, email });

    // const receivedRegister = yield postRegisterFromApi({ fullname, password, phone, divisionId, email })

    if (receivedRegister.message === 'OK') {
      yield put({
        type: actionTypes.FETCH_REGISTER_SUCCESS,
        payload: receivedRegister
      });
    } else {
      yield put({
        type: actionTypes.FETCH_REGISTER_FAILURE,
        payload: receivedRegister
      });
      openNotificationWithIcon('danger', 'Đăng ký thất bại', receivedRegister.description);
    }

  } catch (error) {
 
    yield put({
      type: actionTypes.FETCH_REGISTER_FAILURE,
      payload: error
    });
    openNotificationWithIcon('danger', 'Đăng ký thất bại', error);
  }
}

function* requestRegisterAI(action) {
  try {
    let { voucher, fullname, password, phone } = action.payload;
    const receivedRegister = yield postRegisterAIApi({ voucher, fullname, password, phone });

    yield put({
      type: actionTypes.FETCH_REGISTER_SUCCESS,
      payload: receivedRegister
    });
    action.onSuccess(receivedRegister.data)
  } catch (error) {
  
    yield put({
      type: actionTypes.FETCH_REGISTER_FAILURE,
      payload: error
    });
    openNotificationWithIcon('danger', 'Đăng ký thất bại', error, 4);
  }
}


function* fetchRegisterViettel(action) {
  try {
    yield put({ type: actionTypes.FETCH_REGISTER_VIETTEL_REQUEST });
    let { email, password, fullname, voucher, course, phone } = action.payload;
    const receivedRegister = yield postRegisterViettelFromApi({ email, password, fullname, voucher, course, phone });
    if (receivedRegister.message === 'OK') {
      yield put({
        type: actionTypes.FETCH_REGISTER_SUCCESS,
        payload: receivedRegister
      });
      action.onSuccess(receivedRegister.message)
    }
    if (receivedRegister.message === 'ERROR') {
      yield put({
        type: actionTypes.FETCH_REGISTER_FAILURE,
        payload: receivedRegister
      });
      openNotificationWithIcon('danger', 'Đăng ký thất bại', receivedRegister.description, 4);
    }

  } catch (error) {

    yield put({
      type: actionTypes.FETCH_REGISTER_FAILURE,
      payload: error
    });
    openNotificationWithIcon('danger', 'Đăng ký thất bại', error, 4);
  }
}

function* fetchActiveCode(action) {
  try {
    yield put({ type: actionTypes.FETCH_ACTIVE_CODE_REQUEST });
    let data = action.payload;
    const activeResult = yield postCodeActiveApi(data);
    yield put({
      type: actionTypes.FETCH_ACTIVE_CODE_SUCCESS,
      payload: activeResult
    });
    if (activeResult.message === 'OK') {
      action.onSuccess(activeResult.message)
    }
    if (activeResult.message === 'ERROR') {
      openNotificationWithIcon('danger', 'Lỗi', activeResult.description, 4);
    }
  } catch (error) {

    yield put({
      type: actionTypes.FETCH_ACTIVE_CODE_FAILURE,
      payload: error
    });
  }
}

function* fetchConfrimCode(action) {
  try {
    yield put({ type: actionTypes.FETCH_CONFRIM_CODE_REQUEST });
    let data = action.payload;
    const activeResult = yield postCodeConfrimApi(data);
    yield put({
      type: actionTypes.FETCH_CONFRIM_CODE_SUCCESS,
      payload: activeResult
    });
    if (activeResult.message === 'OK') {
      action.onSuccess(activeResult.message)
    }
    if (activeResult.message === 'ERROR') {
      openNotificationWithIcon('danger', 'Lỗi', activeResult.description, 4);
    }
  } catch (error) {

    yield put({
      type: actionTypes.FETCH_CONFRIM_CODE_FAILURE,
      payload: error
    });
    // openNotificationWithIcon("error", "Đăng ký thất bại", error , 4);
  }
}

export default function* registerSaga() {
  yield takeLatest(actionTypes.FETCH_REGISTER, fetchRegister);
  yield takeLatest(actionTypes.REQUEST_REGISTER_AI, requestRegisterAI);
  yield takeLatest(actionTypes.FETCH_REGISTER_VIETTEL, fetchRegisterViettel);
  yield takeLatest(actionTypes.FETCH_ACTIVE_CODE, fetchActiveCode);
  yield takeLatest(actionTypes.FETCH_CONFRIM_CODE, fetchConfrimCode);
}



