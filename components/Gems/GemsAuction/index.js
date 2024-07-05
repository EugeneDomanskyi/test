import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useRouter } from 'next/router'
import { useTranslation } from 'react-i18next'

import useWagmiHelper from '@/myhooks/useWagmiHelper'
import Socket from '@/libs/ws.lib'

import $gem from '@/store/gem'

import App from '@/components/App'
import AuctionItem from '@/components/Auction/AuctionItem'
import WagmiHelper from '@/libs/WagmiHelper'

const GemsAuction = () => {
  const router = useRouter()
  const { t } = useTranslation()
  const { wallet } = useWagmiHelper()

  const dispatch = useDispatch()
  const auctions = useSelector(({ $gem }) => $gem.auctions)
  const stats = useSelector(({ $gem }) => $gem.stats)
  const socketConnected = useSelector(({ $app }) => $app.socketConnected)

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (socketConnected) {
      Socket.subscribe('auctions')
      return () => {
        Socket.unsubscribe('auctions')
      }
    }
  }, [socketConnected])

  useEffect(() => {
    if (wallet) {
      setTimeout(fetchJWT, 500)
      fetchAuctions()
      fetchStats()
    }
  }, [wallet])

  const fetchJWT = async () => {
    let jwt = getJWT()
    if (!jwt) {
      const signature = await WagmiHelper.signMessage(wallet)
      if (signature) {
        jwt = await $gem.api.login({ wallet_address: wallet, signature })
        if (jwt && !jwt?.error) {
          localStorage.setItem('bidding-token', JSON.stringify({ jwtToken: jwt, jwtWallet: wallet }))
        }
      }
    }

    dispatch($gem.set.jwt(jwt))
  }

  const getJWT = () => {
    const data = localStorage.getItem('bidding-token')
    if (data) {
      const { jwtToken, jwtWallet } = JSON.parse(data)
      if (wallet == jwtWallet) {
        return jwtToken
      }
    }
    return false
  }

  const fetchStats = async () => {
    const result = await $gem.api.stats(wallet, {})
    if (result) {
      dispatch($gem.set.stats(result))
    }
  }

  const fetchAuctions = async () => {
    const result = await $gem.api.auctions()
    if (result) {
      dispatch($gem.set.auctions({data: result, wallet}))
    }

    setLoading(false)
  }

  const handleHistory = () => {
    router.push('/transaction-history')
  }

  return (
    <App.Container maxWidth={1230} sx={{ paddingBottom: 32 }}>
      <App.Flex column fullWidth flex={1} gap={32}>
        <App.Flex direction={['row', 'column']} align={['center', 'stretch']} justify="space-between" gap={[0, 16]}>
          <App.Flex direction={['row', 'column']} align="center" order={[0, 1]}>
            <App.Flex row center width={[280, 'auto']} height={[56, 'auto']} gap={16}>
              <App.Text size={16} weight={600}>{t('Gems Balance')}</App.Text>
              <App.Text size={28} weight={600}>{stats.total_points}</App.Text>
            </App.Flex>

            <App.Flex row center width={[280, 'auto']} height={[56, 'auto']} gap={16}>
              <App.Text size={24} weight={600}>{t('1 Gem = 1 Bid')}</App.Text>
            </App.Flex>
          </App.Flex>

          <App.Button primary2 outlined order={[1, 0]} onClick={handleHistory}>{t('Transaction History')}</App.Button>
        </App.Flex>

        <App.Flex row wrap gap={24}>
          {auctions.length ? (
            auctions.map(item => <AuctionItem key={item.id} item={item} />)
          ) : null}
        </App.Flex>
      </App.Flex>
    </App.Container>
  )
}

export default GemsAuction