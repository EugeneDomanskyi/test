import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import Image from 'next/image'
import cn from 'classnames'

import useWalletConnect from '@/myhooks/wallet-connect'
import { usePropsHelper } from '@/myhooks/props-helper'

import $app from '@/store/app'

import { trackEvent } from '@/libs/analytics.lib'

import App from '@/components/App'

import styles from './styles.module.scss'

const RaffleTop = ({ loading }) => {
  const { wallet, connect } = useWalletConnect()
  const { isMobile } = usePropsHelper()

  const blockchain = useSelector($app.get.blockchain)
  const campaigns = useSelector(({ $raffle }) => $raffle.all)
  const user = useSelector(({ $raffle }) => $raffle.user)
  const last = useSelector(({ $raffle }) => $raffle.last)
  const balance = useSelector(({ $raffle }) => $raffle.balance)
  const loadingUser = useSelector(({ $raffle }) => $raffle.loadingUser)

  const [totalReward, setTotalReward] = useState(0)

  useEffect(() => {
    if (campaigns.length) {
      const sum = campaigns.reduce((accumulator, currentValue) => {
        return accumulator + currentValue.rewardAmount * 1
      }, 0)

      setTotalReward(sum)
    }
  }, [campaigns])

  const getLast = () => {
    const result = []
    if (last.length) {
      let index = 0
      for (let i = 0; i < 50; i++) {
        result.push(last[index])
        index = (index + 1) < last.length ? (index + 1) : 0
      }
    }
    //return isMobile ? last.slice(0, 2) : last
    return result
  }

  const handleMoreClick = () => {
    trackEvent('Click Collect TKeys', {
      'Wallet connect Status': 'Connected',
      'Tkeys Quantity': balance,
    })
    window.open('https://galxe.com/tegro', '_blank')
  }

  const handleConnectWalletClick = async () => {
    trackEvent('Wallet Connect Clicked', {
      'Wallet connected Status': 'Not Connected',
    })
    if ( ! wallet) {
      const result = await connect()
      if (result) {
        trackEvent('Wallet Connected Successfully', {
          'Wallet connected Status': 'Connected',
          'Wallet Address': result,
        })
      }
    }
  }

  const handleTransactionClick = (tx) => () => {
    window.open(`${blockchain.raffle.txUrl}${tx}`, '_blank')
  }

  return (
    <App.Flex column>
      <App.Flex className={styles.top}>
        <App.Container>
          <App.Flex column gap={[64, 32]}>
            <App.Flex column width={['auto', 232]}>
              <App.Text size={[48, 24]} height={1.2} family="ClashDisplay" gradient="linear-gradient(151deg, #FFF -0.73%, rgba(255, 255, 255, 0.50) 132.2%)">Rewards Worth $10,000+<br />Up For Grabs</App.Text>
              <App.Text size={[16, 14]} height={1.6} family="ClashDisplay">Use TKeys to open cases and win $USDT, $PEPE, $SHIB & more</App.Text>
            </App.Flex>

            <App.Flex direction={['row', 'column']} gap={[32, 16]}>
              {/* <App.Flex row align="center" justify={['center', 'space-between']} gap={32} className={styles.box}>
                <App.Flex center column>
                  {!loading ? (
                    <App.Text center size={[36, 24]} family="ClashDisplay" height={1} gradient="linear-gradient(151deg, #FFF -0.73%, rgba(255, 255, 255, 0.50) 132.2%)">${totalReward}</App.Text>
                  ) : (
                    <App.Loader size={[36, 24]} />
                  )}
                  <App.Text center size={[16, 10]} family="ClashDisplay" height={1.2} gradient="linear-gradient(151deg, #FFF -0.73%, rgba(255, 255, 255, 0.50) 132.2%)">Prize Pool</App.Text>
                </App.Flex>
              </App.Flex> */}

              {wallet ? (
                <App.Flex row align="center" justify={['center', 'space-between']} gap={[32, 8]} width={['auto', '100%']} className={styles.box}>
                  <App.Flex column center>
                    {loadingUser ? (
                      <App.Loader size={[36, 24]} />
                    ) : (
                      <App.Text center size={[36, 24]} family="ClashDisplay" height={1} gradient="linear-gradient(151deg, #FFF -0.73%, rgba(255, 255, 255, 0.50) 132.2%)">${user.totalEarned}</App.Text>
                    )}
                    <App.Text center size={[16, 10]} family="ClashDisplay" height={1.2} gradient="linear-gradient(151deg, #FFF -0.73%, rgba(255, 255, 255, 0.50) 132.2%)">Prize Earned</App.Text>
                  </App.Flex>

                  <App.Flex column center>
                    <App.Flex row gap={8} center>
                      <Image src="/images/raffle/tkey-large.png" width={isMobile ? 18 : 24} height={isMobile ? 25 : 36} alt="" />
                      {loadingUser ? (
                        <App.Loader size={[36, 24]} />
                      ) : (
                        <App.Text center size={[36, 24]} family="ClashDisplay" height={1} gradient="linear-gradient(151deg, #FFF -0.73%, rgba(255, 255, 255, 0.50) 132.2%)">{balance}</App.Text>
                      )}
                    </App.Flex>
                    <App.Text center size={[16, 10]} family="ClashDisplay" height={1.2} gradient="linear-gradient(151deg, #FFF -0.73%, rgba(255, 255, 255, 0.50) 132.2%)">TKeys Balance</App.Text>
                  </App.Flex>

                  <App.Flex center className={cn(styles.button, styles.primary)} onClick={handleMoreClick}>
                    <App.Text center size={[14, 12]} weight={700}>Collect TKeys</App.Text>
                  </App.Flex>
                </App.Flex>
              ) : (
                <App.Flex row align="center" justify={['center', 'space-between']} width={['auto', '100%']} gap={[0, 8]} className={styles.box}>
                  <App.Flex width={[288, 'auto']}>
                    <App.Text size={[16, 10]} family="ClashDisplay" height={1.6}>Use TKeys to open cases and win $USDT, $PEPE, $SHIB & more</App.Text>
                  </App.Flex>

                  <App.Flex center className={cn(styles.button, styles.primary)} onClick={handleConnectWalletClick}>
                    <App.Text center size={[14, 12]} weight={700}>Connect Wallet</App.Text>
                  </App.Flex>
                </App.Flex>
              )}
            </App.Flex>
          </App.Flex>
        </App.Container>
      </App.Flex>

      <App.Flex row center fullWidth sx={{ overflow: 'hidden' }}>
        <App.Flex row align="center" gap={8} className={styles.awards}>
          {getLast().map((item, index) => (
            <App.Flex key={item.resolvedTransaction + index} center gap={4} className={styles.last} onClick={handleTransactionClick(item.resolvedTransaction)}>
              <Image src="/images/raffle/icon-crown.png" width={18} height={17} alt="" />
              <App.Text nowrap>{item.address} wins {item.rewardAmount} USDT</App.Text>
            </App.Flex>
          ))}
        </App.Flex>
      </App.Flex>
    </App.Flex>
  )
}

export default RaffleTop