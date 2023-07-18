import React from 'react'
import { Row, Col } from 'react-flexbox-grid'
import Laptop from '~assets/images/laptop.svg'
import Super from '~assets/images/super.png'
import SuperHuman from '~assets/images/superhuman.png'
import Iphone3 from '~assets/images/iphone3.svg'
import Iphone4 from '~assets/images/iphone4.svg'
import Iphone8 from '~assets/images/iphone8.png'
import HeroIntro from '../../layout/HeroIntro'

export default ({ onGetStart }) => (
  <Row className="hero-container container super">
    <Col xs={12} md={12} lg={4} className="left">
      <HeroIntro onGetStart={onGetStart} breakword />
    </Col>
    <Col xs={12} md={12} lg={3} className="middle">
      <img src={Super} alt="Super" className="super" />
      <img src={SuperHuman} alt="SuperHuman" className="super-human" />
    </Col>
    <Col xs={12} md={12} lg={5} className="right">
      <img src={Laptop} alt="latptop" className="laptop" />
      <div className="iphones">
        <img src={Iphone4} className="iphone-1" alt="Iphone4" />
        <img src={Iphone3} className="iphone-2" alt="Iphone3" />
        <img src={Iphone8} className="iphone-3" alt="Iphone8" />
      </div>
    </Col>
  </Row>
)
