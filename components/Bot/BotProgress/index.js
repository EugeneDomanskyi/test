import App from '@/components/App'

import styles from './styles.module.scss'

const BotProgress = ({ currentValue, maxValue, steps, limit }) => {
  const progress = (currentValue / maxValue) * 100

  return (
    <App.Flex column fullWidth gap={8}>
      <App.Flex fullWidth className={styles.progress}>
        <App.Flex className={styles.inner} sx={{ width: `${progress}%` }} />

        {steps && Number(steps) > 0 ? (
          <App.Flex className={styles.steps}>
            {Array.from({ length: steps }).map((_, index) => (
              <App.Flex key={index} flex={1} className={styles.step} />
            ))}
          </App.Flex>
        ) : null}
      </App.Flex>
      
      <App.Flex row align="center" justify="space-between" gap={16}>
        {limit ? (
          <App.Text size={11} weight={400} height={1}>Min withdrawal <App.Text inline size={11} weight={700} height={1}>{maxValue} USDC</App.Text></App.Text>
        ) : (
          <App.Text size={11} weight={700} height={1}>{currentValue}/{maxValue}</App.Text>
        )}

        {limit ? (
          <App.Text inline size={11} weight={700} height={1}>{maxValue - currentValue === 0 ? 'claim ready!' : `${maxValue - currentValue} USDC remaining`}</App.Text>
        ) : null}
      </App.Flex>
    </App.Flex>
  )
}

export default BotProgress