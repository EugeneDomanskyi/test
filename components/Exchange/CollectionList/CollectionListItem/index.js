import { useRouter } from 'next/router'
import { useSelector } from 'react-redux'
import Image from 'next/image'
import cn from 'classnames'

import $app from '@/store/app'
import { trackEvent } from '@/libs/analytics.lib'

import App from  '@/components/App'

import styles from './styles.module.scss'
import { memo } from 'react'

const CollectionListItem = ({ isActive, collection }) => {
  const router = useRouter()
  const blockchain = useSelector($app.get.blockchain)

  const handleClick = () => {
    trackEvent('Dex Select Asset', {
      'Network': blockchain.code.toUpperCase(),
      'Token': collection.name,
    })

    router.push(`/exchange/${collection.address}`, undefined, { scroll: false })
  }

  const TooltipText = () => (
    <App.Text color="#B9B8C5">
      This collection belongs to a verified account and has significant interest or sales. <a href="https://support.opensea.io/hc/en-us/articles/360063519133-What-is-a-verified-account-or-badged-collection-" target="_blank">Learn more</a>
    </App.Text>
  )

  return (
    <App.Flex row justify="space-between" align="center" onClick={handleClick} className={cn(styles.collection, {[styles.active]: isActive})}>
      <App.Flex row gap={8} align="center">
        {collection.image ? (
          <Image src={collection.image} priority width={72} height={72} className={styles.image} alt="" />
        ) : (
          <div style={{width: 72, height: 72}} />
        )}

        <App.Flex column sx={{ maxWidth: 170 }}>
          <App.Flex row align="center" gap={4}>
            <App.Text nowrap weight={700}>{collection.name}</App.Text>
            {collection.openseaVerificationStatus == 'verified' ? (
              <App.Tooltip text={<TooltipText />} placement="right">
                <App.Flex center width={12} height={12} sx={{ minWidth: 12 }}>
                  <App.Icon icon="check-cloud-fill" />
                </App.Flex>
              </App.Tooltip>
            ) : null}
          </App.Flex>

          <App.Text nowrap size={10} className={styles.secondaryText}>{collection.slug}</App.Text>
        </App.Flex>
      </App.Flex>
      
      <App.Flex column>
        <App.Text right>{ collection.price } { blockchain.currency }</App.Text>
        <App.Flex row align="center" justify="flex-end" gap={2}>
          <App.Icon icon="caret-down" width={10} height={10} color={collection.ticker.type == 'minus' ? '#FF1D61' : '#53F19C'} style={{transform: `rotate(${collection.ticker.type == 'plus' ? '180deg' : '0deg'})`}} />
          <App.Text size={10} color={collection.ticker.type == 'minus' ? '#FF1D61' : '#53F19C'}>{ collection.ticker.value }%</App.Text>
        </App.Flex>
      </App.Flex>

      <div className={cn(styles.glow, styles[collection.ticker.type])} />
    </App.Flex>
  )
}

const isEqual = (prevProps, nextProps) => {
  return prevProps.isActive === nextProps.isActive && JSON.stringify(prevProps.collection) === JSON.stringify(nextProps.collection)
}

export default memo(CollectionListItem, isEqual)
