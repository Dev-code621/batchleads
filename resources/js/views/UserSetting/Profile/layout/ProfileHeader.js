import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { FaCamera } from 'react-icons/fa'
import ContainerRow from '~components/ContainerRow'
import UserPlaceholder from '~assets/images/user_placeholder.png'
import './style.scss'

export default ({
  properties, credits, photoUrl, editable, onChangePhoto, role, history,
}) => {
  let fileInput = null
  const [image, setImage] = useState(null)
  const openFileUpload = () => {
    fileInput.click()
  }
  const onSelectImage = (event) => {
    const { files } = event.target
    if (files) {
      setImage(files[0])
      if (onChangePhoto) {
        onChangePhoto(files[0])
      }
    }
  }

  const toProperties = () => {
    history.push('/dashboard/properties', { back_button: true })
  }

  return (
    <ContainerRow className="user-picture-container">
      <div className="user-property">
        <div className="label">
          Properties
        </div>
        <div onClick={toProperties} className="value">
          {properties || 0}
        </div>
      </div>
      <div className="user-picture">
        <img className="user-icon" src={image ? URL.createObjectURL(image) : (photoUrl || UserPlaceholder)} alt="user" />
        {
          editable ? <FaCamera className="edit-icon" color="rgba(143, 143, 143, 0.5)" onClick={openFileUpload} /> : (
            <Link to="/dashboard/settings/profile/edit">
              <FaCamera className="edit-icon" color="rgba(143, 143, 143, 0.5)" />
            </Link>
          )
        }
      </div>
      <div className="user-property">
        <div className="label">
          Credits
        </div>
        {
          (role === 'owner' || role === 'admin') && (
          <Link to="/dashboard/settings/credit" className="value">
            {credits || 0}
          </Link>
          )
        }
        {
          role === 'member' && <span className="value">{credits || 0}</span>
        }
      </div>
      <input
        type="file"
        ref={(input) => {
          fileInput = input
          return true
        }}
        accept="image/*"
        onChange={onSelectImage}
      />
    </ContainerRow>
  )
}
