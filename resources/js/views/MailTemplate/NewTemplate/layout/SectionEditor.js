import React from 'react'
import TextArea from '~components/TextArea'
import TagInput from '~components/TagInput'

export default ({
  name,
  content,
  error,
  onEdit,
  limit,
}) => {
  const edit = (text) => {
    if (text.length <= limit) {
      onEdit(text)
    }
  }

  const insertTag = (index) => {
    let tagText = ''
    if (index === 0) {
      tagText = '{{signature_name}}'
    } else if (index === 1) {
      tagText = '{{signature_sign_off}}'
    } else if (index === 2) {
      tagText = '{{signature_phone}}'
    } else if (index === 3) {
      tagText = '{{signature_email}}'
    } else if (index === 4) {
      tagText = '{{signature_website}}'
    } else if (index === 5) {
      tagText = '{{signature_address}}'
    } else if (index === 6) {
      tagText = '{{signature_city}}'
    } else if (index === 7) {
      tagText = '{{signature_state}}'
    } else if (index === 8) {
      tagText = '{{signature_zip}}'
    }
    edit(`${content}${tagText}`)
  }

  const secondLabel = limit && `${limit - content.length}/${limit}`

  return (
    <React.Fragment>
      <TextArea
        label={name}
        secondLabel={secondLabel}
        value={content}
        error={error}
        onChange={(e) => edit(e.target.value)}
      />
      <div className="mail-tags-container">
        <TagInput
          label="Name"
          onClick={() => insertTag(0)}
        />
        <TagInput
          label="Sign Off"
          onClick={() => insertTag(1)}
        />
        <TagInput
          label="Phone"
          onClick={() => insertTag(2)}
        />
        <TagInput
          label="Email"
          onClick={() => insertTag(3)}
        />
        <TagInput
          label="Website"
          onClick={() => insertTag(4)}
        />
        <TagInput
          label="Address"
          onClick={() => insertTag(5)}
        />
        <TagInput
          label="City"
          onClick={() => insertTag(6)}
        />
        <TagInput
          label="State"
          onClick={() => insertTag(7)}
        />
        <TagInput
          label="Zip"
          onClick={() => insertTag(8)}
        />
      </div>
    </React.Fragment>
  )
}
