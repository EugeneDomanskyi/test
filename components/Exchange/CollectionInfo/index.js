import styles from './styles.module.scss'
import { memo } from 'react'
import { useSelector } from 'react-redux'
import Image from 'next/image'
import Link from 'next/link'

import $exchange from '@/store/exchange'
import $app from '@/store/app'
import useWalletConnect from '@/myhooks/wallet-connect'

import App from '@/components/App'
import { WebIcon, TwitterIcon, DiscordIcon } from '@/components/Icons/exchange'

const CollectionInfo = () => {
  const { scanUrl } = useWalletConnect()
  const blockchain = useSelector($app.get.blockchain)
  const { high, low } = useSelector($exchange.get.highLow({count: 24, unit: 'hours'}))
  const currentCollection = useSelector(({$collection}) => $collection.current)

  const scanLink = scanUrl(currentCollection.address, 'address', blockchain?.code)

  return (
    <App.Flex className={styles.container} gap={6}>
      {
        currentCollection
          ? <>
              <App.Flex>
                {
                  currentCollection?.image
                    ? <Image
                        width={162}
                        height={162}
                        priority
                        alt=""
                        className={styles.image}
                        src={currentCollection?.image} />
                    : null
                }
              </App.Flex>
              <App.Flex flex={1} column className={styles.content}>
                <App.Flex column gap={8} flex={1}>
                  <App.Flex align="center" justify="space-between">
                    <App.Flex align="center" gap={8}>
                      <App.Text weight={700} uppercase size={20}>{ currentCollection?.name }</App.Text>
                      {
                        currentCollection?.openseaVerificationStatus === 'verified'
                          ? <App.Tooltip text={<App.Text>This collection belongs to a verified account and has significant interest or sales. <a href="https://support.opensea.io/hc/en-us/articles/360063519133-What-is-a-verified-account-or-badged-collection-" target="_blank">Learn more</a></App.Text>}>
                              <App.Icon icon="verified" />
                            </App.Tooltip>
                          : null
                      }
                    </App.Flex>
                    <App.Flex align="center">
                      <Link href={scanLink} target="_blank" style={{marginRight: 8}}>
                        <App.Icon width={15} height={15} icon={blockchain?.code === 'polygon' ? 'polyscan' : 'etherscan'} />
                      </Link>
                      <Link href={currentCollection?.externalUrl ?? ''} target="_blank" style={{marginRight: 5}}>
                        <WebIcon />
                      </Link>
                      <Link href={currentCollection?.twitterUrl ?? ''} target="_blank" style={{marginRight: 8}}>
                        <TwitterIcon />
                      </Link>
                      <Link href={currentCollection?.discordUrl ?? ''} target="_blank">
                        <DiscordIcon />
                      </Link>
                    </App.Flex>
                  </App.Flex>
                  <App.Text lines={2} size={12} weight={500} color="#B9B8C5">{ currentCollection?.description }</App.Text>
                  <App.Flex sx={{marginTop: 'auto'}} gap={16}>
                    <App.Flex column className={styles.card}>
                      <App.Text color="#B9B8C5" size={10} weight={400}>Price</App.Text>
                      <App.Text size={16} weight={700} sx={{whiteSpace: 'nowrap'}}>{ currentCollection?.price } { currentCollection?.currency }</App.Text>
                    </App.Flex>
                    <App.Flex column className={styles.card}>
                      <App.Text color="#B9B8C5" size={10} weight={400}>24h Price Change</App.Text>
                      <App.Flex align="center" gap={4}>
                        <App.Icon style={{transform: `rotate(${currentCollection?.ticker?.type == 'minus' ? '0' : '180'}deg)`}} icon="caret-down" color={currentCollection?.ticker?.type == 'minus' ? '#FF1D61' : '#53F19C' } />
                        <App.Text size={16} weight={500} color={currentCollection?.ticker?.type == 'minus' ? '#FF1D61' : '#53F19C' }>{ currentCollection?.ticker?.value }%</App.Text>
                      </App.Flex>
                    </App.Flex>
                    <App.Flex column className={styles.card}>
                      <App.Flex align="center" gap={4}>
                        <App.Text color="#B9B8C5" size={10} weight={400}>24h Volume</App.Text>
                        <App.Tooltip placement="bottom" text={<App.Text center color="#B9B8C5">A measure of how much NFTs was traded in the last 24 hours </App.Text>}>
                          <App.Icon icon="info" width={12} height={12} />
                        </App.Tooltip>
                      </App.Flex>
                      <App.Text size={16} weight={700}>{ currentCollection?.volume }</App.Text>
                    </App.Flex>
                    <App.Flex column className={styles.card}>
                      <App.Text color="#B9B8C5" size={10} weight={400}>24h High</App.Text>
                      <App.Text size={16} weight={700} sx={{whiteSpace: 'nowrap'}}>{ high } { currentCollection?.currency }</App.Text>
                    </App.Flex>
                    <App.Flex column className={styles.card}>
                      <App.Text color="#B9B8C5" size={10} weight={400}>24h Low</App.Text>
                      <App.Text size={16} weight={700} sx={{whiteSpace: 'nowrap'}}>{ low } { currentCollection?.currency }</App.Text>
                    </App.Flex>
                    <App.Flex column className={styles.card}>
                      <App.Flex align="center" gap={4}>
                        <App.Text color="#B9B8C5" size={10} weight={400}>Total Supply</App.Text>
                        <App.Tooltip placement="bottom-start" text={<App.Text center color="#B9B8C5">The maximum amount of NFTs the will ever exist in its lifetime. The total number of NFTs available</App.Text>}>
                          <App.Icon icon="info" width={12} height={12} />
                        </App.Tooltip>
                      </App.Flex>
                      <App.Text size={16} weight={700}>{ currentCollection?.tokenCount }</App.Text>
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

const isEqual = () => {
  return true
}

export default memo(CollectionInfo, isEqual)
