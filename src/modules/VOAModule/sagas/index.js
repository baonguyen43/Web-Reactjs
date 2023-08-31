import { put, takeLatest, call, all } from 'redux-saga/effects';
import * as actionTypes from '../actions/types';
import { getVOAListapi, getVOADetailsListapi } from './api';

function* fetchVOAList() {
  try {
    const VOAList = yield call(getVOAListapi);

    if (VOAList.data.message === 'OK') {
      yield put({
        type: actionTypes.FETCH_VOA_LIST_SUCCESS,
        payload: VOAList.data.items,
      });
    }
  } catch (error) {
    yield put({
      type: actionTypes.FETCH_VOA_LIST_FAILURE,
      payload: error,
    });
  }
}

function* fetchVOADetailList(action) {

  const { categoryId, page } = action;

  try {
    const VOADetailsList = yield getVOADetailsListapi({ categoryId, page });
  
    if (VOADetailsList.data.message === 'OK') {
      yield put({
        type: actionTypes.FETCH_VOA_DETAIL_SUCCESS,
        payload: VOADetailsList.data.items,
      });
    }
  } catch (error) {
    yield put({
      type: actionTypes.FETCH_VOA_DETAIL_FAILURE,
      payload: error,
    });
  }
}

export default function* VOASaga() {
  yield all([
    takeLatest(actionTypes.FETCH_VOA_LIST, fetchVOAList),
    takeLatest(actionTypes.FETCH_VOA_DETAIL, fetchVOADetailList),
  ]);
}
