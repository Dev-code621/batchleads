import React from 'react'
import Loader from 'react-loader-spinner'
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css'

export default ({
  color, type, width, height,
}) => (
  <Loader
    type={type || 'Oval'}
    color={color || '#3683bc'}
    height={height || 30}
    width={width || 30}
  />
)
