import { useTranslation } from 'react-i18next'
import Image from 'next/image'
import cn from 'classnames'

import App from '@/components/App'

import styles from './styles.module.scss'

const AuctionItemSimple = ({ item, small, large }) => {
  const { t } = useTranslation()

  return item ? (
    <App.Flex column gap={small ? 6 : large ? 16 : 12} className={cn(styles.container, {[styles.small]: small}, {[styles.large]: large})}>
      <App.Flex column justify="flex-end" className={styles.image} sx={{ backgroundImage: `url("${item.image}")` }}>
        {item.logo ? (
          <Image src={item.logo} width={small ? 24 : large ? 60 : 40} height={small ? 24 : 40} alt="" />
        ) : null}
      </App.Flex>

      <App.Text center nowrap size={small ? 4 : large ? 14 : 9} weight={600} height={1}>{t('Buy {{title}} for', {title: item.name})}</App.Text>
      {large ? (
        <App.Text center nowrap size={16} weight={400} height={1} color="#FFFFFF99" sx={{textDecoration: 'line-through'}}>${item.marketPrice}</App.Text>
      ) : null}
      <App.Text center nowrap size={small ? 9 : large ? 24 : 16} weight={600} height={1}>{item.currentPrice} {item.token.currency}</App.Text>

      <App.Text center uppercase nowrap size={small ? 9 : large ? 24 : 16} weight={600} height={1} color="#53F19C">{item.discount}% {t('off')}</App.Text>
    </App.Flex>
  ) : null
}

export default AuctionItemSimple