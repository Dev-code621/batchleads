import React, { useEffect } from 'react'
import Logo from '~assets/icons/logonew.svg'
import './Header.style.scss'

export default () => {
  useEffect(() => {
    const script = document.createElement('script')
    const inlineScript = document.createTextNode('_fprom=window._fprom||[];window._fprom=_fprom;_fprom.push(["url_tracking",true]);if (window.$FPROM) $FPROM.trackVisitor({url_tracking: true});')
    script.appendChild(inlineScript)
    document.body.appendChild(script)
    return () => {
      document.body.removeChild(script)
    }
  }, [])

  return (
    <div className="affiliate-header-container">
      <img src={Logo} alt="logo" />
    </div>
  )
}
