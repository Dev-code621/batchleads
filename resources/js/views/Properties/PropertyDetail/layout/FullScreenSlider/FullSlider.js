import React, {
  memo, Fragment,
} from 'react'
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io'
import Carousel from 'nuka-carousel'

const defaultControlsConfig = {
  pagingDotsStyle: {
    width: '30px',
    height: '20px',
    marginBottom: '0px',
    fill: 'white',
  },
}

export default memo(({
  images = [], slideIndex,
}) => {
  return (
    <div className="property-full-carousel">
      <Carousel
        cellAlign="center"
        height="100%"
        heightMode="max"
        slideIndex={slideIndex}
        defaultControlsConfig={defaultControlsConfig}
        enableKeyboardControls
        wrapAround
        renderCenterLeftControls={({ previousSlide }) => (images && images.length > 1
          ? (
            <div className="image-slider-icon" onClick={previousSlide}>
              <IoIosArrowBack size={30} />
            </div>
          ) : (
            <div />
          )
        )}
        renderCenterRightControls={({ nextSlide }) => (images && images.length > 1
          ? (
            <div className="image-slider-icon" onClick={nextSlide}>
              <IoIosArrowForward size={30} />
            </div>
          ) : (
            <div />
          )
        )}
      >
        {images.map((image) => {
          return (
            <Fragment key={image.id || image}>
              {image.url && (
                <img
                  src={image.url}
                  alt="property"
                  key={image.id}
                />
              )}
              {image && !image.url && (
                <img
                  src={URL.createObjectURL(image)}
                  alt="property"
                  key={URL.createObjectURL}
                />
              )}
            </Fragment>
          )
        })}
      </Carousel>
    </div>
  )
})
