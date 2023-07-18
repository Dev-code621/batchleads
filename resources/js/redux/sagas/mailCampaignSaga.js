import {
  put, fork, takeLatest, call,
} from 'redux-saga/effects'
import {
  constants as mailCampaignConstants,
  actions as mailCampaignActions,
} from '../modules/mailCampaign'
import { actions as userActions } from '../modules/user'

import {
  getMyCampaigns,
  newCampaign,
  newCampaignBulk,
  cancelCampaign,
} from '~api/module/mailCampaign'

export function* getMailCampaigns({ payload }) {
  const { page, search } = payload

  try {
    const response = yield call(getMyCampaigns, { page, search })
    const { data } = response.data

    if (response.status === 200) {
      yield put(
        mailCampaignActions.getCampaignsResult({
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
        yield put(userActions.initUserResult())
      }
      yield put(
        mailCampaignActions.getCampaignsResult({
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
        mailCampaignActions.getCampaignsResult({
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

export function* newMailCampaign({ payload }) {
  const {
    title,
    description,
    startDate,
    propertyIds,
    templateId,
    repeatEvery,
    totalMailers,
    isRepeatStep,
  } = payload

  try {
    const response = yield call(newCampaign, {
      title,
      description,
      repeatEvery,
      startDate,
      templateId,
      propertyIds,
      totalMailers,
      isRepeatStep,
    })
    const { data } = response.data

    if (response.status === 200) {
      yield put(
        mailCampaignActions.newCampaignResult({
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
        mailCampaignActions.newCampaignResult({
          error: error.response.data,
          success: false,
          loading: false,
          status,
        })
      )
    } else {
      yield put(
        mailCampaignActions.newCampaignResult({
          success: false,
          loading: false,
        })
      )
    }
  }
}

export function* newMailCampaignBulk({ payload }) {
  const {
    title,
    description,
    repeatEvery,
    startDate,
    propertyIds,
    templateId,
    filter,
    totalMailers,
    isRepeatStep,
  } = payload

  try {
    const response = yield call(newCampaignBulk, {
      title,
      description,
      repeatEvery,
      startDate,
      templateId,
      propertyIds,
      filter,
      totalMailers,
      isRepeatStep,
    })
    const { data } = response.data

    if (response.status === 200) {
      yield put(
        mailCampaignActions.newCampaignResult({
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
        mailCampaignActions.newCampaignResult({
          error: error.response.data,
          success: false,
          loading: false,
          status,
        })
      )
    } else {
      yield put(
        mailCampaignActions.newCampaignResult({
          success: false,
          loading: false,
        })
      )
    }
  }
}

export function* cancelMailCampaign({ payload }) {
  const { campaignId } = payload

  try {
    const response = yield call(cancelCampaign, { campaignId })
    const { data } = response.data

    if (response.status === 200) {
      yield put(
        mailCampaignActions.cancelCampaignResult({
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
        mailCampaignActions.newCampaignResult({
          error: error.response.data,
          success: false,
          loading: false,
          status,
        })
      )
    } else {
      yield put(
        mailCampaignActions.newCampaignResult({
          success: false,
          loading: false,
        })
      )
    }
  }
}

function* watchMailCampaign() {
  yield takeLatest(mailCampaignConstants.GET_MAIL_CAMPAIGNS, getMailCampaigns)
  yield takeLatest(mailCampaignConstants.NEW_MAIL_CAMPAIGN, newMailCampaign)
  yield takeLatest(
    mailCampaignConstants.NEW_MAIL_CAMPAIGN_BULK,
    newMailCampaignBulk
  )
  yield takeLatest(
    mailCampaignConstants.CANCEL_MAIL_CAMPAIGN,
    cancelMailCampaign
  )
}

export const mailCampaignSaga = [fork(watchMailCampaign)]
