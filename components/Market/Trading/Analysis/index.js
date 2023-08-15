import { useRef, useCallback } from 'react'
import { useSelector } from 'react-redux'
import styles from './styles.module.scss'

import App from '@/components/App'
import SectionTitle from '@/components/Market/SectionTitle'

export default function Analysis() {
  const tradeForm = useRef(null)

  const handleClickOrder = useCallback(order => {
    tradeForm.current.setForm({formType: 'market', amount: order.quantity, side: order.side})
  }, [])

  return (
    <App.Flex column gap={16}>
      <SectionTitle>Tegro Analysis</SectionTitle>

      <App.Flex className={styles.container}>
        {
          Array.apply(null, {length: 4}).map(item => {
            return (
              <App.Flex column className={styles.analysisBlock}>
                <App.Flex className={styles.image}>
                </App.Flex>

                <App.Text className={styles.text}>Introducing Tegro Earn</App.Text>
              </App.Flex>
            )
          })
        }
      </App.Flex>
    </App.Flex>
  )
}
