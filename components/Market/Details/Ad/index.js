import { useSelector } from 'react-redux'
import styles from './styles.module.scss'

import { usePropsHelper } from '@/myhooks/props-helper'

import App from '@/components/App'

export default function Ad() {
  const { isMobile } = usePropsHelper()

  const marketInfo = useSelector(({$app}) => $app.marketInfo)

  return (
    <App.Flex className={styles.container} justify="center" align="center">
      <img src={marketInfo?.banner} className={styles.backgroundImage} alt="" />

      <div className={styles.background} />
      <App.Text size={isMobile ? 20 : 28} className={styles.text} center weight={700}>
        Trade { marketInfo.name } on Tegro!
      </App.Text>
    </App.Flex>
  )
}
