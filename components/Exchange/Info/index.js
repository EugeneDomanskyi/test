import styles from './styles.module.scss'
import { memo } from 'react'
import { useSelector } from 'react-redux'
import Image from 'next/image'
import Link from 'next/link'

import $exchange from '@/store/exchange'
import $app from '@/store/app'
import useWalletConnect from '@/myhooks/wallet-connect'
import { trackEvent } from '@/libs/analytics.lib'

import App from '@/components/App'
import { WebIcon, TwitterIcon, DiscordIcon } from '@/components/Icons/exchange'

const Info = ({ current }) => {
  const { scanUrl } = useWalletConnect()
  const blockchain = useSelector($app.get.blockchain)
  const { high, low } = useSelector($exchange.get.highLow({count: 24, unit: 'hours'}))

  const scanLink = scanUrl(current.address, 'address', blockchain)

  const handleClickLink = (type) => () => {
    trackEvent(`Click ${type} Redirect`, {
      Markets: current.name,
    })
  }

  return (
    <App.Flex className={styles.container} gap={6}>
      {
        current
          ? <>
              <App.Flex>
                {
                  current?.image
                    ? <Image
                        width={162}
                        height={162}
                        priority
                        alt=""
                        className={styles.image}
                        src={current?.image} />
                    : <div className={styles.emptyImage} />
                }
              </App.Flex>
              
              <App.Flex flex={1} column className={styles.content}>
                <App.Flex column gap={8} flex={1}>
                  <App.Flex align="center" justify="space-between">
                    <App.Flex align="center" gap={8}>
                      <App.Text weight={700} uppercase size={20}>{ current?.name }</App.Text>
                      {
                        current?.openseaVerificationStatus === 'verified'
                          ? <App.Tooltip text={<App.Text>This collection belongs to a verified account and has significant interest or sales. <a href="https://support.opensea.io/hc/en-us/articles/360063519133-What-is-a-verified-account-or-badged-collection-" target="_blank">Learn more</a></App.Text>}>
                              <App.Icon icon="verified" />
                            </App.Tooltip>
                          : null
                      }
                    </App.Flex>
                    <App.Flex align="center">
                      <Link href={scanLink} target="_blank" onClick={handleClickLink(blockchain?.code)} style={{marginRight: 8}}>
                        <App.Icon width={15} height={15} icon={blockchain?.code === 'polygon' ? 'polyscan' : 'etherscan'} />
                      </Link>
                      {
                        current?.externalUrl
                          ? <Link href={current?.externalUrl ?? ''} onClick={handleClickLink('website')} target="_blank" style={{marginRight: 5}}>
                              <WebIcon />
                            </Link>
                          : null
                      }
                      {
                        current?.twitterUrl
                          ? <Link href={current?.twitterUrl ?? ''} onClick={handleClickLink('twitter')} target="_blank" style={{marginRight: 8}}>
                              <TwitterIcon />
                            </Link>
                          : null
                      }
                      {
                        current?.discordUrl
                          ? <Link href={current?.discordUrl ?? ''} onClick={handleClickLink('discord')} target="_blank">
                              <DiscordIcon />
                            </Link>
                          : null
                      }
                    </App.Flex>
                  </App.Flex>
                  <App.Text lines={2} size={12} weight={500} color="#B9B8C5">{ current?.description }</App.Text>
                  <App.Flex sx={{marginTop: 'auto'}} gap={16}>
                    <App.Flex column className={styles.card}>
                      <App.Text color="#B9B8C5" size={10} weight={400}>Price</App.Text>
                      <App.Text size={16} weight={700} sx={{whiteSpace: 'nowrap'}}>{ current?.price } { current?.currency }</App.Text>
                    </App.Flex>
                    <App.Flex column className={styles.card}>
                      <App.Text color="#B9B8C5" size={10} weight={400}>24h Price Change</App.Text>
                      <App.Flex align="center" gap={4}>
                        <App.Icon style={{transform: `rotate(${current?.ticker?.type == 'minus' ? '0' : '180'}deg)`}} icon="caret-down" color={current?.ticker?.type == 'minus' ? '#FF1D61' : '#53F19C' } />
                        <App.Text size={16} weight={500} color={current?.ticker?.type == 'minus' ? '#FF1D61' : '#53F19C' }>{ current?.ticker?.value }%</App.Text>
                      </App.Flex>
                    </App.Flex>
                    <App.Flex column className={styles.card}>
                      <App.Flex align="center" gap={4}>
                        <App.Text color="#B9B8C5" size={10} weight={400}>24h Volume</App.Text>
                        <App.Tooltip placement="bottom" text={<App.Text center color="#B9B8C5">A measure of how much NFTs was traded in the last 24 hours </App.Text>}>
                          <App.Icon icon="info" width={12} height={12} />
                        </App.Tooltip>
                      </App.Flex>
                      <App.Text size={16} weight={700}>{ current?.volume }</App.Text>
                    </App.Flex>
                    <App.Flex column className={styles.card}>
                      <App.Text color="#B9B8C5" size={10} weight={400}>24h High</App.Text>
                      <App.Text size={16} weight={700} sx={{whiteSpace: 'nowrap'}}>{ current?.high ?? high } { current?.currency }</App.Text>
                    </App.Flex>
                    <App.Flex column className={styles.card}>
                      <App.Text color="#B9B8C5" size={10} weight={400}>24h Low</App.Text>
                      <App.Text size={16} weight={700} sx={{whiteSpace: 'nowrap'}}>{ current?.low ?? low } { current?.currency }</App.Text>
                    </App.Flex>
                    <App.Flex column className={styles.card}>
                      <App.Flex align="center" gap={4}>
                        <App.Text color="#B9B8C5" size={10} weight={400}>Total Supply</App.Text>
                        <App.Tooltip placement="bottom-start" text={<App.Text center color="#B9B8C5">The maximum amount of NFTs there will ever exist in its lifetime. The total number of NFTs available</App.Text>}>
                          <App.Icon icon="info" width={12} height={12} />
                        </App.Tooltip>
                      </App.Flex>
                      <App.Text size={16} weight={700}>{ current?.tokenCount }</App.Text>
                    </App.Flex>
                  </App.Flex>
                </App.Flex>
              </App.Flex>
            </>
          : null
      }
    </App.Flex>
  )
}

const isEqual = (prevProps, nextProps) => {
  return JSON.stringify(prevProps.current) == JSON.stringify(nextProps.current)
}

export default memo(Info, isEqual)
