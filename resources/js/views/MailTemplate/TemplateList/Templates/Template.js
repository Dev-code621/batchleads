import React from 'react'
import ItemSelector from '~components/ItemSelector'

export default ({
  template, isSelect, onSelect, selected, onClickItem,
}) => {
  const onClickTemplate = (event) => {
    if (event.target.className.startsWith('select-box')) {
      return
    }
    onClickItem()
  }

  const temp = template.toJS()
  const { name, mail_template_style: mailTemplateStyle } = temp
  const { front_preview_image_url: previewImage, name: styleName } = mailTemplateStyle

  return (
    <div
      className="template-info"
      onClick={(event) => onClickTemplate(event)}
      onKeyPress={() => {}}
      role="button"
      tabIndex="0"
    >
      <img src={previewImage} alt="preview" />
      <div className="template-detail">
        <div>
          <div className="template-name">{name}</div>
          <div className="template-style-name">{styleName}</div>
        </div>
        {
          isSelect && (
            <ItemSelector selected={selected} onSelect={onSelect} size={30} />
          )
        }
      </div>
    </div>
  )
}
