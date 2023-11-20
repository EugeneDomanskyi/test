import { memo, useRef } from 'react'
import { useRouter } from 'next/router'
import { useSelector } from 'react-redux'
import Image from 'next/image'
import cn from 'classnames'

import $app from '@/store/app'
import { trackEvent } from '@/libs/analytics.lib'

import App from  '@/components/App'

import styles from './styles.module.scss'

const getRandomColor = () => {
  const randomColor = Math.floor(Math.random()*16777215).toString(16)
  return `#${randomColor}`
}

const SidebarItem = ({ item, type, onClick, onClose }) => {
  const router = useRouter()

  const blockchain = useSelector($app.get.blockchain)
  const current = useSelector(({ $token, $collection }) => type == 'tokens' ? $token.current : $collection.current)

  const colors = useRef([getRandomColor(), getRandomColor()])

  const handleClick = () => {
    if (onClick) {
      onClick()
    } else {
      trackEvent('View Market', {
        'Base Currency': item.symbol,
        'Quote Currency': 'USDT',
        'Network': blockchain.code.toUpperCase(),
      })

      router.push(`/${type == 'nfts' ? 'nfts' : 'exchange'}/${blockchain.code}/${item.address}`, undefined, { scroll: false })

      if (onClose) {
        onClose()
      }
    }
  }

  const getSymbolForLogo = () => {
    if (item?.symbol?.length > 4) {
      return item.symbol.slice(0, 4) + '.'
    }

    return item.symbol
  }

  const TooltipText = () => (
    <App.Text size={10} color="#B9B8C5">
      This collection belongs to a verified account and has significant interest or sales. <a href="https://support.opensea.io/hc/en-us/articles/360063519133-What-is-a-verified-account-or-badged-collection-" target="_blank">Learn more</a>
    </App.Text>
  )
  
  return (
    <App.Flex row justify="space-between" align="center" onClick={handleClick} className={cn(styles.collection, {[styles.active]: (current.id == item.id)})}>
      <App.Flex row gap={4} align="center">
        {item.image ? (
          <Image src={item.image} priority width={26} height={26} className={styles.image} alt="" />
        ) : (
          <div className={styles.emptyImage} style={{background: `linear-gradient(0deg, ${colors.current[0]}, ${colors.current[1]})`}}>
            <App.Text center size={10} weight={600}>{ getSymbolForLogo() }</App.Text>
          </div>
        )}

        <App.Flex column gap={2} sx={{ maxWidth: 100 }}>
          <App.Flex row align="center" gap={4}>
            <App.Text nowrap uppercase size={12} weight={600} height={1}>{item.symbol ?? item?.slug}{type == 'tokens' ? (<App.Text inline size={10} weight={600} color="#B9B8C5">/USDT</App.Text>) : null}</App.Text>
            {item.openseaVerificationStatus == 'verified' ? (
              <App.Tooltip text={<TooltipText />} placement="right">
                <App.Flex center width={10} height={10} sx={{ minWidth: 10 }}>
                  <App.Icon icon="check-cloud-fill" />
                </App.Flex>
              </App.Tooltip>
            ) : null}
          </App.Flex>

          <App.Text nowrap size={10} height={1} color="#B9B8C5">{item.name}</App.Text>
        </App.Flex>
      </App.Flex>
      
      <App.Flex column align="flex-end" gap={2}>
        {item.price == '' ? (
          <App.Loader size={12} />
        ) : (
          <App.Text right size={12} weight={600} height={1}>{ item.price }</App.Text>
        )}
        <App.Flex row align="center" justify="flex-end" gap={2}>
          <App.Icon icon="caret-down" width={10} height={10} color={item.ticker.type == 'minus' ? '#FF1D61' : '#53F19C'} style={{transform: `rotate(${item.ticker.type == 'plus' ? '180deg' : '0deg'})`}} />
          <App.Text size={10} height={1} color={item.ticker.type == 'minus' ? '#FF1D61' : '#53F19C'}>{ item.ticker.value }%</App.Text>
        </App.Flex>
      </App.Flex>

      <div className={cn(styles.glow, styles[item.ticker.type])} />
    </App.Flex>
  )
}

const isEqual = (prevProps, nextProps) => {
  return  prevProps.item === nextProps.item
    && prevProps.type === nextProps.type
    && prevProps.onClick === nextProps.onClick
    && prevProps.onClose === nextProps.onClose
}

export default memo(SidebarItem, isEqual)
