import React from 'react'
import './Checkbox.scss'

function Checkbox({ type, children, ...props }) {
  return (
    <label className="checkbox-label">
      <input type="checkbox" {...props} />
      <span className="label">{children}</span>
    </label>
  )
}

export default Checkbox
