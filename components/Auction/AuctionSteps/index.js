import { useTranslation } from 'react-i18next'
import cn from 'classnames'

import App from '@/components/App'

import styles from './styles.module.scss'

const AuctionSteps = () => {
  const { t } = useTranslation()

  return (
    <App.Flex column gap={8} order={[0, 1]}>
      <App.Flex direction={['row', 'column']} gap={[24, 8]}>
        <App.Flex flex={[1, null]} className={styles.box}>
          <App.Flex fullWidth height={['auto', 96]} column gap={8} className={cn(styles.boxInner, styles.notify1)}>
            <App.Text size={14} weight={600} height={1} color="#A6DC37">{t('Step {{number}}', {number: 1})}</App.Text>
            <App.Text size={[20, 16]} weight={600} height={1.2}>{t('Trade on Tegro to collect gems')}</App.Text>
          </App.Flex>
        </App.Flex>

        <App.Flex flex={[1, null]} className={styles.box}>
          <App.Flex fullWidth height={['auto', 96]} column gap={8} className={cn(styles.boxInner, styles.notify2)}>
            <App.Text size={14} weight={600} height={1} color="#A6DC37">{t('Step {{number}}', {number: 2})}</App.Text>
            <App.Text size={[20, 16]} weight={600} height={1.2}>{t('Use gems to bid on auctions')}</App.Text>
          </App.Flex>
        </App.Flex>

        <App.Flex flex={[1, null]} className={styles.box}>
          <App.Flex fullWidth height={['auto', 96]} column gap={8} className={cn(styles.boxInner, styles.notify3)}>
            <App.Text size={14} weight={600} height={1} color="#A6DC37">{t('Step {{number}}', {number: 3})}</App.Text>
            <App.Text size={[20, 16]} weight={600} height={1.2}>{t('Last person to bid wins the auction')}</App.Text>
          </App.Flex>
        </App.Flex>
      </App.Flex>

      <App.Flex justify="flex-end">
        <App.Text size={16} weight={700} height={1} color="#7E91F1" className={styles.link}><a href="https://medium.com/@TegroFi/announcing-tegro-auctions-d35c6a94c7d5" target="_blank" rel="noreferrer">{t('Learn More')}</a></App.Text>
      </App.Flex>
    </App.Flex>
  )
}

export default AuctionSteps