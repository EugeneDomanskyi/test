import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import moment from 'moment'

import $tournament from '@/store/tournament'

import App from '@/components/App'
import PointsCountdown from '@/components/Points/PointsCountdown'

import styles from './styles.module.scss'

const PointsDropsBar = () => {
  const { t } = useTranslation()

  const dispatch = useDispatch()
  const tournament = useSelector(({ $tournament }) => $tournament.current)
  const tournaments = useSelector(({ $tournament }) => $tournament.all)
  const leaderboard = useSelector(({ $tournament }) => $tournament.leaderboard)

  const [dropsLoading, setDropsLoading] = useState(true)
  const [upcomingLoading, setUpcomingLoading] = useState(true)

  useEffect(() => {
    fetchCurrentTournament()
    fetchAllTournaments()
  }, [])

  const fetchCurrentTournament = async () => {
    const result = await $tournament.api.current()
    if (result && result?.data) {
      dispatch($tournament.set.current(result.data))

      const temp = await $tournament.api.leaderboard(result.data.alias)
      if (temp && temp?.data) {
        dispatch($tournament.set.leaderboard(temp.data))
      }
    }

    setDropsLoading(false)
  }

  const fetchAllTournaments = async () => {
    const result = await $tournament.api.all()
    if (result && result?.data) {
      dispatch($tournament.set.all(result.data.filter(item => item.status === 'upcoming')))
    }

    setUpcomingLoading(false)
  }

  const getTodaysData = () => {
    return leaderboard.reduce((acc, value) => {
      return {
        drop: acc.drop + value.reward,
        participants: acc.participants + 1,
        points: acc.points + value.points,
      }
    }, { drop: 0, participants: 0, points: 0})
  }

  return (
    <App.Flex className={styles.border}>
      <App.Container maxWidth={1230}>
        <App.Flex row gap={24} align="flex-end" className={styles.container}>
          <App.Flex column gap={16} flex={65}>
            <App.Text size={20} weight={600} height={1}>{t('Today’s Metadata')}</App.Text>

            {dropsLoading ? (
              <App.LoaderBlock height={89} />
            ) : (
              tournament ? (
                <App.Flex row gap={24} height={89}>
                  <App.Flex column gap={8} className={styles.box}>
                    <App.Text size={14} weight={400} height={1}>{t('Remaining time')}</App.Text>
                    <PointsCountdown hideSeconds endTime={tournament.end_time} />
                  </App.Flex>

                  <App.Flex column gap={8} className={styles.box}>
                    <App.Text size={14} weight={400} height={1}>{t('Total drop')}</App.Text>
                    <App.Text size={32} weight={600} height={1}>{getTodaysData().drop} <App.Text inline weight={600}>USDT</App.Text></App.Text>
                  </App.Flex>

                  <App.Flex column gap={8} flex={1} className={styles.box}>
                    <App.Text size={14} weight={400} height={1}>{t('Participants')}</App.Text>
                    <App.Text size={32} weight={600} height={1}>{getTodaysData().participants}</App.Text>
                  </App.Flex>

                  <App.Flex column gap={8} className={styles.box}>
                    <App.Text size={14} weight={400} height={1}>{t('Total Points Earned')}</App.Text>
                    <App.Text size={32} weight={600} height={1}>{getTodaysData().points}</App.Text>
                  </App.Flex>
                </App.Flex>
              ) : (
                <App.Flex center height={89}>
                  <App.Text>{t('Sorry! No active drops for now')}</App.Text>
                </App.Flex>
              )
            )}
          </App.Flex>

          <App.Flex column gap={16} flex={35} className={styles.sliderContainer}>
            <App.Text size={20} weight={600} height={1}>{t('Upcoming Drops')}</App.Text>

            <App.Flex justify="center" className={styles.slider}>
              {tournaments.length > 2 ? (
                <>
                  <App.Flex center className={styles.arrowLeft}>
                    <App.Icon icon="chevron-slider-left" />
                  </App.Flex>

                  <App.Flex center className={styles.arrowRight}>
                    <App.Icon icon="chevron-slider-right" />
                  </App.Flex>
                </>
              ) : null}

              {upcomingLoading ? (
                <App.LoaderBlock height={72} />
              ) : (
                tournaments.length ? (
                  <App.Flex gap={16} className={styles.sliderInner}>
                    <App.Flex column center gap={8} className={styles.sliderItem}>
                      <App.Flex gap={16} center>
                        <App.Flex className={styles.badge}>
                          <App.Text size={12} weight={400} height={1} color="#A6DC37">Drop 2</App.Text>
                        </App.Flex>

                        <App.Flex className={styles.badge}>
                          <App.Text size={12} weight={400} height={1} color="#A6DC37">Tomorrow</App.Text>
                        </App.Flex>
                      </App.Flex>

                      <App.Text size={24} weight={600} height={1}>1250 USDT</App.Text>
                    </App.Flex>

                    <App.Flex column center gap={8} className={styles.sliderItem}>
                      <App.Flex gap={16} center>
                        <App.Flex className={styles.badge}>
                          <App.Text size={12} weight={400} height={1} color="#A6DC37">Drop 3</App.Text>
                        </App.Flex>

                        <App.Flex className={styles.badge}>
                          <App.Text size={12} weight={400} height={1} color="#A6DC37">22.09.24</App.Text>
                        </App.Flex>
                      </App.Flex>

                      <App.Text size={24} weight={600} height={1}>1250 USDT</App.Text>
                    </App.Flex>

                    <App.Flex column center gap={8} className={styles.sliderItem}>
                      <App.Flex gap={16} center>
                        <App.Flex className={styles.badge}>
                          <App.Text size={12} weight={400} height={1} color="#A6DC37">Drop 4</App.Text>
                        </App.Flex>

                        <App.Flex className={styles.badge}>
                          <App.Text size={12} weight={400} height={1} color="#A6DC37">22.09.24</App.Text>
                        </App.Flex>
                      </App.Flex>

                      <App.Text size={24} weight={600} height={1}>1250 USDT</App.Text>
                    </App.Flex>
                  </App.Flex>
                ) : (
                  <App.Flex center height={72}>
                    <App.Text>{t('Sorry! No upcoming drops')}</App.Text>
                  </App.Flex>
                )
              )}
            </App.Flex>
          </App.Flex>
        </App.Flex>
      </App.Container>
    </App.Flex>
  )
}

export default PointsDropsBar