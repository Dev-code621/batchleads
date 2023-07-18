import React, { useEffect } from 'react'
import { withRouter } from 'react-router'
import queryString from 'query-string'
import Section from '~layout/Section'
import Header from '~layout/Header'
import Platform from '../../sections/Platform'
import Footer from '../../sections/Footer'
import './styles.scss'
import Title from './Title'

const Container = withRouter(({
  history,
  children,
  title,
  secondTitle,
}) => {
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
    <Section className="customer-page">
      <Header menuItems={menuItems} utmCampaign={utmCampaign} />
      <div className="content">
        <Title title={title} secondTitle={secondTitle} />
        {
          children
        }
      </div>
      <Platform utmCampaign={utmCampaign} />
      <Footer />
    </Section>
  )
})

export default Container
