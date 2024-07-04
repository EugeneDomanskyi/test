import styles from './styles.module.scss'
import cn from 'classnames'

import App from '@/components/App'

const GemsStreak = ({streaks}) => {
  console.log(streaks)
  return (
    <div className={styles.container} style={{height: 156}}>
      <div className={styles.streakList}>
        <div className={styles.line}>
          <div className={styles.squareContainer}>
            {
              streaks.slice(0, streaks.length - 1).map((streak, index) => {
                return (
                  <div className={styles.square} />
                )
              })
            }
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
