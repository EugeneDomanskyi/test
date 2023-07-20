import styles from './styles.module.scss'
import { useSelector } from 'react-redux'
import Image from 'next/image'
import Link from 'next/link'

import $collection from '@/store/collection'
import $exchange from '@/store/exchange'

import App from '@/components/App'
import { WebIcon, TwitterIcon, DiscordIcon } from '@/components/Icons/exchange'

const CollectionInfo = ({collectionId}) => {

  const currentCollection = useSelector($collection.get.collection('address', collectionId))
  const { high, low } = useSelector($exchange.get.highLow({count: 24, unit: 'hours'}))

  return (
    <App.Flex className={styles.container} gap={6}>
      <App.Flex>
        {
          currentCollection?.image
            ? <Image
                width={162}
                height={162}
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
                  ? <App.Icon icon="verified" />
                  : null
              }
            </App.Flex>
            <App.Flex align="center">
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
              <App.Text size={16} weight={700}>${ currentCollection?.price }</App.Text>
            </App.Flex>
            <App.Flex column className={styles.card}>
              <App.Text color="#B9B8C5" size={10} weight={400}>24h Price Change</App.Text>
              <App.Flex align="center" gap={4}>
                <App.Icon style={{transform: `rotate(${currentCollection?.ticker?.type == 'minus' ? '0' : '180'}deg)`}} icon="caret-down" color={currentCollection?.ticker?.type == 'minus' ? '#FF1D61' : '#53F19C' } />
                <App.Text size={16} weight={500} color={currentCollection?.ticker?.type == 'minus' ? '#FF1D61' : '#53F19C' }>{ currentCollection?.ticker?.value }%</App.Text>
              </App.Flex>
            </App.Flex>
            <App.Flex column className={styles.card}>
              <App.Text color="#B9B8C5" size={10} weight={400}>24h Volume</App.Text>
              <App.Text size={16} weight={700}>{ currentCollection?.volume }</App.Text>
            </App.Flex>
            <App.Flex column className={styles.card}>
              <App.Text color="#B9B8C5" size={10} weight={400}>24h High</App.Text>
              <App.Text size={16} weight={700}>${ high }</App.Text>
            </App.Flex>
            <App.Flex column className={styles.card}>
              <App.Text color="#B9B8C5" size={10} weight={400}>24h Low</App.Text>
              <App.Text size={16} weight={700}>${ low }</App.Text>
            </App.Flex>
            <App.Flex column className={styles.card}>
              <App.Text color="#B9B8C5" size={10} weight={400}>Total Supply</App.Text>
              <App.Text size={16} weight={700}>{ currentCollection?.tokenCount }</App.Text>
            </App.Flex>
          </App.Flex>
        </App.Flex>
      </App.Flex>
    </App.Flex>
  )
}

export default CollectionInfo
