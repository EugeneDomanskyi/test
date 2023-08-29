import { useSelector } from 'react-redux'
import styles from './styles.module.scss'

import { usePropsHelper } from '@/myhooks/props-helper'

import App from '@/components/App'

export default function Ad() {
  const { isMobile } = usePropsHelper()

  const { current, currentMarketSeoInfo } = useSelector(({$collection}) => $collection)

  const market = currentMarketSeoInfo?.token_metadata?.length ? currentMarketSeoInfo?.token_metadata[0] : null

  return (
    <App.Flex className={styles.container} justify="center" align="center">
      <img src={market.banner_image} className={styles.backgroundImage} alt="" />

      <App.Text size={isMobile ? 20 : 28} className={styles.text} center weight={700}>
        Trade { current.name } on Tegro! (Ad)
      </App.Text>
    </App.Flex>
  )
}
