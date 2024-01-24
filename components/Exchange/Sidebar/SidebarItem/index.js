import { memo, useRef, useState } from 'react'
import { useRouter } from 'next/router'
import { useDispatch, useSelector } from 'react-redux'
import Image from 'next/image'
import cn from 'classnames'

import Amplitude from '@/libs/amplitude.lib'

import $app from '@/store/app'
import $token from '@/store/token'

import App from  '@/components/App'

import styles from './styles.module.scss'

const getRandomColor = () => {
  const randomColor = Math.floor(Math.random()*16777215).toString(16)
  return `#${randomColor}`
}

const SidebarItem = ({ item, version }) => {
  const router = useRouter()

  const dispatch = useDispatch()
  const blockchain = useSelector($app.get.blockchain)
  const current = useSelector(({ $token }) => $token.current)

  const [image, setImage] = useState(item.image)

  const colors = useRef([getRandomColor(), getRandomColor()])

  const handleClick = () => {
    Amplitude.event('View Market', {
      'Base Currency': item.symbol,
      'Quote Currency': item.quoteSymbol,
      'Network': blockchain.code.toUpperCase(),
    })

    dispatch($token.set.current(item))
    router.push(`/exchange/${blockchain.code}/${item.address}`, undefined, { scroll: false })
  }

  const getSymbolForLogo = () => {
    if (item?.symbol?.length > 4) {
      return item.symbol.slice(0, 4) + '.'
    }

    return item.symbol
  }
  
  return (
    <App.Flex row justify="space-between" align="center" onClick={handleClick} className={cn(styles.market, styles.version, {[styles.active]: (current.id == item.id)})}>
      <App.Flex row gap={4} align="center">
        {image ? (
          <Image src={image} priority onError={() => setImage(null)} width={version == 'mobile' ? 30 : 26} height={version == 'mobile' ? 30 : 26} className={styles.image} alt="" />
        ) : (
          <div className={styles.emptyImage} style={{background: `linear-gradient(0deg, ${colors.current[0]}, ${colors.current[1]})`}}>
            <App.Text center size={10} weight={600}>{ getSymbolForLogo() }</App.Text>
          </div>
        )}

        <App.Flex column gap={2} sx={{ maxWidth: version == 'mobile' ? 210 : 110 }}>
          <App.Flex row align="center" gap={4}>
            <App.Text nowrap uppercase size={[12, 16]} weight={600} height={1}>{item.name}</App.Text>
          </App.Flex>
        </App.Flex>
      </App.Flex>
      
      <App.Flex column align="flex-end" gap={2}>
        <App.Text right size={[12, 16]} weight={600} height={1}>{ item.price }</App.Text>
        <App.Flex row align="center" justify="flex-end" gap={2}>
          <App.Icon icon="caret-down" width={10} height={10} color={item.ticker.type == 'minus' ? '#FF1D61' : '#53F19C'} style={{transform: `rotate(${item.ticker.type == 'plus' ? '180deg' : '0deg'})`}} />
          <App.Text size={[10, 12]} height={1} color={item.ticker.type == 'minus' ? '#FF1D61' : '#53F19C'}>{ item.ticker.value }%</App.Text>
        </App.Flex>
      </App.Flex>

      <div className={cn(styles.glow, styles[item.ticker.type])} />
    </App.Flex>
  )
}

const isEqual = (prevProps, nextProps) => {
  return prevProps.item === nextProps.item
    && prevProps.version === nextProps.version
}

export default memo(SidebarItem, isEqual)
