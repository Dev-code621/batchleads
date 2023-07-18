import React from 'react'
import { AiOutlineBars } from 'react-icons/ai'
import ModalContent from '~layout/Dashboard/ModalContent'

const ContentToggle = ({
  children, isActiveContent, toggle,
}) => {
  const ontoggle = () => {
    toggle()
  }
  return (
    <div className="toggled_modal" style={window.location.pathname === '/dashboard' ? { display: 'none' } : { display: 'block' }}>
      {!isActiveContent ? (
        <AiOutlineBars id="content-toggle" onClick={ontoggle} onKeyDown={() => { }} role="button" tabIndex="0" />
      ) : (
        <div>
          <div className="cross-btn">
            <button className="close-icon" onClick={ontoggle} onKeyDown={() => { }} tabIndex="0" type="button" />
          </div>
          <ModalContent>
            {children}
          </ModalContent>
        </div>
      )}
    </div>
  )
}

export default ContentToggle
