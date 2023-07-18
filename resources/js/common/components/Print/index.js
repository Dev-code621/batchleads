import React, { Fragment, useState } from 'react';
import { createPortal } from 'react-dom'
import './style.scss'

export default ({
  children,
  title,
  buttonClass,
  printId,
  ...props
}) => {
  const [contentRef, setContentRef] = useState(null)
  const contentWindow = contentRef ? contentRef.contentWindow : undefined
  const mountNode = contentWindow ? contentWindow.document.body : undefined

  const printIframe = () => {
    if (contentWindow) {
      contentRef.focus()
      contentWindow.print()
    }
    return false
  }

  return (
    <Fragment>
      <iframe
        {...props}
        ref={setContentRef}
        title={title}
        className="print-iframe"
      >
        {mountNode
        && createPortal(
          React.Children.only(children),
          mountNode
        )}
      </iframe>
      <div className={buttonClass} onClick={printIframe}>Print</div>
    </Fragment>
  );
}
