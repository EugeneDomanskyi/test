import { useState } from 'react'
import { ClickAwayListener, Tooltip } from '@mui/material'

const AppTooltip = ({ children, text, hover = true, focus, click, placement = 'right-start' }) => {
  const [open, setOpen] = useState(false)

  const triggers = () => {
    if (click) {
      return {
        disableFocusListener: true,
        disableHoverListener: true,
        disableTouchListener: true,
        open,
        onClose: handleTooltipClose,
        PopperProps: { disablePortal: true, },
      }
    }

    if (focus) {
      return {
        disableHoverListener: true,
      }
    }

    if (hover) {
      return {
        disableFocusListener: true,
      }
    }
  }

  const handleTooltipClose = () => {
    setOpen(false)
  }

  const handleTooltipOpen = (event) => {
    event.stopPropagation()
    
    if (click) {
      setOpen( ! open)
    }
  }

  const container = (content) => {
    if (click) {
      return (
        <ClickAwayListener onClickAway={handleTooltipClose}>
          <div>
            {content}
          </div>
        </ClickAwayListener>
      )
    } else {
      return content
    }
  }

  return container(
    <Tooltip title={text} arrow placement={placement} {...triggers()}>
      <div onClick={handleTooltipOpen}>
        { children }
      </div>
    </Tooltip>
  )
}

export default AppTooltip