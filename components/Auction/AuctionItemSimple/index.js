import { useTranslation } from 'react-i18next'
import Image from 'next/image'
import cn from 'classnames'

import App from '@/components/App'

import styles from './styles.module.scss'

const AuctionItemSimple = ({ item, small, large }) => {
  const { t } = useTranslation()

  return (
    <App.Flex column gap={small ? 6 : large ? 16 : 12} className={cn(styles.container, {[styles.small]: small}, {[styles.large]: large})}>
      {item ? (
        <>
          <App.Flex column justify="flex-end" className={styles.image} sx={{ backgroundImage: `url("${item.image}")` }}>
          </App.Flex>

          <App.Text center nowrap size={small ? 9 : 14} weight={600} height={1}>{t('Buy {{title}} for', {title: item.name})}</App.Text>
          {large && item.marketPrice ? (
            <App.Text center nowrap size={16} weight={400} height={1} color="#FFFFFF99" sx={{textDecoration: 'line-through'}}>${item.marketPrice}</App.Text>
          ) : null}
          <App.Text center nowrap size={small ? 16 : 24} weight={600} height={1}>{item.currentPrice} {item.token.currency}</App.Text>
        </>
      ) : null}
    </App.Flex>
  )
}

export default AuctionItemSimple