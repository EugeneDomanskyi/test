import styles from './styles.module.scss'
import cn from 'classnames'

import App from '@/components/App'

const GemsStreak = ({ streaks, position }) => {
  console.log(position)
  return (
    <div className={styles.container} style={{height: 156}}>
      <div className={styles.streakList}>
        <div className={styles.line}>
          <div className={styles.squareContainer} style={{ padding: `0 calc(${100 / (streaks.length - 1) / 2}% + 8px)` }}>
            {streaks.slice(0, streaks.length - 1).map((streak) => {
              return position == streak.level ? (
                <App.Flex column>
                  <App.Text>You</App.Text>
                </App.Flex>
              ) : (
                <div key={streak.id} className={styles.square} />
              )
            })}
          </div>
        </div>

        {
          streaks.map((streak, index) => {
            return (
              <div key={index} className={cn(styles.streakContainer)}>
                <div className={styles.streakCircle}>
                  <div className={styles.streakInner}>
                    <App.Text>{streak.level}</App.Text>
                  </div>
                </div>
              </div>
            )
          })
        }
      </div>
    </div>
  )
}

export default GemsStreak
