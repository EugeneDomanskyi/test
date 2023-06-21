import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Bar } from 'recharts'

import { getPoolDayData } from '@/libs/query.lib'

const PoolPage = () => {
  const router = useRouter()
  const { poolId } = router.query

  const [poolData, setPoolData] = useState([])

  useEffect(() => {
    if (poolId) {
      getPoolDayData(poolId).then(res => {
        setPoolData(res.data.poolDayDatas)
      })
    }
  }, [poolId])
  
  return (
    <div>
      <BarChart width={730} height={250} data={poolData}>
        <Bar dataKey="volumeUSD" fill="#8884d8" />
      </BarChart>
    </div>
  )
}

export default PoolPage
