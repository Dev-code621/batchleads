import React from 'react'
import ItemSelector from '~components/ItemSelector'

export default ({
  isPostCard = true, onSelect,
}) => {
  return (
    <div className="template-type-selector">
      <div className="template-type-item">
        <div>
          <div className="template-type-name">4x6 Postcard</div>
          <div className="template-type-description">
          4x6 double sided postcards. Choose from pre-created templates or customize to match your message.
          </div>
        </div>
        <ItemSelector selected={!!isPostCard} onSelect={() => onSelect(true)} />
      </div>
      <div className="template-type-item">
        <div>
          <div className="template-type-name">Letter</div>
          <div className="template-type-description">
          Customize your letters by changing colors and content or choose from our pre-selected high performing letters.
          </div>
        </div>
        <ItemSelector selected={!isPostCard} onSelect={() => onSelect(false)} />
      </div>
    </div>
  )
}
