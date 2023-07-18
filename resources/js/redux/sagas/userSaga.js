import axios from 'axios'
import {
  put, fork, takeLatest, call,
} from 'redux-saga/effects'
import get from 'lodash.get'
import {
  constants as userConstants,
  actions as userActions,
} from '../modules/user'

import {
  login,
  signup,
  resetPassword,
  getUserInfo,
  logout,
  verify,
  resendVerify,
  registerOneSignal,
  getMyTeamMembers,
  inviteMyTeamMember,
  cancelMyInvitation,
  removeFromMyTeam,
  updateUserRole,
  getPing,
  updateUserNotificationSetting,
  changePassword,
  getPurchasedPhoneNumbers,
  searchAvailablePhoneNumbers,
  purchasePhoneNumber,
  getTransactionHistory,
  updateUserInformation,
  resendVerification,
  updateCallForward,
  updateUserAddOn,
  forgotPassword,
  updateAutoRechargeSetting,
  cancelUserAcc,
  pauseUserAcc,
  releasePhoneNumber,
} from '~api/module/user'

export function* userSignup({ payload }) {
  yield put(
    userActions.signupResult({
      error: null,
      loading: true,
      success: false,
    })
  )

  try {
    const response = yield call(signup, payload.data)
    if (response.status === 201) {
      yield put(
        userActions.signupResult({ error: null, loading: false, success: true })
      )
    }
  } catch (error) {
    yield put(
      userActions.signupResult({
        error: error.response.data,
        loading: false,
        success: false,
      })
    )
  }
}

export function* userLogin({ payload }) {
  yield put(
    userActions.loginResult({
      error: null,
      loading: true,
      success: false,
    })
  )

  const { email, password, oneSignalUserId } = payload
  try {
    const response = yield call(login, { email, password, oneSignalUserId })
    if (response.status === 200) {
      const { token } = response.data
      const accessToken = token.access_token
      localStorage.setItem('accessToken', accessToken)
      axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`

      yield put(
        userActions.loginResult({
          error: null,
          loading: false,
          success: true,
          user: response.data,
        })
      )
    }
  } catch (error) {
    yield put(
      userActions.loginResult({
        error: error.response.data,
        status: error.response.status,
        loading: false,
        success: false,
      })
    )
  }
}

export function* userLogout({ payload }) {
  const { oneSignalUserId } = payload
  try {
    yield put(
      userActions.verifyResult({
        error: null,
        loading: false,
        success: false,
      })
    )
    yield call(logout, { oneSignalUserId })
    delete axios.defaults.headers.common.Authorization
    localStorage.removeItem('oneSignalUserId')
  } catch (error) {
    yield put(
      userActions.verifyResult({
        error: error.response.data,
        loading: false,
        success: false,
      })
    )
  }
}

export function* resetUserPassword({ payload }) {
  delete axios.defaults.headers.common.Authorization
  yield put(
    userActions.resetPasswordResult({
      error: null,
      loading: true,
      success: false,
      status: 200,
    })
  )

  const { email, password, token } = payload.data
  try {
    const response = yield call(resetPassword, { email, password, token })
    if (response.status === 200) {
      yield put(
        userActions.resetPasswordResult({
          error: null,
          loading: false,
          success: true,
          user: response.data,
          status: 200,
        })
      )
    }
  } catch (error) {
    yield put(
      userActions.resetPasswordResult({
        error: error.response.data,
        status: error.response.status,
        loading: false,
        success: false,
      })
    )
  }
}

export function* initUser() {
  localStorage.removeItem('accessToken')
  yield put(userActions.initUserResult())
}

export function* checkLogin({ payload }) {
  yield put(userActions.checkLoginResult(true))
  if (payload.user) {
    const accessToken = get(payload.user, 'result.user.token.access_token')
    if (accessToken) {
      axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`
    }
  }
  yield put(userActions.checkLoginResult(false))
}

export function* getUser({ payload }) {
  try {
    const response = yield call(getUserInfo)
    if (response.status === 200) {
      const { user } = payload.user.result
      user.user = response.data.data

      /* 3rd parties integration start */
      const { email, name } = user.user;

      /* usersnap */
      if (window.UsersnapCX && !window.hasUsersnapEvent) {
        window.hasUsersnapEvent = true;
        window.UsersnapCX.on('open', (event) => {
          event.api.setValue('visitor', email);
          event.api.setValue('custom', {
            name,
            email,
          });
        });
      }

      /* 3rd parties integration end */

      yield put(
        userActions.loginResult({
          error: null,
          loading: false,
          success: true,
          user,
        })
      )
    }
  } catch (error) {
    yield put(
      userActions.loginResult({
        error: error.response.data,
        loading: false,
        success: false,
      })
    )
  }
}

