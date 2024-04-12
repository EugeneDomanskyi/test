import cn from 'classnames'

import App from '@/components/App'

import styles from './styles.module.scss'

const FaucetSteps = ({ step }) => {
  return (
    <App.Flex row className={styles.steps}>
      <App.Flex column center gap={8} flex={1} className={cn(styles.step, {[styles.current]: step == 1}, {[styles.past]: step > 1})}>
        <App.Flex center className={styles.dot}>
          <App.Icon icon="check" width={10} height={8} />
        </App.Flex>
        <App.Text center size={12} weight={400} className={styles.stepText}>Connect Wallet</App.Text>
      </App.Flex>

      <App.Flex column center gap={8} flex={1} className={cn(styles.step, {[styles.current]: step == 2}, {[styles.past]: step > 2})}>
        <App.Flex center className={styles.dot}>
          <App.Icon icon="check" width={10} height={8} />
        </App.Flex>
        <App.Text center size={12} weight={400} className={styles.stepText}>Claim MATIC</App.Text>
      </App.Flex>

      <App.Flex column center gap={8} flex={1} className={cn(styles.step, {[styles.current]: step == 3}, {[styles.past]: step > 3})}>
        <App.Flex center className={styles.dot}>
          <App.Icon icon="check" width={10} height={8} />
        </App.Flex>
        <App.Text center size={12} weight={400} className={styles.stepText}>Claim Token</App.Text>
      </App.Flex>
    </App.Flex>
  )
}

export default FaucetSteps