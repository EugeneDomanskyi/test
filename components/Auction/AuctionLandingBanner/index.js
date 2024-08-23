import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useRouter } from 'next/navigation'
import cn from 'classnames'

import useWagmiHelper from '@/myhooks/useWagmiHelper'

import $gem from '@/store/gem'

import App from '@/components/App'

import styles from './styles.module.scss'

const AuctionLandingBanner = () => {
  const router = useRouter()
  const { wallet } = useWagmiHelper()

  const dispatch = useDispatch()
  const current = useSelector(({ $gem }) => $gem.current)
  const auctionBannerVisible = useSelector(({ $gem }) => $gem.auctionBannerVisible)

  useEffect(() => {
    fetchAuctions()
  }, [])

  useEffect(() => {
    if (current?.id) {
      dispatch($gem.set.auctionBannerVisible(true))
    }
  }, [current?.id])

  const fetchAuctions = async () => {
    const result = await $gem.api.auctions()
    if (result) {
      dispatch($gem.set.auctions({data: result, wallet}))

      if (result.length) {
        const current = result.find(item => item.auction.status == 2)
        if (current) {
          dispatch($gem.set.current({data: current, wallet}))
        }
      }
    }
  }

  const handleAuctions = () => {
    router.push('/auctions')
  }

  return (
    <App.Container maxWidth={1230} className={cn(styles.banner, {[styles.open]: auctionBannerVisible})}>
      <App.Flex className={styles.container}>
        {current ? (
          <App.Flex column gap={8} align="flex-start" fullWidth className={styles.content}>
            <App.Flex row align="center" gap={16}>
              <App.Text size={[24, 20]} weight={800} height={1} color="#FFBB01">Buy {current.name} at ${current.startPrice}*</App.Text>
              <App.Flex row center gap={4} className={styles.live}>
                <App.Flex className={styles.circle}></App.Flex>
                <App.Text size={14} weight={700} color="#4ADE80">Live</App.Text>
              </App.Flex>
            </App.Flex>

            <App.Text size={[20, 16]} weight={500} height={1.2}>Trade on Tegro to Earn gems, Use gems to Bid on auctions, and get your favorite cryptos at a steal.</App.Text>

            <App.Button small rounded onClick={handleAuctions}>Bid Now <App.Icon icon="arrow-right" /></App.Button>
          </App.Flex>
        ) : null}
      </App.Flex>
    </App.Container>
  )
}

export default AuctionLandingBanner