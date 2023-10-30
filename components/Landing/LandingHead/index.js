import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { ApolloClient, InMemoryCache } from '@apollo/client'
import cn from 'classnames'

import { usePropsHelper } from '@/myhooks/props-helper'

import $app from '@/store/app'

import App from '@/components/App'
import Landing from '@/components/Landing'

import styles from './styles.module.scss'

const getApolloClient = (uri) => {
  const client = new ApolloClient({
    uri,
    cache: new InMemoryCache(),
    connectToDevTools: true,
  })

  return client
}

const LandingHead = () => {
  const { isMobile } = usePropsHelper()

  const [volume, setVolume] = useState(0)

  const apolloEthereum = useRef(getApolloClient('https://api.thegraph.com/subgraphs/name/ashtegro/tegro'))
  const apolloPolygon = useRef(getApolloClient('https://api.thegraph.com/subgraphs/name/ashtegro/tegro-polygon'))

  useEffect(() => {
    getLifetimeVolume()
  }, [])

  const getLifetimeVolume = async () => {
    const requests = []
    let totalVolume = 0

    requests.push(apolloEthereum.current.query({
      query: $app.query.totalVolume,
    }))

    requests.push(apolloPolygon.current.query({
      query: $app.query.totalVolume,
    }))

    const responses = await Promise.all(requests)
    for (const response of responses) {
      if (response && response.hasOwnProperty('data') && response.data.hasOwnProperty('totalVolume')) {
        totalVolume += (response.data.totalVolume.volume * 1)
      }
    }
    
    setVolume(totalVolume.toFixed(2))
  }

  const handleXClick = () => {
    window.open('https://x.tegro.com', '_blank')
  }

  const handleDuneClick = () => {
    window.open('https://dune.com/ashtegro/tegro', '_blank')
  }

  return (
    <App.Container className={styles.container}>
      <App.Flex column align="center" gap={24} fullWidth>
        <Landing.Slides />
        {/* {isMobile ? (
          <img src="/images/landing/header.png" alt="" className={styles.image} />
        ) : (
          <video autoPlay loop muted className={styles.video}>
            <source src={'/images/landing/header.webm'} type="video/webm" />
          </video>
        )}
        

        <App.Flex column gap={6}>
          <App.Text center size={[48, 24]} weight={800} height={1}>One Protocol to Rule Them All</App.Text>
          <App.Text center size={[16, 10]} height={1.2} color="#B9B8C5">Market & Limit Orders | Orderbooks | Aggregated Liquidity | Real-time Token & NFT Price Charts</App.Text>
        </App.Flex>

        <App.Flex direction={['row', 'column']} center gap={[40, 24]}>
          <App.Flex className={cn(styles.banner, styles.long)} onClick={handleXClick}>
            <App.Flex className={styles.bannerInner} />

            <App.Flex align="center" justify="space-between" gap={16} className={styles.bannerContent} sx={{ paddingLeft: 0 }}>
              <App.Flex align="center">
                <Image src="/images/landing/logo-x1.png" width={isMobile ? 73 : 108} height={isMobile ? 75 : 110} alt="" />

                <App.Flex column gap={8}>
                  <App.Text size={[14, 12]} weight={600} color="#B9B8C5" height={1}>FOR ALL TRADERS</App.Text>
                  <App.Text size={[18, 12]} height={1.2}>Use Tegro: The CEX-DEX to trade Tokens and NFTs efficiently across chains.</App.Text>
                </App.Flex>
              </App.Flex>

              <Image src="/images/landing/button-with-arrow.png" width={isMobile ? 30 : 58} height={isMobile ? 30 : 58} alt="" />
            </App.Flex>
          </App.Flex>

          <App.Flex className={cn(styles.banner, styles.short)} onClick={handleDuneClick}>
            <App.Flex className={styles.bannerInner} />

            <App.Flex column center gap={8} className={styles.bannerContent}>
              <App.Text center size={[14, 12]} weight={600} color="#B9B8C5" height={1}>ALL TIME TRADING VOLUME</App.Text>
              {volume == 0 ? (
                <App.Loader size={[40, 24]} />
              ) : (
                <App.Text center size={[40, 24]} weight={600} height={1}>${volume}</App.Text>
              )}
            </App.Flex>
          </App.Flex>
        </App.Flex> */}
      </App.Flex>
    </App.Container>
  )
}

export default LandingHead