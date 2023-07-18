import React from 'react'
import { Row, Col } from 'react-flexbox-grid'
import Titanium from '~assets/images/titanium.png'
import HeroIntro from '../../layout/HeroIntro'
import HeroText from '../../layout/HeroText'
import Iphone2 from '~assets/images/iphone2.svg'
import Iphone3 from '~assets/images/iphone3.svg'

export default ({ onGetStart }) => (
  <Row className="hero-container container titanium">
    <Col xs={12} md={12} lg={6} className="left">
      <div className="iphones">
        <img src={Iphone2} className="iphone-1" alt="Iphone7" />
        <img src={Iphone3} className="iphone-2" alt="Iphone3" />
      </div>
      <div className="heros">
        <img src={Titanium} alt="titanium" className="titanium" />
        <HeroText />
      </div>
    </Col>
    <Col xs={12} md={12} lg={6} className="right">
      <HeroIntro laptop onGetStart={onGetStart} />
    </Col>
  </Row>
)
