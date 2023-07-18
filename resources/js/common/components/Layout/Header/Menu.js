import React from 'react'
import { Link } from 'react-router-dom'
import { Link as HomeLink } from 'react-scroll'
import { HashLink } from 'react-router-hash-link';

export default ({ menuItems, loggedIn, utmCampaign }) => {
  const signUpUrl = utmCampaign ? `/signup?utm_campaign=${utmCampaign}` : '/signup'

  return (
    <div className="menu-container">
      {
        menuItems.map((menuItem) => {
          if (menuItem.isHome) {
            return (
              <HomeLink
                to={menuItem.link}
                className="menu-text"
                key={menuItem.title}
                activeClass="active"
                spy
                smooth
                duration={500}
              >
                {menuItem.title}
              </HomeLink>
            )
          }
          if (menuItem.hash) {
            return (
              <HashLink to={menuItem.link} className="menu-text" key={menuItem.title}>
                {menuItem.title}
              </HashLink>
            )
          }
          return (
            <Link to={menuItem.link} className="menu-text" key={menuItem.title}>
              {menuItem.title === 'Log In' ? !loggedIn && menuItem.title : menuItem.title}
            </Link>
          )
        })
      }
      {
        !loggedIn && (
        <Link to={signUpUrl}>
          <input type="button" value="Try for FREE" className="signup-button" />
        </Link>
        )
      }
      {
        loggedIn && (
          <Link to="/dashboard" className="menu-text" key="dashboard">
            Dashboard
          </Link>
        )
      }
    </div>
  )
}
