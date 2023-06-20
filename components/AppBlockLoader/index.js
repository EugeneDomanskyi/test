import { Stack } from '@mui/material'

import AppLoader from '@/components/AppLoader'

const AppBlockLoader = ({ height=300 }) => {
  return (
    <Stack sx={{ height: height, alignItems: 'center', justifyContent: 'center' }}>
      <AppLoader size={40} />
    </Stack>
  )
}

export default AppBlockLoader