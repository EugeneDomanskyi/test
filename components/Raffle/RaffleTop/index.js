import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import Image from 'next/image'
import cn from 'classnames'

import useWalletConnect from '@/myhooks/wallet-connect'
import { usePropsHelper } from '@/myhooks/props-helper'

import $app from '@/store/app'

import { trackEvent, getPageName } from '@/libs/analytics.lib'

import App from '@/components/App'

import styles from './styles.module.scss'
import Link from 'next/link'

const RaffleTop = ({ loading, isFirstTimeUser }) => {
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
    window.open('https://galxe.com/tegro/campaign/GC9QPUMqMz?utm_source=web', '_blank')
  }

  const handleConnectWalletClick = async () => {
    trackEvent('Wallet Connect Clicked', {
      'Source': getPageName(),
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

  const handleClickMore = () => {
    const blogURL = 'https://blog.tegro.com/10k-tegro-treasure-case-event?utm_source=earn&utm_medium=bnr&utm_campaign=10kttcs'
    window.open(blogURL, '_blank')
  }

  return (
    <App.Flex column>
      <App.Flex className={styles.top}>
        <App.Container>
          <App.Flex column gap={[64, 32]}>
            <App.Flex align="flex-start" column width={['auto', 232]}>
              <App.Text size={[48, 24]} height={1.2} family="ClashDisplay" gradient="linear-gradient(151deg, #FFF -0.73%, rgba(255, 255, 255, 0.50) 132.2%)">Rewards Worth $10,000+<br />Up For Grabs</App.Text>
              <App.Text size={[16, 14]} height={1.6} family="ClashDisplay">Use TKeys to open cases and win $USDT, $PEPE, $SHIB & more</App.Text>
              <App.Flex gap={8} className={styles.linkButton} onClick={handleClickMore}>
                <App.Text size={14} height={1.6}>Read More</App.Text>
                <App.Icon icon="arrow-45" />
              </App.Flex>
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

              {
                isFirstTimeUser
                  ? <App.Flex justify="flex-start" className={styles.firstTimeBanner}>
                      <App.Flex center gap={8}>
                        <App.Text
                          size={22}
                          weight={500}
                          family="ClashDisplay"
                          gradient="linear-gradient(151deg, #FFF -0.73%, rgba(255, 255, 255, 0.50) 132.2%)"
                        >
                          Open your first $200* Case for
                        </App.Text>
                        <App.ShadowText color="#FFCB04" shadowColor="#FF7708" size={24} weight={600}>FREE!</App.ShadowText>
                      </App.Flex>

                      <App.Flex className={styles.firstTimeCase}>
                        <Image src="/images/raffle/case-blue.png" width={86} height={82} alt="" />
                      </App.Flex>

                      <App.Flex center className={cn(styles.button, styles.primary)} onClick={handleConnectWalletClick}>
                        <App.Text center size={[14, 12]} weight={700}>Connect Wallet Now</App.Text>
                      </App.Flex>

                      <App.Flex sx={{position: 'absolute', bottom: 4, left: 32}}>
                        <App.Text size={10} weight={500} family="ClashDisplay" color="#B9B8C5">*Only applicable for first time users</App.Text>
                      </App.Flex>
                    </App.Flex>
                  : wallet ? (
                    <App.Flex row align="center" justify={['center', 'space-between']} gap={[32, 8]} width={['auto', '100%']} className={styles.box}>
                      <App.Flex column center>
                        {loadingUser ? (
                          <App.Loader size={[36, 24]} />
                        ) : (
                          <App.Text center size={[36, 24]} family="ClashDisplay" height={1} gradient="linear-gradient(151deg, #FFF -0.73%, rgba(255, 255, 255, 0.50) 132.2%)">${user.totalEarned}</App.Text>
                        )}
                        <App.Text center size={[16, 10]} family="ClashDisplay" height={1.2} gradient="linear-gradient(151deg, #FFF -0.73%, rgba(255, 255, 255, 0.50) 132.2%)">Prize Earned</App.Text>
                      </App.Flex>

                      <Link href="/exchange">
                        <App.Flex center className={cn(styles.button, styles.primary)}>
                          <App.Text center size={[14, 12]} weight={700}>Trade Now</App.Text>
                        </App.Flex>
                      </Link>
    
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
    
                      <App.Flex center gap={8} className={cn(styles.button, styles.primary)} onClick={handleMoreClick}>
                        <App.Text center size={[14, 12]} weight={700}>Get TKeys</App.Text>
                        <App.Icon icon="galxe-icon" />
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
                  )
              }
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