import CircularProgress from '@mui/material/CircularProgress'

import { usePropsHelper } from '@/myhooks/props-helper'

const AppLoader = ({ size = 20, color = '#fff', sx }) => {
  const { propValue } = usePropsHelper()

  return (
    <CircularProgress size={propValue(size)} sx={{ color: propValue(color), ...sx }} />
  )
}

export default AppLoader