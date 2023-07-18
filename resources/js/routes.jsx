import React, { useEffect } from 'react'
import {
  Route,
  Switch,
  withRouter,
} from 'react-router-dom'
import TagManager from 'react-gtm-module'

import Main from '~views/Main'
import Signup from '~views/Signup'
import Login from '~views/Login'
import ResetPassword from '~views/ResetPassword'
import ForgotPassword from '~views/ForgotPassword'
import Dashboard from '~views/Dashboard'
import Subscribe from '~views/Subscribe'
import Verify from '~views/Verify'

import '../style/index.scss'

export default withRouter(({ location }) => {
  const { pathname } = location
  useEffect(() => {
    const tagManagerArgs = {
      dataLayer: {
        event: 'page',
        pageName: pathname,
      },
    }
    TagManager.dataLayer(tagManagerArgs)
  }, [pathname])

  return (
    <Switch>
      <Route exact path="/" component={Main} />
      <Route exact path="/signup" component={Signup} />
      <Route exact path="/signup/:token" component={Signup} />
      <Route exact path="/verify/:token" component={Verify} />
      <Route exact path="/login" component={Login} />
      <Route exact path="/subscribe" component={Subscribe} />
      <Route exact path="/subscribe/*" component={Subscribe} />
      <Route exact path="/reset-password" component={ResetPassword} />
      <Route exact path="/forgot-password" component={ForgotPassword} />
      <Route exact path="/reset-password/:token" component={ResetPassword} />
      <Route exact path="/dashboard" component={Dashboard} />
      <Route exact path="/dashboard/*" component={Dashboard} />
      <Route exact path="*" component={Main} />
    </Switch>
  )
})
