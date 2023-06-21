import { useEffect, useState } from 'react'
import { Stack } from '@mui/material'
import { useSelector } from 'react-redux'

import HomeTop from '@/components/HomeTop'
import HomeTable from '@/components/HomeTable'
import AppBlockLoader from '@/components/AppBlockLoader'

export default function Home() {
  const { tokens, loadingTokens: loading } = useSelector(({$app}) => $app)

  return (
    <Stack sx={{ width: '100%', pb: 2 }}>
      {loading ? (
        <AppBlockLoader height={600} />
      ) : (
        <>
          <HomeTop tokens={tokens} />
          <HomeTable tokens={tokens} />
        </>
      )}
    </Stack>
  )
}
