import { useState, useEffect } from 'react'

import $token from '@/store/token'

import App from '@/components/App'
import SectionTitle from '@/components/Market/SectionTitle'

import styles from './styles.module.scss'

export default function Trending() {
  const [trending, setTrending] = useState([])
  
  useEffect(() => {
    handleFetchTrending()
  }, [])

  const handleFetchTrending = async () => {
    let topResults = []
    
    const result = await $token.api.coingecko.top()
    const rate = 0

    if (result) {
      topResults = result.coins.map(item => {
        item = item.item        
        return {
          name: item.name,
          price: (rate * item.price_btc).toFixed(4),
          symbol: item.symbol,
          image: item.small,
          coin_id: item.coin_id,
        }
      })
    }
    setTrending(topResults)
  }

  return (
    <App.Flex column gap={16}>
      <SectionTitle>Trending Tokens</SectionTitle>

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
