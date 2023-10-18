import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useRouter } from 'next/router'
import Image from 'next/image'
import { getAccount } from '@wagmi/core'

import useWalletConnect from '@/myhooks/wallet-connect'

import App from '@/components/App'

import styles from './styles.module.scss'

const Mobile = ({ item }) => {
  const router = useRouter()
  const queryBlockchainCode = router.query.blockchain

  const { wallet, getBalance, getPrice, connectorId } = useWalletConnect()

  const assets = useSelector(({ $token }) => $token.assets)

  const [tab, setTab] = useState('charts')
  const [tabs, setTabs] = useState([])
  const [balance, setBalance] = useState({ currency: 0, usd: 0, usdt: 0, loading: true })

  useEffect(() => {
    setTabs([
      { key: 'charts', title: 'Charts' },
      { key: 'orderbook', title: 'Orderbook' },
      { key: 'trades', title: 'Trades' },
      { key: 'orders', title: 'My Orders', disabled: !wallet },
    ])

    if ( ! wallet && tab == 'orders') {
      setTab('charts')
    }

    if (wallet) {
      fetchBalance()
    }
  }, [wallet])

  const fetchBalance = async () => {
    const tempBalance = {}
 
    //tempBalance.currency = await getBalance(item.id)
    //tempBalance.currency = await getBalance(item.id)
  }

  const handleBack = () => {
    const page = router.pathname.split('/').filter(item => item != '')[0]
    router.push(`/${page}/${queryBlockchainCode}/`)
  }

  const handleTabChange = (value) => {
    setTab(value)
  }

  return (
    <App.Flex column fullWidth gap={16}>
      <App.Flex column fullWidth>
        <App.Flex row align="center" className={styles.back} onClick={handleBack} fullWidth>
          <App.Icon icon="chevron-left" width={24} height={24} color="#fff" />
          <App.Text size={16}>Back</App.Text>
        </App.Flex>

        <App.Flex row align="center" justify="space-between" sx={{ padding: '0 8px' }}>
          <App.Flex row align="center" gap={8}>
            {item.image ? (
              <Image src={item.image} priority width={50} height={50} className={styles.image} alt="" />
            ) : (
              <div className={styles.emptyImage} />
            )}

            <App.Flex column>
              <App.Text nowrap uppercase size={16} weight={600}>{item.symbol}</App.Text>
              <App.Text nowrap size={12} color="#5E5C6B">{item.name}</App.Text>
            </App.Flex>
          </App.Flex>

          <App.Flex column>
            <App.Text right size={16} weight={600}>${ item.price }</App.Text>
            <App.Flex row align="center" justify="flex-end" gap={2}>
              <App.Icon icon="caret-down" width={10} height={10} color={item.ticker?.type == 'minus' ? '#FF1D61' : '#53F19C'} style={{transform: `rotate(${item.ticker?.type == 'plus' ? '180deg' : '0deg'})`}} />
              <App.Text size={12} color={item.ticker?.type == 'minus' ? '#FF1D61' : '#53F19C'}>{ item.ticker?.value }%</App.Text>
            </App.Flex>
          </App.Flex>
        </App.Flex>
      </App.Flex>

      <App.Flex column gap={16} sx={{ padding: '0 8px' }} flex={1}>
        <App.Tabs options={tabs} active={tab} onChange={handleTabChange} height="auto" variant="mobile" />

        <App.Flex flex={1}>
          <App.Text>{connectorId}</App.Text>
        </App.Flex>
      </App.Flex>

      <App.Flex column>
        {wallet ? (
          <App.Flex column gap={8} sx={{ padding: '0 8px' }}>
            <App.Text szie={16} color="#878598" height={1}>My Balance</App.Text>

            <App.Flex column gap={8} className={styles.balanceBox}>
              <App.Flex row align="center" justify="space-between">
                <App.Flex column>
                  <App.Text size={16} weight={700}>{item.symbol}</App.Text>
                  <App.Text size={14} color="#5E5C6B">{item.name}</App.Text>
                </App.Flex>

                <App.Flex column>
                  <App.Text right size={16} weight={700}>465</App.Text>
                  <App.Text right size={14} color="#5E5C6B">$658</App.Text>
                </App.Flex>
              </App.Flex>

              <App.Hr color="#1D1937" />

              <App.Flex row align="center" justify="space-between">
                <App.Flex column>
                  <App.Text size={16} weight={700}>USDT</App.Text>
                </App.Flex>

                <App.Flex column>
                  <App.Text right size={16} weight={700}>$465</App.Text>
                </App.Flex>
              </App.Flex>
            </App.Flex>
          </App.Flex>
        ) : null}

        <App.Hr color="#1F1C30" />

        <App.Flex row gap={16} sx={{ padding: '16px' }}>
          <App.Flex flex={1}>
            <App.Button xl fullWidth variant="success"><App.Text inline uppercase size={16} weight={700} color="#08051C">Buy</App.Text></App.Button>
          </App.Flex>

          <App.Flex flex={1}>
            <App.Button xl fullWidth variant="danger"><App.Text inline uppercase size={16} weight={700}>Sell</App.Text></App.Button>
          </App.Flex>
        </App.Flex>
      </App.Flex>
    </App.Flex>
  )
}

export default Mobile