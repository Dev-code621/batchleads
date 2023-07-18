import React, { useState } from 'react'
import { Link, withRouter } from 'react-router-dom';

export default withRouter(({
  link,
  id,
  label,
  badge,
  subNavs,
  location,
  isSideBarActive,
  toggleSideBar,
  hover,
  setHoverNav,
  history,
  onLogout,
}) => {
  const [expandSubMenu, setExpand] = useState(false)
  const onClickHelp = () => {
    // OPEN USERSNAP BOX
    if (window.UsersnapCX) {
      window.UsersnapCX.open();
    }
  }

  const onClickCampaigns = () => {
    if (!isSideBarActive) {
      toggleSideBar()
      setExpand(true)
    }
    if (subNavs.map((e) => e.link).indexOf(location.pathname) === -1) {
      history.push(subNavs[0].link)
    }
  }

  const onLeave = () => {
    setHoverNav(null)
  }

  const onEnter = () => {
    setHoverNav(id)
  }

  const onToggleExpand = () => {
    setExpand(!expandSubMenu)
  }

  const isActiveLink = (path) => {
    if (!path) {
      const campaignMenuItems = [
        '/smsCampaign',
        '/smsTemplates',
        '/mailCampaign',
        '/smsTemplates',
        '/mailSignatures',
      ]
      return subNavs && campaignMenuItems.filter((e) => location.pathname.includes(e)).length > 0
    }
    return location.pathname.includes(path)
  }

  return (
    <li className={`sidenav__item sidenav__item--${id} ${expandSubMenu ? 'expand-submenu' : ''} ${hover === id || isActiveLink(link) ? 'active' : ''}`}>
      <div className="nav-text">
        {link && !subNavs && (
          <Link to={link} className={`nav-link ${location.pathname === link && 'active'}`} onMouseEnter={onEnter} onMouseLeave={onLeave}>
            {label}
          </Link>
        )}
        {/* CAMPAIGNS */}
        {id === 'campaigns' && (
          <div className="nav-link--group" onMouseEnter={onEnter} onMouseLeave={onLeave}>
            <div className="nav-link--has-submenu" onClick={onToggleExpand}>
              {label}
            </div>
            {
              subNavs.map((nav) => (
                <Link key={nav.id} to={nav.link} className={`nav-link ${location.pathname.includes(nav.link) && 'active'}`}>
                  {nav.label}
                </Link>
              ))
            }
          </div>
        )}
        {/* HELP */}
        {id === 'help' && (
          <div className="nav-link" onClick={onClickHelp} onMouseEnter={onEnter} onMouseLeave={onLeave}>
            {label}
          </div>
        )}
        {/* LOGOUT */}
        {id === 'logout' && (
          <div className="nav-link" onClick={onLogout} onMouseEnter={onEnter} onMouseLeave={onLeave}>
            {label}
          </div>
        )}
      </div>
      <div className="nav-icon">
        {link && (
          <Link to={link} className="nav-link nav-link--ani" onMouseEnter={onEnter} onMouseLeave={onLeave}>
            {
              id === 'properties' && (
                <svg className="no-fill" width="38" height="35" viewBox="0 0 38 35" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6.1543 14.3916V31.455C6.1543 31.7618 6.28032 32.0561 6.50463 32.273C6.72895 32.49 7.03319 32.6118 7.35042 32.6118H14.5272V22.7787C14.5272 22.3185 14.7162 21.8771 15.0527 21.5517C15.3891 21.2263 15.8455 21.0434 16.3213 21.0434H22.3019C22.7778 21.0434 23.2341 21.2263 23.5706 21.5517C23.9071 21.8771 24.0961 22.3185 24.0961 22.7787V32.6118H31.2729C31.5901 32.6118 31.8943 32.49 32.1186 32.273C32.343 32.0561 32.469 31.7618 32.469 31.455V14.3916" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M36.0578 17.5728L20.1262 2.8231C19.7524 2.44135 18.8785 2.43701 18.498 2.8231L2.56641 17.5728" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M30.0767 12.0052V3.69043H26.4883V8.6793" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )
            }
            {
              id === 'messages' && (
                <svg width="32" height="31" viewBox="0 0 32 31" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M28.1563 0.976074H3.875C2.20567 0.976074 0.85502 2.30051 0.85502 3.91926L0.839844 30.4079L6.91016 24.5216H28.1563C29.8256 24.5216 31.1914 23.1971 31.1914 21.5784V3.91926C31.1914 2.30051 29.8256 0.976074 28.1563 0.976074ZM11.4629 14.2204H8.42774V11.2772H11.4629V14.2204ZM17.5332 14.2204H14.4981V11.2772H17.5332V14.2204ZM23.6035 14.2204H20.5684V11.2772H23.6035V14.2204Z" />
                </svg>
              )
            }
            {
              id === 'driving_routes' && (
                <svg width="35" height="35" viewBox="0 0 35 35" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M27.9032 21.7793H21.6235C20.4723 21.7793 19.5303 20.8374 19.5303 19.6861C19.5303 18.5348 20.4723 17.5929 21.6235 17.5929H27.9032C27.9032 17.5929 34.1828 10.5937 34.1828 7.12681C34.1828 3.65992 31.3701 0.847168 27.9032 0.847168C24.4363 0.847168 21.6235 3.65992 21.6235 7.12681C21.6235 8.79484 23.0757 11.274 24.5868 13.4065H21.6235C18.1632 13.4065 15.3439 16.2257 15.3439 19.6861C15.3439 23.1464 18.1632 25.9657 21.6235 25.9657H27.9032C29.0545 25.9657 29.9964 26.9077 29.9964 28.0589C29.9964 29.2102 29.0545 30.1522 27.9032 30.1522H12.8255C11.7789 31.7744 10.6145 33.2724 9.73147 34.3386H27.9032C31.3635 34.3386 34.1828 31.5193 34.1828 28.0589C34.1828 24.5986 31.3635 21.7793 27.9032 21.7793ZM27.9032 5.0336C29.061 5.0336 29.9964 5.969 29.9964 7.12681C29.9964 8.28462 29.061 9.22002 27.9032 9.22002C26.7454 9.22002 25.81 8.28462 25.81 7.12681C25.81 5.969 26.7454 5.0336 27.9032 5.0336ZM6.97105 17.5929C3.50416 17.5929 0.691406 20.4056 0.691406 23.8725C0.691406 27.3394 6.97105 34.3386 6.97105 34.3386C6.97105 34.3386 13.2507 27.3394 13.2507 23.8725C13.2507 20.4056 10.4379 17.5929 6.97105 17.5929ZM6.97105 25.9657C5.81324 25.9657 4.87783 25.0303 4.87783 23.8725C4.87783 22.7147 5.81324 21.7793 6.97105 21.7793C8.12886 21.7793 9.06426 22.7147 9.06426 23.8725C9.06426 25.0303 8.12886 25.9657 6.97105 25.9657Z" />
                </svg>
              )
            }
            {
              id === 'reports' && (
              <svg width="32" height="33" viewBox="0 0 32 33" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M31.9203 32.239H0.015625V28.7503H31.9203V32.239ZM8.87802 13.0512H1.7881V25.2616H8.87802V13.0512ZM19.5129 6.07385H12.423V25.2616H19.5129V6.07385ZM30.1478 0.84082H23.0579V25.2616H30.1478V0.84082Z" />
              </svg>
              )
            }
            {
              id === 'team' && (
                <svg width="35" height="33" viewBox="0 0 35 33" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17.6832 15.1076C19.9038 15.1076 22.0335 15.963 23.6037 17.4856C25.1739 19.0083 26.0561 21.0734 26.0561 23.2267V32.9697H22.7069V23.2267C22.707 21.9842 22.2174 20.7885 21.3383 19.8845C20.4592 18.9804 19.2571 18.4363 17.9779 18.3634L17.6832 18.3553C16.4018 18.3552 15.1688 18.8299 14.2365 19.6824C13.3042 20.5348 12.743 21.7005 12.6679 22.9409L12.6595 23.2267V32.9697H9.31036V23.2267C9.31036 21.0734 10.1925 19.0083 11.7627 17.4856C13.3329 15.963 15.4626 15.1076 17.6832 15.1076ZM6.7985 19.9791C7.2657 19.9791 7.71951 20.0327 8.1549 20.1317C7.86859 20.9583 7.69903 21.8186 7.65086 22.6892L7.63578 23.2267V23.3664C7.4433 23.2996 7.24309 23.256 7.03964 23.2365L6.7985 23.2267C6.17408 23.2268 5.57206 23.4523 5.10983 23.8594C4.6476 24.2665 4.35831 24.8259 4.29836 25.4286L4.28664 25.6625V32.9697H0.9375V25.6625C0.9375 24.1551 1.555 22.7096 2.65415 21.6437C3.7533 20.5779 5.24407 19.9791 6.7985 19.9791ZM28.5679 19.9791C30.1224 19.9791 31.6131 20.5779 32.7123 21.6437C33.8114 22.7096 34.4289 24.1551 34.4289 25.6625V32.9697H31.0798V25.6625C31.0797 25.057 30.8471 24.4732 30.4273 24.025C30.0075 23.5768 29.4306 23.2962 28.8091 23.2381L28.5679 23.2267C28.2749 23.2267 27.9935 23.2754 27.7306 23.3648V23.2267C27.7306 22.1453 27.5498 21.106 27.2132 20.135C27.6568 20.0308 28.1116 19.9785 28.5679 19.9791ZM6.7985 10.2361C7.90881 10.2361 8.97364 10.6638 9.75875 11.4251C10.5439 12.1865 10.9849 13.219 10.9849 14.2957C10.9849 15.3724 10.5439 16.4049 9.75875 17.1662C8.97364 17.9276 7.90881 18.3553 6.7985 18.3553C5.68819 18.3553 4.62335 17.9276 3.83825 17.1662C3.05314 16.4049 2.61207 15.3724 2.61207 14.2957C2.61207 13.219 3.05314 12.1865 3.83825 11.4251C4.62335 10.6638 5.68819 10.2361 6.7985 10.2361ZM28.5679 10.2361C29.6782 10.2361 30.7431 10.6638 31.5282 11.4251C32.3133 12.1865 32.7543 13.219 32.7543 14.2957C32.7543 15.3724 32.3133 16.4049 31.5282 17.1662C30.7431 17.9276 29.6782 18.3553 28.5679 18.3553C27.4576 18.3553 26.3928 17.9276 25.6077 17.1662C24.8226 16.4049 24.3815 15.3724 24.3815 14.2957C24.3815 13.219 24.8226 12.1865 25.6077 11.4251C26.3928 10.6638 27.4576 10.2361 28.5679 10.2361ZM6.7985 13.4838C6.57644 13.4838 6.36347 13.5693 6.20645 13.7216C6.04943 13.8738 5.96121 14.0804 5.96121 14.2957C5.96121 14.511 6.04943 14.7175 6.20645 14.8698C6.36347 15.0221 6.57644 15.1076 6.7985 15.1076C7.02056 15.1076 7.23353 15.0221 7.39055 14.8698C7.54757 14.7175 7.63578 14.511 7.63578 14.2957C7.63578 14.0804 7.54757 13.8738 7.39055 13.7216C7.23353 13.5693 7.02056 13.4838 6.7985 13.4838ZM28.5679 13.4838C28.3459 13.4838 28.1329 13.5693 27.9759 13.7216C27.8188 13.8738 27.7306 14.0804 27.7306 14.2957C27.7306 14.511 27.8188 14.7175 27.9759 14.8698C28.1329 15.0221 28.3459 15.1076 28.5679 15.1076C28.79 15.1076 29.003 15.0221 29.16 14.8698C29.317 14.7175 29.4052 14.511 29.4052 14.2957C29.4052 14.0804 29.317 13.8738 29.16 13.7216C29.003 13.5693 28.79 13.4838 28.5679 13.4838ZM17.6832 0.493164C19.4597 0.493164 21.1634 1.17749 22.4196 2.3956C23.6758 3.6137 24.3815 5.26581 24.3815 6.98847C24.3815 8.71113 23.6758 10.3632 22.4196 11.5813C21.1634 12.7995 19.4597 13.4838 17.6832 13.4838C15.9067 13.4838 14.203 12.7995 12.9468 11.5813C11.6906 10.3632 10.9849 8.71113 10.9849 6.98847C10.9849 5.26581 11.6906 3.6137 12.9468 2.3956C14.203 1.17749 15.9067 0.493164 17.6832 0.493164ZM17.6832 3.74082C16.795 3.74082 15.9431 4.08298 15.315 4.69203C14.6869 5.30108 14.3341 6.12714 14.3341 6.98847C14.3341 7.8498 14.6869 8.67585 15.315 9.28491C15.9431 9.89396 16.795 10.2361 17.6832 10.2361C18.5715 10.2361 19.4233 9.89396 20.0514 9.28491C20.6795 8.67585 21.0324 7.8498 21.0324 6.98847C21.0324 6.12714 20.6795 5.30108 20.0514 4.69203C19.4233 4.08298 18.5715 3.74082 17.6832 3.74082Z" />
                </svg>
              )
            }
            {
              id === 'settings' && (
              <svg width="34" height="35" viewBox="0 0 34 35" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M17.2128 24.4005C21.0324 24.4005 24.1386 21.3963 24.1386 17.7022C24.1386 14.0081 21.0324 11.0039 17.2128 11.0039C13.3933 11.0039 10.2871 14.0081 10.2871 17.7022C10.2871 21.3963 13.3933 24.4005 17.2128 24.4005ZM17.2128 14.3531C19.0897 14.3531 20.6757 15.887 20.6757 17.7022C20.6757 19.5174 19.0897 21.0513 17.2128 21.0513C15.336 21.0513 13.75 19.5174 13.75 17.7022C13.75 15.887 15.336 14.3531 17.2128 14.3531Z" />
                <path d="M1.36217 24.6283L3.0936 27.5253C4.01299 29.0609 6.22577 29.6369 7.82042 28.7477L8.73635 28.2353C9.73805 28.9974 10.8425 29.6239 12.0191 30.0974V31.0988C12.0191 32.9459 13.5722 34.448 15.482 34.448H18.9449C20.8547 34.448 22.4078 32.9459 22.4078 31.0988V30.0974C23.584 29.6238 24.6884 28.9979 25.6906 28.237L26.6065 28.7494C28.2046 29.6369 30.4122 29.0642 31.335 27.5253L33.0647 24.63C33.5236 23.8608 33.648 22.947 33.4107 22.0892C33.1734 21.2314 32.5937 20.4998 31.7991 20.055L30.9247 19.5661C31.1106 18.3311 31.1106 17.0767 30.9247 15.8418L31.7991 15.3528C32.5934 14.9078 33.1728 14.1762 33.41 13.3185C33.6473 12.4608 33.5231 11.5471 33.0647 10.7779L31.335 7.88257C30.4156 6.34196 28.2046 5.76424 26.6065 6.65678L25.6906 7.1692C24.6889 6.40711 23.5844 5.78064 22.4078 5.30708V4.30569C22.4078 2.45863 20.8547 0.956543 18.9449 0.956543H15.482C13.5722 0.956543 12.0191 2.45863 12.0191 4.30569V5.30708C10.8429 5.78072 9.73854 6.40658 8.73635 7.16753L7.82042 6.65511C6.22057 5.76591 4.01126 6.34196 3.09187 7.88089L1.36217 10.7762C0.903306 11.5454 0.778866 12.4592 1.01618 13.317C1.2535 14.1748 1.83316 14.9064 2.62785 15.3512L3.50222 15.8401C3.31563 17.0744 3.31563 18.3284 3.50222 19.5627L2.62785 20.0517C1.8334 20.497 1.254 21.229 1.01673 22.0869C0.779464 22.9449 0.903691 23.8588 1.36217 24.6283ZM7.12092 20.0098C6.92541 19.2552 6.82599 18.4802 6.82484 17.7023C6.82484 16.9286 6.92527 16.1516 7.11919 15.3947C7.21051 15.0419 7.18047 14.67 7.03363 14.3352C6.88679 14.0004 6.63115 13.721 6.30541 13.5393L4.36101 12.4508L6.08898 9.55547L8.07148 10.664C8.39478 10.845 8.77004 10.9196 9.14093 10.8767C9.51182 10.8338 9.85832 10.6758 10.1284 10.4262C11.2998 9.34875 12.7123 8.54706 14.2562 8.08352C14.6108 7.9788 14.9213 7.76674 15.142 7.47854C15.3627 7.19035 15.4819 6.84125 15.482 6.48263V4.30569H18.9449V6.48263C18.945 6.84125 19.0642 7.19035 19.2849 7.47854C19.5056 7.76674 19.8161 7.9788 20.1707 8.08352C21.7143 8.54773 23.1267 9.34933 24.2985 10.4262C24.5689 10.6753 24.9153 10.833 25.2861 10.8759C25.6568 10.9188 26.032 10.8444 26.3554 10.664L28.3362 9.55714L30.0676 12.4525L28.1215 13.5393C27.796 13.7212 27.5405 14.0006 27.3937 14.3353C27.2469 14.6701 27.2167 15.0419 27.3077 15.3947C27.5016 16.1516 27.6021 16.9286 27.6021 17.7023C27.6021 18.4742 27.5016 19.2512 27.306 20.0098C27.2151 20.3628 27.2456 20.7348 27.3927 21.0695C27.5398 21.4043 27.7957 21.6836 28.1215 21.8652L30.0659 22.952L28.3379 25.8474L26.3554 24.7405C26.0322 24.5593 25.6569 24.4845 25.2859 24.5274C24.915 24.5703 24.5684 24.7285 24.2985 24.9783C23.1271 26.0558 21.7146 26.8574 20.1707 27.321C19.8161 27.4257 19.5056 27.6378 19.2849 27.926C19.0642 28.2142 18.945 28.5633 18.9449 28.9219L18.9484 31.0988H15.482V28.9219C15.4819 28.5633 15.3627 28.2142 15.142 27.926C14.9213 27.6378 14.6108 27.4257 14.2562 27.321C12.7126 26.8568 11.3002 26.0552 10.1284 24.9783C9.85884 24.7278 9.51212 24.5692 9.14089 24.5266C8.76966 24.484 8.39419 24.5596 8.07148 24.7422L6.09072 25.8507L4.35928 22.9554L6.30541 21.8652C6.63126 21.6836 6.88709 21.4043 7.03422 21.0695C7.18136 20.7348 7.21179 20.3628 7.12092 20.0098Z" />
              </svg>
              )
            }
            {
              id === 'affiliates' && (
                <svg width="35" height="31" viewBox="0 0 35 31" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17.6722 2.913C15.8426 1.23066 13.4478 0.296953 10.9623 0.296875C9.64676 0.298245 8.34447 0.559763 7.13037 1.06638C5.91628 1.573 4.81436 2.31471 3.88802 3.24883C-0.0630322 7.21668 -0.0613531 13.4228 3.89138 17.3739L16.203 29.6855C16.4884 30.1876 17.0392 30.5116 17.6722 30.5116C17.9322 30.5091 18.1879 30.4457 18.4188 30.3264C18.6498 30.2071 18.8496 30.0353 19.0021 29.8249L31.4531 17.3739C35.4058 13.4212 35.4058 7.21668 31.4497 3.24212C30.5238 2.30971 29.4228 1.5695 28.2099 1.06405C26.997 0.558605 25.6961 0.297882 24.3821 0.296875C21.8967 0.297281 19.502 1.23094 17.6722 2.913ZM29.0754 5.61645C31.6999 8.2544 31.7016 12.3751 29.0787 14.9996L17.6722 26.4061L6.26571 14.9996C3.64287 12.3751 3.64455 8.2544 6.26235 5.62316C7.53851 4.35372 9.20759 3.65519 10.9623 3.65519C12.717 3.65519 14.3794 4.35372 15.6455 5.6198L16.4851 6.45938C16.6409 6.61545 16.8259 6.73927 17.0296 6.82375C17.2333 6.90823 17.4517 6.95171 17.6722 6.95171C17.8928 6.95171 18.1111 6.90823 18.3148 6.82375C18.5185 6.73927 18.7036 6.61545 18.8594 6.45938L19.699 5.6198C22.2379 3.08596 26.5399 3.09267 29.0754 5.61645Z" />
                </svg>
              )
            }
            {
              badge ? <div className="badge">{badge}</div> : null
            }
          </Link>
        )}

        {/* HELP */}
        {
          id === 'help' && (
            <div className="nav-link nav-link--ani" onClick={onClickHelp} onMouseEnter={onEnter} onMouseLeave={onLeave}>
              <svg width="37" height="36" viewBox="0 0 37 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18.4448 7.61523C16.5892 7.61751 14.8102 8.33147 13.498 9.60053C12.1859 10.8696 11.4477 12.5901 11.4453 14.3849H15.0038C15.0038 12.5488 16.5481 11.0568 18.4448 11.0568C20.3415 11.0568 21.8858 12.5488 21.8858 14.3849C21.8858 15.4139 21.03 16.1607 19.7223 17.1829C19.2951 17.5066 18.8848 17.8506 18.4929 18.2136C16.7172 19.9293 16.6656 21.7516 16.6656 21.9547V23.1024H20.224L20.2223 22.0132C20.224 21.9856 20.281 21.3489 21.0069 20.6486C21.2738 20.3905 21.6101 20.1323 21.9588 19.8604C23.3448 18.7746 25.4425 17.1347 25.4425 14.3849C25.4411 12.5902 24.7035 10.8693 23.3915 9.60013C22.0795 8.33092 20.3005 7.61706 18.4448 7.61523ZM16.6656 24.8232H20.224V28.2648H16.6656V24.8232Z" />
                <path d="M18.4466 0.732422C8.63593 0.732422 0.654297 8.45193 0.654297 17.9404C0.654297 27.4289 8.63593 35.1484 18.4466 35.1484C28.2573 35.1484 36.2389 27.4289 36.2389 17.9404C36.2389 8.45193 28.2573 0.732422 18.4466 0.732422ZM18.4466 31.7068C10.5984 31.7068 4.21276 25.5309 4.21276 17.9404C4.21276 10.35 10.5984 4.17402 18.4466 4.17402C26.2948 4.17402 32.6805 10.35 32.6805 17.9404C32.6805 25.5309 26.2948 31.7068 18.4466 31.7068Z" />
              </svg>
            </div>
          )
        }
        {/* CAMPAIGN */}
        {
          id === 'campaigns' && (
            <div className="nav-link nav-link--ani" onClick={onClickCampaigns} onMouseEnter={onEnter} onMouseLeave={onLeave}>
              <svg width="32" height="29" viewBox="0 0 32 29" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16.4414 7.10228H3.35235C2.48449 7.10228 1.65217 7.44156 1.0385 8.04549C0.424834 8.64942 0.0800781 9.46852 0.0800781 10.3226V16.7633C0.0800781 17.6173 0.424834 18.4365 1.0385 19.0404C1.65217 19.6443 2.48449 19.9836 3.35235 19.9836H4.98848V26.4243C4.98848 26.8513 5.16086 27.2608 5.4677 27.5628C5.77453 27.8648 6.19069 28.0344 6.62462 28.0344H9.89689C10.3308 28.0344 10.747 27.8648 11.0538 27.5628C11.3606 27.2608 11.533 26.8513 11.533 26.4243V19.9836H16.4414L24.6221 26.4243V0.661621L16.4414 7.10228ZM31.9847 13.5429C31.9847 16.2963 30.414 18.7921 27.8944 19.9836V7.10228C30.3977 8.3099 31.9847 10.8057 31.9847 13.5429Z" />
              </svg>
            </div>
          )
        }
        {/* LOGOUT */}
        {
          id === 'logout' && (
            <div className="nav-link nav-link--ani" onClick={onLogout} onMouseEnter={onEnter} onMouseLeave={onLeave}>
              <svg width="33" height="30" viewBox="0 0 33 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M0 5.99078V24.0092C0 25.6682 0.690493 27.1429 1.79528 28.2949C2.90007 29.4009 4.32709 30 5.98427 30H15.0067V26.2673H5.98427C4.74138 26.2673 3.77469 25.2535 3.77469 24.0092V5.99078C3.77469 4.74654 4.74138 3.7788 5.98427 3.7788H15.0067V0H5.98427C4.32709 0 2.90007 0.645161 1.79528 1.75115C0.690493 2.90323 0 4.3318 0 5.99078ZM9.89706 11.4286V18.6175C9.89706 19.447 10.6336 20.1382 11.4622 20.1382H19.7941V25.8065C19.7941 26.3134 20.0703 26.7281 20.5306 26.9585C20.7148 27.0046 20.8989 27.0046 20.991 27.0046C21.3132 27.0046 21.5894 26.9124 21.8196 26.682L32.6373 15.8525C33.1436 15.4378 33.0976 14.6083 32.6373 14.1475L21.8196 3.36406C21.1751 2.67281 19.7941 3.08756 19.7941 4.19355V9.90783H11.4622C10.6336 9.90783 9.89706 10.5991 9.89706 11.4286Z" />
              </svg>
            </div>
          )
        }

      </div>
    </li>
  )
});
