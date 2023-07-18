import React from 'react'
import Affiliates from '~views/Affiliates'
import KPIS from '~views/KPIS'

export default ({ pathname }) => {
  if (pathname === '/dashboard/affiliates') {
    return <Affiliates />
  }
  if (pathname === '/dashboard/kpis') {
    return <KPIS />
  }

  return null
}
