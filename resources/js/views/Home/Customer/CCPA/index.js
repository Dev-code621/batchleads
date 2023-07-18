import React from 'react'
import Container from '../layout/Container'
import Input from '~components/Input'
import Button from '~components/Button'
import TextArea from '~components/TextArea'
import User from '~assets/icons/user.svg'

export default () => {
  return (
    <Container title="California Consumer" secondTitle="Protection Act">
      <form>
        <div className="bg-container">
          <div className="bg-1" />
          <div className="bg-2" />
          <div className="bg-3" />
        </div>
        <div className="form-description" style={{ display: 'unset' }}>
          To the extent required by the California Consumer Protection Act
          (CCPA): California residents who want to know what Personal
          Information (as defined in the CCPA) we maintain about them may send a
          Request to Know using the webform below or by calling us at
          <span>
            <b>&nbsp;1 (800) 983-5313&nbsp;</b>
          </span>
          during business hours. We will confirm receipt of your
          Request within 10 days and fulfill your request within 45 days, or up
          to 90 days if we notify you as to why we need more time. You will
          first be required to prove your identity as required by the CCPA and
          as set forth in our Privacy Notice to California Residents.
          <br />
          <br />
          If we cannot successfully verify your identity, or if the information would
          be too sensitive to disclose, we may not be able to provide the
          Personal Information to you. You may only submit 2 requests per year.
        </div>
        <div className="form-description">
          <Input
            type="text"
            placeholder="First Name*"
            width="100%"
            className="input"
            icon={User}
            height={35}
          />
          <Input
            type="text"
            placeholder="Last Name*"
            width="100%"
            className="input"
            icon={User}
            height={35}
          />
          <Input
            type="email"
            placeholder="Email Address*"
            width="100%"
            className="input"
            height={35}
          />
          <TextArea
            placeholder="Address"
            fontSize={14}
            width="100%"
            className="input-field"
          />
          <Button
            label="SEND REQUEST"
            width="50%"
            height={40}
            color="transparent"
          />
        </div>
      </form>
    </Container>
  )
}
