import React, { useEffect } from 'react'
import {
  Route, Switch, Redirect, withRouter,
} from 'react-router-dom'
import { connect } from 'react-redux'
import { Row, Col } from 'react-flexbox-grid'
import Section from '~layout/Section'
import { actions as userActions } from '~redux/modules/user'
import { userSelector } from '~redux/selectors/userSelector'
import { addUserSnap, addFreshChat } from '~common/useScript'
import './style.scss'
import routes from './routes'

const mapStateToProps = (state) => ({
  user: userSelector(state),
})

const mapDispatchToProps = {
  ...userActions,
}

const Subscribe = withRouter(({
  history, user,
}) => {
  const { success } = user.result
  addUserSnap(true)
  addFreshChat(true)

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
      const stripeId = user.result.user.user.stripe_id
      const isPaused = user.result.user.user.is_paused
      const isCancelled = user.result.user.user.is_cancelled
      if (stripeId !== '' && !isPaused && stripeId && !isCancelled) {
        history.push('/dashboard')
      }
    }
  }, [user])

  useEffect(() => {
    showWindow()
  }, [])

  return (
    <Section className="subscribe-page">
      <Row className="subscribe-form">
        <Col sm={12}>
          <Switch>
            {success ? (
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
          {/* <div className="tos-footer">
            <Tos />
          </div> */}
        </Col>
      </Row>
    </Section>
  )
})

export default connect(mapStateToProps, mapDispatchToProps)(Subscribe)
