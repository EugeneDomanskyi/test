import { useEffect, useState } from 'react'
import { Stack } from '@mui/material'

import { getPools, getPoolsAll } from '@/libs/query.lib'

import HomeTop from '@/components/HomeTop'
import HomeTable from '@/components/HomeTable'
import AppBlockLoader from '@/components/AppBlockLoader'

export default function Home() {
  const [loading, setLoading] = useState(true)
  const [tokens, setTokens] = useState([])

  const tokensUrl = 'https://tegro-imagekit.s3.eu-central-1.amazonaws.com/nft20Tokens.json'

  useEffect(() => {
    (async () => {
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
            })
          }
        }
      }
      setTokens(temp)
      setLoading(false)
    })()
  }, [])

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
