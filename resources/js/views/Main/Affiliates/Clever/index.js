import React, { useEffect } from 'react'
import { withRouter } from 'react-router'
import Section from '~layout/Section'
import Header from '../layout/Header'
import Hero from './layout/Hero'
import Feature from '../../../Home/sections/Feature'
import Partner from '../../../Home/sections/Partner'
import Testimonial from '../../../Home/sections/Testimonial'
import Workflow from '../../../Home/sections/Workflow'
import Platform from '../../../Home/sections/Platform'
import Footer from '../../../Home/sections/Footer'
import Intro from '../layout/Intro'
import GetStartedNow from '../layout/GetStartedNow'
import ThisSoundsTooGood from '../layout/ThisSoundsTooGood'
import Opportunity from '../layout/Opportunity'
import HowItWorks from '../layout/HowItWorks'
import './layout/style.scss'

const Home = withRouter(({ history }) => {
  useEffect(() => {
    const { pathname } = history.location
    localStorage.setItem('tracking_ref_id', pathname.substring(1))
  }, [])

  const onGetStart = () => {
    history.push('/signup')
  }

  return (
    <Section className="affiliate-landing-page clever">
      <Header />
      <Hero onGetStart={onGetStart} />
      <Intro />
      <Workflow />
      <Partner />
      <GetStartedNow onGetStart={onGetStart} />
      <Feature />
      <ThisSoundsTooGood />
      <HowItWorks />
      <Opportunity onGetStart={onGetStart} />
      <Testimonial />
      <Platform />
      <Footer />
    </Section>
  )
})

export default Home
