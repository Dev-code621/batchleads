import React, { useState, useEffect } from 'react'
import {
  Route, Switch, Redirect, withRouter,
} from 'react-router-dom'
import { connect } from 'react-redux'
import get from 'lodash.get'
import { Base64 } from 'js-base64'
import TagManager from 'react-gtm-module'
import { actions as userActions } from '~redux/modules/user'
import { actions as messageActions } from '~redux/modules/message'
import { actions as folderActions } from '~redux/modules/folder'
import { actions as tagActions } from '~redux/modules/tag'
import { actions as drivingRoutesActions } from '~redux/modules/drivingRoutes'
import { userSelector } from '~redux/selectors/userSelector'
import { messageSelector } from '~redux/selectors/messageSelector'
import { useThemeState } from '~common/theme-context'
import { addUserSnap, addFreshChat } from '~common/useScript'
import SideMenu from './SideMenu'
import routes from './routes'
import GoogleMap from './Map/index'
import ContentToggle from './ContentToggle'
import { toast } from '~common/helper'

import './style.scss'
import FullWidthView from './FullWidthView'
import VerifyNeededBanner from './VerifyNeededBanner'

const mapStateToProps = (state) => ({
  user: userSelector(state),
  message: messageSelector(state),
})

const mapDispatchToProps = {
  ...userActions,
  ...messageActions,
  ...drivingRoutesActions,
  ...folderActions,
  ...tagActions,
}

