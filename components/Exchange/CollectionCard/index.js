import { useRouter } from 'next/router'
import { useDispatch } from 'react-redux'
import Image from 'next/image'
import cn from 'classnames'

import $collection from '@/store/collection'

import App from  '@/components/App'

import styles from './styles.module.scss'

const CollectionCard = ({ isActive, collection }) => {
  const router = useRouter()
  const dispatch = useDispatch()

  const handleClick = () => {
    dispatch($collection.set.add(collection))
    router.push(`/exchange/${collection.address}`)
  }

  return (
    <App.Flex row justify="space-between" align="center" onClick={handleClick} className={cn(styles.collection, {[styles.active]: isActive})}>
      <App.Flex row gap={8} align="center">
        {collection.image ? (
          <Image src={collection.image} width={72} height={72} className={styles.image} alt="" />
        ) : (
          <div style={{width: 72, height: 72}} />
        )}

        <App.Flex column sx={{ maxWidth: 170 }}>
          <App.Flex row align="center" gap={4}>
            <App.Text nowrap weight={700}>{collection.name}</App.Text>
            {collection.openseaVerificationStatus == 'verified' ? (
              <App.Tooltip text="Hello There" placement="bottom-center">
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
        <App.Text right>${ collection.price }</App.Text>
        <App.Flex row align="center" justify="flex-end" gap={2}>
          <App.Icon icon="caret-down" width={10} height={10} color={collection.ticker.type == 'minus' ? '#FF1D61' : '#53F19C'} style={{transform: `rotate(${collection.ticker.type == 'plus' ? '180deg' : '0deg'})`}} />
          <App.Text size={10} color={collection.ticker.type == 'minus' ? '#FF1D61' : '#53F19C'}>{ collection.ticker.value }%</App.Text>
        </App.Flex>
      </App.Flex>

      <div className={cn(styles.glow, styles[collection.ticker.type])} />
    </App.Flex>
  )
}

export default CollectionCard
