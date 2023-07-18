import {
  put,
  fork,
  takeLatest,
  call,
} from 'redux-saga/effects'
import {
  constants as smsCampaignConstants,
  actions as smsCampaignActions,
} from '../modules/smsCampaign'
import { actions as userActions } from '../modules/user'

import {
  getMyCampaigns, newCampaign, newCampaignBulk, cancelCampaign,
} from '~api/module/smsCampaign'

export function* getSmsCampaigns({ payload }) {
  const { page, search } = payload

  try {
    const response = yield call(getMyCampaigns, { page, search })
    const { data } = response.data

    if (response.status === 200) {
      yield put(
        smsCampaignActions.getCampaignsResult({
          error: null,
          loading: false,
          success: true,
          page: data.page,
          total: data.total,
          count: data.count,
          count_per_page: data.count_per_page,
          campaigns: data.data,
        })
      )
    }
  } catch (error) {
    if (error.response) {
      const { status } = error.response
      if (status === 401) {
        yield put(userActions.initUserResult());
      }
      yield put(
        smsCampaignActions.getCampaignsResult({
          error: error.response.data,
          success: false,
          status,
          loading: false,
          total: 0,
          page: 0,
          count: 0,
          count_per_page: 0,
          campaigns: [],
        })
      )
    } else {
      yield put(
        smsCampaignActions.getCampaignsResult({
          success: false,
          loading: false,
          total: 0,
          page: 0,
          count: 0,
          count_per_page: 0,
          campaigns: [],
        })
      )
    }
  }
}

export function* newSmsCampaign({ payload }) {
  const {
    title,
    description,
    startDate,
    propertyIds,
    templateId,
    skiptracing,
  } = payload

  try {
    const response = yield call(newCampaign, {
      title,
      description,
      startDate,
      templateId,
      propertyIds,
      skiptracing,
    })
    const { data } = response.data

    if (response.status === 200) {
      yield put(
        smsCampaignActions.newCampaignResult({
          error: null,
          loading: false,
          success: true,
          data,
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
        smsCampaignActions.newCampaignResult({
          error: error.response.data,
          success: false,
          loading: false,
          status,
        })
      )
    } else {
      yield put(
        smsCampaignActions.newCampaignResult({
          success: false,
          loading: false,
        })
      )
    }
  }
}

export function* newSmsCampaignBulk({ payload }) {
  const {
    title,
    description,
    startDate,
    propertyIds,
    templateId,
    filter,
    skiptracing,
  } = payload

  try {
    const response = yield call(newCampaignBulk, {
      title,
      description,
      startDate,
      templateId,
      propertyIds,
      filter,
      skiptracing,
    })
    const { data } = response.data

    if (response.status === 200) {
      yield put(
        smsCampaignActions.newCampaignResult({
          error: null,
          loading: false,
          success: true,
          data,
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
        smsCampaignActions.newCampaignResult({
          error: error.response.data,
          success: false,
          loading: false,
          status,
        })
      )
    } else {
      yield put(
        smsCampaignActions.newCampaignResult({
          success: false,
          loading: false,
        })
      )
    }
  }
}

export function* cancelSmsCampaign({ payload }) {
  const { campaignId } = payload

  try {
    const response = yield call(cancelCampaign, { campaignId })
    const { data } = response.data

    if (response.status === 200) {
      yield put(
        smsCampaignActions.cancelCampaignResult({
          error: null,
          loading: false,
          success: true,
          data,
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
        smsCampaignActions.newCampaignResult({
          error: error.response.data,
          success: false,
          loading: false,
          status,
        })
      )
    } else {
      yield put(
        smsCampaignActions.newCampaignResult({
          success: false,
          loading: false,
        })
      )
    }
  }
}

function* watchSmsCampaign() {
  yield takeLatest(smsCampaignConstants.GET_CAMPAIGNS, getSmsCampaigns)
  yield takeLatest(smsCampaignConstants.NEW_CAMPAIGN, newSmsCampaign)
  yield takeLatest(smsCampaignConstants.NEW_CAMPAIGN_BULK, newSmsCampaignBulk)
  yield takeLatest(smsCampaignConstants.CANCEL_CAMPAIGN, cancelSmsCampaign)
}

export const smsCampaignSaga = [fork(watchSmsCampaign)]
