import React from 'react'
import { Row, Col } from 'react-flexbox-grid'
import Laptop from '~assets/images/laptop.svg'
import Ttp from '~assets/images/ttp.png'
import TtpLogo from '~assets/images/ttp_logo.png'
import HeroIntro from '../../layout/HeroIntro'

export default ({ onGetStart }) => (
  <Row className="hero-container container squad">
    <Col xs={12} md={12} lg={6} className="right">
      <div className="top">
        <div className="skip-traces-for">
        50 skip traces for
        </div>
        <div className="free-trial">
          <div className="free">Free</div>
          <div className="trial">7 days trial</div>
        </div>
      </div>
      <img src={Ttp} alt="affiliate" className="ttp" />
      <img src={Laptop} alt="latptop" className="laptop" />
    </Col>
    <Col xs={12} md={12} lg={6} className="left">
      <img src={TtpLogo} alt="TTP Logo" className="logo" />
      <HeroIntro onGetStart={onGetStart} hideFreeTrial hideSkipTrace />
    </Col>
  </Row>
)
