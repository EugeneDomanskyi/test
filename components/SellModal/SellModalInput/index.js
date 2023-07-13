import { useEffect, useState } from 'react'
import Image from 'next/image'
import cn from 'classnames'

import AlchemyLibrary from '@/libs/alchemy.lib'
import useWalletConnect from '@/myhooks/wallet-connect'
import { usePropsHelper } from '@/myhooks/props-helper'

import $exchange from '@/store/exchange'

import App from '@/components/App'

import styles from './styles.module.scss'

const SellModalInput = ({ token, amount, onAmountChange, onSell }) => {
  const { isMobile } = usePropsHelper()
  const { wallet, network } = useWalletConnect()

  const [nfts, setNfts] = useState([])
  const [bids, setBids] = useState([])
  const [averagePrice, setAveragePrice] = useState(0)
  const [balanceLoading, setBalanceLoading] = useState(true)
  const [error, setError] = useState(false)

  const alchemy = new AlchemyLibrary(network(token?.chain)?.alchemy)

  useEffect(() => {
    if (wallet && token && token?.ognft) {
      (async () => {
        const result = await getNfts(token.ognft)
        if (result) {
          setNfts(result)
        }

        const resultBids = await $exchange.api.bids({ collection: token.ognft })
        if (resultBids && resultBids.hasOwnProperty('orders')) {
          setBids(resultBids.orders)
          
          if (resultBids.orders.length) {
            let total = 0
            for (const bid of resultBids.orders) {
              if (bid.price?.amount && bid.price?.amount?.native) {
                total += bid.price?.amount?.native
              }
            }

            setAveragePrice(total / resultBids.orders.length)
          }
        }
        setBalanceLoading(false)
      })()
    }
  }, [wallet, token])

  const getNfts = async (collection) => {
    const nfts = await alchemy.getNftsForOwner(wallet, token.type)
    const result = nfts.filter((item) => item.collectionAddress == collection)
    return result
  }

  useEffect(() => {
    if (amount * 1 > nfts.length) {
      setError(true)
    } else {
      setError(false)
    }
  }, [amount])

  const handleAmountChange = (event) => {
    if (onAmountChange) {
      onAmountChange(event.target.value)
    }
  }

  const handleKeyPress = (event) => {
    if ((event.key === '0' && event.target.value.length == 0) || event.key === '-' || event.key === '+' || event.key === 'e' || event.key === '.' || event.key === ',') {
      event.preventDefault()
    }

    if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
      event.preventDefault()
    }

    if (event.key == 'Enter' && onBuy) {
      onBuy()
    }
  }

  const handleSell = () => {
    if (amount * 1 > nfts.length || amount * 1 > bids.length) {
      setError(true)
      return
    } else {
      setError(false)
    }

    if (onSell) {
      onSell(nfts.slice(0, amount))
    }
  }

  return (
    <App.Flex column>
      <div className={styles.box}>
        <App.Text size={[20, 16]} weight={[600, 700]}>Enter the amount you would like to sell</App.Text>
      </div>

      <App.Flex column gap={16} className={styles.content}>
        <App.Flex row gap={8} className={styles.item}>
          <input type="number" placeholder="0" value={amount} onChange={handleAmountChange} onKeyDown={handleKeyPress} className={cn(styles.input, {[styles.error]: error})} />

          <App.Flex column align="flex-end" gap={10}>
            <App.Flex row gap={8} align="center" className={styles.chip}>
              <div className={styles.imgRound}>
                <Image src={token.image} width={25} height={25} alt="" />
              </div>
              <App.Text size={16}>{token.code}</App.Text>
            </App.Flex>

            <App.Text size={12} weight={400} color={error ? '#DE5C64' : '#B9B8C5'}>
              <App.Flex row align="center" justify="flex-end" gap={4}>
                <span>Balance:</span>
                {balanceLoading ? <App.Loader size={12} /> : nfts.length}
              </App.Flex>
            </App.Text>
          </App.Flex>
        </App.Flex>

        <App.Flex row justify="flex-end" sx={{ padding: '0 17px' }}>
          <App.Flex column gap={8}>
            <App.Text size={12} weight={400} color={error ? '#DE5C64' : '#B9B8C5'}>
              <App.Flex row align="center" justify="flex-end" gap={4}>
                <span>Total Offers:</span>
                {balanceLoading ? <App.Loader size={12} /> : bids.length}
              </App.Flex>
            </App.Text>

            <App.Text size={12} weight={400} color={error ? '#DE5C64' : '#B9B8C5'}>
              <App.Flex row align="center" justify="flex-end" gap={4}>
                <span>Average Price:</span>
                {balanceLoading ? <App.Loader size={12} /> : `${averagePrice.toFixed(4)} ${network(token.chain.toLowerCase()).currency}`}
              </App.Flex>
            </App.Text>
          </App.Flex>
        </App.Flex>
      </App.Flex>

      <App.Flex center className={cn(styles.box, styles.borderTop)}>
        <App.Button primary large disabled={error || amount * 1 <= 0 || amount * 1 > bids.length} onClick={handleSell} sx={{ width: isMobile ? '100%' : 200 }}>Sell</App.Button>
      </App.Flex>
    </App.Flex>
  )
}

export default SellModalInput