import { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import moment from 'moment'

import useWagmiHelper from '@/myhooks/useWagmiHelper'

import $tournament from '@/store/tournament'

import App from '@/components/App'
import GemsCountdown from '@/components/Gems/GemsCountdown'

import styles from './styles.module.scss'

const GemsDropsBar = () => {
  const { t } = useTranslation()
  const { wallet } = useWagmiHelper()

  const dispatch = useDispatch()
  const isMobile = useSelector(({ $app }) => $app.size.isMobile)
  const tournament = useSelector(({ $tournament }) => $tournament.current)
  const tournaments = useSelector(({ $tournament }) => $tournament.all)
  const leaderboard = useSelector(({ $tournament }) => $tournament.leaderboard)

  const [dropsLoading, setDropsLoading] = useState(true)
  const [upcomingLoading, setUpcomingLoading] = useState(true)
  const [sliderLeft, setSliderLeft] = useState(0)

  const sliderRef = useRef(null)

  useEffect(() => {
    fetchCurrentTournament()
    fetchAllTournaments()
  }, [])

  useEffect(() => {
    setSliderLeft(0)
  }, [isMobile])

  const fetchCurrentTournament = async () => {
    const result = await $tournament.api.current()
    if (result) {
      dispatch($tournament.set.current(result))

      const temp = await $tournament.api.leaderboard(result.alias)
      if (temp) {
        dispatch($tournament.set.leaderboard(temp))
      }
    }

    setDropsLoading(false)
  }

  const fetchAllTournaments = async () => {
    const result = await $tournament.api.all()
    if (result) {
      dispatch($tournament.set.all(result.filter(item => item.status !== 'upcoming')))
    }

    setUpcomingLoading(false)
  }

  const getTodaysData = () => {
    return leaderboard.reduce((acc, value) => {
      return {
        drop: acc.drop + value.reward,
        participants: acc.participants + 1,
        gems: acc.gems + value.points,
      }
    }, { drop: 0, participants: 0, gems: 0})
  }

  const formatDate = (date) => {
    const tomorrow = moment().add(1, 'days').startOf('day');
    if (moment(date).isSame(tomorrow, 'd')) {
      return 'Tomorrow';
    } else {
      return moment(date).format('DD.MM.YY');
    }
  }

  const getReward = (rewards) => {
    return rewards.reduce((acc, value) => {
      return acc + value.reward
    }, 0)
  }

  const handleArrow = (direction) => () => {
    const slider = sliderRef.current
    const item = document.querySelector(`.${styles.sliderItem}`)

    if (slider && item) {
      const itemWidth = item.offsetWidth + 16
      const scroll = direction === 'prev' ? (sliderLeft + itemWidth) : (sliderLeft - itemWidth)

      const delta = isMobile ? 1 : 2
      const offset = scroll / itemWidth
      if (offset <= 0 && tournaments.length + offset >= delta) {
        setSliderLeft(scroll)
      }
    }
  }

  return

  return (
    <App.Flex className={styles.border}>
      <App.Container maxWidth={1230}>
        <App.Flex direction={['row', 'column']} gap={24} align={['flex-end', 'stretch']} className={styles.container}>
          <App.Flex column gap={16} flex={[65, 0]}>
            <App.Text size={20} weight={600} height={1}>{t('Today’s Metadata')}</App.Text>

            {dropsLoading ? (
              <App.LoaderBlock height={[89, 70]} />
            ) : (
              tournament ? (
                <App.Flex row gap={[24, 20]} wrap={isMobile} height={[89, 'auto']}>
                  {!isMobile || (isMobile && wallet) ? (
                    <>
                      <App.Flex column gap={8} className={styles.box}>
                        <App.Text size={[14, 12]} weight={400} height={1}>{t('Remaining time')}</App.Text>
                        <GemsCountdown hideSeconds endTime={tournament.end_time} />
                      </App.Flex>

                      <App.Flex column gap={8} className={styles.box}>
                        <App.Text size={[14, 12]} weight={400} height={1}>{t('Total drop')}</App.Text>
                        <App.Text size={[32, 24]} weight={600} height={1}>{getTodaysData().drop} <App.Text inline size={[14, 12]} weight={600}>USDT</App.Text></App.Text>
                      </App.Flex>
                    </>
                  ) : null}

                  <App.Flex column gap={8} flex={1} className={styles.box}>
                    <App.Text size={[14, 12]} weight={400} height={1}>{t('Participants')}</App.Text>
                    <App.Text size={[32, 24]} weight={600} height={1}>{getTodaysData().participants}</App.Text>
                  </App.Flex>

                  <App.Flex column gap={8} className={styles.box}>
                    <App.Text size={[14, 12]} weight={400} height={1}>{t('Total Gems Earned')}</App.Text>
                    <App.Text size={[32, 24]} weight={600} height={1}>{getTodaysData().gems}</App.Text>
                  </App.Flex>
                </App.Flex>
              ) : (
                <App.Flex center height={89}>
                  <App.Text>{t('Sorry! No active drops for now')}</App.Text>
                </App.Flex>
              )
            )}
          </App.Flex>
          
          {!isMobile || (isMobile && wallet) ? (
            <App.Flex column gap={16} flex={[35, 0]} className={styles.sliderContainer}>
              <App.Text size={20} weight={600} height={1}>{t('Upcoming Drops')}</App.Text>

              <App.Flex justify="center" className={styles.slider}>
                {tournaments.length > 2 ? (
                  <>
                    <App.Flex center className={styles.arrowLeft} onClick={handleArrow('prev')}>
                      <App.Icon icon="chevron-slider-left" />
                    </App.Flex>

                    <App.Flex center className={styles.arrowRight} onClick={handleArrow('next')}>
                      <App.Icon icon="chevron-slider-right" />
                    </App.Flex>
                  </>
                ) : null}

                {upcomingLoading ? (
                  <App.LoaderBlock height={72} />
                ) : (
                  tournaments.length ? (
                    <div ref={sliderRef} style={{ left: sliderLeft }} className={styles.sliderInner}>
                      {tournaments.map(item => (
                        <App.Flex key={item.id} column center gap={8} className={styles.sliderItem}>
                          <App.Flex gap={16} center>
                            <App.Flex className={styles.badge}>
                              <App.Text size={12} weight={400} height={1} color="#A6DC37">{t('Drop {{id}}', { id: item.id })}</App.Text>
                            </App.Flex>

                            <App.Flex className={styles.badge}>
                              <App.Text size={12} weight={400} height={1} color="#A6DC37">{formatDate(item.start_time)}</App.Text>
                            </App.Flex>
                          </App.Flex>

                          <App.Text size={[24, 20]} weight={600} height={1}>{getReward(item.rewards)} USDT</App.Text>
                        </App.Flex>
                      ))}
                    </div>
                  ) : (
                    <App.Flex center height={72}>
                      <App.Text>{t('Sorry! No upcoming drops')}</App.Text>
                    </App.Flex>
                  )
                )}
              </App.Flex>
            </App.Flex>
          ) : null}
        </App.Flex>
      </App.Container>
    </App.Flex>
  )
}

export default GemsDropsBar