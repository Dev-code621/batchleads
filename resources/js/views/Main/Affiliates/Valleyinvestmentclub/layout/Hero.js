import React from 'react'
import { Row, Col } from 'react-flexbox-grid'
import Button from '../../layout/Button'
import SecureCheckOut from '../../layout/SecureCheckOut'
import Laptop from '~assets/images/laptop.svg'
import Iphone3 from '~assets/images/iphone3.svg'
import Iphone4 from '~assets/images/iphone4.svg'
import Iphone8 from '~assets/images/iphone8.png'
import Iphone1 from '~assets/images/iphone7.svg'
import HeroIntro from '../../layout/HeroIntro'

export default ({ onGetStart }) => (
  <Row className="hero-container container valleyinvestmentclub">
    <Col xs={12} md={12} lg={6} className="left">
      <img src={Laptop} alt="latptop" className="laptop" />
      <div className="iphones">
        <img src={Iphone4} className="iphone-2" alt="iphone4" />
        <img src={Iphone8} className="iphone-3" alt="iphone8" />
        <img src={Iphone3} className="iphone-4" alt="iphone3" />
        <img src={Iphone1} className="iphone-5" alt="iphone1" />
      </div>
    </Col>
    <Col xs={12} md={12} lg={6} className="right">
      <HeroIntro valleyinvestmentclub hideBottom onGetStart={onGetStart} />
    </Col>
    <div className="bottom">
      <Button onClick={onGetStart} />
      <SecureCheckOut />
    </div>
  </Row>
)
