import Header from '@/components/Header'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'

import $app from '@/store/app'
import { getPoolsAll } from '@/libs/query.lib'

const tokensUrl = 'https://tegro-imagekit.s3.eu-central-1.amazonaws.com/nft20Tokens.json'

const AppLayout = ({ children }) => {
  const dispatch = useDispatch()
  
  useEffect(() => {
    (async () => {
      dispatch($app.set.appKey({key: 'loadingTokens', data: true}))
      const temp = []
      const result = await fetch(tokensUrl)
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
              image: `https://tegro-imagekit.s3.eu-central-1.amazonaws.com/NFT-20/${item['Code'].toUpperCase()}_256.png`,
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
      // setTokens(temp)
      // setLoading(false)
    })()
  }, [])

  return (
    <>
      <Header />
      {children}
    </>
  )
}

export default AppLayout