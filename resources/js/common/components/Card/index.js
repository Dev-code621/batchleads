import React from 'react';
import {
  CardNumberElement,
  CardCvcElement,
  CardExpiryElement,
} from '@stripe/react-stripe-js';
import './style.scss';

const useOptions = (theme) => {
  const options = {
    style: {
      base: {
        fontSize: '16px',
        color: theme === 'theme-dark' ? '#ffffff' : '#454545',
        letterSpacing: '0.025em',
        fontFamily: 'sans-serif',
        '::placeholder': {
          color: theme === 'theme-dark' ? 'rgba(255, 255, 255, 0.5)' : '#8f8f8f',
        },
      },
      invalid: {
        color: '#9e2146',
      },
    },
  };

  return options;
};

export const CardNumberInput = ({
  label, width, height, icon, onChange, error, theme,
}) => (
  <div className="card-input-component" style={{ width }}>
    {label && <div className="label">{label}</div>}
    <div className="input" style={{ backgroundImage: `url(${icon})`, height }}>
      <CardNumberElement options={useOptions(theme)} onChange={onChange} />
    </div>
    {
      error && (
      <div className="error">
        *
        {error.message ? error.message : error}
      </div>
      )
    }
  </div>
);

export const CardExpiryInput = ({
  label, width, height, icon, onChange, error, theme,
}) => (
  <div className="card-input-component" style={{ width }}>
    {label && <div className="label">{label}</div>}
    <div className="input" style={{ backgroundImage: `url(${icon})`, height }}>
      <CardExpiryElement options={useOptions(theme)} onChange={onChange} />
    </div>
    {
      error && (
      <div className="error">
        *
        {error.message ? error.message : error}
      </div>
      )
    }
  </div>
);

export const CardCvcInput = ({
  label, width, height, icon, onChange, error, theme,
}) => (
  <div className="card-input-component" style={{ width }}>
    {label && <div className="label">{label}</div>}
    <div className="input" style={{ backgroundImage: `url(${icon})`, height }}>
      <CardCvcElement options={useOptions(theme)} onChange={onChange} />
    </div>
    {
      error && (
      <div className="error">
        *
        {error.message ? error.message : error}
      </div>
      )
    }
  </div>
);
