import { useEffect, useState } from 'react'
import Image from 'next/image'
import cn from 'classnames'

import useWalletConnect from '@/myhooks/wallet-connect'
import { usePropsHelper } from '@/myhooks/props-helper'

import App from '@/components/App'

import styles from './styles.module.scss'

const BuyModalInput = ({ token, amount, price, onAmountChange, onPriceChange, onBuy }) => {
  const { isMobile } = usePropsHelper()
  const { wallet, network } = useWalletConnect()

  const [nfts, setNfts] = useState([])
  const [balanceLoading, setBalanceLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    if (wallet && token && token?.ognft) {
      (async () => {
        const response = await fetch(`https://api-polygon.reservoir.tools/tokens/floor/v1?collection=${token?.ognft}`)
        if (response && response.status == 200) {
          const result = await response.json()
          if (result && result?.tokens) {
            const temp = Object.entries(result.tokens).map(([id, price]) => ({ id, price }))
            temp.sort((a, b) => a.price - b.price)
            setNfts(temp)
          }
        }
        setBalanceLoading(false)
      })()
    }
  }, [wallet, token])

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

    if (onPriceChange) {
      onPriceChange(getPrice(event.target.value))
    }
  }

  const handlePriceChange = (event) => {
    if (onPriceChange) {
      onPriceChange(event.target.value)
    }

    if (onAmountChange) {
      let amount = 0
      let maxPrice = event.target.value
      while (maxPrice > 0) {
        if (nfts[amount].price <= maxPrice) {
          maxPrice -= nfts[amount].price
          amount++
        } else {
          maxPrice = 0
        }
      }
      onAmountChange(amount)
    }
  }

  const handleKeyPress = (event) => {
    if ((event.key === '0' && event.target.value.length == 0) || event.key === '-' || event.key === '+' || event.key === 'e') {
      event.preventDefault()
    }

    if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
      event.preventDefault()
    }

    if (event.key == 'Enter' && onBuy) {
      onBuy()
    }
  }

  const handleBuy = () => {
    if (amount * 1 > nfts.length) {
      setError(true)
      return
    } else {
      setError(false)
    }

    if (onBuy) {
      onBuy(nfts.slice(0, amount))
    }
  }

  const getPrice = (count = nfts.length) => {
    let result = 0
    count = count > nfts.length ? nfts.length : count
    for (let i = 0; i < count; i++) {
      result += (nfts[i].price * 1)
    }
    return result
  }

  return (
    <App.Flex column>
      <div className={styles.box}>
        <App.Text size={[20, 16]} weight={[600, 700]}>Enter the amount you would like to buy</App.Text>
      </div>

      <App.Flex column gap={6} className={styles.content}>
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
                <span>Total Amount:</span>
                {balanceLoading ? <App.Loader size={12} /> : nfts.length}
              </App.Flex>
            </App.Text>

            <App.Text size={12} weight={400} color={error ? '#DE5C64' : '#B9B8C5'}>
              <App.Flex row align="center" justify="flex-end" gap={4}>
                <span>Total Price:</span>
                {balanceLoading ? <App.Loader size={12} /> : `${getPrice().toFixed(4)} MATIC`}
              </App.Flex>
            </App.Text>
          </App.Flex>
        </App.Flex>

        <div className={styles.arrowBox}>
          <App.Flex center className={styles.arrow}>
            <App.Icon icon="arrow-down" />
          </App.Flex>
        </div>

        <App.Flex row gap={8} className={styles.item}>
          <input type="number" placeholder="0" value={price} onChange={handlePriceChange} onKeyDown={handleKeyPress} className={styles.input} />

          <App.Flex column gap={10}>
            <App.Flex row gap={8} align="center" className={cn(styles.chip, styles.collection)}>
              <div className={styles.imgSquare}>
              <Image src={`/images/icon-${token.chain.toLowerCase()}.png`} width={25} height={25} alt="" />
              </div>
              <App.Text size={16}>{network(token.chain.toLowerCase()).currency}</App.Text>
            </App.Flex>

            {/* <App.Text right size={12} weight={400} color="#B9B8C5">
              <App.Flex row align="center" justify="flex-end" gap={4}>
                <span>Balance:</span>
                {balanceLoading ? <App.Loader size={12} /> : count}
              </App.Flex>
            </App.Text> */}
          </App.Flex>
        </App.Flex>
      </App.Flex>

      <App.Flex center className={cn(styles.box, styles.borderTop)}>
        <App.Button primary large disabled={error || amount * 1 <= 0} onClick={handleBuy} sx={{ width: isMobile ? '100%' : 200 }}>Buy</App.Button>
      </App.Flex>
    </App.Flex>
  )
}

export default BuyModalInput