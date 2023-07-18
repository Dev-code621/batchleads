import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import Collapsible from '~components/Collapsable'
import SelectItem from '../SelectItem'
import { userSelector } from '~redux/selectors/userSelector'
import { actions as userActions } from '~redux/modules/user'

const mapStateToProps = (state) => ({
  user: userSelector(state),
})

const mapDispatchToProps = {
  ...userActions,
}

const initialUser = { id: null, name: 'Everyone' }

const MemberSelector = ({
  selectedUser,
  onSelect,
  showAll,
  getTeamMembers,
  user,
}) => {
  useEffect(() => {
    getTeamMembers()
  }, [])
  let teamMembers = user.team_members
  let owner = null
  let admins = null
  let members = null
  if (teamMembers) {
    teamMembers = teamMembers.data;
    if (teamMembers) {
      ({ owner, admins, members } = teamMembers)
    }
  }
  const [open, setOpen] = useState(false);
  const onSelectItem = (item) => {
    onSelect(item);
    setOpen(false);
  }

  return (
    <Collapsible trigger={selectedUser.name} open={open} setOpenStatus={(flag) => setOpen(flag)}>
      {
        showAll && (
          <SelectItem
            item={initialUser.name}
            selected={selectedUser.id === initialUser.id}
            onSelect={() => onSelectItem(initialUser)}
          />
        )
      }
      {teamMembers && owner && (
        <SelectItem
          item={owner.name}
          selected={selectedUser && selectedUser.id === owner.id}
          onSelect={() => onSelectItem({ id: owner.id, name: owner.name })}
        />
      )}
      {teamMembers
        && admins
        && admins.map((admin) => (
          <SelectItem
            key={admin.user.id}
            item={admin.user.name}
            selected={selectedUser && selectedUser.id === admin.user_id}
            onSelect={() => onSelectItem({ id: admin.user_id, name: admin.user.name })}
          />
        ))}
      {teamMembers
        && members
        && members.map((member) => (
          <SelectItem
            key={member.user.id}
            item={member.user.name}
            selected={selectedUser && selectedUser.id === member.user_id}
            onSelect={() => onSelectItem({ id: member.user_id, name: member.user.name })}
          />
        ))}
    </Collapsible>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(MemberSelector)