const Dashboard = withRouter(({
  history,
  user,
  initUser,
  logout,
  registerOneSignal,
  getMessageBox,
  receiveMessage,
  getTotalBadge,
  message,
  // initDrivingRoute,
  getFolders,
  getTags,
  getUser,
  resendVerification,
  changeTagMode,
}) => {
  const { success, loading, user: userDetails } = user.result
  const subscriptionDetails = userDetails && userDetails.user && userDetails.user.subscription
  const emailAddress = user.result.user ? get(user.result.user.user, 'email') : null
  const eamailVerifiedAt = user.result.user ? get(user.result.user.user, 'email_verified_at') : null
  const resending = get(user.resend_verification, 'loading')

  const [isSideBarActive, setIsSideBarActive] = useState(false)
  const [hideContentToggle, setHideContentToggle] = useState(false)
  const theme = useThemeState()
  addUserSnap(true)
  addFreshChat(true)

  const setupFc = (userId, name, email) => {
    window.fcWidget.setExternalId(userId)
    window.fcWidget.user.setFirstName(name)
    window.fcWidget.user.setEmail(email)
  }

  const showWindow = () => {
    if (window.UsersnapCX) {
      window.UsersnapCX.showButton()
    } else {
      setTimeout(() => {
        showWindow()
      }, 100)
    }
  }

  useEffect(() => {
    if (success) {
      const OneSignal = window.OneSignal || []
      OneSignal.push(() => {
        OneSignal.init({
          appId: __CONFIG__.ONE_SIGNAL_APP_ID,
          allowLocalhostAsSecureOrigin: true,
        })
        OneSignal.on('subscriptionChange', () => {
          OneSignal.getUserId((userId) => {
            localStorage.setItem('oneSignalUserId', userId)
            if (userId) {
              registerOneSignal(userId)
            }
          })
        })
        OneSignal.getUserId((userId) => {
          localStorage.setItem('oneSignalUserId', userId)
          if (userId) {
            registerOneSignal(userId)
          }
        })
      })

      OneSignal.push(() => {
        OneSignal.on('notificationDisplay', (event) => {
          const { data } = event
          if (data) {
            const { type } = data
            if (type === 'sms') {
              getMessageBox(1)
              getTotalBadge()
              const { master_id: masterId, sms_detail: smsDetail } = data
              const pathName = history.location.pathname
              if (pathName !== `/dashboard/messages/${masterId}`) {
                // history.push(`/dashboard/messages/${masterId}`)
              } else {
                receiveMessage(smsDetail)
              }
            }
          }
        })
      })

      const stripeId = get(user.result.user.user, 'stripe_id')
      const role = get(user.result.user.user, 'role')
      const preSelectedPlanIndex = get(user.result.user.user, 'pre_selected_plan_index')
      if (!stripeId && role === 'owner') {
        if (preSelectedPlanIndex) {
          history.push('/subscribe/choosePlan', { selected_plan_index: preSelectedPlanIndex })
        } else {
          history.push('/subscribe')
        }
      }

      // Configure freshchat widget
      const name = user.result.user ? get(user.result.user.user, 'name') : null
      const userId = user.result.user ? get(user.result.user.user, 'id') : null
      const email = user.result.user ? get(user.result.user.user, 'email') : null
      const interVal = setInterval(() => {
        if (window.fcWidget) {
          clearInterval(interVal)
          setupFc(userId, name, email)
        }
      }, 1000)

      getUser(user)
      getTotalBadge()
      getFolders()
      getTags()
    } else if (!loading) {
      const tagManagerArgs = {
        dataLayer: {
          event: 'user_logged_out',
          user_id: undefined,
          user_email: undefined,
          user_email_verified: undefined,
          user_full_name: undefined,
          user_lists_plan: undefined,
          user_package: undefined,
          user_package_span: undefined,
          user_payment_due: undefined,
          user_type: undefined,
          user_wallet_balance: undefined,
        },
      }
      TagManager.dataLayer(tagManagerArgs)
      const reset = function() {
        this.reset();
      }
      const tagManagerArgs2 = {
        dataLayer: reset,
      }
      TagManager.dataLayer(tagManagerArgs2)
      window.location.reload();
    }
  }, [user.result.success])

  useEffect(() => {
    if (user.result.success) {
      const isPaused = get(user.result.user.user, 'is_paused')
      const isCancelled = get(user.result.user.user, 'is_cancelled')
      const isPastDue = get(user.result.user.user, 'is_pastdue')
      const role = get(user.result.user.user, 'role')
      if (isPastDue && role === 'owner') {
        toast.error('You have an incomplete payment!')
        history.push('/dashboard/settings/paymentmethod')
      } else if ((isPaused || isCancelled) && role === 'owner') {
        history.push('/subscribe')
      }
    }
  }, [user.result])

  useEffect(() => {
    if (user.login_tag_mode && success && subscriptionDetails) {
      const tagManagerArgs = {
        dataLayer: {
          event: 'user_logged_in',
          user_id: userDetails.user.id,
          user_email: userDetails.user.email,
          user_email_verified: userDetails.user.email_verified_at ? 1 : 0,
          user_full_name: userDetails.user.name,
          user_lists_plan: userDetails.user.subscribed_plan,
          user_package: userDetails.user.subscribed_plan,
          user_package_span: subscriptionDetails.interval,
          user_payment_due: userDetails.user.is_pastdue,
          user_type: userDetails.user.role,
          user_wallet_balance: userDetails.user.credit ? userDetails.user.credit.ballance : 0,
        },
      }
      TagManager.dataLayer(tagManagerArgs)
      changeTagMode(false)
    }
  }, [user.login_tag_mode, success, subscriptionDetails])

  useEffect(() => {
    showWindow()
  }, [])

  history.listen(() => {
    // initDrivingRoute()
    setHideContentToggle(false)
  })

  const onToggleSideBar = () => {
    setIsSideBarActive(!isSideBarActive)
  }

  const onToggleModal = () => {
    setHideContentToggle(!hideContentToggle)
  }

  const onLogout = () => {
    initUser()
    logout(localStorage.getItem('oneSignalUserId'))
  }

  const { pathname } = history.location

  return (
    <div className={isSideBarActive ? 'layout' : 'layout layout-active'}>
      <div className={`layout_sidebar ${theme.theme}`}>
        <SideMenu
          isSideBarActive={isSideBarActive}
          toggleSideBar={onToggleSideBar}
          onLogout={onLogout}
          user={user}
          message={message}
        />
        <main className="layout_content">
          {
            pathname === '/dashboard/affiliates' || pathname === '/dashboard/kpis'
              ? (
                <React.Fragment>
                  {success && !loading ? <FullWidthView pathname={pathname} /> : (
                    <Redirect
                      to={{
                        pathname: '/login',
                      }}
                    />
                  )}
                </React.Fragment>
              )
              : (
                <React.Fragment>
                  <ContentToggle
                    history={history}
                    toggle={onToggleModal}
                    isActiveContent={!hideContentToggle}
                  >
                    <Switch>
                      {success && !loading ? (
                        routes.map((route) => {
                          return route.component ? (
                            <Route
                              key={route.name}
                              path={route.path}
                              exact={route.exact}
                              name={route.name}
                              render={(props) => <route.component {...props} />}
                            />
                          ) : null
                        })
                      ) : (
                        <Redirect
                          to={{
                            pathname: '/login',
                          }}
                        />
                      )}
                    </Switch>
                  </ContentToggle>
                </React.Fragment>
              )
          }
          <GoogleMap />
        </main>
        {
          (typeof eamailVerifiedAt !== 'undefined') && !eamailVerifiedAt && <VerifyNeededBanner loading={resending} email={emailAddress} onClick={() => resendVerification(Base64.encode(`${emailAddress}:${emailAddress}`))} />
        }
      </div>
    </div>
  )
})

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard)
