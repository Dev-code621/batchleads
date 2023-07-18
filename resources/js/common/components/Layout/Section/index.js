import React from 'react'
import classNames from 'classnames'

import './style.scss'

export default ({
  children,
  className,
}) => (
  <div className={classNames('section', className)}>
    {children}
  </div>
);
