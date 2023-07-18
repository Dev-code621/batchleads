import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'

import { Link, withRouter } from 'react-router-dom'
import { Row, Col } from 'react-flexbox-grid'
import { TiSocialInstagram } from 'react-icons/ti'
import { FaFacebookSquare, FaYoutube } from 'react-icons/fa'
import get from 'lodash.get'
import Section from '~layout/Section'
import Title from '~layout/Title'
import Logo from '~layout/Header/Logo'
import Button from '~components/Button'
import './layout/style.scss'

import { actions as userActions } from '~redux/modules/user'
import { userSelector } from '~redux/selectors/userSelector'
import LoadingActivity from '~components/LoadingActivity'
import SubDescription from '~layout/SubDescription'
import TosModalContent from '~components/TosModalContent'
import BaseModal from '~components/BaseModal'
import { addUserSnap, addFreshChat } from '~common/useScript'

const mapStateToProps = (state) => ({
  user: userSelector(state),
})

const mapDispatchToProps = {
  ...userActions,
}

const Verify = withRouter(({
  verify, initUser, resendVerification, user, match, history,
}) => {
  const [showTos, setShowTos] = useState(false)
  const { loading, success, error } = user.result
  const resending = get(user.resend_verification, 'loading')
  const resendError = get(user.resend_verification, 'error')
  const token = get(match.params, 'token')
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
    initUser()
    verify(token)
    showWindow()
  }, [])

  const resendVerificationLink = () => {
    resendVerification(token)
  }

  const closeTosModal = () => {
    setShowTos(false)
  }

  const showHelp = () => {
    if (window.UsersnapCX) {
      window.UsersnapCX.open();
    }
  }

  return (
    <Section>
      <Row className="verify-page">
        <Col sm={12} className="verify-form">
          <div className="logo">
            <Logo />
          </div>
          <Title title={success ? 'Well Done!' : 'Verify Account'} description={success && 'Your Email is verified!'} />
          <div className="input-container">
            {(loading || resending) && <LoadingActivity width="100%" />}
            {
              error && error.message && <div className="error-message">{error.message}</div>
            }
            {
              resendError && resendError.message && <div className="error-message">{resendError.message}</div>
            }
            {
              success && (
                <Button
                  label="LET'S START"
                  width="300px"
                  onClick={() => history.push('/login')}
                />
              )
            }
            {
              (error && error.status !== 421)
                ? (
                  <Link to="/login">
                    <Button
                      label="LOG IN"
                      width="300px"
                      onClick={() => {}}
                    />
                  </Link>
                )
                : (
                  error && error.status === 421 && !resending && (
                    <Button
                      label="RESEND VERIFICATION LINK"
                      width="100%"
                      onClick={() => resendVerificationLink()}
                    />
                  )
                )
            }
            <div className="footer">
              <SubDescription text="You can also find us:" textAlign="center" />
              <div className="social">
                <a href="https://www.facebook.com/groups/goknock" target="_blank" rel="noopener noreferrer">
                  <FaFacebookSquare className="social-icon" />
                </a>
                <a href="https://www.youtube.com/channel/UCMlCyc6QB0pq1wDj-ldiIMA?view_as=subscriber" target="_blank" rel="noopener noreferrer">
                  <FaYoutube className="social-icon" />
                </a>
                <a href="https://www.instagram.com/goknockapp/" target="_blank" rel="noopener noreferrer">
                  <TiSocialInstagram className="social-icon" />
                </a>
              </div>
              <div className="nav-bar">
                {/* <div onClick={() => setShowTos(true)}>Terms and Conditions</div> */}
                <Link to="/tos">Terms and Conditions</Link>
                <div>&nbsp;|&nbsp;</div>
                <div onClick={showHelp}>Get Support</div>
              </div>
            </div>
          </div>
        </Col>
      </Row>
      <BaseModal toggle={showTos} onClose={closeTosModal}>
        <TosModalContent />
      </BaseModal>
    </Section>
  )
})

export default connect(mapStateToProps, mapDispatchToProps)(Verify)
