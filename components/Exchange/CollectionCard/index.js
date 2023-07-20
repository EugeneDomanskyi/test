import styles from './styles.module.scss'
import Image from 'next/image'
import Link from 'next/link'
import cn from 'classnames'

import App from  '@/components/App'

const CollectionCard = ({id, address, image, name, slug, price, ticker, isActive, openseaVerificationStatus, ...rest}) => {
  return (
    <Link href={`/exchange/${address}`} scroll={false}>
      <App.Flex row justify="space-between" align="center" className={cn(styles.collection, {[styles.active]: isActive})}>
        <App.Flex row gap={8} align="center">
          {image ? (
            <Image src={image} width={72} height={72} className={styles.image} alt="" />
          ) : (
            <div style={{width: 72, height: 72}} />
          )}

          <App.Flex column sx={{ maxWidth: 170 }}>
            <App.Flex row align="center" gap={4}>
              <App.Text nowrap weight={700}>{name}</App.Text>
              {openseaVerificationStatus == 'verified' ? (
                <App.Flex center width={12} height={12} sx={{ minWidth: 12 }}>
                  <App.Icon icon="check-cloud-fill" />
                </App.Flex>
              ) : null}
            </App.Flex>

            <App.Text nowrap size={10} className={styles.secondaryText}>{slug}</App.Text>
          </App.Flex>
        </App.Flex>
        
        <App.Flex column>
          <App.Text right>${ price }</App.Text>
          <App.Flex row align="center" justify="flex-end" gap={2}>
            <App.Icon icon="caret-down" width={10} height={10} color={ticker.type == 'minus' ? '#FF1D61' : '#53F19C'} style={{transform: `rotate(${ticker.type == 'plus' ? '180deg' : '0deg'})`}} />
            <App.Text size={10} color={ticker.type == 'minus' ? '#FF1D61' : '#53F19C'}>{ ticker.value }%</App.Text>
          </App.Flex>
        </App.Flex>

        <div className={cn(styles.glow, styles[ticker.type])} />
      </App.Flex>
    </Link>
  )
}

export default CollectionCard
