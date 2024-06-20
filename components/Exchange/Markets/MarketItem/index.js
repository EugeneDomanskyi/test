import { useState } from 'react'
import Image from 'next/image'

import App from '@/components/App'

import styles from './styles.module.scss'

const MarketItem = ({ item, onSelect }) => {
  const [logo, setLogo] = useState(item.image)

  const handleSelect = () => {
    if (onSelect) {
      onSelect(item)
    }
  }

  return (
    <App.Flex row gap={16} align="center" className={styles.item} onClick={handleSelect}>
      <App.Flex row width={100} align="center" gap={8}>
        <App.Flex row center width={16} height={16}>
          {logo ? (
            <Image src={logo} width={16} height={16} alt="" onError={() => setLogo(null)} />
          ) : (
            <div className={styles.emptyImage} />
          )}
        </App.Flex>
        <App.Text size={16} weight={400} height={1}>{item.name}</App.Text>
      </App.Flex>

      <App.Flex row flex={1} align="center" justify="flex-end">
        <App.Text right size={16} weight={400} height={1}>{item.price}</App.Text>
      </App.Flex>

      <App.Flex row width={80} align="center" justify="flex-end" gap={2}>
        <App.Icon icon="caret-down" width={10} height={10} color={item.ticker.type == 'minus' ? '#FF1D61' : '#53F19C'} style={{transform: `rotate(${item.ticker.type == 'plus' ? '180deg' : '0deg'})`}} />
        <App.Text size={12} height={1} color={item.ticker.type == 'minus' ? '#FF1D61' : '#53F19C'}>{ item.ticker.value }%</App.Text>
      </App.Flex>
    </App.Flex>
  )
}

export default MarketItem