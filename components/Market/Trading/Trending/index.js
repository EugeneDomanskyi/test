import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import styles from './styles.module.scss'

import App from '@/components/App'
import SectionTitle from '@/components/Market/SectionTitle'

import useWalletConnect from '@/myhooks/wallet-connect'

import $collection from '@/store/collection'
import $token from '@/store/token'

export default function Trending() {
  const router = useRouter()
  const { getPrice, network } = useWalletConnect()
  
  const isNfts = router.asPath?.includes('nfts')
  const queryMarketType = isNfts ? 'nfts' : 'tokens'
  const queryBlockchainCode = router.query.blockchain

  const [trending, setTrending] = useState([])
  
  useEffect(() => {
    handleFetchTrending()
  }, [])

  const handleFetchTrending = async () => {
    let topResults = []
    if (queryMarketType === 'nfts') {
      const result = await $collection.api.top({
        blockchain: queryBlockchainCode,
        limit: 10,
        useNonFlaggedFloorAsk: true,
      })

      topResults = result.collections.map(item => {
        return {
          name: item.name,
          price: item.floorAsk?.price?.amount?.usd ?? 0,
          symbol: item.floorAsk?.price?.currency?.symbol,
          image: item.image,
        }
      })
    } else {
      const result = await $token.api.coingecko.top()
      const rate = await getPrice('bitcoin', 'usd')

      if (result) {
        topResults = result.coins.map(item => {
          item = item.item        
          return {
            name: item.name,
            price: (rate * item.price_btc).toFixed(4),
            symbol: item.symbol,
            image: item.small
          }
        })
      }
    }
    setTrending(topResults)
  }

  return (
    <App.Flex column gap={16}>
      <SectionTitle>Trending {queryMarketType === 'nfts' ? 'NFTs' : 'Tokens'}</SectionTitle>

      <App.Flex column gap={16}>
        {
          trending.map((item, index) => {
            return (
              <App.Flex key={index} justify="space-between" align="center" gap={16}>
                <App.Flex align="center" gap={16}>
                  <App.Flex className={styles.image}>
                    <img src={item.image} alt="" />
                  </App.Flex>

                  <App.Flex column>
                    <App.Text size={16} weight={500}>{item.name}</App.Text>
                    {/* <App.Text size={12} weight={400} color="#B9B8C5">League of Kingdom</App.Text> */}
                    <App.Text size={12} weight={400} color="#B9B8C5">{ item.symbol }</App.Text>
                  </App.Flex>
                </App.Flex>

                <App.Flex column justify="flex-end">
                  <App.Text size={16} weight={500}>${ item.price }</App.Text>
                  
                  {/* <App.Text size={12} weight={400} color="#53F19C" right>
                    <App.Icon icon="caret-up-fill" /> 3.4%
                  </App.Text> */}
                </App.Flex>
              </App.Flex>
            )
          })
        }
      </App.Flex>
    </App.Flex>
  )
}
