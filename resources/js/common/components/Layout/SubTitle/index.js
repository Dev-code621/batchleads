/* eslint-disable react/no-danger */
import React from 'react'

import './style.scss'

export default ({ title, textAlign = 'left', container = '' }) => (
  <div className={`sub-title-container sub-title-container--${container}`}>
    <div className="title" style={{ textAlign: `${textAlign}` }} dangerouslySetInnerHTML={{ __html: title }} />
  </div>
);
