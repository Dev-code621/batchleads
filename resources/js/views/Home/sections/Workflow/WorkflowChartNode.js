/* eslint-disable react/no-danger */
import React from 'react'

export default ({ title, description, image }) => {
  return (
    <div className="node">
      <div className="node__info">
        <h4 className="node__title">{title}</h4>
        <p className="node__description" dangerouslySetInnerHTML={{ __html: description }} />
      </div>
      <div className="node__image">
        <img src={image} alt={title} />
      </div>
    </div>
  );
};
