import { useEffect, useState } from 'react'
import Image from 'next/image'
import cn from 'classnames'

import AlchemyLibrary from '@/libs/alchemy.lib'
import Contracts from '@/libs/contracts.lib'
import useWalletConnect from '@/myhooks/wallet-connect'

import AppFlex from '@/components/AppFlex'
import AppText from '@/components/AppText'
import AppButton from '@/components/AppButton'
import AppIcon from '@/components/AppIcon'
import AppLoader from '@/components/AppLoader'

import styles from './styles.module.scss'

const RedeemModalInput = ({ token, amount, onAmountChange, onRedeem }) => {
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
        setBalance(Math.floor(result))

        const resultNFT = await getNftsCount()
        setCount(resultNFT)
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
    <AppFlex column>
      <div className={styles.box}>
        <AppText size={20} weight={600}>Enter the amount you would like to redeem</AppText>
      </div>

      <AppFlex column gap={6} className={styles.content}>
        <AppFlex row gap={8} className={styles.item}>
          <input type="number" placeholder="0" value={amount} onChange={handleChange} onKeyDown={handleKeyPress} className={cn(styles.input, {[styles.error]: error})} />

          <AppFlex column gap={10}>
            <AppFlex row gap={8} align="center" className={styles.chip}>
              <div className={styles.imgRound}>
                <Image src={token.image} width={25} height={25} alt="" />
              </div>
              <AppText size={16}>{token.code}</AppText>
            </AppFlex>

            <AppText size={12} weight={400} color={error ? '#DE5C64' : '#B9B8C5'}>
              <AppFlex row align="center" justify="flex-end" gap={4}>
                <span>Balance:</span>
                {balanceLoading ? <AppLoader size={12} /> : balance}
              </AppFlex>
            </AppText>
          </AppFlex>
        </AppFlex>

        <div className={styles.arrowBox}>
          <AppFlex center className={styles.arrow}>
            <AppIcon icon="arrow-down" />
          </AppFlex>
        </div>

        <AppFlex row gap={8} className={styles.item}>
          <input type="number" placeholder="0" value={amount} onChange={handleChange} onKeyDown={handleKeyPress} className={styles.input} />

          <AppFlex column gap={10}>
            <AppFlex row gap={8} align="center" className={cn(styles.chip, styles.collection)}>
              <div className={styles.imgSquare}>
                <Image src={token.image} width={25} height={25} alt="" />
              </div>
              <AppText size={16}>{token.collection}</AppText>
            </AppFlex>

            <AppText right size={12} weight={400} color="#B9B8C5">
              <AppFlex row align="center" justify="flex-end" gap={4}>
                <span>Balance:</span>
                {balanceLoading ? <AppLoader size={12} /> : count}
              </AppFlex>
            </AppText>
          </AppFlex>
        </AppFlex>

        <AppFlex row center gap={8} className={styles.bottom}>
          <div className={styles.imgRound}>
            <Image src={token.image} width={25} height={25} alt="" />
          </div>

          <AppText right size={16} color="#B9B8C5">1 {token.code} NFT20</AppText>

          <AppText right size={16} color="#B9B8C5">=</AppText>

          <div className={styles.imgSquare}>
            <Image src={token.image} width={25} height={25} alt="" />
          </div>

          <AppText right size={16} color="#B9B8C5">1 {token.collection} NFT</AppText>
        </AppFlex>
      </AppFlex>

      <AppFlex center className={cn(styles.box, styles.borderTop)}>
        <AppButton primary large disabled={error || amount * 1 <= 0} onClick={handleRedeem} sx={{ width: 200 }}>Redeem</AppButton>
      </AppFlex>
    </AppFlex>
  )
}

export default RedeemModalInput