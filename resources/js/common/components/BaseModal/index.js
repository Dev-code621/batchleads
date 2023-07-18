import React from 'react'
import Modal from 'react-modal'
import { IoMdClose } from 'react-icons/io'
import LoadingActivity from '~components/LoadingActivity'
import { useThemeState } from '~common/theme-context'
import './style.scss'

const baseModalStyles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
  },
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    paddingTop: 0,
    paddingBottom: 0,
    paddingLeft: 0,
    paddingRight: 0,
    border: 'none',
    background: 'transparent',
    overflow: 'unset',
  },
}

export default ({
  title,
  children,
  toggle,
  onClose,
  preventClose,
  footer,
  loading,
  transparent,
  closeButtonSize,
  modelClass,
}) => {
  const mode = useThemeState()
  return (
    <Modal
      isOpen={toggle}
      onRequestClose={() => (!preventClose || !loading) && onClose()}
      style={baseModalStyles}
      ariaHideApp={false}
      portalClassName={`${mode.theme}  gn-base-modal ${modelClass}`}
    >
      <div className={`modal-container ${transparent && 'transparent'}`}>
        <div className="modal-header">
          <IoMdClose size={closeButtonSize || 24} className="close-icon" onClick={onClose} />
          <div className="title">{title}</div>
        </div>
        <div className="modal-content">
          {children}
        </div>
        <div className="modal-footer">
          {footer}
        </div>
        {loading && (
          <div className="modal-loading">
            <LoadingActivity width={30} height={30} color="white" />
          </div>
        )}
      </div>
    </Modal>
  )
}
