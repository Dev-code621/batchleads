import React from 'react'
import Section from '~layout/Section'
import Header from '~layout/Header'
import Hero from '../sections/Hero'
import Plan from '../sections/Plan'
import Addition from '../sections/Addition'
import Platform from '../sections/Platform'
import Footer from '../sections/Footer'
import Testimonial from '../sections/Testimonial'

import Iphone4 from '~assets/images/iphone4.svg'
import Iphone5 from '~assets/images/iphone5.svg'
import Iphone6 from '~assets/images/iphone6.svg'
import Iphone7 from '~assets/images/iphone7.svg'

const Pricing = () => {
  const menuItems = [
    {
      title: 'What\'s New',
      link: '/?section=whatsnew',
      isExternal: true,
    },
    {
      title: 'How it works',
      link: '/?section=howitworks',
    },
    {
      title: 'Features',
      link: '/?section=features',
    },
    {
      title: 'Feedback',
      link: 'feedback',
      isHome: true,
    },
    {
      title: 'Pricing',
      link: 'pricing#plans',
      hash: true,
    },
    {
      title: 'Log In',
      link: '/login',
    },
  ]

  return (
    <Section className="home-page">
      <Header menuItems={menuItems} />
      <Hero>
        <div className="hero-image pricing-header">
          <img className="iphone-4" src={Iphone7} alt="BatchDriven" />
          <img className="iphone-3" src={Iphone6} alt="BatchDriven" />
          <img className="iphone-2" src={Iphone5} alt="BatchDriven" />
          <img className="iphone-1" src={Iphone4} alt="BatchDriven" />
        </div>
      </Hero>
      <div id="plans">
        <Plan />
      </div>
      <Testimonial />
      <Addition />
      <Platform />
      <Footer />
    </Section>
  )
}

export default Pricing
