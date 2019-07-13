import React, { useState, cloneElement } from 'react'
import Popover from 'react-popover'
import Button from './Button'
import './PopoverConfirm.scss'

const PopoverConfirm = ({ children, title, handler }) => {
  const [open, setOpen] = useState(false)

  const child = cloneElement(children, {
    onClick: () => {
      setOpen(true)
    },
  })

  const popoverProps = {
    isOpen: open,
    onOuterAction: () => setOpen(false),
    body: (
      <div>
        <div className="t">{title}</div>
        <div className="b">
          <Button className="bc" onClick={() => setOpen(false)}>
            No
          </Button>
          <Button className="ba" onClick={handler}>
            Yes
          </Button>
        </div>
      </div>
    ),
  }

  return <Popover {...popoverProps}>{child}</Popover>
}

export default PopoverConfirm
