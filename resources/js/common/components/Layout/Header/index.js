import React, { useState } from 'react'
import { connect } from 'react-redux'
import classNames from 'classnames'
import Logo from './Logo'
import Menu from './Menu'
import DropdownMenu from './DropdownMenu'

import { userSelector } from '~redux/selectors/userSelector'

import 'hamburgers/_sass/hamburgers/hamburgers.scss'
import './style.scss'

const mapStateToProps = (state) => ({
  user: userSelector(state),
})

const Header = ({ user, menuItems, utmCampaign }) => {
  const [menuOpen, setMenuOpen] = useState(false)

  const showMenu = () => {
    setMenuOpen(true)
    document.getElementsByTagName('BODY')[0].classList.add('stop-scrolling')
  }

  const hideMenu = () => {
    setMenuOpen(false)
    document.getElementsByTagName('BODY')[0].classList.remove('stop-scrolling')
  }

  const onMenuClick = () => {
    hideMenu()
  }

  return (
    <div className="header-container">
      <div className="container">
        <Logo onClick={hideMenu} />
        <Menu
          menuItems={menuItems}
          loggedIn={user.result.user}
          utmCampaign={utmCampaign}
        />
        <div className="mobile-menu">
          <button
            className={classNames('hamburger', 'hamburger--squeeze', {
              'is-active': menuOpen,
            })}
            type="button"
            onClick={menuOpen ? hideMenu : showMenu}
            aria-label="hamburger button to open navigation menu"
          >
            <span className="hamburger-box">
              <span className="hamburger-inner" />
            </span>
          </button>
          <DropdownMenu
            show={menuOpen}
            menuItems={menuItems}
            onMenuClick={onMenuClick}
            loggedIn={user.result.user}
            utmCampaign={utmCampaign}
          />
        </div>
      </div>

    </div>
  )
}

export default connect(mapStateToProps)(Header)
