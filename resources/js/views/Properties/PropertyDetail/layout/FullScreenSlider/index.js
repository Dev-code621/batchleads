import React from 'react'
import BaseModal from '~components/BaseModal'
import FullSlider from './FullSlider'

import './style.scss';

export default ({
  images,
  slideIndex,
  showSlider,
  onClose,
}) => {
  return (
    <BaseModal
      toggle={showSlider}
      onClose={onClose}
      transparent
      closeButtonSize={36}
    >
      <FullSlider
        images={images}
        slideIndex={slideIndex}
      />
    </BaseModal>
  )
}
