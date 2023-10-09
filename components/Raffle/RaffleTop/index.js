import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import Image from 'next/image'
import cn from 'classnames'

import useWalletConnect from '@/myhooks/wallet-connect'
import { usePropsHelper } from '@/myhooks/props-helper'

import App from '@/components/App'

import styles from './styles.module.scss'

const RaffleTop = ({ loading }) => {
  const { wallet, connect } = useWalletConnect()
  const { isMobile } = usePropsHelper()

  const campaigns = useSelector(({ $raffle }) => $raffle.all)
  const user = useSelector(({ $raffle }) => $raffle.user)
  const last = useSelector(({ $raffle }) => $raffle.last)
  const tokenIds = useSelector(({ $raffle }) => $raffle.tokenIds)
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
    return isMobile ? last.slice(0, 2) : last
  }

  const handleMoreClick = () => {
    window.open('https://galxe.com/tegro', '_blank')
  }

  const handleConnectWalletClick = async () => {
    if ( ! wallet) {
      connect()
    }
  }

  const handleTransactionClick = (tx) => () => {
    window.open(`https://${process.env.NEXT_PUBLIC_APP_ENV == 'local' ? 'mumbai.' : ''}polygonscan.com/tx/${tx}`, '_blank')
  }

  return (
    <App.Flex column>
      <App.Flex className={styles.top}>
        <App.Container>
          <App.Flex column gap={[64, 32]}>
            <App.Flex column width={['auto', 178]}>
              <App.Text size={[48, 24]} height={1.2} family="ClashDisplay" gradient="linear-gradient(151deg, #FFF -0.73%, rgba(255, 255, 255, 0.50) 132.2%)">Open Cases, Win Epic Prizes</App.Text>
              <App.Text size={[16, 14]} height={1.6} family="ClashDisplay">Use your TKeys to unlock USDT and token rewards!</App.Text>
            </App.Flex>

            <App.Flex direction={['row', 'column']} gap={[32, 16]}>
              <App.Flex row align="center" justify={['center', 'space-between']} gap={32} className={styles.box}>
                <App.Flex center column>
                  {!loading ? (
                    <App.Text center size={[36, 24]} family="ClashDisplay" height={1} gradient="linear-gradient(151deg, #FFF -0.73%, rgba(255, 255, 255, 0.50) 132.2%)">${totalReward}</App.Text>
                  ) : (
                    <App.Loader size={[36, 24]} />
                  )}
                  <App.Text center size={[16, 10]} family="ClashDisplay" height={1.2} gradient="linear-gradient(151deg, #FFF -0.73%, rgba(255, 255, 255, 0.50) 132.2%)">Prize Pool</App.Text>
                </App.Flex>
              </App.Flex>

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
                        <App.Text center size={[36, 24]} family="ClashDisplay" height={1} gradient="linear-gradient(151deg, #FFF -0.73%, rgba(255, 255, 255, 0.50) 132.2%)">{tokenIds.length}</App.Text>
                      )}
                    </App.Flex>
                    <App.Text center size={[16, 10]} family="ClashDisplay" height={1.2} gradient="linear-gradient(151deg, #FFF -0.73%, rgba(255, 255, 255, 0.50) 132.2%)">TKeys Balance</App.Text>
                  </App.Flex>

                  <App.Flex center className={cn(styles.button, styles.primary)} onClick={handleMoreClick}>
                    <App.Text center size={[14, 12]} weight={700}>Collect TKeys</App.Text>
                  </App.Flex>
                </App.Flex>
              ) : (
                <App.Flex row align="center" justify={['center', 'space-between']} width={['auto', '100%']} gap={[32, 8]} className={styles.box}>
                  <App.Flex width={[251, 'auto']}>
                    <App.Text size={[16, 10]} family="ClashDisplay" height={1.2} gradient="linear-gradient(151deg, #FFF -0.73%, rgba(255, 255, 255, 0.50) 132.2%)">Connect your wallet, open cases, and enjoy your winnings!</App.Text>
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
        <App.Flex row center gap={8} className={styles.awards}>
          {getLast().map((item, index) => (
            <App.Flex key={item.resolvedTransaction + index} center gap={4} className={styles.last} onClick={handleTransactionClick(item.resolvedTransaction)}>
              <Image src="/images/raffle/icon-crown.png" width={18} height={17} alt="" />
              <App.Text nowrap color="rgba(255, 255, 255, 0.8)">{item.address} wins {item.rewardAmount} USDT</App.Text>
            </App.Flex>
          ))}
        </App.Flex>
      </App.Flex>
    </App.Flex>
  )
}

export default RaffleTop