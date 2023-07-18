import React from 'react'
import { Row, Col } from 'react-flexbox-grid'
import Jamil from '~assets/images/jamil.png'
import Iphone3 from '~assets/images/iphone3.svg'
import Iphone4 from '~assets/images/iphone4.svg'
import Iphone5 from '~assets/images/iphone5.svg'
import Iphone6 from '~assets/images/iphone6.svg'
import Iphone7 from '~assets/images/iphone7.svg'
import HeroIntro from '../../layout/HeroIntro'

export default ({ onGetStart }) => (
  <Row className="hero-container container squad">
    <Col xs={12} md={12} lg={6} className="left">
      <img src={Jamil} alt="jamil" className="jamil" />
      <div className="iphones">
        <img src={Iphone3} className="iphone-1" alt="iphone3" />
        <img src={Iphone4} className="iphone-2" alt="iphone4" />
        <img src={Iphone5} className="iphone-3" alt="iphone5" />
        <img src={Iphone6} className="iphone-4" alt="iphone6" />
        <img src={Iphone7} className="iphone-5" alt="iphone7" />
      </div>
    </Col>
    <Col xs={12} md={12} lg={6} className="right">
      <HeroIntro onGetStart={onGetStart} />
    </Col>
  </Row>
)
