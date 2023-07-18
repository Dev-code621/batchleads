import React from 'react'
import { Row, Col } from 'react-flexbox-grid'

import FooterLogo from '~assets/icons/footer_logo.png'
import MenuBlock from './MenuBlock'
import NewsLetter from './NewsLetter'

import './style.scss'

const menuBlockItems1 = [
  {
    link: '',
    label: 'Contact',
  },
  {
    link: '',
    label: 'Blog',
  },
  {
    link: '',
    label: 'Careers',
  },
  {
    link: '',
    label: 'Affiliate Partners',
  },
  {
    link: '',
    label: 'Privacy Policy',
  },
  {
    link: '',
    label: 'Terms Of Service',
  },
]

const menuBlockItems2 = [
  {
    link: '',
    label: 'Pricing',
  },
  {
    link: '',
    label: 'Automated Owner Lookup',
  },
  {
    link: '',
    label: 'Direct Mail Campaigns',
  },
  {
    link: '',
    label: 'Real Estate Lead Management',
  },
  {
    link: '',
    label: 'Help Center',
  },
  {
    link: '',
    label: 'Open Support Ticket',
  },
]

export default () => (
  <Row className="mobile-footer-container">
    <Col xs={12}>
      <NewsLetter />
    </Col>
    <Col xs={12}>
      <MenuBlock items={menuBlockItems1} />
    </Col>
    <Col xs={12}>
      <MenuBlock items={menuBlockItems2} />
    </Col>
    <Col xs={12} className="item footer-logo">
      <div className="footer-logo-item">
        <div>support@batchdriven.com</div>
        <div>Copyright BatchDriven 2019</div>
      </div>
    </Col>
  </Row>
);
