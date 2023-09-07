import { useRef, useCallback } from 'react'
import { useSelector } from 'react-redux'
import styles from './styles.module.scss'

import App from '@/components/App'
import SectionTitle from '@/components/Market/SectionTitle'

export default function Trending() {
  const tradeForm = useRef(null)

  const handleClickOrder = useCallback(order => {
    tradeForm.current.setForm({formType: 'market', amount: order.quantity, side: order.side})
  }, [])

  return (
    <App.Flex column gap={16}>
      <SectionTitle>Trending NFTs</SectionTitle>

      <App.Flex column gap={16}>
        {
          Array.apply(null, {length: 5}).map((item, index) => {
            return (
              <App.Flex key={index} justify="space-between" align="center" gap={16}>
                <App.Flex align="center" gap={16}>
                  <App.Flex className={styles.image}>
                  </App.Flex>

                  <App.Flex column>
                    <App.Text size={16} weight={500}>Dragos</App.Text>
                    <App.Text size={12} weight={400} color="#B9B8C5">League of Kingdom</App.Text>
                    <App.Text size={12} weight={400} color="#B9B8C5">DRAGOS</App.Text>
                  </App.Flex>
                </App.Flex>

                <App.Flex column justify="flex-end">
                  <App.Text size={16} weight={500}>$21,939.98</App.Text>
                  
                  <App.Text size={12} weight={400} color="#53F19C" right>
                    <App.Icon icon="caret-up-fill" /> 3.4%
                  </App.Text>
                </App.Flex>
              </App.Flex>
            )
          })
        }
      </App.Flex>
    </App.Flex>
  )
}
