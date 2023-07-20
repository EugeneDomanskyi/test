import { Tooltip } from '@mui/material'

const AppTooltip = ({ children, text, hover = true, click }) => {
  const triggers = () => {
    if (click) {
      
    }
  }

  return (
    <Tooltip title={text} arrow>
      <div>
        { children }
      </div>
    </Tooltip>
  )
}

export default AppTooltip