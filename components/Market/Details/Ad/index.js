import { useSelector } from 'react-redux'
import styles from './styles.module.scss'

import { usePropsHelper } from '@/myhooks/props-helper'

import App from '@/components/App'

export default function Ad() {
  const { isMobile } = usePropsHelper()

  const { current, marketInfo } = useSelector(({$collection}) => $collection)

  return (
    <App.Flex className={styles.container} justify="center" align="center">
      <img src={marketInfo?.banner} className={styles.backgroundImage} alt="" />

      <App.Text size={isMobile ? 20 : 28} className={styles.text} center weight={700}>
        Trade { current.name } on Tegro! (Ad)
      </App.Text>
    </App.Flex>
  )
}