export function* userVerify({ payload }) {
  yield put(
    userActions.verifyResult({
      error: null,
      loading: true,
      success: false,
    })
  )

  const { token } = payload
  try {
    const response = yield call(verify, { token })
    if (response.status === 200) {
      yield put(
        userActions.verifyResult({
          error: null,
          loading: false,
          success: response.data.data,
        })
      )
    }
  } catch (error) {
    yield put(
      userActions.verifyResult({
        error: error.response.data,
        loading: false,
        success: false,
      })
    )
  }
}

export function* userReVerify({ payload }) {
  yield put(
    userActions.reVerifyResult({
      error: null,
      loading: true,
      success: false,
    })
  )

  const { token } = payload
  try {
    const response = yield call(resendVerify, { token })
    if (response.status === 200) {
      yield put(
        userActions.reVerifyResult({
          error: null,
          loading: false,
          success: response.data.data,
        })
      )
    }
  } catch (error) {
    yield put(
      userActions.reVerifyResult({
        error: error.response.data,
        loading: false,
        success: false,
      })
    )
  }
}

export function* registerOneSignalUser({ payload }) {
  const { data: oneSignalUserId } = payload
  try {
    yield call(registerOneSignal, { oneSignalUserId })
  } catch (error) {
    const { status } = error.response
    if (status === 401) {
      yield put(userActions.initUserResult())
    }
  }
}

export function* getTeamMembers() {
  try {
    const response = yield call(getMyTeamMembers)
    if (response.status === 200) {
      yield put(
        userActions.getTeamMembersResult({
          error: null,
          loading: false,
          success: true,
          data: response.data.data,
        })
      )
    }
  } catch (error) {
    const { status } = error.response
    if (status === 401) {
      yield put(userActions.initUserResult())
    }
    yield put(userActions.getTeamMembersResult({
      error: null,
      loading: false,
      success: false,
    }))
  }
}

export function* inviteTeamMember({ payload }) {
  try {
    const { email } = payload
    const response = yield call(inviteMyTeamMember, { email })
    if (response.status === 200) {
      yield put(
        userActions.inviteMemberResult({
          error: null,
          loading: false,
          success: true,
          data: response.data,
        })
      )
    }
  } catch (error) {
    const { status, data } = error.response
    if (status === 401) {
      yield put(userActions.initUserResult())
    }
    yield put(userActions.inviteMemberResult({
      error: data,
      status,
      loading: false,
      success: false,
      data: null,
    }))
  }
}

export function* cancelInvitation({ payload }) {
  try {
    const { id } = payload
    const response = yield call(cancelMyInvitation, { id })
    if (response.status === 200) {
      yield put(
        userActions.cancelInvitationResult({
          error: null,
          loading: false,
          success: true,
          data: response.data,
        })
      )
    }
  } catch (error) {
    const { status, data } = error.response
    if (status === 401) {
      yield put(userActions.initUserResult())
    }
    yield put(userActions.cancelInvitationResult({
      error: data,
      status,
      loading: false,
      success: false,
      data: null,
    }))
  }
}

export function* removFromTeam({ payload }) {
  try {
    const { id } = payload
    const response = yield call(removeFromMyTeam, { id })
    if (response.status === 200) {
      yield put(
        userActions.removeFromTeamResult({
          error: null,
          loading: false,
          success: true,
          data: response.data,
        })
      )
    }
  } catch (error) {
    const { status, data } = error.response
    if (status === 401) {
      yield put(userActions.initUserResult())
    }
    yield put(userActions.removeFromTeamResult({
      error: data,
      status,
      loading: false,
      success: false,
      data: null,
    }))
  }
}

export function* updateTeamUserRole({ payload }) {
  try {
    const { userId, role } = payload
    const response = yield call(updateUserRole, { userId, role })
    if (response.status === 200) {
      yield put(
        userActions.updateUserRoleResult({
          error: null,
          loading: false,
          success: true,
          data: response.data,
        })
      )
    }
  } catch (error) {
    const { status, data } = error.response
    if (status === 401) {
      yield put(userActions.initUserResult())
    }
    yield put(userActions.updateUserRoleResult({
      error: data,
      status,
      loading: false,
      success: false,
      data: null,
    }))
  }
}

