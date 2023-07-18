import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { Link, withRouter } from 'react-router-dom'
import { Row, Col } from 'react-flexbox-grid'
import get from 'lodash.get'
import { Base64 } from 'js-base64'
import TagManager from 'react-gtm-module'
import Section from '~layout/Section'
import Title from '~layout/Title'
// import SubTitle from '~layout/SubTitle'
import Logo from '~layout/Header/Logo'
import Input from '~components/Input'
import Button from '~components/Button'
import BackgroundImage from '~assets/images/login-bg.jpg'
import LogoSVG from '~assets/icons/logo_text_new.svg'
import RegUserSVG from '~assets/icons/reg-user.svg'

import { actions as userActions } from '~redux/modules/user'
import { userSelector } from '~redux/selectors/userSelector'
import LoadingActivity from '~components/LoadingActivity'

import User from '~assets/icons/user.svg'
import Phone from '~assets/icons/phone.svg'
import { formatPhoneInput, isValidName } from '~common/helper'

import './layout/style.scss'

const mapStateToProps = (state) => ({
  user: userSelector(state),
})

const mapDispatchToProps = {
  ...userActions,
}

const SignUp = withRouter(
  ({
    signup,
    initUser,
    user,
    match,
    history,
    // resendVerification,
    login,
  }) => {
    let selectedPlanIndex = null
    if (history.location.state) {
      selectedPlanIndex = history.location.state.plan_id && history.location.state.plan_id
    }
    const [invitationEmailAddress, setInvitationEmailAddress] = useState('')
    // const [successMessage, setSuccessMessage]
    // = useState('Verify your e-mail to finish signing up for BatchDriven.')
    // const [resend, setResend] = useState(true)

    const { loading, success, error } = user.signupResult
    const {
      loading: loginLoading,
      success: loginSuccess,
      error: loginError,
      user: userDetails,
    } = user.result
    // const resending = get(user.resend_verification, 'loading')
    // const resendError = get(user.resend_verification, 'error')

    const token = get(match.params, 'token')
    if (window.UsersnapCX) {
      window.UsersnapCX.hideButton()
    }
    if (window.fcWidget) {
      window.fcWidget.destroy()
    }

    useEffect(() => {
      initUser()
      if (token) {
        // setResend(false)
        // setSuccessMessage('You have been registered.<br />Please login now.')
        const decodedStr = Base64.decode(token)
        const splits = decodedStr.split(':')
        if (splits.length === 3) {
          const emailAddress = splits[0]
          setInvitationEmailAddress(emailAddress)
        }
      }
    }, [])

    const [email, setEmail] = useState('')
    const onChangeEmail = (event) => {
      setEmail(event.target.value)
    }

    const [firstName, setFirstName] = useState('')
    const onChangeFirstName = (event) => {
      if (isValidName(event.target.value)) {
        setFirstName(event.target.value)
      }
    }

    const [lastName, setLastName] = useState('')
    const onChangeLastName = (event) => {
      if (isValidName(event.target.value)) {
        setLastName(event.target.value)
      }
    }

    const [phone, setPhone] = useState('')

    const [password, setPassword] = useState('')
    const onChangePassword = (event) => {
      setPassword(event.target.value)
    }

    const [confirmPassword, setConfirmPassword] = useState('')
    const onChangeConfirmPassword = (event) => {
      setConfirmPassword(event.target.value)
    }

    const [errorFirstName, setErrorFirstName] = useState('')
    const [errorLastName, setErrorLastName] = useState('')
    const [errorPasswordMismatch, setErrorPasswordMismatch] = useState('')

    useEffect(() => {
      if (success) {
        const tagManagerArgs = {
          dataLayer: {
            event: 'user_registration',
          },
        }
        TagManager.dataLayer(tagManagerArgs)
        if (invitationEmailAddress) {
          login(invitationEmailAddress, password)
        } else {
          login(email, password)
        }
      }
    }, [success])

    useEffect(() => {
      if (loginSuccess && userDetails) {
        if (userDetails.user) {
          const tagManagerArgs = {
            dataLayer: {
              event: 'user_logged_in',
              user_id: userDetails.user.id,
              user_email: userDetails.user.email,
              user_email_verified: userDetails.user.email_verified_at ? 1 : 0,
              user_full_name: userDetails.user.name,
              user_lists_plan: userDetails.user.subscribed_plan,
              user_package: userDetails.user.subscribed_plan,
              user_package_span: userDetails.user.subscription ? userDetails.user.subscription.interval : '',
              user_payment_due: userDetails.user.is_pastdue,
              user_type: userDetails.user.role,
              user_wallet_balance: userDetails.user.credit ? userDetails.user.credit.ballance : 0,
            },
          }
          TagManager.dataLayer(tagManagerArgs)
        }
        history.push('/dashboard')
      }
    }, [loginSuccess, userDetails])

    const onSignUp = () => {
      initUser()
      setErrorFirstName('')
      setErrorLastName('')
      setErrorPasswordMismatch('')

      let formError = false
      if (!firstName) {
        formError = true
        setErrorFirstName('First Name Field is required.')
      }
      if (!lastName) {
        formError = true
        setErrorLastName('Last Name Field is required.')
      }
      if (password !== confirmPassword) {
        formError = true
        setErrorPasswordMismatch('Passwords are mismatching.')
      }

      if (formError) {
        return
      }

      const data = {
        name: `${firstName} ${lastName}`,
        phone,
        email: invitationEmailAddress || email,
        password,
        token,
        plan_index: selectedPlanIndex,
        tracking_ref_id: localStorage.getItem('tracking_ref_id'),
      }
      signup(data)
    }

    return (
      <Section>
        <div className="sign-page signup-page">
          <Row className="panels-container">
            <Col sm={12} lg={6} className="left-panel">
              <div className="decoration">
                <img src={RegUserSVG} alt="user" />
              </div>
              <div className="login-form">
                <Title
                  title="Registration"
                  container="login"
                  description="Enter your personal data"
                />
                {/*
                success && resend && (
                <div className="title-container">
                  <SubTitle title="Didn't receive email?" container="login" />
                  {
                    resending ? <LoadingActivity width="100%" /> : (
                      <Button
                        label="RESEND VERIFICATION"
                        width="100%"
                        height={35}
                        onClick={() => resendVerification(Base64.encode(`${email}:${email}`))}
                      />
                    )
                  }
                  {
                    resendError && <div className="error-message">{resendError.message}</div>
                  }
                </div>
                )
                */}
                <div className="input-container">
                  {/*
                !success && (
                <React.Fragment>
                  <Input
                    type="text"
                    value={firstName}
                    onChange={onChangeFirstName}
                    placeholder="Your First Name"
                    width="100%"
                    className="input"
                    error={errorFirstName}
                    icon={User}
                    height={35}
                  />
                  <Input
                    type="text"
                    value={lastName}
                    onChange={onChangeLastName}
                    placeholder="Your Last Name"
                    width="100%"
                    className="input"
                    error={errorLastName}
                    icon={User}
                    height={35}
                  />
                  <Input
                    placeholder="Phone Number"
                    value={formatPhoneInput(phone)}
                    onChange={(e) => setPhone(e.target.value)}
                    type="text"
                    error={error && error.error && error.error.phone}
                    icon={Phone}
                    height={35}
                  />
                  <Input
                    type="email"
                    value={invitationEmailAddress || email}
                    onChange={onChangeEmail}
                    placeholder="Email Address"
                    width="100%"
                    className="input"
                    error={error && error.error && error.error.email}
                    readOnly={!!invitationEmailAddress}
                    height={35}
                  />
                  <Input
                    type="password"
                    value={password}
                    onChange={onChangePassword}
                    placeholder="Your Password"
                    width="100%"
                    className="input"
                    error={error && error.error && error.error.password}
                    height={35}
                  />
                  <Input
                    type="password"
                    value={confirmPassword}
                    onChange={onChangeConfirmPassword}
                    placeholder="Retype Password"
                    width="100%"
                    className="input"
                    error={errorPasswordMismatch}
                    height={35}
                  />
                  {
                    error && <div className="error-message">{error.message}</div>
                  }
                  {loading ? (
                    <LoadingActivity width="100%" />
                  ) : (
                    <Button
                      label="CONTINUE TO PLAN"
                      width="90%"
                      height={35}
                      onClick={onSignUp}
                    />
                  )}
                </React.Fragment>
                  ) */}
                  <React.Fragment>
                    <Input
                      type="text"
                      value={firstName}
                      onChange={onChangeFirstName}
                      placeholder="Your First Name"
                      width="100%"
                      className="input"
                      error={errorFirstName}
                      icon={User}
                      height={35}
                    />
                    <Input
                      type="text"
                      value={lastName}
                      onChange={onChangeLastName}
                      placeholder="Your Last Name"
                      width="100%"
                      className="input"
                      error={errorLastName}
                      icon={User}
                      height={35}
                    />
                    <Input
                      placeholder="Phone Number"
                      value={formatPhoneInput(phone)}
                      onChange={(e) => setPhone(e.target.value)}
                      type="text"
                      error={error && error.error && error.error.phone}
                      icon={Phone}
                      height={35}
                    />
                    <Input
                      type="email"
                      value={invitationEmailAddress || email}
                      onChange={onChangeEmail}
                      placeholder="Email Address"
                      width="100%"
                      className="input"
                      error={error && error.error && error.error.email}
                      readOnly={!!invitationEmailAddress}
                      height={35}
                    />
                    <Input
                      type="password"
                      value={password}
                      onChange={onChangePassword}
                      placeholder="Your Password"
                      width="100%"
                      className="input"
                      error={error && error.error && error.error.password}
                      height={35}
                    />
                    <Input
                      type="password"
                      value={confirmPassword}
                      onChange={onChangeConfirmPassword}
                      placeholder="Retype Password"
                      width="100%"
                      className="input"
                      error={errorPasswordMismatch}
                      height={35}
                    />
                    {error && (
                      <div className="error-message">{error.message}</div>
                    )}
                    {loginError && (
                      <div className="error-message">{loginError.message}</div>
                    )}
                    {(loading || loginLoading) ? (
                      <LoadingActivity width="100%" />
                    ) : (
                      <Button
                        label="CONTINUE"
                        width="90%"
                        height={35}
                        onClick={onSignUp}
                      />
                    )}
                  </React.Fragment>
                </div>
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
                <Title
                  title="LIMITED TIME OFFER!"
                  container="slogan"
                  description="7 DAYS TRIAL"
                />
                <Link className="link-white" to="/login">
                  BACK TO LOGIN
                </Link>
              </div>
            </Col>
          </Row>
        </div>
      </Section>
    )
  }
)

export default connect(mapStateToProps, mapDispatchToProps)(SignUp)
