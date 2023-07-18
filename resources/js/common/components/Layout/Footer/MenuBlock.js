import React from 'react'
import { Link } from 'react-router-dom'

export default ({ items }) => (
  <div className="menu-block">
    {items.map((item) => (
      <Link to={item.link} key={item.id}>{item.label}</Link>
    ))}
  </div>
);
