import { useTranslation } from 'react-i18next'
import cn from 'classnames'

import App from '@/components/App'

import styles from './styles.module.scss'

const PointsConsumables = () => {
  const { t } = useTranslation()

  return (
    <App.Flex column fullWidth gap={40}>
      <App.Flex row wrap gap={30}>
        <App.Flex column gap={16} className={styles.consumeBox}>
          <App.Flex className={cn(styles.consumeImage)}>
            <App.Flex center className={styles.consumeSoon}>
              <App.Text italic size={20} weight={700} family="Playfair Display" color="#9B99AE">{t('Soon')}</App.Text>
            </App.Flex>
          </App.Flex>

          <App.Flex column gap={16}>
            <App.Flex column gap={8}>
              <App.Flex height={[58, 'auto']}>
                <App.Text italic size={20} weight={700} color="#574E74" family="Playfair Display">{t('2X Points Booster')}</App.Text>
              </App.Flex>

              <App.Flex height={[120, 'auto']}>
                <App.Text color="#9B99AE">{t('Double down on your points! Activate this booster and every trade will yield twice the points for a limited time.')}</App.Text>
              </App.Flex>
            </App.Flex>

            <App.Flex center row className={styles.buy}>
              <App.Text size={16} weight={600} color="#9B99AE">{t('Buy')}</App.Text>
            </App.Flex>
          </App.Flex>
        </App.Flex>

        <App.Flex column gap={16} className={styles.consumeBox}>
          <App.Flex className={cn(styles.consumeImage)}>
            <App.Flex center className={styles.consumeSoon}>
              <App.Text italic size={20} weight={700} family="Playfair Display" color="#9B99AE">{t('Soon')}</App.Text>
            </App.Flex>
          </App.Flex>

          <App.Flex column gap={16}>
            <App.Flex column gap={8}>
              <App.Flex height={[58, 'auto']}>
                <App.Text italic size={20} weight={700} color="#574E74" family="Playfair Display">{t('AMA Session with Sid')}</App.Text>
              </App.Flex>

              <App.Flex height={[120, 'auto']}>
                <App.Text color="#9B99AE">{t('Get exclusive access to an Ask Me Anything session with Sid, Tegro’s visionary leader. Gain insights into the future of trading and have your voice heard directly at the top.')}</App.Text>
              </App.Flex>
            </App.Flex>

            <App.Flex center row className={styles.buy}>
              <App.Text size={16} weight={600} color="#9B99AE">{t('Buy')}</App.Text>
            </App.Flex>
          </App.Flex>
        </App.Flex>

        <App.Flex column gap={16} className={styles.consumeBox}>
          <App.Flex className={cn(styles.consumeImage)}>
            <App.Flex center className={styles.consumeSoon}>
              <App.Text italic size={20} weight={700} family="Playfair Display" color="#9B99AE">{t('Soon')}</App.Text>
            </App.Flex>
          </App.Flex>

          <App.Flex column gap={16}>
            <App.Flex column gap={8}>
              <App.Flex height={[58, 'auto']}>
                <App.Text italic size={20} weight={700} color="#574E74" family="Playfair Display">{t('20% Off Trading Fees')}</App.Text>
              </App.Flex>

              <App.Flex height={[120, 'auto']}>
                <App.Text color="#9B99AE">{t('Cut down on costs with a 20% fee rebate, letting you trade more for less. Apply this consumable to reduce trading fees and maximize your investment potential.')}</App.Text>
              </App.Flex>
            </App.Flex>

            <App.Flex center row className={styles.buy}>
              <App.Text size={16} weight={600} color="#9B99AE">{t('Buy')}</App.Text>
            </App.Flex>
          </App.Flex>
        </App.Flex>

        <App.Flex column gap={16} className={styles.consumeBox}>
          <App.Flex className={cn(styles.consumeImage)}>
            <App.Flex center className={styles.consumeSoon}>
              <App.Text italic size={20} weight={700} family="Playfair Display" color="#9B99AE">{t('Soon')}</App.Text>
            </App.Flex>
          </App.Flex>

          <App.Flex column gap={16}>
            <App.Flex column gap={8}>
              <App.Flex height={[58, 'auto']}>
                <App.Text italic size={20} weight={700} color="#574E74" family="Playfair Display">{t('Tegro Merch Pack')}</App.Text>
              </App.Flex>

              <App.Flex height={[120, 'auto']}>
                <App.Text color="#9B99AE">{t('Show off your trader pride with an exclusive Tegro Merch Pack. Don premium gear from your favorite trading platform and become a visible part of the Tegro community.')}</App.Text>
              </App.Flex>
            </App.Flex>

            <App.Flex center row className={styles.buy}>
              <App.Text size={16} weight={600} color="#9B99AE">{t('Buy')}</App.Text>
            </App.Flex>
          </App.Flex>
        </App.Flex>

        <App.Flex column gap={16} className={styles.consumeBox}>
          <App.Flex className={cn(styles.consumeImage)}>
            <App.Flex center className={styles.consumeSoon}>
              <App.Text italic size={20} weight={700} family="Playfair Display" color="#9B99AE">{t('Soon')}</App.Text>
            </App.Flex>
          </App.Flex>

          <App.Flex column gap={16}>
            <App.Flex column gap={8}>
              <App.Flex height={[58, 'auto']}>
                <App.Text italic size={20} weight={700} color="#574E74" family="Playfair Display">{t('Exclusive Community NFT')}</App.Text>
              </App.Flex>

              <App.Flex height={[120, 'auto']}>
                <App.Text color="#9B99AE">{t('Own a piece of Tegro’s digital heritage with an exclusive NFT. Not just a collectible but a key to additional members-only benefits within the Tegro ecosystem.')}</App.Text>
              </App.Flex>
            </App.Flex>

            <App.Flex center row className={styles.buy}>
              <App.Text size={16} weight={600} color="#9B99AE">{t('Buy')}</App.Text>
            </App.Flex>
          </App.Flex>
        </App.Flex>

        <App.Flex column gap={16} className={styles.consumeBox}>
          <App.Flex className={cn(styles.consumeImage)}>
            <App.Flex center className={styles.consumeSoon}>
              <App.Text italic size={20} weight={700} family="Playfair Display" color="#9B99AE">{t('Soon')}</App.Text>
            </App.Flex>
          </App.Flex>

          <App.Flex column gap={16}>
            <App.Flex column gap={8}>
              <App.Flex height={[58, 'auto']}>
                <App.Text italic size={20} weight={700} color="#574E74" family="Playfair Display">{t('Early Access Pass to New Features')}</App.Text>
              </App.Flex>

              <App.Flex height={[120, 'auto']}>
                <App.Text color="#9B99AE">{t('Be the first to explore upcoming features on Tegro with an Early Access Pass. Get a head-start and navigate the future of trading before anyone else.')}</App.Text>
              </App.Flex>
            </App.Flex>

            <App.Flex center row className={styles.buy}>
              <App.Text size={16} weight={600} color="#9B99AE">{t('Buy')}</App.Text>
            </App.Flex>
          </App.Flex>
        </App.Flex>

        <App.Flex column gap={16} className={styles.consumeBox}>
          <App.Flex className={cn(styles.consumeImage)}>
            <App.Flex center className={styles.consumeSoon}>
              <App.Text italic size={20} weight={700} family="Playfair Display" color="#9B99AE">{t('Soon')}</App.Text>
            </App.Flex>
          </App.Flex>

          <App.Flex column gap={16}>
            <App.Flex column gap={8}>
              <App.Flex height={[58, 'auto']}>
                <App.Text italic size={20} weight={700} color="#574E74" family="Playfair Display">{t('Unlimited API Access')}</App.Text>
              </App.Flex>

              <App.Flex height={[120, 'auto']}>
                <App.Text color="#9B99AE">{t('Elevate your trading strategy to the next level with Unlimited API Access. Enjoy the freedom to execute high-frequency trades with no rate limits, giving you the edge in the fast-paced world of crypto trading.')}</App.Text>
              </App.Flex>
            </App.Flex>

            <App.Flex center row className={styles.buy}>
              <App.Text size={16} weight={600} color="#9B99AE">{t('Buy')}</App.Text>
            </App.Flex>
          </App.Flex>
        </App.Flex>
      </App.Flex>
    </App.Flex>
  )
}

export default PointsConsumables