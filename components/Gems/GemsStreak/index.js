import Image from 'next/image'
import cn from 'classnames'

import App from '@/components/App'

import styles from './styles.module.scss'

const GemsStreak = ({ streaks, position }) => {
  position = position > streaks.length ? streaks.length : position

  const getCurrentMultiplier = () => {
    const streak = streaks.find((streak) => streak.level == position)
    if (streak) {
      return streak.multiplier
    }

    return 1
  }

  return (
    <App.Flex column>
      <App.Flex row gap={90} className={styles.container}>
        <App.Flex column flex={1} gap={12}>
          <App.Text>Trade Daily To Win {streaks[streaks.length - 1].multiplier}X Bonus Gems!</App.Text>
        
          <App.Flex row gap={12} className={styles.tierContainer}>
            <App.Flex sx={{ paddingTop: 13 }}>
              <App.Text size={12} weight={400} height={1}>Day</App.Text>
            </App.Flex>

            <App.Flex row fullWidth align="flex-start" justify="space-between" className={styles.streakList}>
              <div className={styles.line}>
                <div className={styles.squareContainer} style={{ padding: `0 calc(${100 / (streaks.length - 1) / 2}% + 8px)` }}>
                  {streaks.slice(0, streaks.length - 1).map((streak) => {
                    const active = streak.level == position
                    return active ? (
                      <App.Flex className={styles.squareFake}>
                        <App.Flex column align="center" gap={6} className={styles.you}>
                          <Image src="/images/tiger.png" width={24} height={24} alt="" />
                          <App.Text size={12} weight={400}>You</App.Text>
                        </App.Flex>
                      </App.Flex>
                    ) : (
                      <div key={streak.id} className={styles.square} />
                    )
                  })}
                </div>
              </div>

              {streaks.map((streak, index) => {
                const active = streak.level <= position
                const maxStreak = position === streaks.length && streak.level === position
                return (
                  <div key={index} className={cn(styles.streakContainer)}>
                    {
                      maxStreak
                        ? <App.Flex column align="center" gap={12}>
                            <App.Flex className={styles.streakCircle} sx={{width: 40, height: 40}} align="center" justify="center" column>
                              <Image src="/images/tiger.png" width={28} height={28} alt="" />
                            </App.Flex>
                            <App.Flex center width={40}>
                              <App.Text center size={12} weight={400} height={1}>{streak.multiplier}x</App.Text>
                            </App.Flex>
                          </App.Flex>
                        : <App.Flex column align="center" gap={12}>
                            <div className={styles.streakCircle}>
                              <App.Flex center className={cn(styles.streakInner, {[styles.active]: active})}>
                                <App.Text size={14} weight={700} color={active ? '#fff' : '#FFFFFF99'}>{streak.level}</App.Text>
                              </App.Flex>
                            </div>
      
                            <App.Flex center width={40}>
                              <App.Text center size={12} weight={400} height={1}>{streak.multiplier}x</App.Text>
                            </App.Flex>
                          </App.Flex>
                    }
                  </div>
                )
              })}
            </App.Flex>
          </App.Flex>
        </App.Flex>

        <App.Flex column align="center" gap={8}>
          <App.Flex justify="center" className={styles.badge}>
            <App.Text center size={[18, 12]} weight={900} color="#FFD851" sx={{ textShadow: '0px 2.849px 5.697px rgba(182, 0, 0, 0.55)' }}>{getCurrentMultiplier()}X</App.Text>
          </App.Flex>

          <App.Text center size={16} weight={700} height={1} color="#FFD851">Daily Streak Bonus</App.Text>
        </App.Flex>
      </App.Flex>
      <App.Flex column className={styles.mobileContainer}>
        <App.Flex align={'center'} sx={{marginBottom: 12}}>
          <App.Text>Trade Daily To Win {streaks[streaks.length - 1].multiplier}X Bonus Gems!</App.Text>
          <App.Flex column align={'center'}>
            <App.Flex justify="center" className={styles.badge}>
              <App.Text center size={[18, 12]} weight={900} color="#FFD851" sx={{ textShadow: '0px 2.849px 5.697px rgba(182, 0, 0, 0.55)' }}>{getCurrentMultiplier()}X</App.Text>
            </App.Flex>
            <App.Text center size={16} weight={700} height={1} color="#FFD851">Daily Streak Bonus</App.Text>
          </App.Flex>
        </App.Flex>
        <App.Flex row fullWidth align="flex-start" justify="space-between" className={styles.streakList}>
          <div className={styles.line} />
          {streaks.map((streak, index) => {
            const active = streak.level <= position
            const current = streak.level == position
            return (
              <div key={index} className={cn(styles.streakContainer)}>
                {
                  current
                    ? <>
                        <Image src="/images/tiger.png" width={24} height={24} alt="" />
                        <App.Text center size={12} weight={400}>You</App.Text>
                      </>
                    : <>
                        <App.Flex column align="center" gap={8}>
                          <div className={styles.streakCircle}>
                            <App.Flex center className={cn(styles.streakInner, {[styles.active]: active})}>
                              <App.Text size={14} weight={700} color={active ? '#fff' : '#FFFFFF99'}>{streak.level}</App.Text>
                            </App.Flex>
                          </div>

                          <App.Flex center width={40}>
                            <App.Text center size={12} weight={400} height={1}>{streak.multiplier}x</App.Text>
                          </App.Flex>
                        </App.Flex>
                      </>
                }
                
                
              </div>
            )
          })}
        </App.Flex>
      </App.Flex>
    </App.Flex>
  )
}

export default GemsStreak
