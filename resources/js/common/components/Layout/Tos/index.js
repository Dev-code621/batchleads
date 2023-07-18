import React from 'react'
import { Link } from 'react-router-dom'

import './style.scss'

export default () => (
  <div className="tos-container">
    By signing up, you are agree to our
    <Link to="/"> Terms of Service </Link>
    and
    <Link to="/"> Privacy Policy</Link>
  </div>
);
