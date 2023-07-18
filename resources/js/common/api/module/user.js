import qs from 'querystring'
import httpClient from '../httpClient'

export const signup = (data) => {
  return httpClient.post('/users/register', qs.stringify(data))
}

export const login = ({ email, password, skipVerification = 1 }) => {
  return httpClient.post('/users/login', qs.stringify({ email, password, skip_verification: skipVerification }))
}

export const logout = ({ oneSignalUserId }) => {
  return httpClient.get(`/users/logout?one_signal_user_id=${oneSignalUserId}`)
}

export const resetPassword = ({ email, password, token }) => {
  return httpClient.post('/users/changePassword', qs.stringify({ email, new_password: password, token }))
}

export const getUserInfo = () => {
  return httpClient.get('/users/getUserInfo')
}

export const verify = ({ token }) => {
  return httpClient.get(`/users/verify?token=${token}`)
}

export const resendVerify = ({ token }) => {
  return httpClient.get(`/users/verify/resend?token=${token}`)
}

export const registerOneSignal = ({ oneSignalUserId }) => {
  return httpClient.get(`/users/registerOneSignal?one_signal_user_id=${oneSignalUserId}`)
}

export const getMyTeamMembers = () => {
  return httpClient.get('/team/getTeamMembers')
}

export const inviteMyTeamMember = ({ email }) => {
  return httpClient.post('/team/user/invite', qs.stringify({ email }))
}

export const cancelMyInvitation = ({ id }) => {
  return httpClient.get(`team/user/invite/cancel/${id}`)
}

export const removeFromMyTeam = ({ id }) => {
  return httpClient.get(`team/user/remove/${id}`)
}

export const updateUserRole = ({ userId, role }) => {
  return httpClient.post('/users/updateUserRole', qs.stringify({ user_id: userId, role }))
}

export const getPing = ({ userId }) => {
  return httpClient.get(`users/ping?user_id=${userId}`)
}

export const updateUserNotificationSetting = ({ notificationType, status }) => {
  return httpClient.put('users/notification/update',
    {
      enabled: status,
      notification_type: notificationType,
    })
}

export const changePassword = ({ currentPassword, newPassword }) => {
  return httpClient.post('users/changePassword',
    {
      cur_password: currentPassword,
      new_password: newPassword,
    })
}

export const getPurchasedPhoneNumbers = () => {
  return httpClient.get('twilio/getPurchasedPhoneNumbers')
}

export const searchAvailablePhoneNumbers = ({ areaCode = '', count = 5 }) => {
  return httpClient.get(`twilio/searchAvailablePhoneNumbers?count=${count}&area_code=${areaCode}`)
}

export const purchasePhoneNumber = ({ phoneNumber }) => {
  return httpClient.get(`twilio/purchasePhoneNumber?phone_number=${phoneNumber}`)
}

export const getTransactionHistory = ({ page }) => {
  return httpClient.get(`credit/transaction/history/${page}`)
}

export const updateUserInformation = ({ user }) => {
  const formData = new FormData()
  const keys = Object.keys(user)
  keys.forEach((key) => {
    if (key !== 'file') {
      if (user[key]) {
        formData.append(key, user[key])
      }
    }
  })
  const { file } = user
  if (file) {
    formData.append('file', file)
  }

  return httpClient.post('users/update', formData)
}

export const resendVerification = ({ token }) => {
  return httpClient.get(`users/verify/resend?token=${token}`)
}

export const updateCallForward = ({ phoneNumber }) => {
  return httpClient.post('users/callforwarding',
    {
      phone_number: phoneNumber,
    })
}

export const updateUserAddOn = ({ type, status }) => {
  if (status) {
    return httpClient.post('users/addon',
      {
        add_on: type,
      })
  }

  return httpClient.delete(`users/addon?add_on=${type}`)
}

export const forgotPassword = ({ email }) => {
  return httpClient.post('users/forgotPassword',
    {
      email,
    })
}

export const updateAutoRechargeSetting = ({ status, threshold, creditPackageId }) => {
  if (status) {
    return httpClient.post('users/autoRechargeSetting',
      {
        status,
        threshold,
        credit_package_id: creditPackageId,
      })
  }
  return httpClient.post('users/autoRechargeSetting',
    {
      status,
    })
}

export const cancelUserAcc = ({ surveyId, surveyText }) => {
  return httpClient.post('users/cancel',
    {
      survey_id: surveyId,
      text: surveyText,
    })
}

export const pauseUserAcc = ({ surveyId, surveyText }) => {
  return httpClient.post('users/pause',
    {
      survey_id: surveyId,
      text: surveyText,
    })
}

export const releasePhoneNumber = ({ phoneNumber }) => {
  return httpClient.get(`twilio/releasePhoneNumber?phone_number=${phoneNumber}`)
}
