import React, { useState, useEffect } from 'react'
import { withRouter } from 'react-router-dom'

import Form from '~components/Form'
import ContainerRow from '~components/ContainerRow'
import FormTitle from '~components/Layout/Dashboard/FormTitle'
import Input from '~components/Input'
import Button from '~components/Button'
import LoadingActivity from '~components/LoadingActivity'
import ErrorMessage from '~common/components/ErrorMessage'
import { validateEmail, toast } from '~common/helper'
import './layout/style.scss'

const Invite = withRouter(({
  initInviteMember, inviteMember, user, history,
}) => {
  const [email, setEmail] = useState('')
  const [errorEmail, setErrorEmail] = useState('')

  const { loading, error, success } = user.invite_member

  useEffect(() => {
    initInviteMember()
  }, [])

  useEffect(() => {
    if (success) {
      toast.success('User Invited!')
      initInviteMember()
      history.goBack()
    }
  }, [success])

  const inviteUser = () => {
    setErrorEmail('')
    if (!email) {
      setErrorEmail('Required.')
      return
    }
    if (!validateEmail(email)) {
      setErrorEmail('Need to input valid email address.')
      return
    }
    inviteMember(email)
  }

  const onChangeEmail = (e) => {
    setEmail(e.target.value)
  }

  return (
    <Form className="team-invite-page">
      <FormTitle title="Invite Member" hasBack history={history} />
      <React.Fragment>
        <ContainerRow>
          <Input
            type="text"
            label="Email"
            value={email}
            onChange={onChangeEmail}
            placeholder="someone@company.com"
            error={
              errorEmail
              || (error && error.error && error.error.email)
            }
            noIcon
            fontSize={14}
          />
        </ContainerRow>
        <ContainerRow>
          <ErrorMessage message={error && `*${error.message}`} />
        </ContainerRow>
        {
          !loading && (
            <ContainerRow className="button-container">
              <Button
                label="Invite Member"
                width="70%"
                onClick={inviteUser}
              />
            </ContainerRow>
          )
        }
        {
          loading && <ContainerRow><LoadingActivity /></ContainerRow>
        }
      </React.Fragment>
    </Form>
  )
})
export default Invite
