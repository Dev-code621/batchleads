import React from 'react'
import { Row, Col } from 'react-flexbox-grid'
import Laptop from '~assets/images/laptop.svg'
import Empire from '~assets/images/empire.png'
import Iphone3 from '~assets/images/iphone3.svg'
import Iphone4 from '~assets/images/iphone4.svg'
import Iphone7 from '~assets/images/iphone7.svg'
import Iphone8 from '~assets/images/iphone8.png'
import HeroIntro from '../../layout/HeroIntro'

export default ({ onGetStart }) => (
  <Row className="hero-container container empire">
    <Col xs={12} md={12} lg={4} className="left">
      <div className="team">
        <img src={Empire} alt="Empire" className="empire" />
        <img src={Laptop} alt="latptop" className="laptop" />
      </div>
    </Col>
    <Col xs={12} md={12} lg={2} className="middle">
      <div className="iphones">
        <img src={Iphone7} className="iphone-1" alt="Iphone7" />
        <img src={Iphone3} className="iphone-2" alt="Iphone3" />
        <img src={Iphone8} className="iphone-3" alt="Iphone8" />
        <img src={Iphone4} className="iphone-4" alt="Iphone4" />
      </div>
    </Col>
    <Col xs={12} md={12} lg={6} className="right">
      <HeroIntro onGetStart={onGetStart} />
    </Col>
  </Row>
)
