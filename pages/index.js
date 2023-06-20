import { Stack } from '@mui/material'

import HomeTop from '@/components/HomeTop'
import HomeTable from '@/components/HomeTable'

export default function Home() {
  return (
    <Stack sx={{ width: '100%', pb: 2 }}>
      <HomeTop />
      <HomeTable />
    </Stack>
  )
}
