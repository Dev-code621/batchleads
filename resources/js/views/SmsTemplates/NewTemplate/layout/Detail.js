import React from 'react'
import TextArea from '~components/TextArea'
import TagInput from '~components/TagInput'

export default ({
  day, content, onRemove, onEdit, error,
}) => {
  const edit = (e) => {
    onEdit(e.target.value)
  }

  const insertTag = (index) => {
    let tagText = ''
    if (index === 0) {
      tagText = '%Owner Name%'
    } else if (index === 1) {
      tagText = '%First Name%'
    } else if (index === 2) {
      tagText = '%My Name%'
    } else if (index === 3) {
      tagText = '%Property Address%'
    }
    onEdit(`${content}${tagText}`)
  }

  const onChangeDay = (e) => {
    onEdit(e.target.value === '0 (Today)' ? 0 : e.target.value, 'day')
  }

  const getDays = () => {
    const result = []
    for (let i = 0; i <= 31; i += 1) {
      result.push(<option key={`sms-${day}-${i}`}>{`${i}${i === 0 ? ' (Today)' : ''}`}</option>)
    }

    return result
  }

  return (
    <div className="sms-detail-container">
      <div className="sms-detail-top">
        <div className="label">
          Schedule
        </div>
        <div
          onClick={onRemove}
          className="btn-remove"
          onKeyPress={() => {}}
          role="button"
          tabIndex="0"
        />
      </div>
      <div className="sms-detail-day">
        <select value={day === 0 ? `${day} (Today)` : day} onChange={onChangeDay}>
          {getDays()}
        </select>
      </div>
      <TextArea label="SMS text" value={content} onChange={edit} error={error} placeholder="Enter SMS text here" />
      <div className="sms-tags-container">
        <TagInput
          label="Owner Name"
          onClick={() => insertTag(0)}
        />
        <TagInput
          label="First Name(Owner)"
          onClick={() => insertTag(1)}
        />
        <TagInput
          label="My Name"
          onClick={() => insertTag(2)}
        />
        <TagInput
          label="Property Address"
          onClick={() => insertTag(3)}
        />
      </div>
    </div>
  )
}
