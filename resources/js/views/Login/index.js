/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect } from 'react'

import { connect } from 'react-redux'
import { Link, withRouter } from 'react-router-dom'
import { Row, Col } from 'react-flexbox-grid'
import get from 'lodash.get'
import { Base64 } from 'js-base64'
import Section from '~layout/Section'
import Title from '~layout/Title'
import Input from '~components/Input'
import Button from '~components/Button'
import Logo from '~layout/Header/Logo'
import LogoSVG from '~assets/icons/logo_text_new.svg'

import './layout/style.scss'

import { actions as userActions } from '~redux/modules/user'
import { userSelector } from '~redux/selectors/userSelector'
import LoadingActivity from '~components/LoadingActivity'
import TosModalContent from '~components/TosModalContent'
import BaseModal from '~components/BaseModal'
import TosContainer from '~components/TosContainer'

const mapStateToProps = (state) => ({
  user: userSelector(state),
})

const mapDispatchToProps = {
  ...userActions,
}

const Login = withRouter(({
  history, login, user, initUser, resendVerification, changeTagMode,
}) => {
  const loading = get(user.result, 'loading')
  const success = get(user.result, 'success')
  const error = get(user.result, 'error')
  const status = get(user.result, 'status')

  if (window.UsersnapCX) {
    window.UsersnapCX.hideButton()
  }
  if (window.fcWidget) {
    window.fcWidget.destroy()
  }

  useEffect(() => {
    if (success) {
      changeTagMode(true)
      history.push('/dashboard')
    }
  }, [success])

  useEffect(() => {
    initUser()
  }, [])

  const [email, setEmail] = useState('')
  const onChangeEmail = (event) => {
    setEmail(event.target.value)
  }

  const [password, setPassword] = useState('')
  const onChangePassword = (event) => {
    setPassword(event.target.value)
  }

  const [errorEmail, setErrorEmail] = useState('')
  const [errorPassword, setErrorPassword] = useState('')
  const [tos, setTos] = useState(false)
  const [showTos, setShowTos] = useState(false)

  const closeTosModal = () => {
    setShowTos(false)
  }

  const onSignIn = () => {
    initUser()
    setErrorEmail('')
    setErrorPassword('')
    let formError = false
    if (!email) {
      formError = true
      setErrorEmail('Email Field is required.')
    }
    if (!password) {
      formError = true
      setErrorPassword('Password Field is required.')
    }

    if (formError) {
      return
    }

    login(email, password)
  }

  return (
    <Section>
      <div className="sign-page login-page">
        <Row className="panels-container">
          <Col
            sm={12}
            lg={6}
            className="left-panel"
          >
            <div className="login-form">
              <Title title="Welcome back" container="login" description="Sign in to continue" />
              <div className="input-container">
                <Input
                  type="email"
                  value={email}
                  onChange={onChangeEmail}
                  placeholder="Email"
                  width="100%"
                  height={35}
                  className="input"
                  error={errorEmail}
                />
                <Input
                  type="password"
                  value={password}
                  onChange={onChangePassword}
                  placeholder="Password"
                  width="100%"
                  height={35}
                  className="input"
                  error={errorPassword}
                />
              </div>
              {!success && error && (
                <div className="error-message">
                  {error.message}
                  {
                    status === 423 && (
                    <Link
                      to="#"
                      onClick={() => resendVerification(Base64.encode(`${email}:${email}`))}
                      onKeyPress={() => {}}
                      role="button"
                      tabIndex="0"
                    >
                    &nbsp;Resend Verification
                    </Link>
                    )
                  }
                </div>
              )}

              <div className="fp-container">
                <Link
                  to="/forgot-password"
                  role="button"
                  tabIndex="0"
                >
                  Forgot your password?
                </Link>
              </div>
              <TosContainer
                checked={tos}
                onChange={(val) => setTos(val)}
                showTosModal={() => setShowTos(true)}
              />

              {loading ? (
                <LoadingActivity width="100%" />
              ) : (
                <div className="btn-container">
                  <Button label="LOGIN" width="100%" height={35} onClick={onSignIn} disabled={!tos} />
                  <div className="label-or"><span>OR</span></div>
                  <Link to="/signup">
                    <Button label="SIGN UP NOW" width="100%" height={35} />
                  </Link>
                </div>
              )}

            </div>
          </Col>
          <Col
            sm={12}
            lg={6}
            className="right-panel"
          >
            <div className="right-content">
              <Logo src={LogoSVG} />
              <Title title="LIMITED TIME OFFER!" container="slogan" description="7 DAYS TRIAL" />
              <Link className="link-white" to="/signup">
                BACK TO SIGN UP
              </Link>
            </div>
          </Col>
        </Row>
      </div>
      <BaseModal toggle={showTos} onClose={closeTosModal}>
        <TosModalContent />
      </BaseModal>
    </Section>
  )
})

export default connect(mapStateToProps, mapDispatchToProps)(Login)
