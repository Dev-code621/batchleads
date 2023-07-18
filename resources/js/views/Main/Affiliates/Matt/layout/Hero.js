import React from 'react'
import { Row, Col } from 'react-flexbox-grid'
import Laptop from '~assets/images/laptop.svg'
import Matt from '~assets/images/matt.png'
import HeroIntro from '../../layout/HeroIntro'

export default ({ onGetStart }) => (
  <Row className="hero-container container squad">
    <Col xs={12} md={12} lg={6} className="right">
      <HeroIntro onGetStart={onGetStart} />
    </Col>
    <Col xs={12} md={12} lg={6} className="left">
      <img src={Matt} alt="Matt" />
      <img src={Laptop} alt="latptop" className="laptop" />
    </Col>
  </Row>
)
