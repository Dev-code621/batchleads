import React from 'react'
import Button from './Button'
import SecureCheckOut from './SecureCheckOut'
import Laptop from '~assets/images/laptop.svg'
import Iphone3 from '~assets/images/iphone3.svg'
import Iphone4 from '~assets/images/iphone4.svg'
import Iphone7 from '~assets/images/iphone7.svg'
import Iphone8 from '~assets/images/iphone8.png'
import Millenialflippers from '~assets/images/millenialflippers.png'
import Valleyinvestmentclub from '~assets/images/valleyinvestmentclub.png'
import './HeroIntro.style.scss'

export default ({
  onGetStart,
  laptop,
  mobile,
  hideFreeTrial,
  hideSkipTrace,
  hideBottom,
  millenialflippers,
  valleyinvestmentclub,
  mobileList,
  breakword,
}) => (
  <div className="hero-intro-container">
    {
      millenialflippers && <img src={Millenialflippers} alt="millenialflippers" className="millenialflippers" />
    }
    {
      !hideSkipTrace && (
      <div className="skip-traces-for">
        {
          millenialflippers ? '10 Direct Mail Pieces for' : '50 skip traces for'
        }
      </div>
      )
    }
    {
      !hideFreeTrial && (
      <div className="free-trial">
        <div className="free">Free</div>
        <div className="trial">7 days trial</div>
      </div>
      )
    }
    {laptop && <img src={Laptop} alt="latptop" className="laptop" />}
    {mobile && (
      <div className="iphones">
        <img src={Iphone3} className="iphone-1" alt="iphone3" />
      </div>
    )}
    {mobileList && (
      <div className="iphones-list">
        <img src={Iphone4} className="iphone-1" alt="Iphone4" />
        <img src={Iphone8} className="iphone-2" alt="Iphone8" />
        <img src={Iphone3} className="iphone-3" alt="Iphone3" />
        <img src={Iphone7} className="iphone-4" alt="Iphone7" />
      </div>
    )}
    <div className="read">
      <b>Yes</b>
      , you read that right -
      {breakword ? <br /> : ' ' }
      50 Skip Traces for
      &nbsp;
      <span>FREE.</span>
      <br />
      <i>Act now because this offer won&apos;t last</i>
    </div>
    {
      !hideBottom && (
      <div className="bottom">
        <Button onClick={onGetStart} />
        <SecureCheckOut />
      </div>
      )
    }
    {
      valleyinvestmentclub && <img src={Valleyinvestmentclub} alt="valleyinvestmentclub" />
    }
  </div>
)