export function* getUserPing({ payload }) {
  try {
    const { userId } = payload
    const response = yield call(getPing, { userId })
    if (response.status === 200) {
      yield put(
        userActions.getUserPingResult({
          error: null,
          loading: false,
          success: true,
          ...response.data.data,
        })
      )
    }
  } catch (error) {
    const { status, data } = error.response
    if (status === 401) {
      yield put(userActions.initUserResult())
    }
    yield put(userActions.getUserPingResult({
      error: data,
      status,
      loading: false,
      success: false,
      data: null,
    }))
  }
}

export function* updateNotificationSetting({ payload }) {
  try {
    const { notificationType, status } = payload
    let response = yield call(updateUserNotificationSetting, { notificationType, status })
    if (response.status === 200) {
      response = yield call(getUserInfo)
      if (response.status === 200) {
        const { user } = payload.user.result
        user.user = response.data.data
        yield put(
          userActions.loginResult({
            error: null,
            loading: false,
            success: true,
            user,
          })
        )
      }
    }
  } catch (error) {
    const { status } = error.response
    if (status === 401) {
      yield put(userActions.initUserResult())
    }
  }
}

export function* updatePassword({ payload }) {
  try {
    const { currentPassword, newPassword } = payload
    const response = yield call(changePassword, { currentPassword, newPassword })
    if (response.status === 200) {
      yield put(
        userActions.changePasswordResult({
          error: null,
          loading: false,
          success: true,
        })
      )
    }
  } catch (error) {
    const { status, data } = error.response
    if (status === 401) {
      yield put(userActions.initUserResult())
    }
    yield put(userActions.changePasswordResult({
      error: data,
      status,
      loading: false,
      success: false,
      data: null,
    }))
  }
}

export function* getMyPhoneNumbers() {
  try {
    const response = yield call(getPurchasedPhoneNumbers)
    if (response.status === 200) {
      yield put(
        userActions.getPurchasedPhoneNumbersResult({
          error: null,
          loading: false,
          success: true,
          data: response.data.data,
        })
      )
    }
  } catch (error) {
    const { status, data } = error.response
    if (status === 401) {
      yield put(userActions.initUserResult())
    }
    yield put(userActions.getPurchasedPhoneNumbersResult({
      error: data,
      status,
      loading: false,
      success: false,
      data: null,
    }))
  }
}

export function* getAvailablePhoneNumbers({ payload }) {
  try {
    const { areaCode } = payload
    const response = yield call(searchAvailablePhoneNumbers, { areaCode })
    if (response.status === 200) {
      yield put(
        userActions.searchAvailablePhoneNumbersResult({
          error: null,
          loading: false,
          success: true,
          data: response.data.data,
        })
      )
    }
  } catch (error) {
    const { status, data } = error.response
    if (status === 401) {
      yield put(userActions.initUserResult())
    }
    yield put(userActions.searchAvailablePhoneNumbersResult({
      error: data,
      status,
      loading: false,
      success: false,
      data: null,
    }))
  }
}

export function* purchaseNumber({ payload }) {
  try {
    const { phoneNumber } = payload
    const response = yield call(purchasePhoneNumber, { phoneNumber })
    if (response.status === 200) {
      yield put(
        userActions.purchasePhoneNumberResult({
          error: null,
          loading: false,
          success: true,
          data: response.data.data,
        })
      )
    }
  } catch (error) {
    const { status, data } = error.response
    if (status === 401) {
      yield put(userActions.initUserResult())
    }
    yield put(userActions.purchasePhoneNumberResult({
      error: data,
      status,
      loading: false,
      success: false,
      data: null,
    }))
  }
}

