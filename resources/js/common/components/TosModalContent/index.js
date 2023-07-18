import React from 'react'
import Frame from 'react-frame-component'
import tosPage from '../../../../../public/tos.html'
import './style.scss'

export default () => {
  return (
    <div className="tos-content">
      <Frame
        className="tos-frame"
        initialContent="<!DOCTYPE html><html><head><style>.frame-content {height:100%}.frame-div{height:100%}</style></head><body><div class='frame-div'></div></body></html>"
      >
        <div dangerouslySetInnerHTML={{ __html: tosPage }} style={{ height: '100%' }} />
      </Frame>
    </div>
  )
}
