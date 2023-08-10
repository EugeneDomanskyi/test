import { useRef, useCallback } from 'react'
import { useSelector } from 'react-redux'
import styles from './styles.module.scss'

import App from '@/components/App'

export default function Analysis() {
  const tradeForm = useRef(null)

  const handleClickOrder = useCallback(order => {
    tradeForm.current.setForm({formType: 'market', amount: order.quantity, side: order.side})
  }, [])

  return (
    <App.Flex column gap={16}>
      <App.Text size={28} weight={700}>Tegro Analysis</App.Text>

      <App.Flex className={styles.container} gap={32}>
        {
          Array.apply(null, {length: 4}).map(item => {
            return (
              <App.Flex column className={styles.analysisBlock} gap={16}>
                <App.Flex className={styles.image}>
                </App.Flex>

                <App.Text size={16} weight={500} center>Introducing Tegro Earn</App.Text>
              </App.Flex>
            )
          })
        }
      </App.Flex>
    </App.Flex>
  )
}
