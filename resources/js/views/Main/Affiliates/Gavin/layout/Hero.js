import React from 'react'
import { Row, Col } from 'react-flexbox-grid'
import Gavin from '~assets/images/gavin.png'
import HeroIntro from '../../layout/HeroIntro'

export default ({ onGetStart }) => (
  <Row className="hero-container container gavin">
    <Col xs={12} md={12} lg={6} className="left">
      <HeroIntro onGetStart={onGetStart} laptop mobile />
    </Col>
    <Col xs={12} md={12} lg={6} className="right">
      <img src={Gavin} alt="gavin" className="gavin" />
    </Col>
  </Row>
)
