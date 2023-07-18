/* eslint-disable react/no-danger */
import React from 'react'

import './style.scss'

export default ({ text, textAlign = 'center' }) => (
  <div className="sub-description-container">
    <div className="description" style={{ textAlign: `${textAlign}` }} dangerouslySetInnerHTML={{ __html: text }} />
  </div>
);
