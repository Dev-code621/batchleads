import React from 'react'
import ContainerRow from '~common/components/ContainerRow'
import PropertyStatusSelector from '~components/CollapsibleSelector/PropertyStatusSelector'
import MemberSelector from '~components/CollapsibleSelector/MemberSelector'

export default ({
  user, status, setStatus, setUser,
}) => {
  return (
    <div className="filter-panel">
      <ContainerRow title="Deal Status">
        <PropertyStatusSelector
          onSelect={(item) => setStatus(item)}
          selectedStatus={status}
          showAll
        />
      </ContainerRow>
      <ContainerRow title="By Team Members">
        <MemberSelector
          showAll
          onSelect={(item) => setUser(item)}
          selectedUser={user}
        />
      </ContainerRow>
    </div>
  )
}