export function* getTransaction({ payload }) {
  const { page } = payload

  try {
    const response = yield call(getTransactionHistory, { page })
    const { data } = response.data

    if (response.status === 200) {
      yield put(
        userActions.getTransactionResult({
          error: null,
          loading: false,
          success: true,
          page: data.page,
          total: data.total,
          count: data.count,
          count_per_page: data.count_per_page,
          data: data.data,
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
        userActions.getTransactionResult({
          error: null,
          loading: false,
          success: false,
          page: 0,
          total: 0,
          count: 0,
          count_per_page: 0,
          data: [],
        })
      )
    } else {
      yield put(
        userActions.getTransactionResult({
          error: null,
          loading: false,
          success: false,
          page: 0,
          total: 0,
          count: 0,
          count_per_page: 0,
          data: [],
        })
      )
    }
  }
}

export function* updateUserInfo({ payload }) {
  try {
    const { user } = payload
    const response = yield call(updateUserInformation, { user })
    if (response.status === 200) {
      yield put(
        userActions.updateUserInfoResult({
          error: null,
          loading: false,
          success: true,
          data: response.data,
        })
      )
    }
  } catch (error) {
    const { status, data } = error.response
    if (status === 401) {
      yield put(userActions.initUserResult())
    }
    yield put(userActions.updateUserInfoResult({
      error: data,
      status,
      loading: false,
      success: false,
      data: null,
    }))
  }
}

export function* resendVerificationEmail({ payload }) {
  try {
    const { token } = payload
    const response = yield call(resendVerification, { token })
    if (response.status === 200) {
      yield put(
        userActions.resendVerificationResult({
          error: null,
          loading: false,
          success: true,
          data: response.data,
        })
      )
    }
  } catch (error) {
    const { status, data } = error.response
    if (status === 401) {
      yield put(userActions.initUserResult())
    }
    yield put(userActions.resendVerificationResult({
      error: data,
      status,
      loading: false,
      success: false,
      data: null,
    }))
  }
}

export function* setCallForward({ payload }) {
  try {
    const { phoneNumber } = payload
    const response = yield call(updateCallForward, { phoneNumber })
    if (response.status === 200) {
      yield put(
        userActions.setCallForwardResult({
          error: null,
          loading: false,
          success: true,
          data: response.data,
        })
      )
    }
  } catch (error) {
    const { status, data } = error.response
    if (status === 401) {
      yield put(userActions.initUserResult())
    }
    yield put(userActions.setCallForwardResult({
      error: data,
      status,
      loading: false,
      success: false,
      data: null,
    }))
  }
}

export function* updateAddOn({ payload }) {
  try {
    const { type, status } = payload
    const response = yield call(updateUserAddOn, { type, status })
    if (response.status === 200) {
      yield put(
        userActions.updateAddOnResult({
          error: null,
          loading: false,
          success: true,
        })
      )
    }
  } catch (error) {
    const { status, data } = error.response
    if (status === 401) {
      yield put(userActions.initUserResult())
    }
    yield put(userActions.updateAddOnResult({
      error: data,
      status,
      loading: false,
      success: false,
      data: null,
    }))
  }

  const response = yield call(getUserInfo)
  if (response.status === 200) {
    const { user } = payload.user.result
    user.user = response.data.data
    yield put(
      userActions.loginResult({
        error: null,
        loading: false,
        success: true,
        user,
      })
    )
  }
}

export function* forgotUserPassword({ payload }) {
  try {
    const { email } = payload
    const response = yield call(forgotPassword, { email })
    if (response.status === 200) {
      yield put(
        userActions.forgotPasswordResult({
          error: null,
          loading: false,
          success: true,
          data: response.data,
        })
      )
    }
  } catch (error) {
    const { status, data } = error.response
    yield put(userActions.forgotPasswordResult({
      error: data,
      status,
      loading: false,
      success: false,
      data: null,
    }))
  }
}

export function* updateAutoRecharge({ payload }) {
  try {
    const { status, threshold, creditPackageId } = payload
    const response = yield call(updateAutoRechargeSetting, { status, threshold, creditPackageId })
    if (response.status === 200) {
      yield put(
        userActions.updateAutoRechargeResult({
          error: null,
          loading: false,
          success: true,
          data: response.data,
        })
      )
    }
  } catch (error) {
    const { status, data } = error.response
    if (status === 401) {
      yield put(userActions.initUserResult())
    }
    yield put(userActions.updateAutoRechargeResult({
      error: data,
      status,
      loading: false,
      success: false,
      data: null,
    }))
  }
}

export function* cancelUserAccount({ payload }) {
  try {
    const { surveyId, surveyText } = payload
    const response = yield call(cancelUserAcc, { surveyId, surveyText })
    if (response.status === 200) {
      yield put(
        userActions.cancelUserAccountResult({
          error: null,
          loading: false,
          success: true,
          data: response.data,
        })
      )
    }
  } catch (error) {
    const { status, data } = error.response
    yield put(userActions.cancelUserAccountResult({
      error: data,
      status,
      loading: false,
      success: false,
      data: null,
    }))
  }
}

export function* pauseUserAccount({ payload }) {
  try {
    const { surveyId, surveyText } = payload
    const response = yield call(pauseUserAcc, { surveyId, surveyText })
    if (response.status === 200) {
      yield put(
        userActions.pauseUserAccountResult({
          error: null,
          loading: false,
          success: true,
          data: response.data,
        })
      )
    }
  } catch (error) {
    const { status, data } = error.response
    yield put(userActions.pauseUserAccountResult({
      error: data,
      status,
      loading: false,
      success: false,
      data: null,
    }))
  }
}

export function* releasePhone({ payload }) {
  try {
    const { phoneNumber } = payload
    const response = yield call(releasePhoneNumber, { phoneNumber })
    if (response.status === 200) {
      yield put(
        userActions.releasePhoneResult({
          error: null,
          loading: false,
          success: true,
          data: response.data,
        })
      )
    }
  } catch (error) {
    const { status, data } = error.response
    if (status === 401) {
      yield put(userActions.initUserResult())
    }
    yield put(userActions.releasePhoneResult({
      error: data,
      status,
      loading: false,
      success: false,
      data: null,
    }))
  }
}

function* watchUser() {
  yield takeLatest(userConstants.SIGNUP, userSignup)
  yield takeLatest(userConstants.LOGIN, userLogin)
  yield takeLatest(userConstants.LOGOUT, userLogout)
  yield takeLatest(userConstants.INIT_USER, initUser)
  yield takeLatest(userConstants.RESET_PASSWORD, resetUserPassword)
  yield takeLatest(userConstants.CHECK_LOGIN, checkLogin)
  yield takeLatest(userConstants.GET_USER_INFO, getUser)
  yield takeLatest(userConstants.VERIFY, userVerify)
  yield takeLatest(userConstants.REVERIFY, userReVerify)
  yield takeLatest(userConstants.REGISTER_ONE_SIGNAL, registerOneSignalUser)
  yield takeLatest(userConstants.GET_TEAM_MEMBERS, getTeamMembers)
  yield takeLatest(userConstants.INVITE_MEMBER, inviteTeamMember)
  yield takeLatest(userConstants.CANCEL_INVITATION, cancelInvitation)
  yield takeLatest(userConstants.REMOVE_FROM_TEAM, removFromTeam)
  yield takeLatest(userConstants.UPDATE_USER_ROLE, updateTeamUserRole)
  yield takeLatest(userConstants.GET_USER_PING, getUserPing)
  yield takeLatest(userConstants.UPDATE_NOTIFICATION_SETTING, updateNotificationSetting)
  yield takeLatest(userConstants.CHANGE_PASSWORD, updatePassword)
  yield takeLatest(userConstants.GET_PURCHASED_PHONE_NUMBERS, getMyPhoneNumbers)
  yield takeLatest(userConstants.SEARCH_AVAILABLE_PHONE_NUMBERS, getAvailablePhoneNumbers)
  yield takeLatest(userConstants.PURCHASE_PHONE_NUMBER, purchaseNumber)
  yield takeLatest(userConstants.GET_TRANSACTION, getTransaction)
  yield takeLatest(userConstants.UPDATE_USER_INFO, updateUserInfo)
  yield takeLatest(userConstants.RESEND_VERIFICATION, resendVerificationEmail)
  yield takeLatest(userConstants.SET_CALL_FORWARD, setCallForward)
  yield takeLatest(userConstants.UPDATE_ADD_ON, updateAddOn)
  yield takeLatest(userConstants.FORGOT_PASSWORD, forgotUserPassword)
  yield takeLatest(userConstants.UPDATE_AUTO_RECHARGE, updateAutoRecharge)
  yield takeLatest(userConstants.CANCEL_USER_ACCOUNT, cancelUserAccount)
  yield takeLatest(userConstants.PAUSE_USER_ACCOUNT, pauseUserAccount)
  yield takeLatest(userConstants.RELEASE_PHONE, releasePhone)
}

export const userSaga = [fork(watchUser)]
