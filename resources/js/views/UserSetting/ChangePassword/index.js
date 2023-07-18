import React, { useState, useEffect } from 'react'
import { withRouter } from 'react-router-dom'
import get from 'lodash.get'

import { toast } from '~common/helper'
import Form from '~common/components/Form'
import FormTitle from '~components/Layout/Dashboard/FormTitle'
import Input from '~components/Input'
import Button from '~components/Button'
import ContainerRow from '~components/ContainerRow'
import LoadingActivity from '~components/LoadingActivity'
import './layout/style.scss'

const ChangePassword = withRouter(({
  history, user, changePassword, initChangePassword,
}) => {
  const { updatePassword } = user
  const loading = get(updatePassword, 'loading')
  const error = get(updatePassword, 'error')
  const success = get(updatePassword, 'success')

  useEffect(() => {
    initChangePassword()
  }, [])

  useEffect(() => {
    if (success) {
      toast.success('Updated Password!')
      history.push('/dashboard/settings')
      initChangePassword()
    }
  }, [success])

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [currentPassword, setCurrentPassword] = useState('')
  const [errorPasswordMismatch, setErrorPasswordMismatch] = useState('')

  const onChangePassword = (e) => {
    setPassword(e.target.value)
  }

  const onChangeConfirmPassword = (e) => {
    setConfirmPassword(e.target.value)
  }

  const onChangeCurrentPassword = (e) => {
    setCurrentPassword(e.target.value)
  }

  const onClick = () => {
    if (password !== confirmPassword) {
      setErrorPasswordMismatch('Password is mismatching.')
      return false
    }
    setErrorPasswordMismatch('')
    changePassword(currentPassword, password)
    return true
  }

  return (
    <Form className="change-password-page">
      <FormTitle title="Change Password" hasBack history={history} />
      <ContainerRow>
        <Input
          type="password"
          label="Current Password"
          value={currentPassword}
          onChange={onChangeCurrentPassword}
          placeholder="Current Password"
          width="100%"
          className="input"
          error={error && error.message}
        />
      </ContainerRow>
      <ContainerRow>
        <Input
          type="password"
          label="New Password"
          value={password}
          onChange={onChangePassword}
          placeholder="Your Password"
          width="100%"
          className="input"
          error={error && error.error && error.error.new_password}
        />
      </ContainerRow>
      <ContainerRow>
        <Input
          type="password"
          label="Confirm Password"
          value={confirmPassword}
          onChange={onChangeConfirmPassword}
          placeholder="Confirm New Password"
          width="100%"
          className="input"
          error={errorPasswordMismatch}
        />
      </ContainerRow>
      <ContainerRow className="button-container">
        {
          loading ? <LoadingActivity /> : (
            <Button
              label="CHANGE PASSWORD"
              width="70%"
              onClick={onClick}
            />
          )
        }
      </ContainerRow>
    </Form>
  )
})

export default ChangePassword
