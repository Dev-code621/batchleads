import React from 'react'
import { Row, Col } from 'react-flexbox-grid'
import Laptop from '~assets/images/laptop.svg'
import HeroIntro from '../../layout/HeroIntro'

export default ({ onGetStart }) => (
  <Row className="hero-container container squad">
    <Col xs={12} md={12} lg={6} className="left">
      <div className="image-text">DRIVE FOR DOLLARS...EVEN VIRTUALLY</div>
      <img src={Laptop} alt="latptop" className="laptop" />
    </Col>
    <Col xs={12} md={12} lg={6} className="right">
      <HeroIntro onGetStart={onGetStart} />
    </Col>
    
  </Row>
)
