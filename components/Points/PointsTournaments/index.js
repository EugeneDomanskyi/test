import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useRouter } from 'next/router'
import { useTranslation } from 'react-i18next'
import moment from 'moment'
import cn from 'classnames'

import $tournament from '@/store/tournament'

import App from '@/components/App'
import TournamentCountdown from '@/components/Tournament/TournamentCountdown'

import styles from './styles.module.scss'

const PointsTournaments = () => {
  const { t } = useTranslation()
  const router = useRouter()

  const dispatch = useDispatch()
  const all = useSelector(({ $tournament }) => $tournament.all)

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTournaments()
  }, [])

  const fetchTournaments = async () => {
    const result = await $tournament.api.all()
    if (result?.data) {
      dispatch($tournament.set.all(result.data))
    }
    setLoading(false)
  }

  const getStatus = (status) => {
    switch (status) {
      case 'ongoing': return t('On-Going')
      case 'upcoming': return t('Upcoming')
      case 'closed': return t('Closed')
      default: return t('Unknown')
    }
  }

  const getTimer = (status) => {
    switch (status) {
      case 'ongoing': return t('Ends in:')
      case 'upcoming': return t('Starts in:')
      case 'closed': return t('Time since close:')
      default: return t('Unknown')
    }
  }

  const handleTournament = (alias) => () => {
    router.push(`/points-dashboard/tournament/${alias}`)
  }

  return (
    <App.Flex fullWidth column gap={32}>
      <App.Flex fullWidth column gap={12}>
        <App.Text size={24}>{t('Trading Tournaments')}</App.Text>
        <App.Text color="#9B99AE">{t('Conquer trading battles, stack points, and unlock your loot! Glory awaits.')}</App.Text>
      </App.Flex>

      <App.Flex row wrap fullWidth gap={24}>
        {loading ? (
          <App.LoaderBlock height={300} />
        ) : (
          all.map(item => {
            const status = item.status === 'active' ? (moment().isAfter(item.start_time) ? 'ongoing' : 'upcoming') : 'closed'
            const pool = item.rewards.reduce((acc, reward) => {
              return acc + reward?.reward
            }, 0)
            return (
              <App.Frame key={item.id} padding={24} radius={16} background="url('/images/points/tournament-box-background.png') center top / cover no-repeat" gradient={status == 'ongoing' ? 'linear-gradient(101.49deg, #749828 -1.14%, #674EFF 109.57%)' : '#FFFFFF1A'} className={styles.item} onClick={handleTournament(item.alias)}>
                <App.Flex fullWidth column gap={12}>
                  <App.Flex fullWidth row align="center" justify="space-between" gap={12}>
                    <App.Text nowrap size={24} weight={700}>{item.title}</App.Text>

                    <App.Flex center className={cn(styles.badge, styles[status])}>
                      <App.Text nowrap uppercase size={12} weight={700}>{getStatus(status)}</App.Text>
                    </App.Flex>
                  </App.Flex>

                  <App.Flex fullWidth row align="center" justify="space-between" gap={12}>
                    <App.Flex column gap={8}>
                      <App.Text size={12} color="#9B99AE">{getTimer(status)}</App.Text>
                      <TournamentCountdown small alternate={status == 'closed'} color={status == 'closed' ? '#9B99AE' : '#A6DC37'} hideSeconds endTime={item[status != 'upcoming' ? 'end_time' : 'start_time']} />
                    </App.Flex>

                    <App.Frame width={130} padding={12} radius={14} background="#0B091566" gradient={status == 'ongoing' ? 'linear-gradient(101.49deg, #749828 -1.14%, #674EFF 109.57%)' : '#FFFFFF1A'}>
                      <App.Flex column>
                        <App.Text weight={700}>{t('Points in')}<br /><App.Text inline italic family="Playfair Display" weight={700} color={status == 'closed' ? '#9B99AE' : '#A6DC37'}>{t('Reward Pool')}</App.Text>:</App.Text>
                        <App.Text size={28} weight={700}>{pool}</App.Text>
                      </App.Flex>
                    </App.Frame>
                  </App.Flex>
                </App.Flex>
              </App.Frame>
            )
          })
        )}
      </App.Flex>
    </App.Flex>
  )
}

export default PointsTournaments