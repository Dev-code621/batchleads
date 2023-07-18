import React from 'react'
import moment from 'moment'
import { toast as reactToast } from 'react-toastify'
import GNToast from './components/GNToast'

export const formatDateString = (dateStr) => {
  return moment(dateStr, 'YYYYMMDD').format('MM/DD/YYYY')
}

export const formatDateString1 = (dateStr) => {
  return moment.utc(dateStr).local().format('DD MMM, hh:mm A')
}

export const formatDateString2 = (dateStr) => {
  return moment.utc(dateStr).local().format('MM/DD/YYYY, hh:mm A')
}

export const formatDateString3 = (dateStr) => {
  return moment(dateStr).format('DD MMM, YYYY')
}

export const formatDateString4 = (dateStr) => {
  return moment(dateStr).format('DD MMM')
}

export const formatPriceValue = (priceValue) => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(priceValue)
}

export const formatNumber = (number) => {
  // return new Intl.NumberFormat('en-US', { maximumSignificantDigits: 2 }).format(number)
  return number.toLocaleString(undefined)
}

export const formatPhoneNumber = (str) => {
  const cleaned = (`${str}`).replace(/\D/g, '')
  const match = cleaned.match(/^(1|)?(\d{3})(\d{3})(\d{4})$/)

  if (match) {
    // const intlCode = (match[1] ? '+1 ' : '')
    return ['(', match[2], ') ', match[3], '-', match[4]].join('')
  }

  return null
}

export const formatPhoneNumberForApiRequest = (str) => {
  const cleaned = (`${str}`).replace(/\D/g, '')
  const match = cleaned.match(/^(1|)?(\d{3})(\d{3})(\d{4})$/)

  if (match) {
    return [match[2], match[3], match[4]].join('')
  }

  return null
}

export const formatPhoneInput = (value, previousValue) => {
  if (!value) {
    return value;
  }
  const currentValue = value.replace(/[^\d]/g, '');
  const cvLength = currentValue.length;

  if (!previousValue || value.length > previousValue.length) {
    if (cvLength < 4) {
      return currentValue;
    }
    if (cvLength < 7) {
      return `(${currentValue.slice(0, 3)}) ${currentValue.slice(3)}`;
    }
    return `(${currentValue.slice(0, 3)}) ${currentValue.slice(3, 6)}-${currentValue.slice(6, 10)}`;
  }
};

export const validateEmail = (email) => {
  // eslint-disable-next-line no-useless-escape
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return re.test(String(email).toLowerCase())
}

export const isValidUSZip = (sZip) => {
  return /^\d{5}(-\d{4})?$/.test(sZip);
}

export const isValidName = (name) => {
  const nameRegex = /^[a-zA-Z'\-,.]*[^0-9_!¡?÷?¿\/\\+=@#$%ˆ&*(){}|~<>;:[\]]*$/
  return nameRegex.test(String(name).toLowerCase())
}

export const elapsedTime = (ms) => {
  let secs = ms / 1000
  ms = Math.floor(ms % 1000)
  let minutes = secs / 60
  secs = Math.floor(secs % 60)
  let hours = minutes / 60
  minutes = Math.floor(minutes % 60)
  hours = Math.floor(hours % 24)
  if (hours < 1) {
    if (minutes < 1) {
      return `${secs} secs`
    }
    return `${minutes} mins`
  }
  return `${hours} hrs, ${minutes} mins`
}

export const geoDistance = (location1, location2) => {
  const { lng: lon1, lat: lat1 } = location1;
  const { lng: lon2, lat: lat2 } = location2;
  if (!lon1 || !lon2 || !lat1 || !lat2) {
    return 1000000;
  }
  if ((lat1 === lat2) && (lon1 === lon2)) {
    return 0;
  }
  const radlat1 = Math.PI * lat1 / 180;
  const radlat2 = Math.PI * lat2 / 180;
  const theta = lon1 - lon2;
  const radtheta = Math.PI * theta / 180;
  // eslint-disable-next-line max-len
  let dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
  if (dist > 1) {
    dist = 1;
  }
  dist = Math.acos(dist);
  dist = dist * 180 / Math.PI;
  dist = dist * 60 * 1.1515;
  return dist;
}

/* eslint-disable prettier/prettier */
export function decimalAdjust(type, value, exp) {
  // If the exp is undefined or zero...
  if (typeof exp === 'undefined' || +exp === 0) {
    return Math[type](value);
  }
  value = +value;
  exp = +exp;
  // If the value is not a number or the exp is not an integer...
  if (isNaN(value) || !(typeof exp === 'number' && exp % 1 === 0)) {
    return NaN;
  }
  // Shift
  value = value.toString().split('e');
  value = Math[type](+(value[0] + 'e' + (value[1] ? (+value[1] - exp) : -exp)));
  // Shift back
  value = value.toString().split('e');
  return +(value[0] + 'e' + (value[1] ? (+value[1] + exp) : exp));
}

export const getAddressFormats = (addressObj) => {
  let street = '';
  let state = '';
  let zip = '';
  let city = '';
  addressObj.forEach((item) => {
    if (item.types && item.types.includes('postal_code')) {
      zip = item.long_name
    }
    if (item.types && item.types.includes('administrative_area_level_1')) {
      state = item.long_name
    }
    if (item.types && (item.types.includes('locality') || item.types.includes('neighborhood'))) {
      city = item.long_name
    }
    if (item.types && item.types.includes('street_number')) {
      street = item.long_name
    }
    if (item.types && item.types.includes('route')) {
      street = `${street} ${item.long_name}`
    }
  })
  return {
    street, state, zip, city,
  }
}

const toastConfig = {
  hideProgressBar: true,
  position: 'bottom-right',
  closeButton: false,
  autoClose: 3000,
}

export const toast = {
  success: (text) => reactToast.success(<GNToast success text={text} />, toastConfig),
  error: (text) => reactToast.error(<GNToast text={text} />, toastConfig),
  info: (text) => reactToast.error(<GNToast text={text} />, toastConfig),
}


export const getRoutingColor = (dateStr) => {
  const dateNow = moment();
  const diff = dateNow.diff(moment(dateStr), 'months', true);
  if (diff < 6) {
    return 'green';
  }
  if (diff < 12) {
    return 'yellow';
  }
  return 'red';
};
