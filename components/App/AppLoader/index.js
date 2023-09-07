import CircularProgress from '@mui/material/CircularProgress'

const AppLoader = ({ size = 20, color = '#fff', sx }) => {
  return (
    <CircularProgress size={size} sx={{ color: color, ...sx }} />
  )
}

export default AppLoader