import React from 'react'
import Collapsible from '~components/Collapsable'
import Member from './Member'

export default ({ title, members, onClick }) => {
  return (
    <Collapsible trigger={title} open>
      {members
        && members.map((member) => (
          <Member
            name={member.user.name}
            email={member.user.email}
            onClick={() => onClick(member)}
          />
        ))}
    </Collapsible>
  )
}
