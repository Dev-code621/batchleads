import React from 'react'
import { withRouter } from 'react-router'
import { Row, Col } from 'react-flexbox-grid'
import Header from '../layout/Header'
import Section from '~layout/Section'
import Updating from '~assets/images/machine.svg'
import Error from '~assets/images/error404.svg'
import './layout/style.scss'

const Missing = withRouter(() => {
  return (
    <Section className="affiliate-landing-page missing">
      <Header />
      <div className="machine">
        <img src={Updating} alt="Error" />
      </div>
      <div className="error">
        <img src={Error} alt="Error" />
      </div>
      <div className="message">
        We couldn’t find the page you’re looking for. Get back to&nbsp;
        <a href="\">BatchDriven</a>.
      </div>
      <div className="scroll" />
    </Section>
  )
})

export default Missing
