import React from 'react'
import { Link } from 'react-router-dom'
import Logo from '~assets/icons/logonew.svg'
import LogoWhite from '~assets/icons/logo_text_new.svg'

export default ({
  color,
  onClick,
  white,
  src,
}) => (
  <div className="logo-container" onClick={onClick} role="button" onKeyPress={() => {}} tabIndex="0">
    <Link to="/" className="logo-text" style={{ color }}>
      <img src={src || (white ? LogoWhite : Logo)} alt="logo" />
    </Link>
  </div>
)
