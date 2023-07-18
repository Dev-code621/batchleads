import {
  put, fork, takeLatest, call,
} from 'redux-saga/effects'
import {
  constants as styleConstants,
  actions as styleActions,
} from '../modules/templateStyle'
import { actions as userActions } from '../modules/user'
import { getStyles } from '../../common/api/module/templateStyle'

export function* fetchStyles() {
  try {
    const response = yield call(getStyles)
    const { data } = response.data
    if (response.status === 200) {
      yield put(
        styleActions.getStylesResult({
          error: null,
          loading: false,
          success: true,
          styles: data.data,
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
        styleActions.getStylesResult({
          error: null,
          success: false,
          status: 200,
          loading: false,
          styles: [],
        })
      )
    } else {
      yield put(
        styleActions.getStylesResult({
          error: null,
          success: false,
          status: 200,
          loading: false,
          styles: [],
        })
      )
    }
  }
}

function* watchStyles() {
  yield takeLatest(styleConstants.GET_STYLES, fetchStyles)
}

export const templateStyleSaga = [fork(watchStyles)]
