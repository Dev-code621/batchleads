/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect } from 'react'

import { connect } from 'react-redux'
import { Link, withRouter } from 'react-router-dom'
import { Row, Col } from 'react-flexbox-grid'

import get from 'lodash.get'
import Section from '~layout/Section'
import Title from '~layout/Title'
import { toast } from '~common/helper'
import Input from '~components/Input'
import Button from '~components/Button'
import Logo from '~layout/Header/Logo'
import LogoSVG from '~assets/icons/logo_text_new.svg'
import { addUserSnap, addFreshChat } from '~common/useScript'

import BackgroundImage from '~assets/images/login-bg.jpg'

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


const ForgotPassword = withRouter(({
  history, user, initForgotPassword, forgotPassword,
}) => {
  const loading = get(user.forgot_password, 'loading')
  const success = get(user.forgot_password, 'success')
  const error = get(user.forgot_password, 'error')
  addUserSnap(true)
  addFreshChat(true)

  useEffect(() => {
    if (success) {
      initForgotPassword()
      toast.success('Password Reset Link sent to your email.')
      history.push('/login')
    }
  }, [success])

  useEffect(() => {
    initForgotPassword()
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

  const [email, setEmail] = useState('')
  const onChangeEmail = (event) => {
    setEmail(event.target.value)
  }


  const [errorEmail, setErrorEmail] = useState('')

  const onReset = () => {
    initForgotPassword()
    setErrorEmail('')
    let formError = false
    if (!email) {
      formError = true
      setErrorEmail('Email Field is required.')
    }

    if (formError) {
      return
    }
    forgotPassword(email)
  }

  return (
    <Section>
      <div className="sign-page fp-page">
        <Row className="panels-container">
          <Col
            sm={12}
            lg={6}
            className="left-panel"
          >
            <div className="login-form">
              <Title title="Forgot your password?" container="login" />
              <div className="input-container">
                <Input
                  type="email"
                  value={email}
                  onChange={onChangeEmail}
                  placeholder="Email"
                  width="100%"
                  height={35}
                  className="input"
                  error={errorEmail || (error && error.error && error.error.email)}
                />
              </div>
              {!success && error && (
                <div className="error-message">
                  {error.message}
                </div>
              )}

              {loading ? (
                <LoadingActivity width="100%" />
              ) : (
                <div className="w-100">
                  {
                    loading ? <LoadingActivity /> : <Button label="RESET" width="100%" height={35} onClick={onReset} />
                  }
                  <div className="label-or"><span>OR</span></div>
                  <Link to="/login">
                    <Button label="BACK TO SIGN IN" width="100%" height={35} />
                  </Link>
                </div>
              )}

            </div>
          </Col>
          <Col
            sm={12}
            lg={6}
            className="right-panel"
            style={{ backgroundImage: `url(${BackgroundImage})` }}
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
    </Section>
  )
})

export default connect(mapStateToProps, mapDispatchToProps)(ForgotPassword)
