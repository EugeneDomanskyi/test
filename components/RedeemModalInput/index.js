import { useEffect, useState } from 'react'
import Image from 'next/image'
import cn from 'classnames'

import Contracts from '@/libs/contracts.lib'
import useWalletConnect from '@/myhooks/wallet-connect'

import AppFlex from '@/components/AppFlex'
import AppText from '@/components/AppText'
import AppButton from '@/components/AppButton'
import AppIcon from '@/components/AppIcon'

import styles from './styles.module.scss'

const RedeemModalInput = ({ token, amount, onAmountChange, onRedeem }) => {
  const { wallet, network } = useWalletConnect()

  const [balance, setBalance] = useState(0)
  const [balanceLoading, setBalanceLoading] = useState(true)

  const contracts = new Contracts(network(token?.chain)?.gasLimit)

  useEffect(() => {
    if (wallet && token && token?.nft20) {
      (async () => {
        const result = await contracts.balanceOf(wallet, token.nft20)
        setBalance(Math.floor(result))
        setBalanceLoading(false)
      })()
    }
  }, [wallet, token])

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

  return (
    <AppFlex column>
      <div className={styles.box}>
        <AppText size={20} weight={600}>Enter the amount you would like to redeem</AppText>
      </div>

      <AppFlex column gap={6} className={styles.content}>
        <AppFlex row gap={8} className={styles.item}>
          <input type="number" placeholder="0" value={amount} onChange={handleChange} onKeyDown={handleKeyPress} className={styles.input} />

          <AppFlex column gap={10}>
            <AppFlex row gap={8} align="center" className={styles.chip}>
              <div className={styles.imgRound}>
                <Image src={token.image} width={25} height={25} alt="" />
              </div>
              <AppText size={16}>{token.code}</AppText>
            </AppFlex>

            <AppText right size={12} weight={400} color="#B9B8C5">{ ! balanceLoading ? `Balance: ${balance}` : '0'}</AppText>
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

            <AppText right size={12} weight={400} color="#B9B8C5">Balance: {balance}</AppText>
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
        <AppButton primary large disabled sx={{ width: 200 }}>Redeem</AppButton>
      </AppFlex>
    </AppFlex>
  )
}

export default RedeemModalInput