import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import get from 'lodash.get'
import Collapsible from '~components/Collapsable'
import SelectItem from '~components/CollapsibleSelector/SelectItem'
import { getSmsMasters, setSelectedMaster } from '~redux/modules/message'
import { smsMastersSelector } from '~redux/selectors/messageSelector'
import { formatPhoneNumber } from '~common/helper'
import Message from '~assets/icons/message.svg'
import './style.scss'

export default ({
  onSelect,
  propertyId,
}) => {
  const dispatch = useDispatch()
  const smsMasters = useSelector(smsMastersSelector)
  const phoneNumbers = get(smsMasters, 'data', [])
  const [open, setOpen] = useState(false)

  const onSelectItem = (item) => {
    if (item.id && item.latest_message) {
      dispatch(setSelectedMaster(item))
      onSelect(item.id)
      setOpen(false)
    }
  }

  useEffect(() => {
    if (propertyId) {
      dispatch(getSmsMasters(propertyId))
    }
  }, [propertyId])

  const getTrigger = () => {
    let unread = 0
    phoneNumbers.forEach((phoneNumber) => {
      unread += phoneNumber.badge_number
    })

    return (
      <div className="message-selector-trigger">
        <img src={Message} alt="Message" />
        <div>
          <span>
            {
              `Messages (${phoneNumbers.length})`
            }
          </span>
          <span>|</span>
          <span className={unread && 'unread'}>
            {
              `Unread (${unread})`
            }
          </span>
        </div>
      </div>
    )
  }

  const getItem = (phoneNumber) => {
    return (
      <div className="message-item-container">
        <span>
          {
            `${formatPhoneNumber(phoneNumber.phone_number)}`
          }
        </span>
        <span className={`${phoneNumber.badge_number && 'unread'}`}>
          {
            `(${phoneNumber.badge_number})`
          }
        </span>
      </div>
    )
  }

  return (
    <Collapsible
      trigger={getTrigger()}
      open={open}
      setOpenStatus={(flag) => setOpen(flag)}
    >
      {phoneNumbers.map((phoneNumber) => (
        <SelectItem
          item={getItem(phoneNumber)}
          onSelect={() => onSelectItem(phoneNumber)}
          key={phoneNumber.phone_number}
          arrow={phoneNumber.id && phoneNumber.latest_message}
          isNavigation
        />
      ))}
    </Collapsible>
  )
}
