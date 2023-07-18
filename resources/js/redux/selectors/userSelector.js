import { createSelector } from 'reselect'
import get from 'lodash.get'
import { updateAutoRecharge } from '../modules/user'

const userDataSelector = (state) => state.user

const resultSelector = createSelector(
  userDataSelector,
  (payload) => payload.result
)

const signupResultSelector = createSelector(
  userDataSelector,
  (payload) => payload.signupResult
)

const teamMembersSelector = createSelector(
  userDataSelector,
  (payload) => payload.team_members
)

const inviteMemberSelector = createSelector(
  userDataSelector,
  (payload) => payload.invite_member
)

const selectedMemberSelector = createSelector(
  userDataSelector,
  (payload) => payload.member
)

const userPingSelector = createSelector(
  userDataSelector,
  (payload) => payload.ping
)

const updatePasswordSelector = createSelector(
  userDataSelector,
  (payload) => payload.updatePassword
)

const purchasedPhoneNumbersSelector = createSelector(
  userDataSelector,
  (payload) => payload.purchased_phone_numbers
)

const availablePhoneNumbersSelector = createSelector(
  userDataSelector,
  (payload) => payload.available_phone_numbers
)

const purchasePhoneNumberSelector = createSelector(
  userDataSelector,
  (payload) => payload.purchase_phone_number
)

const transactionSelector = createSelector(
  userDataSelector,
  (payload) => payload.transaction
)

const updateUserInfoSelector = createSelector(
  userDataSelector,
  (payload) => payload.update_user_info
)

const resendVerificationSelector = createSelector(
  userDataSelector,
  (payload) => payload.resend_verification
)

const callForwardSelector = createSelector(
  userDataSelector,
  (payload) => payload.call_forward
)

export const addOnSelector = createSelector(
  userDataSelector,
  (payload) => payload.update_add_on
)

const forgotPasswordSelector = createSelector(
  userDataSelector,
  (payload) => payload.forgot_password
)

const updateAutoRechargeSelector = createSelector(
  userDataSelector,
  (payload) => payload.update_auto_recharge
)

const cancelUserAccountSelector = createSelector(
  userDataSelector,
  (payload) => payload.cancel_user_account
)

const pauseUserAccountSelector = createSelector(
  userDataSelector,
  (payload) => payload.pause_user_account
)

const releasePhoneNumbersSelector = createSelector(
  userDataSelector,
  (payload) => payload.release_phone
)

export const prefrenceMode = createSelector(
  userDataSelector,
  (payload) => payload.prefrence_mode
)

export const loginTagMode = createSelector(
  userDataSelector,
  (payload) => payload.login_tag_mode
)

export const getStreetViewAddonSelector = createSelector(
  resultSelector,
  (payload) => {
    const userAddons = get(payload.user.user, 'add_ons', null);
    return userAddons && !!userAddons.find((aItem) => aItem.add_on === 'street_view')
  }
)

export const userSelector = (state) => ({
  result: resultSelector(state),
  signupResult: signupResultSelector(state),
  team_members: teamMembersSelector(state),
  invite_member: inviteMemberSelector(state),
  member: selectedMemberSelector(state),
  ping: userPingSelector(state),
  updatePassword: updatePasswordSelector(state),
  purchased_phone_numbers: purchasedPhoneNumbersSelector(state),
  available_phone_numbers: availablePhoneNumbersSelector(state),
  purchase_phone_number: purchasePhoneNumberSelector(state),
  transaction: transactionSelector(state),
  update_user_info: updateUserInfoSelector(state),
  resend_verification: resendVerificationSelector(state),
  call_forward: callForwardSelector(state),
  update_add_on: addOnSelector(state),
  forgot_password: forgotPasswordSelector(state),
  update_auto_recharge: updateAutoRechargeSelector(state),
  cancel_user_account: cancelUserAccountSelector(state),
  pause_user_account: pauseUserAccountSelector(state),
  release_phone: releasePhoneNumbersSelector(state),
  prefrence_mode: prefrenceMode(state),
  login_tag_mode: loginTagMode(state)
})
