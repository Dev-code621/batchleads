import React from 'react'
import ContainerRow from '~components/ContainerRow'

export default ({
  name, email, onClick,
}) => {
  return (
    <ContainerRow className="user-info" onClick={onClick}>
      <div className="user-name">{name}</div>
      <div className="user-email">{email}</div>
    </ContainerRow>
  )
}
