import React, { useState } from 'react'
import { SketchPicker } from 'react-color'

export default ({ color, onSelectColor }) => {
  const [showPicker, setShowPicker] = useState(false)

  return (
    <div className="primary-color-picker-container">
      <div
        className="primary-color-picker"
        onClick={() => setShowPicker(!showPicker)}
        onKeyPress={() => {}}
        style={{ backgroundColor: color }}
        role="button"
        tabIndex="0"
      >
        <div className="color-label">
          {color}
        </div>
      </div>
      {
        showPicker && <SketchPicker color={color} onChange={onSelectColor} />
      }
    </div>
  )
}
