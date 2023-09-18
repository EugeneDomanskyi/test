import Image from 'next/image'
import cn from 'classnames'

import useWalletConnect from '@/myhooks/wallet-connect'

import App from '@/components/App'

import styles from './styles.module.scss'

const RaffleTop = () => {
  const { wallet } = useWalletConnect()

  const handleMoreClick = () => {
    window.open('https://galxe.com/tegro', '_blank')
  }

  return (
    <App.Flex column>
      <App.Flex className={styles.top}>
        <App.Container>
          <App.Flex column gap={[64, 32]} sx={{ padding: '103px 0 87px' }}>
            <App.Flex column>
              <App.Text center size={[68, 40]} height={1} family="ClashDisplay" gradient="linear-gradient(151deg, #FFF -0.73%, rgba(255, 255, 255, 0.50) 132.2%)">The TKeys Raffle</App.Text>
              <App.Text center size={[16, 14]}>Join raffles with TKeys for chances to win USDT and more on Polygon!</App.Text>
            </App.Flex>

            <App.Flex row center gap={96}>
              <App.Flex row center gap={32} className={cn(styles.box, styles.hiddenOnMobile)}>
                <App.Flex column>
                  <App.Text center size={48} family="ClashDisplay" height={1} gradient="linear-gradient(151deg, #FFF -0.73%, rgba(255, 255, 255, 0.50) 132.2%)">$3245</App.Text>
                  <App.Text center size={16} family="ClashDisplay" height={1.2} gradient="linear-gradient(151deg, #FFF -0.73%, rgba(255, 255, 255, 0.50) 132.2%)">Raffle Reward Available</App.Text>
                </App.Flex>

                <App.Flex center className={styles.button}>
                  <App.Text center weight={700}>Share</App.Text>
                </App.Flex>
              </App.Flex>

              {wallet ? (
                <App.Flex row center gap={32} className={styles.box}>
                  <App.Flex column className={styles.hiddenOnMobile}>
                    <App.Text center size={48} family="ClashDisplay" height={1} gradient="linear-gradient(151deg, #FFF -0.73%, rgba(255, 255, 255, 0.50) 132.2%)">$32</App.Text>
                    <App.Text center size={16} family="ClashDisplay" height={1.2} gradient="linear-gradient(151deg, #FFF -0.73%, rgba(255, 255, 255, 0.50) 132.2%)">Rewards Received</App.Text>
                  </App.Flex>

                  <App.Flex row center gap={8}>
                    <Image src="/images/raffle/tkey-large.png" width={44} height={64} alt="" />
                    <App.Flex column>
                      <App.Text center size={48} family="ClashDisplay" height={1} gradient="linear-gradient(151deg, #FFF -0.73%, rgba(255, 255, 255, 0.50) 132.2%)">10</App.Text>
                      <App.Text center size={16} family="ClashDisplay" height={1.2} gradient="linear-gradient(151deg, #FFF -0.73%, rgba(255, 255, 255, 0.50) 132.2%)">TKeys</App.Text>
                    </App.Flex>
                  </App.Flex>

                  <App.Flex center className={styles.button} onClick={handleMoreClick}>
                    <App.Text center size={[14, 12]} weight={700}>Collect more TKeys</App.Text>
                  </App.Flex>
                </App.Flex>
              ) : null}
            </App.Flex>
          </App.Flex>
        </App.Container>
      </App.Flex>

      <App.Flex row center fullWidth sx={{ overflow: 'hidden' }}>
        <App.Flex row center gap={8} className={styles.awards}>
          <App.Flex center gap={4}>
            <Image src="/images/raffle/icon-crown.png" width={18} height={17} alt="" />
            <App.Text nowrap color="rgba(255, 255, 255, 0.40)">0x23...9qe2 wins 20 USDT</App.Text>
          </App.Flex>

          <App.Text nowrap color="rgba(255, 255, 255, 0.40)">|</App.Text>

          <App.Flex center gap={4}>
            <Image src="/images/raffle/icon-crown.png" width={18} height={17} alt="" />
            <App.Text nowrap color="rgba(255, 255, 255, 0.40)">0x23...9qe2 wins 20 USDT</App.Text>
          </App.Flex>

          <App.Text nowrap color="rgba(255, 255, 255, 0.40)">|</App.Text>

          <App.Flex center gap={4}>
            <Image src="/images/raffle/icon-crown.png" width={18} height={17} alt="" />
            <App.Text nowrap color="rgba(255, 255, 255, 0.40)">0x23...9qe2 wins 20 USDT</App.Text>
          </App.Flex>

          <App.Text nowrap color="rgba(255, 255, 255, 0.40)">|</App.Text>

          <App.Flex center gap={4}>
            <Image src="/images/raffle/icon-crown.png" width={18} height={17} alt="" />
            <App.Text nowrap color="rgba(255, 255, 255, 0.40)">0x23...9qe2 wins 20 USDT</App.Text>
          </App.Flex>

          <App.Text nowrap color="rgba(255, 255, 255, 0.40)">|</App.Text>

          <App.Flex center gap={4}>
            <Image src="/images/raffle/icon-crown.png" width={18} height={17} alt="" />
            <App.Text nowrap color="rgba(255, 255, 255, 0.40)">0x23...9qe2 wins 20 USDT</App.Text>
          </App.Flex>
        </App.Flex>
      </App.Flex>
    </App.Flex>
  )
}

export default RaffleTop