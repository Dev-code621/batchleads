import React from 'react'
import { Row, Col } from 'react-flexbox-grid'

import FooterLogo from '~assets/icons/footer_logo.png'
import MenuBlock from './MenuBlock'
import NewsLetter from './NewsLetter'

import './style.scss'

const menuBlockItems1 = [
  {
    id: 'menu-1',
    link: '',
    label: 'Contact',
  },
  {
    id: 'menu-2',
    link: '',
    label: 'Blog',
  },
  {
    id: 'menu-3',
    link: '',
    label: 'Careers',
  },
  {
    id: 'menu-4',
    link: '',
    label: 'Affiliate Partners',
  },
  {
    id: 'menu-5',
    link: '',
    label: 'Privacy Policy',
  },
  {
    id: 'menu-6',
    link: '',
    label: 'Terms Of Service',
  },
]

const menuBlockItems2 = [
  {
    id: 'menu-7',
    link: '',
    label: 'Pricing',
  },
  {
    id: 'menu-8',
    link: '',
    label: 'Automated Owner Lookup',
  },
  {
    id: 'menu-9',
    link: '',
    label: 'Direct Mail Campaigns',
  },
  {
    id: 'menu-10',
    link: '',
    label: 'Real Estate Lead Management',
  },
  {
    id: 'menu-11',
    link: '',
    label: 'Help Center',
  },
  {
    id: 'menu-12',
    link: '',
    label: 'Open Support Ticket',
  },
]

export default () => (
  <Row className="footer-container">
    <Col xs={3} className="item footer-logo">
      <div className="footer-logo-item">
        <img src={FooterLogo} alt="footer logo" />
      </div>
      <div className="footer-logo-item">
        <div>support@batchdriven.com</div>
        <div>Copyright BatchDriven 2019</div>
      </div>
    </Col>
    <Col xs={2}>
      <MenuBlock items={menuBlockItems1} />
    </Col>
    <Col xs={3}>
      <MenuBlock items={menuBlockItems2} />
    </Col>
    <Col xs={4}>
      <NewsLetter />
    </Col>
  </Row>
);
