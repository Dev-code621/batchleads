import { combineReducers } from 'redux'
import { routerReducer as routing } from 'react-router-redux'
import user, { constants as userConstants } from './modules/user'
import credit from './modules/credit'
import property from './modules/property'
import drivingRoutes from './modules/drivingRoutes'
import smsCampaign from './modules/smsCampaign'
import smsTemplate from './modules/smsTemplate'
import mailCampaign from './modules/mailCampaign'
import mailTemplate from './modules/mailTemplate'
import folder from './modules/folder'
import templateStyle from './modules/templateStyle'
import signature from './modules/signature'
import message from './modules/message'
import kpi from './modules/kpi'
import tag from './modules/tag'

const appReducer = combineReducers({
  user,
  credit,
  routing,
  property,
  drivingRoutes,
  smsCampaign,
  smsTemplate,
  mailTemplate,
  folder,
  templateStyle,
  signature,
  mailCampaign,
  message,
  kpi,
  tag,
})

const rootReducer = (state, action) => {
  if (action.type === userConstants.LOGOUT) {
    // eslint-disable-next-line no-param-reassign
    state = undefined
  }

  return appReducer(state, action);
}

export default rootReducer
