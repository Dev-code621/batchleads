import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'

import { withRouter } from 'react-router-dom'
import { Row, Col } from 'react-flexbox-grid'

import get from 'lodash.get'
import { Base64 } from 'js-base64'
import Section from '~layout/Section'
import Title from '~layout/Title'
import Logo from '~layout/Header/Logo'
import Input from '~components/Input'
import Button from '~components/Button'
import { addUserSnap, addFreshChat } from '~common/useScript'
import './layout/style.scss'

import { actions as userActions } from '~redux/modules/user'
import { userSelector } from '~redux/selectors/userSelector'
import LoadingActivity from '~components/LoadingActivity'

const mapStateToProps = (state) => ({
  user: userSelector(state),
})

const mapDispatchToProps = {
  ...userActions,
}

const ResetPassword = withRouter(({
  history, resetPassword, initUser, user, match,
}) => {
  const {
    loading, success, error, status,
  } = user.result
  const encodedToken = get(match.params, 'token')
  addUserSnap(true)
  addFreshChat(true)
  let email = ''
  let token = ''
  if (encodedToken) {
    const decodedStr = Base64.decode(encodedToken)
    const splits = decodedStr.split(':')
    if (splits.length === 2) {
      [token, email] = splits
    }
  }

  useEffect(() => {
    if (success) {
      initUser()
      history.push('/login')
    }
  }, [user.result.success])

  useEffect(() => {
    initUser()
    showWindow()
  }, [])

  const showWindow = () => {
    if (window.UsersnapCX) {
      window.UsersnapCX.showButton()
    } else {
      setTimeout(() => {
        showWindow()
      }, 100)
    }
  }

  const [password, setPassword] = useState('')
  const onChangePassword = (event) => {
    setPassword(event.target.value)
  }

  const [confirmPassword, setConfirmPassword] = useState('')
  const onChangeConfirmPassword = (event) => {
    setConfirmPassword(event.target.value)
  }

  const [errorPasswordMismatch, setErrorPasswordMismatch] = useState('')

  const onResetPassword = () => {
    initUser()
    setErrorPasswordMismatch('')

    let formError = false
    if (password !== confirmPassword) {
      formError = true
      setErrorPasswordMismatch('Passwords are mismatching.')
    }

    if (formError) {
      return
    }

    const data = {
      email,
      password,
      token,
    }
    resetPassword(data)
  }

  return (
    <Section>
      <Row className="reset-password-page">
        <Col sm={12} className="signup-form">
          <div className="logo">
            <Logo />
          </div>
          <Title title="Reset Password" />
          <div className="input-container">
            {
              email && token ? (
                <React.Fragment>
                  <Input
                    type="password"
                    value={password}
                    onChange={onChangePassword}
                    placeholder="Your Password"
                    error={error && error.error && error.error.new_password}
                  />
                  <Input
                    type="password"
                    value={confirmPassword}
                    onChange={onChangeConfirmPassword}
                    placeholder="Retype Password"
                    error={errorPasswordMismatch}
                  />
                  {!success && status !== 200 && error && (
                    <div className="error-message">{error.message}</div>
                  )}
                  {loading ? (
                    <LoadingActivity width="100%" />
                  ) : (
                    <Button
                      label="RESET"
                      width="100%"
                      onClick={onResetPassword}
                    />
                  )}
                </React.Fragment>
              ) : (
                <div className="invalid-description">This link is invalid.</div>
              )
          }
          </div>
        </Col>
      </Row>
    </Section>
  )
})

export default connect(mapStateToProps, mapDispatchToProps)(ResetPassword)
