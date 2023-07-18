import React, { useState, useEffect, useRef } from 'react'
import get from 'lodash.get'
import { Link, withRouter } from 'react-router-dom'
import Switch from 'react-switch'
import { connect } from 'react-redux'
import { useCookies } from 'react-cookie';
import { actions as userActions } from '~redux/modules/user'
import { userSelector } from '~redux/selectors/userSelector'
import UserPlaceholder from '~assets/images/user_placeholder.png'
import { useThemeDispatch } from '~common/theme-context'
import NavLink from './NavLink'
import LogoIcon from '~assets/icons/logo_icon_new.png'
import LogoText from '~assets/icons/logo_text.png'
import ToggleMenu from '~assets/icons/toggle_menu.svg'

import './style.scss'

const mapStateToProps = (state) => ({
  user: userSelector(state),
})

const mapDispatchToProps = {
  ...userActions,
}

const navsList = [
  {
    link: '/dashboard/properties',
    id: 'properties',
    label: 'Properties',
  }, {
    link: '/dashboard/messages',
    id: 'messages',
    label: 'Messages',
  }, {
    link: '/dashboard/drivingRoutes',
    id: 'driving_routes',
    label: 'Driving Routes',
  }, {
    link: '',
    id: 'campaigns',
    label: 'Campaigns',
    subNavs: [
      {
        link: '/dashboard/smsCampaign',
        id: 'sms_campaign',
        label: 'SMS Campaigns',
      },
      {
        link: '/dashboard/mailCampaign',
        id: 'mail_campaign',
        label: 'Mail Campaigns',
      },
    ],
  }, {
    link: '/dashboard/kpis',
    id: 'reports',
    label: 'Reports',
  },
  {
    link: '/dashboard/settings',
    id: 'settings',
    label: 'Settings',
  }, {
    link: '',
    id: 'help',
    label: 'Help',
  },
  {
    link: '',
    id: 'logout',
    label: 'Log out',
  },
]

const getHeight = () => window.innerHeight
  || document.documentElement.clientHeight
  || document.body.clientHeight

const SideMenu = withRouter(({
  // eslint-disable-next-line no-unused-vars
  isSideBarActive, toggleSideBar, onLogout, user, message,
}) => {
  const sideNavbar = useRef()

  const name = user.result.user ? get(user.result.user.user, 'name') : null
  const email = user.result.user ? get(user.result.user.user, 'email') : null
  const photoUrl = user.result.user ? get(user.result.user.user, 'photo_url') : null

  const [hover, setHover] = useState(null)

  const [height, setHeight] = useState(getHeight())
  const [scrollY, setScrollY] = useState(0)
  const [cookies, setCookie] = useCookies(['prefrence_mode'])
  const [darkMode, setDarkMode] = useState(false)

  const themeDispatch = useThemeDispatch()

  useEffect(() => {
    console.log('mode: ', darkMode)
    themeDispatch(darkMode ? 'dark' : 'light')
  }, [darkMode])

  const onScrollUp = () => {
    sideNavbar.current.scroll({
      top: 0,
      behavior: 'smooth',
    })
  }
  const onScrollDown = () => {
    sideNavbar.current.scroll({
      top: height,
      behavior: 'smooth',
    })
  }

  useEffect(() => {
    let timer0 = null
    let timer1 = null

    const resizeListener = () => {
      clearTimeout(timer0)
      timer0 = setTimeout(() => setHeight(getHeight()), 150)
    };

    const scrollListener = () => {
      clearTimeout(timer1);
      timer1 = setTimeout(() => {
        const sY = sideNavbar.current.scrollTop
        setScrollY(sY)
      }, 150);
    };
    window.addEventListener('resize', resizeListener)
    sideNavbar.current.addEventListener('scroll', scrollListener)
    setDarkMode((cookies.prefrence_mode && cookies.prefrence_mode === 'true'))
    return () => {
      window.removeEventListener('resize', resizeListener)
      sideNavbar.current.removeEventListener('scroll', scrollListener)
    }
  }, [])

  const setHoverNav = (id) => {
    setHover(id)
  }

  const toggleMode = () => {
    const newMode = !darkMode
    setDarkMode(newMode)
    setCookie('prefrence_mode', newMode, { path: '/' })
  }

  return (
    <div ref={sideNavbar} className={isSideBarActive ? 'sidenav-container active' : 'sidenav-container'}>
      <div className="overlay" onClick={toggleSideBar} />
      <nav className="sidenav">
        <ul>
          {/* LOGO */}
          <li className="sidenav__item sidenav__item--logo">
            <div className="nav-text">
              <Link to="/dashboard" className="nav-link">
                <img src={LogoText} alt="BatchDriven" />
              </Link>
            </div>
            <div className="nav-icon">
              <Link to="/dashboard" className="nav-link">
                <img src={LogoIcon} alt="BatchDriven" />
              </Link>
            </div>
          </li>
          {/* PROFILE */}
          <li className="sidenav__item sidenav__item--profile">
            <div className="nav-text">
              <Link to="/dashboard/settings" className="nav-link">
                <div className="user-name">
                  {name}
                </div>
                <div className="user-email">
                  {email}
                </div>
              </Link>
            </div>
            <div className="nav-icon">
              <Link to="/dashboard/settings" className="nav-link">
                <div className="user-image" style={{ backgroundImage: `url(${photoUrl || UserPlaceholder}` }}>
                  &nbsp;
                </div>
              </Link>
            </div>
          </li>

          {/* GENERAL NAVS */}
          {
            navsList.map((nav) => (
              <li key={nav.id}>
                <NavLink {...nav} toggleSideBar={toggleSideBar} setHoverNav={setHoverNav} onLogout={onLogout} isSideBarActive={isSideBarActive} hover={hover} badge={nav.id === 'messages' && message.badge} />
              </li>
            ))
          }

          {/* Dark mode toggle */}
          {
            <li className="nav-icon-toggle">
              <Switch
                checked={!darkMode}
                onChange={toggleMode}
                uncheckedIcon={
                  (
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: '100%',
                        fontSize: '7px',
                        color: '#FFF',
                      }}
                    >
                      NIGHT
                    </div>
                )}
                checkedIcon={
                  (
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: '100%',
                        fontSize: '7px',
                        color: '#FFF',
                      }}
                    >
                      DAY
                    </div>
                )}
                height={17}
                width={40}
                handleDiameter={16}
                id="drakMode"
                onColor="#AAAAAA"
                offColor="#313131"
                offHandleColor="#3683BC"
                onHandleColor="#3683BC"
              />
            </li>
          }

          {/* TOGGLE EXPANDDING */}
          <li className="sidenav__item sidenav__item--expand">
            <div className="nav-icon" onClick={toggleSideBar}>
              <img src={ToggleMenu} alt="Expand" />
            </div>
          </li>

        </ul>
      </nav>
      {scrollY && <div className="btn-scroll-up" onClick={onScrollUp} />}
      {(13 * 60 - scrollY) > height && <div className="btn-scroll-down" onClick={onScrollDown} />}
    </div>

  )
})

export default connect(mapStateToProps, mapDispatchToProps)(SideMenu)
