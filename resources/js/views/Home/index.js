import React, { useEffect } from 'react'
import { withRouter } from 'react-router'
import queryString from 'query-string'
import Section from '~layout/Section'
import Header from '~layout/Header'
import Hero from './sections/Hero'
import Compare from './sections/Compare'
import Feature from './sections/Feature'
import Partner from './sections/Partner'
import Solution from './sections/Solution'
import Testimonial from './sections/Testimonial'
import Workflow from './sections/Workflow'
import Addition from './sections/Addition'
import Platform from './sections/Platform'
import Footer from './sections/Footer'
import HeroImage from '~assets/images/macstreetview.png'
import './layout/style.scss'

const Home = withRouter(({ history }) => {
  let utmCampaign = null
  const { search } = history.location
  if (search) {
    const parse = queryString.parse(search)
    utmCampaign = parse.utm_campaign
  }

  useEffect(() => {
    localStorage.removeItem('tracking_ref_id')
    if (search.startsWith('?_by=')) {
      // localStorage.setItem('tracking_ref_id', search.substr(5, search.length))
    } else if (search.startsWith('?section=')) {
      setTimeout(() => {
        const section = search.substr(9, search.length)
        const elmnt = document.getElementById(section)
        elmnt.scrollIntoView()
      })
    }
  }, [])

  const menuItems = [
    {
      title: 'What\'s New',
      link: 'whatsnew',
      isHome: true,
    },
    {
      title: 'How it works',
      link: 'howitworks',
      isHome: true,
    },
    {
      title: 'Features',
      link: 'features',
      isHome: true,
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
      <Header menuItems={menuItems} utmCampaign={utmCampaign} />
      <Hero utmCampaign={utmCampaign}>
        <div className="hero-image">
          <div className="image-text">DRIVE FOR DOLLARS...EVEN VIRTUALLY</div>
          <img src={HeroImage} alt="BatchDriven" />
        </div>
      </Hero>
      <Compare />
      <Workflow />
      <Partner />
      <Feature />
      <Solution utmCampaign={utmCampaign} />
      <Testimonial />
      <Addition utmCampaign={utmCampaign} />
      <Platform utmCampaign={utmCampaign} />
      <Footer />
    </Section>
  )
})

export default Home
