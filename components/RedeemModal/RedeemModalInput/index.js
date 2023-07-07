import { useEffect, useState } from 'react'
import Image from 'next/image'
import cn from 'classnames'

import AlchemyLibrary from '@/libs/alchemy.lib'
import Contracts from '@/libs/contracts.lib'
import useWalletConnect from '@/myhooks/wallet-connect'
import { usePropsHelper } from '@/myhooks/props-helper'

import App from '@/components/App'

import styles from './styles.module.scss'

const RedeemModalInput = ({ token, amount, onAmountChange, onRedeem }) => {
  const { isMobile } = usePropsHelper()
  const { wallet, network } = useWalletConnect()

  const [balance, setBalance] = useState(0)
  const [count, setCount] = useState(0)
  const [balanceLoading, setBalanceLoading] = useState(true)
  const [error, setError] = useState(false)

  const alchemy = new AlchemyLibrary(network(token?.chain)?.alchemy)
  const contracts = new Contracts(network(token?.chain)?.gasLimit)

  useEffect(() => {
    if (wallet && token && token?.nft20) {
      (async () => {
        const result = await contracts.balanceOf(wallet, token.nft20)
        if (result && typeof result === 'number' && !isNaN(result)) {
          setBalance(Math.floor(result))
        } else {
          setBalance(0)
        }

        const resultNFT = await getNftsCount()
        if (resultNFT && typeof resultNFT === 'number' && !isNaN(resultNFT)) {
          setCount(resultNFT)
        } else {
          setCount(0)
        }
        setBalanceLoading(false)
      })()
    }
  }, [wallet, token])

  useEffect(() => {
    if (amount * 1 > balance * 1) {
      setError(true)
    } else {
      setError(false)
    }
  }, [balance, amount])

  const getNftsCount = async () => {
    const nfts = await alchemy.getNftsForOwner(wallet, token.type)
    const result = nfts.filter((item) => item.collectionAddress == token.ognft).length
    return result
  }

  const handleChange = (event) => {
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

    if (event.key == 'Enter' && onRedeem) {
      onRedeem()
    }
  }

  const handleRedeem = () => {
    if (amount * 1 > balance * 1) {
      setError(true)
      return
    } else {
      setError(false)
    }

    if (onRedeem) {
      onRedeem()
    }
  }

  return (
    <App.Flex column>
      <div className={styles.box}>
        <App.Text size={[20, 16]} weight={[600, 700]}>Enter the amount you would like to redeem</App.Text>
      </div>

      <App.Flex column gap={6} className={styles.content}>
        <App.Flex row gap={8} className={styles.item}>
          <input type="number" placeholder="0" value={amount} onChange={handleChange} onKeyDown={handleKeyPress} className={cn(styles.input, {[styles.error]: error})} />

          <App.Flex column gap={10}>
            <App.Flex row gap={8} align="center" className={styles.chip}>
              <div className={styles.imgRound}>
                <Image src={token.image} width={25} height={25} alt="" />
              </div>
              <App.Text size={16}>{token.code}</App.Text>
            </App.Flex>

            <App.Text size={12} weight={400} color={error ? '#DE5C64' : '#B9B8C5'}>
              <App.Flex row align="center" justify="flex-end" gap={4}>
                <span>Balance:</span>
                {balanceLoading ? <App.Loader size={12} /> : balance}
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
          <input type="number" placeholder="0" value={amount} onChange={handleChange} onKeyDown={handleKeyPress} className={styles.input} />

          <App.Flex column gap={10}>
            <App.Flex row gap={8} align="center" className={cn(styles.chip, styles.collection)}>
              <div className={styles.imgSquare}>
                <Image src={token.image} width={25} height={25} alt="" />
              </div>
              <App.Text size={16}>{token.collection}</App.Text>
            </App.Flex>

            <App.Text right size={12} weight={400} color="#B9B8C5">
              <App.Flex row align="center" justify="flex-end" gap={4}>
                <span>Balance:</span>
                {balanceLoading ? <App.Loader size={12} /> : count}
              </App.Flex>
            </App.Text>
          </App.Flex>
        </App.Flex>

        <App.Flex row center gap={8} className={styles.bottom}>
          <div className={styles.imgRound}>
            <Image src={token.image} width={25} height={25} alt="" />
          </div>

          <App.Text right size={[16, 14]} color="#B9B8C5">1 {token.code} NFT20</App.Text>

          <App.Text right size={[16, 14]} color="#B9B8C5">=</App.Text>

          <div className={styles.imgSquare}>
            <Image src={token.image} width={25} height={25} alt="" />
          </div>

          <App.Text right size={[16, 14]} color="#B9B8C5">1 {token.collection} NFT</App.Text>
        </App.Flex>
      </App.Flex>

      <App.Flex center className={cn(styles.box, styles.borderTop)}>
        <App.Button primary large disabled={error || amount * 1 <= 0} onClick={handleRedeem} sx={{ width: isMobile ? '100%' : 200 }}>Redeem</App.Button>
      </App.Flex>
    </App.Flex>
  )
}

export default RedeemModalInput