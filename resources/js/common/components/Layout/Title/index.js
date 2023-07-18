/* eslint-disable react/no-danger */
import React from 'react'

import './style.scss'

export default ({
  title, description = '', textAlign = 'center', color, container = '',
}) => (
  <div className={`title-container title-container--${container}`}>
    <div className="title" style={{ textAlign: `${textAlign}`, color: `${color}` }} dangerouslySetInnerHTML={{ __html: title }} />
    {
      description && <div className="description" style={{ color: `${color}` }} dangerouslySetInnerHTML={{ __html: description }} />
    }
  </div>
);
