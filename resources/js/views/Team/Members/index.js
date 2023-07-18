import React, { useEffect } from 'react'
import { withRouter } from 'react-router-dom'
import Form from '~components/Form'
import ContainerRow from '~components/ContainerRow'
import FormTitle from '~components/Layout/Dashboard/FormTitle'
import Collapsible from '~components/Collapsable'
import MemberList from './layout/MemberList'
import Member from './layout/Member'
import './layout/style.scss'

const MyTeam = withRouter(({
  getTeamMembers, setSelectedMember, user, history,
}) => {
  useEffect(() => {
    getTeamMembers()
  }, [])

  const onAdd = () => {
    history.push('/dashboard/teams/invite')
  }

  const onDetail = (item) => {
    setSelectedMember(item)
    history.push('/dashboard/teams/member')
  }

  let teamMembers = user.team_members
  let owner = null
  let admins = null
  let members = null
  let pendingMembers = null
  if (teamMembers) {
    teamMembers = teamMembers.data
    if (teamMembers) {
      ({
        owner,
        admins,
        members,
        pending_members: pendingMembers,
      } = teamMembers)
    }
  }

  return (
    <Form className="team-page">
      <FormTitle title="Team" hasBack hasAdd onAdd={onAdd} history={history}/>
      <ContainerRow>
        <Collapsible trigger="Owner" open>
          {owner && (
            <Member name={owner.name} email={owner.email} onClick={() => onDetail(owner)} />
          )}
        </Collapsible>
      </ContainerRow>
      <ContainerRow>
        <MemberList title="Admins" members={admins} onClick={onDetail} />
      </ContainerRow>
      <ContainerRow>
        <MemberList title="Members" members={members} onClick={onDetail} />
      </ContainerRow>
      <ContainerRow>
        <Collapsible trigger="Not Accepted" open>
          {pendingMembers
            && pendingMembers.map((member) => (
              <Member email={member.email} onClick={() => onDetail(member)} />
            ))}
        </Collapsible>
      </ContainerRow>
    </Form>
  )
})
export default MyTeam
