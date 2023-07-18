import React, { useState, useEffect } from 'react'
import { withRouter } from 'react-router-dom'
import get from 'lodash.get'
import Form from '~common/components/Form'
import FormTitle from '~components/Layout/Dashboard/FormTitle'
import Input from '~components/Input'
import Button from '~components/Button'
import ContainerRow from '~components/ContainerRow'
import LoadingActivity from '~components/LoadingActivity'
import { formatPhoneInput, toast } from '~common/helper'
import ProfileHeader from '../layout/ProfileHeader'
import './layout/style.scss'

const EditProfile = withRouter(({
  history,
  user,
  updateUserInfo,
  initUpdateUserInfo,
  getUser,
}) => {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [image, setImage] = useState('')
  const [company, setCompany] = useState('')

  const userName = user.result.user ? get(user.result.user.user, 'name') : null
  const phoneNumber = user.result.user ? get(user.result.user.user, 'phone') : null
  const photoUrl = user.result.user ? get(user.result.user.user, 'photo_url') : null
  const credits = user.result.user ? get(user.result.user.user.credit, 'ballance') : null
  const properties = user.result.user ? get(user.result.user.user, 'property_count') : null
  const error = user.update_user_info ? get(user.update_user_info, 'error') : null
  const loading = user.update_user_info ? get(user.update_user_info, 'loading') : null
  const success = user.update_user_info ? get(user.update_user_info, 'success') : null
  const role = user.result.user ? get(user.result.user.user, 'role') : null
  const userCompany = user.result.user ? get(user.result.user.user, 'company') : null

  useEffect(() => {
    setName(userName)
    setPhone(formatPhoneInput(phoneNumber))
    setCompany(userCompany)
    initUpdateUserInfo()
  }, [])

  useEffect(() => {
    if (success) {
      toast.success('Updated!')
      initUpdateUserInfo()
      getUser(user)
    }
  }, [success])

  const onChangeName = (e) => {
    setName(e.target.value)
  }

  const onSave = () => {
    updateUserInfo({
      name,
      phone,
      file: image,
      company,
    })
  }

  return (
    <Form className="profile-page">
      <FormTitle title="Profile" hasBack history={history} />
      <ProfileHeader
        editable
        photoUrl={photoUrl}
        properties={properties}
        credits={credits}
        onChangePhoto={setImage}
        history={history}
        role={role}
      />
      <ContainerRow>
        <Input
          type="text"
          label="Name"
          value={name}
          onChange={onChangeName}
          placeholder="Your Name"
          width="100%"
          noIcon
          height={48}
          error={error && error.error && error.error.name}
        />
      </ContainerRow>
      <ContainerRow>
        <Input
          label="Phone Number"
          placeholder="Phone Number"
          value={formatPhoneInput(phone)}
          onChange={(e) => setPhone(e.target.value)}
          type="text"
          noIcon
          height={48}
          error={error && error.error && error.error.phone}
        />
      </ContainerRow>
      <ContainerRow>
        <Input
          label="Company"
          placeholder="Company"
          noIcon
          height={48}
          type="text"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
        />
      </ContainerRow>
      <ContainerRow className="button-container">
        {
        loading ? <LoadingActivity /> : (
          <Button
            label="SAVE SETTINGS"
            width="70%"
            height={48}
            onClick={onSave}
          />
        )
      }
      </ContainerRow>
    </Form>
  )
})

export default EditProfile
