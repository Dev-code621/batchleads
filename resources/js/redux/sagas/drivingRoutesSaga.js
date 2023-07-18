import {
  put, fork, takeLatest, call,
} from 'redux-saga/effects';
import {
  constants as drivingRoutesConstants,
  actions as drivingRoutesActions,
} from '../modules/drivingRoutes';
import {
  actions as userActions,
} from '../modules/user'

import { getDrivingRoutesList, deleteDrivingRouteApi, createDrivingRouteApi } from '../../common/api/module/drivingRoutes';

export function* drivingRoutesList({ payload }) {
  try {
    const { pageNumber, params } = payload;
    const response = yield call(getDrivingRoutesList, { pageNumber, params });
    const { data } = response.data;
    if (response.status === 200) {
      yield put(
        drivingRoutesActions.gerDrivingRoutesResult({
          error: null,
          loading: false,
          success: true,
          total: data.recent_total.trips,
          miles: data.recent_total.miles,
          page: data.page,
          count: data.recent_total.trips,
          count_per_page: data.count_per_page,
          drivingRoutesData: data.data,
        })
      )
    }
  } catch (error) {
    const { status } = error.response;
    if (status === 401) {
      yield put(userActions.initUserResult());
    }
    yield put(
      drivingRoutesActions.gerDrivingRoutesResult({
        status: 200,
        total: 0,
        page: 0,
        count_per_page: 0,
        drivingRoutesData: null,
        loading: false,
        error: error.response.data,
        success: false,
        count: 0,
        miles: 0,
      })
    );
  }
}
export function* homeDrivingRoutesList({ payload }) {
  try {
    const { pageNumber, params } = payload;
    const response = yield call(getDrivingRoutesList, { pageNumber, params });
    const { data } = response.data;
    if (response.status === 200) {
      yield put(
        drivingRoutesActions.getHomeDrivingRoutesResult({
          drivingRoutesData: data.data,
        })
      )
    }
  } catch (error) {
    const { status } = error.response;
    if (status === 401) {
      yield put(userActions.initUserResult());
    }
    yield put(
      drivingRoutesActions.getHomeDrivingRoutesResult({
        drivingRoutesData: [],
      })
    );
  }
}

export function* deleteDrivingRoute({ payload }) {
  try {
    const { id } = payload;
    const response = yield call(deleteDrivingRouteApi, { id });
    if (response.status === 200) {
      yield put(
        drivingRoutesActions.deleteDrivingRouteResult({
          error: null,
          loading: false,
          success: true,
        })
      )
    }
  } catch (error) {
    const { status } = error.response;
    if (status === 401) {
      yield put(userActions.initUserResult());
    }
    yield put(
      drivingRoutesActions.deleteDrivingRouteResult({
        status: 200,
        loading: false,
        error: error.response.data,
        success: false,
      })
    );
  }
}

export function* createDrivingRoute({ payload }) {
  try {
    const response = yield call(createDrivingRouteApi, { payload })
    if (response.status === 200) {
      yield put(
        drivingRoutesActions.createDrivingRouteResult({
          error: null,
          loading: false,
          success: true,
        })
      )
    }
  } catch (error) {
    const { status } = error.response
    if (status === 401) {
      yield put(userActions.initUserResult())
    }
    yield put(
      drivingRoutesActions.createDrivingRouteResult({
        status: 200,
        loading: false,
        error: error.response.data,
        success: false,
      })
    )
  }
}

function* watchDrivingRoutes() {
  yield takeLatest(drivingRoutesConstants.GET_DRIVING_ROUTES, drivingRoutesList);
  yield takeLatest(drivingRoutesConstants.GET_HOME_DRIVING_ROUTES, homeDrivingRoutesList);
  yield takeLatest(drivingRoutesConstants.DELETE_DRIVING_ROUTE, deleteDrivingRoute);
  yield takeLatest(drivingRoutesConstants.CREATE_DRIVING_ROUTE, createDrivingRoute);
}

export const drivingRoutesSaga = [fork(watchDrivingRoutes)];
