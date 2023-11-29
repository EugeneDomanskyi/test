import { useEffect, useState, useRef } from 'react'
import Image from 'next/image'
import { useDispatch, useSelector } from 'react-redux'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { ApolloClient, InMemoryCache } from '@apollo/client'
import cn from 'classnames'

import { trackEvent, getPageName } from '@/libs/analytics.lib'
import useWalletConnect from '@/myhooks/wallet-connect'

import App from '@/components/App'

import { CHAINS } from '@/config'

import $app from '@/store/app'
import $raffle from '@/store/raffle'

import styles from './styles.module.scss'

const getApolloClient = (blockchain) => {
  const uri = blockchain?.raffle?.subgraph
  const client = new ApolloClient({
    uri,
    cache: new InMemoryCache(),
    connectToDevTools: true,
  })

  return client
}

const LandingPage = () => {
  const dispatch = useDispatch()
  const router = useRouter()
  const { wallet, connect, getConnectorName } = useWalletConnect()

  const campaigns = useSelector(({ $raffle }) => $raffle.all)
  const blockchain = CHAINS.find(item => item.id === 137)

  const apollo = useRef()

  const [walletsCount, setWalletsCount] = useState(null)
  const [totalReward, setTotalReward] = useState(null)

  useEffect(() => {
    dispatch($app.get.walletConnectedCount).then(res => {
      if (res.data) {
        setWalletsCount(res.data.count)
      }
    })

    handleFetchCampaigns()
  }, [])

  useEffect(() => {
    if (campaigns.length) {
      const sum = campaigns.reduce((accumulator, currentValue) => {
        return accumulator + currentValue.rewardAmount * 1
      }, 0)

      setTotalReward(sum)
    }
  }, [campaigns])

  const handleFetchCampaigns = async () => {
    apollo.current = getApolloClient(blockchain)
      const result = await apollo.current.query({
        query: $raffle.query.campaigns,
      })

      if (result && result.hasOwnProperty('data') && result.data.hasOwnProperty('campaigns')) {
        const campaigns = result.data.campaigns
        
        dispatch($raffle.set.all(campaigns.map(item => {
          return {
            ...item,
            rewardAmount: item.rewardAmount / Math.pow(10, 6),
          }
        })))
      }
  }

  const handleConnectWallet = async (noWallet = null) => {
    if (noWallet) {
      trackEvent("Click Don't have a wallet")
    }

    if ( ! wallet) {
      trackEvent('Wallet Connect Clicked', {
        'Source': getPageName(),
      })

      const result = await connect()
      if (result) {
        router.push('/exchange')
        const walletName = await getConnectorName()
        trackEvent('Wallet Connect Success', {
          'Source': getPageName(),
          'Type': walletName,
        })
      }
    } else {
      router.push('/exchange')
    }
  }

  return (
    <App.Flex className={styles.container}>
      <Link href="/" style={{ lineHeight: 0 }}>
        <App.Flex column gap={4} className={styles.logoWrapper}>
          <div className={styles.logo}>
            <div className={styles.badge}>
              BETA
            </div>
            <App.Icon icon="tegro" width={117} height={25} />
          </div>

          <App.Text size={10} weight={500}>Trade Efficiently On-Chain</App.Text>
        </App.Flex>
      </Link>

      <App.Flex column className={styles.leftSide}>
        <App.Flex column className={styles.contentWrapper} gap={32}>
          <App.Flex column align="flex-start">
            <App.Text size={[55, 36]} weight={800}>
              Trade on Tegro &<br />
              Share Rewards worth
            </App.Text>
            
            <App.Text size={64} weight={800} className={styles.rewardText}>
              $10,000

              <App.Text size={64} weight={800} className={styles.rewardTextShadow}>
                $10,000
              </App.Text>
            </App.Text>
            
            <App.Text size={16} weight={500} color="#B9B8C5" className={styles.subText}>
              Connect your wallet and trade your favorite tokens on Tegro. Collect TKeys and open Mystery Boxes containing USDT, PEPE, SHIB, and other token rewards.
            </App.Text>
          </App.Flex>

          <App.Flex align="center" className={styles.stepsWrapper}>
            <App.Flex className={styles.stepBlock} gap={16}>
              <App.Flex center className={styles.stepCircle}>1</App.Flex>
              <App.Text size={14} weight={600}>Connect Wallet</App.Text>
            </App.Flex>

            <App.Flex className={styles.stepLine} />

            <App.Flex className={styles.stepBlock} gap={16}>
              <App.Flex center className={styles.stepCircle}>2</App.Flex>
              <App.Text size={14} weight={600}>Trade Tokens</App.Text>
            </App.Flex>

            <App.Flex className={styles.stepLine} />

            <App.Flex className={styles.stepBlock} gap={16}>
              <App.Flex center className={styles.stepCircle}>3</App.Flex>
              <App.Text size={14} weight={600}>Earn Rewards</App.Text>
            </App.Flex>
          </App.Flex>

          <App.Flex align="center" className={styles.buttonsWrapper}>
            <App.Button rounded primary sx={{paddingLeft: 32, paddingRight: 32}} onClick={handleConnectWallet}>
              {
                wallet
                  ? 'Trade Tokens'
                  : <>
                      Connect Wallet Now
                      <App.Icon icon="stars" />      
                    </>
              }
            </App.Button>
            
            {
              ! wallet
                ? <App.Text className={styles.link} onClick={() => handleConnectWallet(true)}>
                    Don&apos;t have a wallet?
                  </App.Text>
                : null
            }
          </App.Flex>
        </App.Flex>
      </App.Flex>

      <App.Flex center className={styles.rightSide}>
        <Image src="/animations/campaign_2.gif" width={320} height={320} alt="" />

        <App.Flex className={styles.bottomSection}>
          <App.Flex center gap={4}>
            <App.Flex center className={styles.circleWrapper}>
              <App.Flex className={styles.dot} />
              <App.Flex className={styles.innerCircle} />
            </App.Flex>

            <App.Flex gap={4}>
              <App.Text color="#B9B8C5" size={12} weight={700}>
                {
                  walletsCount ?? <App.Loader size={12} />
                }
              </App.Text>
              <App.Text color="#B9B8C5" size={12}>wallets connected so far</App.Text>
            </App.Flex>
          </App.Flex>
          
          <App.Flex center gap={4}>
            <App.Flex center className={styles.circleWrapper}>
              <App.Flex className={styles.dot} />
              <App.Flex className={cn(styles.innerCircle, styles.delayed)} />
            </App.Flex>

            <App.Flex gap={4}>
              <App.Text color="#B9B8C5" size={12} weight={700}>
                {
                  totalReward ? '$' + totalReward : <App.Loader size={12} />
                }
              </App.Text>
              <App.Text color="#B9B8C5" size={12}>rewards distributed so far</App.Text>
            </App.Flex>
          </App.Flex>
        </App.Flex>
      </App.Flex>
    </App.Flex>
  )
}

export default LandingPage