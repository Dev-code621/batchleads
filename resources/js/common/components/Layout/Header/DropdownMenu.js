import React from 'react';
import { Link } from 'react-router-dom'
import classNames from 'classnames'

export default ({
  show,
  onMenuClick,
  menuItems,
  loggedIn,
  utmCampaign,
}) => {
  const signUpUrl = utmCampaign ? `/signup?utm_campaign=${utmCampaign}` : '/signup'

  return (
    <div
      className={classNames('header-dropdown', { show })}
      onClick={() => onMenuClick()}
      role="button"
      onKeyPress={() => {}}
      tabIndex="0"
    >
      <div className="container">
        {
          loggedIn && (
            <div className="menu-item">
              <Link to="/dashboard">
                Dashboard
              </Link>
            </div>
          )
        }
        {menuItems.map((menuItem) => {
          return (
            <div className="menu-item" key={menuItem.title}>
              {
                menuItem.isHome ? (
                  <a href={`#${menuItem.link}`}>
                    {menuItem.title === 'Log In' ? !loggedIn && menuItem.title : menuItem.title}
                  </a>
                ) : (
                  <Link to={menuItem.link}>
                    {menuItem.title === 'Log In' ? !loggedIn && menuItem.title : menuItem.title}
                  </Link>
                )
              }
            </div>
          )
        })}
        {
          !loggedIn && (
            <div className="menu-item">
              <Link to={signUpUrl}>
                Sign up
              </Link>
            </div>
          )
        }
      </div>
    </div>
  )
}
