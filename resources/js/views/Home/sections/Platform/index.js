import React from 'react'
import ScrollAnimation from 'react-animate-on-scroll'
import { Link } from 'react-router-dom'
import './style.scss'


export default ({ utmCampaign }) => {
  const signUpUrl = utmCampaign ? `/signup?utm_campaign=${utmCampaign}` : '/signup'

  return (
    <section className="platform-section">
      <ScrollAnimation animateIn="flash" animateOnce>
        <h2>All Platforms Supported</h2>
      </ScrollAnimation>
      <div className="button-container">
        <a href="https://apps.apple.com/us/app/go-knock/id1495675376" className="btn-download btn-download--ios">
          Download for
          <span>iOS</span>
        </a>
        <a href="https://play.google.com/store/apps/details?id=com.goknock" className="btn-download btn-download--android">
          Download for
          <span>Android</span>
        </a>
        <Link to={signUpUrl} className="btn-download btn-download--web">
          Sign up now
          <span>Browser</span>
        </Link>
      </div>

    </section>
  )
}
