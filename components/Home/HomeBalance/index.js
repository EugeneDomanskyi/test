import { useEffect, useState } from 'react'
import Image from 'next/image'

import useWalletConnect from '@/myhooks/wallet-connect'
import Contracts from '@/libs/contracts.lib'

import App from '@/components/App'

import styles from './styles.module.scss'

const HomeBalance = ({ justify = 'center' }) => {
  const { wallet, blockchain, network, usdt } = useWalletConnect()

  const [loading, setLoading] = useState(true)
  const [balance, setBalance] = useState(0)

  const contracts = new Contracts()

  useEffect(() => {
    if (wallet) {
      fetchBalance()
    }
  }, [wallet])

  const fetchBalance = async () => {
    setLoading(true)
    const result = await contracts.balanceOf(wallet, usdt[blockchain.toLowerCase()])
    if (result) {
      setBalance(result)
    }
    setLoading(false)
  }

  return wallet ? (
    <App.Flex row align="center" justify={justify} gap={8}>
      <App.Flex row center gap={12} className={styles.badge} sx={{ cursor: 'pointer' }}>
        <Image src={`/images/icon-${blockchain.toLowerCase()}.png`} width={24} height={24} alt="" />
        {/* <App.Icon icon="caret-down" /> */}
      </App.Flex>

      <App.Flex row center gap={6} className={styles.badge} sx={{ padding: '8px 16px' }}>
        <App.Text size={16} height={1} color="#B9B8C5">Balance</App.Text>
        {loading ? (
          <App.Loader size={20} />
        ) : (
          <App.Text size={20} weight={700} height={1}>{balance} USDT</App.Text>
        )}
      </App.Flex>
    </App.Flex>
  ) : null
}

export default HomeBalance