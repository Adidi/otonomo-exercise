import React from 'react'
import './LevelBar.scss'

export default function LevelBar({ width, fraction }) {
  return (
    <div className="level-bar" style={{ maxWidth: width }}>
      <div
        className="level-bar__progress"
        style={{ width: `${fraction * 100}%` }}
      />
    </div>
  )
}
