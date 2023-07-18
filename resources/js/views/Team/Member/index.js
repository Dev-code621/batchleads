import React, { useEffect } from 'react'
import { withRouter } from 'react-router-dom'
import { FaCircle } from 'react-icons/fa'
import { GoogleMap, Marker, Polyline } from '@react-google-maps/api'

import { toast } from '~common/helper'
import Form from '~components/Form'
import ContainerRow from '~components/ContainerRow'
import FormTitle from '~components/Layout/Dashboard/FormTitle'
import Input from '~components/Input'
import Button from '~components/Button'
import LoadingActivity from '~components/LoadingActivity'
import ErrorMessage from '~common/components/ErrorMessage'
import { formatDateString3, formatPhoneNumber } from '~common/helper'
import RoleSelector from './RoleSelector'

import './style.scss'

const Member = withRouter(({
  user,
  history,
  cancelInvitation,
  removeFromTeam,
  updateUserRole,
  getUserPing,
  initUserPing,
}) => {
  const { member, ping } = user
  const {
    loading, error, success,
  } = member
  const {
    loading: userPingLoading,
    latitude,
    longitude,
    route,
    is_tracking: isTracking,
    online_status: onlieStatus,
  } = ping

  const options = {
    strokeColor: '#0c7de3',
    strokeOpacity: 1,
    strokeWeight: 5,
    fillColor: '#0c7de3',
    fillOpacity: 0.35,
    clickable: false,
    draggable: false,
    editable: false,
    visible: true,
    radius: 30000,
    zIndex: 1,
  }
  let routes = null
  if (route) {
    routes = JSON.parse(route)
    routes = routes.map((item) => {
      const result = {}
      result.lat = item.latitude
      result.lng = item.longitude
      return result
    })
  }

  const getPing = () => {
    getUserPing(member.user_id)
  }

  useEffect(() => {
    if (success) {
      toast.success('Success')
      history.goBack()
    }
  }, [success])

  useEffect(() => {
    initUserPing()
    getPing()
    const interval = setInterval(() => {
      getPing()
    }, 30000)
    return () => {
      clearInterval(interval)
    }
  }, [])

  return (
    <Form className="team-member-page">
      <FormTitle title="Member" hasBack history={history}>
        {
          onlieStatus ? (
            <div className="user-status online">
              <FaCircle />
              <span>ONLINE</span>
            </div>
          ) : (
            <div className="user-status">
              <FaCircle />
              <span>OFFLINE</span>
            </div>
          )
        }
      </FormTitle>
      <React.Fragment>
        {
          member && member.role === 'owner'
            && (
            <React.Fragment>
              <ContainerRow>
                <Input label="Name" type="text" value={member.name} noIcon readOnly />
              </ContainerRow>
              <ContainerRow>
                <Input label="Role" type="text" value={member.role} noIcon readOnly />
              </ContainerRow>
              <ContainerRow>
                <Input label="Email" type="text" value={member.email} noIcon readOnly />
              </ContainerRow>
              <ContainerRow>
                <Input label="Phone" type="text" value={formatPhoneNumber(member.phone)} noIcon readOnly />
              </ContainerRow>
              <ContainerRow>
                <Input label="Join Date" type="text" value={formatDateString3(member.created_at)} noIcon readOnly />
              </ContainerRow>
            </React.Fragment>
            )
        }
        {
          member && member.user
            && (
            <React.Fragment>
              <ContainerRow>
                <Input label="Name" type="text" value={member.user.name} noIcon readOnly />
              </ContainerRow>
              {
                user.result.user.user.role === 'member'
                  && <ContainerRow><Input label="Role" type="text" value={member.user.role} noIcon readOnly /></ContainerRow>
              }
              {
                user.result.user.user.role !== 'member'
                  && (
                  <ContainerRow title="Role">
                    <RoleSelector
                      selectedRole={member.user.role}
                      onSelect={(role) => updateUserRole(member.user_id, role)}
                    />
                  </ContainerRow>
                  )
              }
              <ContainerRow>
                <Input label="Email" type="text" value={member.user.email} noIcon readOnly />
              </ContainerRow>
              <ContainerRow>
                <Input label="Phone" type="text" value={formatPhoneNumber(member.user.phone)} noIcon readOnly />
              </ContainerRow>
              <ContainerRow>
                <Input label="Join Date" type="text" value={formatDateString3(member.user.created_at)} noIcon readOnly />
              </ContainerRow>
            </React.Fragment>
            )
        }
        {
          member && member.invite_user
            && (
            <React.Fragment>
              <ContainerRow>
                <Input label="Email" type="text" value={member.email} noIcon readOnly />
              </ContainerRow>
              <ContainerRow>
                <Input label="Invited Date" type="text" value={formatDateString3(member.created_at)} noIcon readOnly />
              </ContainerRow>
            </React.Fragment>
            )
        }
        <ContainerRow>
          <ErrorMessage message={error && `*${error.message}`} />
        </ContainerRow>
        <ContainerRow>
          {
            loading && <LoadingActivity />
          }
        </ContainerRow>
        {
          !loading && member && member.user && user.result.user.user.id !== member.user_id && user.result.user.user.role !== 'member' && (
            <ContainerRow className="button-container">
              <Button
                label="Remove from Team"
                width="70%"
                onClick={() => removeFromTeam(member.user_id)}
              />
            </ContainerRow>
          )
        }
        {
          !loading && member && member.invite_user && user.result.user.user.role !== 'member' && (
            <ContainerRow className="button-container">
              <Button
                label="Cancel Invitation"
                width="70%"
                onClick={() => cancelInvitation(member.id)}
              />
            </ContainerRow>
          )
        }
        {
          latitude && longitude && onlieStatus && (
          <ContainerRow className="member-googlemap-container">
            <GoogleMap
              id="property-map"
              zoom={16}
              center={{
                lng: Number(longitude),
                lat: Number(latitude),
              }}
              mapContainerStyle={{
                height: '100%',
                width: '100%',
              }}
              options={{
                disableDefaultUI: false,
              }}
            >
              <Marker
                position={{
                  lat: Number(latitude),
                  lng: Number(longitude),
                }}
              />
              {
                isTracking && <Polyline path={routes} options={options} />
              }
            </GoogleMap>
          </ContainerRow>
          )
        }
      </React.Fragment>
    </Form>
  )
})
export default Member
