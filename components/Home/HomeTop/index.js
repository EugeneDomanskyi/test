import { memo } from 'react'

import App from '@/components/App'

import styles from './styles.module.scss'

const HomeTop = () => {
  return (
    <div className={styles.container}>
      <App.Container className={styles.content}>
        <div className={styles.rectangle} />

        <App.Flex column gap={[24, 16]} align="center" sx={[{ padding: 60 }, { padding: 0 }]}>
          <App.Text center size={48} weight={700} height={1} gradient="linear-gradient(91.7deg, #E792E4 2.92%, #B545BE 49.32%, #7931CB 119.02%, #4D42C9 138.71%)">
            Bulk Buy & Sell at the best price
          </App.Text>
        </App.Flex>
      </App.Container>
    </div>
  )
}

export default memo(HomeTop, () => true)