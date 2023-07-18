import React from 'react';


import Quote from '~assets/images/quote.svg';

export default (
  {
    name,
    description,
    picture,
    role,
  }
) => {
  return (
    <div className="testimonial-card">
      <img src={Quote} alt="quote" />
      <div dangerouslySetInnerHTML={{__html: `<p>${description}</p>`}} />
      <div className="customer">
        <div className="customer__picture">
          <img src={picture} alt={name} />
          <a className="youtube" href="#" />
        </div>
        <div className="customer__info">
          <div className="customer__info__name">
            {name}
          </div>
          <div className="customer__info__role">
            {role}
          </div>
        </div>
      </div>
    </div>
  );
};
