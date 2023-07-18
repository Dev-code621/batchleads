import React from 'react'
import { Row, Col } from 'react-flexbox-grid'
import Clever from '~assets/images/clever.png'
import HeroIntro from '../../layout/HeroIntro'
import HeroText from '../../layout/HeroText'

export default ({ onGetStart }) => (
  <Row className="hero-container container clever">
    <Col xs={12} md={12} lg={6} className="left">
      <img src={Clever} alt="Clever" className="clever" />
      <HeroText />
    </Col>
    <Col xs={12} md={12} lg={6} className="right">
      <HeroIntro mobileList onGetStart={onGetStart} />
    </Col>
  </Row>
)
