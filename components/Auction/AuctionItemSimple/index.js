import { useTranslation } from 'react-i18next'
import Image from 'next/image'
import cn from 'classnames'

import App from '@/components/App'

import styles from './styles.module.scss'

const AuctionItemSimple = ({ item, small, large }) => {
  const { t } = useTranslation()

  const percent = () => {
    return Math.round((item.marketPrice - item.currentPrice) / item.marketPrice * 100)
  }

  return (
    <App.Flex column gap={small ? 6 : large ? 16 : 12} className={cn(styles.container, {[styles.small]: small}, {[styles.large]: large})}>
      <App.Flex column justify="flex-end" className={styles.image} sx={{ backgroundImage: `url("${item.image}")` }}>
        <Image src={item.logo} width={small ? 24 : large ? 60 : 40} height={small ? 24 : 40} alt="" />
      </App.Flex>

      <App.Text center nowrap size={small ? 4 : large ? 14 : 9} weight={600} height={1}>{item.name}</App.Text>
      {large ? (
        <App.Text center nowrap size={16} weight={400} height={1} color="#FFFFFF99" sx={{textDecoration: 'line-through'}}>{item.marketPrice} {item.currency}</App.Text>
      ) : null}
      <App.Text center nowrap size={small ? 9 : large ? 24 : 16} weight={600} height={1}>{item.currentPrice} {item.currency}</App.Text>
      {large ? (
        <App.Text center uppercase nowrap size={16} weight={600} height={1} color="#53F19C">{percent()}% {t('off')}</App.Text>
      ) : null}
    </App.Flex>
  )
}

export default AuctionItemSimple