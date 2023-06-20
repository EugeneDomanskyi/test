import CircularProgress from '@mui/material/CircularProgress'

const AppLoader = ({ size = 20, color = '#fff' }) => {
  return (
    <CircularProgress size={size} sx={{ color: color }} />
  )
}

export default AppLoader