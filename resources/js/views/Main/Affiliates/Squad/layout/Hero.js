import React from 'react'
import { Row, Col } from 'react-flexbox-grid'
import Laptop from '~assets/images/laptop.svg'
import Iphone3 from '~assets/images/iphone3.svg'
import Iphone4 from '~assets/images/iphone4.svg'
import Iphone8 from '~assets/images/iphone8.png'
import Iphone1 from '~assets/images/iphone1.svg'
import Squad from '~assets/images/squad.png'
import HeroIntro from '../../layout/HeroIntro'

export default ({ onGetStart }) => (
  <Row className="hero-container container squad">
    <Col xs={12} md={12} lg={3} className="left">
      <img src={Laptop} alt="latptop" className="laptop" />
      <div className="iphones">
        <img src={Iphone4} className="iphone-1" alt="iphone4" />
        <img src={Iphone3} className="iphone-2" alt="iphone3" />
        <img src={Iphone8} className="iphone-3" alt="iphone8" />
      </div>
    </Col>
    <Col xs={12} md={12} lg={6} className="middle">
      <div className="squad-bg" id="squad-bg">
        <div className="talk">
          Squad Up!
        </div>
        <div className="squad-backgroud" />
        <img src={Squad} className="squad" alt="squad" />
        <HeroIntro onGetStart={onGetStart} />
      </div>
    </Col>
    <Col xs={12} md={12} lg={3} className="right">
      <img src={Iphone1} className="iphone-5" alt="iphone1" />
    </Col>
  </Row>
)
