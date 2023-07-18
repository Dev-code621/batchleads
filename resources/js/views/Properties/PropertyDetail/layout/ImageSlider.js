import React, { memo, Fragment, useState } from 'react'
import { FaRegTrashAlt } from 'react-icons/fa'
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io'
import Carousel from 'nuka-carousel'
import { useSelector } from 'react-redux'

import { getStreetViewAddonSelector } from '~redux/selectors/userSelector'

import CAMERA_ICON from '~assets/icons/camera.svg'
import AddonModal from '~common/components/AddonModal'

const defaultControlsConfig = {
  pagingDotsStyle: {
    width: '20px',
    height: '20px',
    marginBottom: '20px',
  },
}

export default memo(({
  images = [], slideIndex,
  setSlideIndex, removeImage,
  onSelectImages, onClickImage,
  user, isSaved,
}) => {
  const [showAddonModal, setShowAddonModal] = useState(false);
  const hasStreetViewAddon = useSelector(getStreetViewAddonSelector);
  const isBlur = !hasStreetViewAddon
    && ((images.length > 0 && images[slideIndex].is_location_image) || !isSaved)
  let fileInput = null
  const openFileUpload = () => {
    fileInput.click()
  }
  const showLargeImage = (e) => {
    if (hasStreetViewAddon) {
      onClickImage()
    }
  }
  const updateStreetAddon = () => {
    setShowAddonModal(true);
  }
  return (
    <div className={`property-carousel${isBlur ? ' blured' : ''}`}>
      <Carousel
        heightMode="max"
        slideIndex={slideIndex}
        afterSlide={(index) => setSlideIndex(index)}
        defaultControlsConfig={defaultControlsConfig}
        wrapAround
        renderCenterLeftControls={({ previousSlide }) => (
          <div className="image-slider-icon" onClick={previousSlide}>
            <IoIosArrowBack size={20} />
          </div>
        )}
        renderCenterRightControls={({ nextSlide }) => (
          <div className="image-slider-icon" onClick={nextSlide}>
            <IoIosArrowForward size={20} />
          </div>
        )}
      >
        {Array.isArray(images) && images.map((image) => {
          return (
            <Fragment key={image.id || image}>
              {image.url && (
                // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
                <img
                  onClick={(e) => showLargeImage(e, image)}
                  src={image.url}
                  alt="property"
                  key={image.id}
                />
              )}
              {image && !image.url && (
                <div onClick={(e) => showLargeImage(e, image)}>
                  <img
                    src={URL.createObjectURL(image)}
                    alt="property"
                    key={URL.createObjectURL}
                  />
                </div>
              )}
            </Fragment>
          )
        })}
      </Carousel>
      {images.length > 0 ? (
        <FaRegTrashAlt className="trash-icon" size={20} onClick={() => removeImage()} />
      ) : (
        <div />
      )}
      <input
        type="file"
        multiple
        ref={(input) => {
          fileInput = input
          return true
        }}
        accept="image/*"
        onChange={onSelectImages}
      />
      <div onClick={openFileUpload} className="camera-icon">
        <img src={CAMERA_ICON} alt="camera" />
      </div>
      {isBlur && (
        <div className="addon-button" onClick={updateStreetAddon}>Upgrade to View Picture</div>
      )}
      <AddonModal toggle={showAddonModal} user={user} onClose={() => setShowAddonModal(false)} />
    </div>
  )
})
