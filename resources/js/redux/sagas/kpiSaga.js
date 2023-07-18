import {
  put, fork, takeLatest, call,
} from 'redux-saga/effects'
import {
  constants as kpiConstants,
  actions as kpiActions,
} from '../modules/kpi'
import { actions as userActions } from '../modules/user'
import { getKpis } from '../../common/api/module/kpi'

export function* fetchKpis({ payload }) {
  const { filter } = payload
  try {
    const response = yield call(getKpis, { filter })
    const { data } = response
    if (response.status === 200) {
      yield put(
        kpiActions.getKpisResult({
          error: null,
          loading: false,
          success: true,
          kpis: data,
        })
      )
    }
  } catch (error) {
    if (error.response) {
      const { status } = error.response
      if (status === 401) {
        yield put(userActions.initUserResult())
      }
      yield put(
        kpiActions.getKpisResult({
          error: null,
          success: false,
          status: 200,
          loading: false,
          kpis: null,
        })
      )
    } else {
      yield put(
        kpiActions.getKpisResult({
          error: null,
          success: false,
          status: 200,
          loading: false,
          kpis: null,
        })
      )
    }
  }
}

function* watchKpis() {
  yield takeLatest(kpiConstants.GET_KPIS, fetchKpis)
}

export const kpiSaga = [fork(watchKpis)]
