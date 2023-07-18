import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import BaseModal from '~components/BaseModal'
import Button from '~components/Button'
import LoadingActivity from '~components/LoadingActivity'
import { toast } from '~common/helper'

import { updateAddOn, initUpdateAddOn } from '~redux/modules/user'
import { addOnSelector } from '~redux/selectors/userSelector'
import ADDON_ICON from '~assets/icons/street_addon.svg'
import './style.scss'

export default ({ toggle, onClose, user }) => {
  const dispatch = useDispatch()
  const addOnResult = useSelector(addOnSelector)
  useEffect(() => {
    if (!addOnResult) {
      return;
    }
    const { loading, success } = addOnResult;
    if (!loading && success) {
      toast.success('Successfully upgrade your addon.');
      dispatch(initUpdateAddOn());
      onClose();
    }
  }, [addOnResult])
  const update = () => {
    dispatch(updateAddOn('street_view', user))
  }

  return (
    <BaseModal
      toggle={toggle}
      onClose={onClose}
      transparent
      modelClass="addon-modal"
    >
      <div className="addon-modal-body">
        <img src={ADDON_ICON} alt="addon" />
        <div className="title">Add Google Street Pics</div>
        <div className="description">{"Instantly see a \"curbside view\" photo of a property through Google's Street View."}</div>
        <div className="price">$20/month</div>
        <Button label="BUY ADDON" onClick={update} />
        <div className="cancel" onClick={onClose}>No, thanks</div>
        {addOnResult && addOnResult.loading && (
          <div className="modal-loading">
            <LoadingActivity width={30} height={30} color="white" />
          </div>
        )}
      </div>
    </BaseModal>
  )
}
