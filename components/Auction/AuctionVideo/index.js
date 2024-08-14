import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'

import App from '@/components/App'

import styles from './styles.module.scss'

const AuctionVideo = () => {
  const { t } = useTranslation()

  const isMobile = useSelector(({ $app }) => $app.size.isMobile)

  return (
    <App.Flex row align="center" justify="space-between" className={styles.videoBox}>
      <App.Flex row align="center" gap={[16, 8]}>
        <App.Flex center className={styles.question}>
          <App.Text size={[40, 14]} weight={700} height={1}>?</App.Text>
        </App.Flex>

        {!isMobile ? (
          <App.Flex column gap={8}>
            <App.Text size={16} weight={700} height={1}>{t('Want to participate in Auctions but don’t know how?')}</App.Text>
            <App.Text size={14} weight={500} height={1}>{t('Watch our detailed guide on how to earn gems and place bids in auctions.')}</App.Text>
          </App.Flex>
        ) : (
          <App.Text size={14} weight={400} height={1.2}>{t('Want to participate in Auctions but don’t know how?')} <App.Text inline size={14} weight={700} height={1.2} color="#7364FF">{t('Watch this video guide')}</App.Text></App.Text>
        )}
      </App.Flex>
      
      {!isMobile ? (
        <App.Button primary2 outlined>{t('Watch Now')} <App.Icon icon="play-circle" /></App.Button>
      ) : null}
    </App.Flex>
  )
}

export default AuctionVideo