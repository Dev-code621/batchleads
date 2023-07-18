import React, { useState, useEffect, Fragment } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { AiFillPhone, AiOutlineMail } from 'react-icons/ai'
import { IoIosCheckmarkCircle, IoIosRadioButtonOff } from 'react-icons/io'
import get from 'lodash.get'
import BaseModal from '~components/BaseModal'
import { formatPhoneInput, validateEmail, toast } from '~common/helper'
import Input from '~components/Input';
import Button from '~components/Button';
import { contactSelector, selectedPropertySelector } from '~redux/selectors/propertySelector'
import { actions } from '~redux/modules/property'

import './style.scss';

export default ({ toggle, onClose, contact }) => {
  const { addContact, deleteContact, updateContact } = actions
  const dispatch = useDispatch();
  const { loading, success, error } = useSelector((state) => contactSelector(state))
  const { id: propertyId } = useSelector((state) => selectedPropertySelector(state)).item
  const [value, setValue] = useState('');
  const [phoneType, setPhoneType] = useState('Mobile')
  const { type, action, data } = contact
  const isEmail = type === 'Email'
  const placeholder = isEmail ? 'Email Address' : 'Phone Number'
  const disabled = isEmail ? !validateEmail(value) : !value
  useEffect(() => {
    if (data) {
      if (!isEmail) {
        setPhoneType(data.type || 'Mobile')
      }
      setValue(isEmail ? data.email : data.phone_number)
    } else {
      setValue('')
    }
  }, [toggle])

  useEffect(() => {
    if (!loading && success) {
      toast.success('Property updated successfully')
      onClose()
    }
    if (error) {
      const errMsg = get(error, 'response.data.message', 'Something wrong. Please try again later')
      toast.error(errMsg)
    }
  }, [success, error])

  const onContact = () => {
    if (isEmail) {
      window.open(`mailto:${data.email}`);
    } else {
      window.open(`tel:${data.phone_number}`)
    }
  }

  const onContactUpdate = () => {
    const contactAction = data ? updateContact : addContact
    const contactType = isEmail ? null : phoneType
    dispatch(contactAction(type, {
      ...data,
      type: contactType,
      [isEmail ? 'email' : 'phone_number']: value,
      property_id: propertyId,
    }))
  }

  const onContactDelete = () => {
    if (!data) return
    dispatch(deleteContact(type, data.id))
  }

  const footer = (
    <div className="footer-wrapper" style={{ justifyContent: data ? 'space-between' : 'flex-end' }}>
      {data && (
        <Button
          onClick={onContactDelete}
          disabled={disabled}
          label="Delete"
          style={{
            width: 80, height: 40, backgroundColor: 'firebrick', color: 'white',
          }}
        />
      )}
      <Button onClick={onContactUpdate} disabled={disabled} label="Save" style={{ width: 80, height: 40 }} />
    </div>
  )

  return (
    <BaseModal
      toggle={toggle}
      onClose={onClose}
      loading={loading}
      title={`${action} ${placeholder}`}
      footer={footer}
    >
      <div className="contact-modal-body">
        {!isEmail && (
          <div className="phone-type-container">
            <div className="option" onClick={() => setPhoneType('Mobile')}>
              {phoneType === 'Mobile' && <IoIosCheckmarkCircle size={20} color="#3683bc" />}
              {phoneType !== 'Mobile' && <IoIosRadioButtonOff size={20} color="#c3c3c3" />}
              <div className="title">Mobile</div>
            </div>
            <div className="option" onClick={() => setPhoneType('Land Line')}>
              {phoneType !== 'Mobile' && <IoIosCheckmarkCircle size={20} color="#3683bc" />}
              {phoneType === 'Mobile' && <IoIosRadioButtonOff size={20} color="#c3c3c3" />}
              <div className="title">Land Line</div>
            </div>
          </div>
        )}
        <div className="content-wrapper">
          <Input
            type="text"
            value={isEmail ? value : formatPhoneInput(value)}
            noIcon
            onChange={(e) => setValue(isEmail ? e.target.value : formatPhoneInput(e.target.value))}
            placeholder={placeholder}
          />
          {data && (
            <div
              onClick={onContact}
              onKeyPress={() => { }}
              role="button"
              tabIndex="0"
              className="contact-btn"
              style={{ color: disabled ? 'gray' : '' }}
            >
              {isEmail && <AiOutlineMail size={24} />}
              {!isEmail && <AiFillPhone size={24} />}
            </div>
          )}
        </div>
      </div>
    </BaseModal>
  )
}
