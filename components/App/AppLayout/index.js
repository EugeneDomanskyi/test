import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { loadIntercom } from 'next-intercom'
import { v4 as uuid } from 'uuid'

import { getPoolsAll } from '@/libs/query.lib'
import { trackEvent } from '@/libs/analytics.lib'
import useUtils from '@/myhooks/utils'

import $app from '@/store/app'

import Header from '@/components/Header'
import Footer from '@/components/Footer'

const tokensUrl = `${process.env.NEXT_PUBLIC_S3_URL}/nft20Tokens.json`

const AppLayout = ({ children }) => {
  const dispatch = useDispatch()

  const { s3File } = useUtils()
  
  useEffect(() => {
    (async () => {
      const deviceId = localStorage.getItem('device_id')
      if (!deviceId) {
        localStorage.setItem('device_id', uuid())
      }

      loadIntercom({
        user_id: deviceId,
        appId: process.env.NEXT_PUBLIC_INTERCOM_APP_ID,
        ssr: false,
        initWindow: false,
        delay: 0,
      })

      trackEvent('Dex Page Visited')

      dispatch($app.set.appKey({key: 'loadingTokens', data: true}))
      const temp = []

      const result = await fetch(tokensUrl, { method: 'GET' })
      if (result && result.status == 200) {
        const json = await result.json()
        const pools = await getPoolsAll(json.map(el => el.PoolId.toLowerCase()))
        for (const item of json) {
          if (item['NFT20 Contract'] && item['OG NFT Contract'] && item['Code'] != 'UNIOC') {
            const pool = pools.hasOwnProperty(item['NFT20 Contract'].toLowerCase()) ? pools[item['NFT20 Contract'].toLowerCase()] : {}
            temp.push({
              code: item['Code'],
              collection: item['Collection Name'],
              game: item['Game Name'],
              chain: item['Chain'].toLowerCase(),
              type: ('erc' + item['1155/721']),
              nft20: item['NFT20 Contract'].toLowerCase(),
              ognft: item['OG NFT Contract'].toLowerCase(),
              tokenId: item['Token ID'],
              decimals: item['Decimals'],
              mintFee: item['Minting Fee'],
              redeemFee: item['Redemption Fee'],
              image: s3File(item['Code'].toUpperCase()),
              pool,
              price: (pool?.token1Price ?? 0) * 1,
              tvl: (pool?.totalValueLockedUSD ?? 0) * 1,
              volumeToken1: (pool?.volumeToken1 ?? 0) * 1,
              poolId: pool.id,
            })
          }
        }
      }
      dispatch($app.set.tokens(temp))
    })()
  })

  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  )
}

export default AppLayout