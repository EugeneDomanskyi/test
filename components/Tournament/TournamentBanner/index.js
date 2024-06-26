import { useDispatch, useSelector } from 'react-redux'

import Amplitude from '@/libs/amplitude.lib'

import $token from '@/store/token'

import App from 'components/App'

import styles from './styles.module.scss'

const TournamentBanner = ({ tournament }) => {
  const dispatch = useDispatch()
  const isMobile = useSelector(({ $app }) => $app.size.isMobile)

  const handleExchange = (tournament) => () => {
    Amplitude.event(`Tournament Trade ${tournament.name}`, {
      'Page': Amplitude.page(),
    })

    dispatch($token.set.current({}))
    router.push(`/exchange/base/${tournament.bonus_contract}`)
  }

  const getPool = (rewards) => {
    let pool = 0
    rewards.forEach(reward => {
      pool += reward.reward
    })
    return pool.toLocaleString('en-US')
  }

  return isMobile ? (
    <App.Flex column fullWidth gap={16} align="flex-start" className={styles.bannerMobile} onClick={handleExchange(tournament)}>
      <App.Flex column gap={4}>
        <App.Text uppercase size={24} weight={900} height={1} gradient="radial-gradient(193.17% 113.6% at 96.29% 4.49%, #FFF6A3 0%, #FFF066 34.61%, #FFCB45 68.83%, #FFBD13 100%)">{getPool(tournament.rewards)} ${tournament.currency}</App.Text>
        <App.Text size={16} weight={700} height={1} gradient="radial-gradient(193.17% 113.6% at 96.29% 4.49%, #FFF6A3 0%, #FFF066 34.61%, #FFCB45 68.83%, #FFBD13 100%)">In Rewards!</App.Text>
      </App.Flex>

      <App.Text size={14} weight={900} height={1} gradient="linear-gradient(180deg, #FFF 0%, #C7C7C7 100%)">$1 = 1 Points</App.Text>

      <App.Button primary2 small>Trade Now</App.Button>
    </App.Flex>
  ) : (
    <App.Flex direction={['row', 'column']} gap={24} className={styles.banner} align={['center', 'flex-start']} justify="space-between" onClick={handleExchange(tournament)}>
      <App.Flex column gap={8}>
        <App.Text uppercase size={36} weight={900} height={1} gradient="radial-gradient(193.17% 113.6% at 96.29% 4.49%, #FFF6A3 0%, #FFF066 34.61%, #FFCB45 68.83%, #FFBD13 100%)">{getPool(tournament.rewards)} ${tournament.currency}</App.Text>
        <App.Text uppercase size={16} weight={600} height={1} gradient="radial-gradient(193.17% 113.6% at 96.29% 4.49%, #FFF6A3 0%, #FFF066 34.61%, #FFCB45 68.83%, #FFBD13 100%)">in rewards!</App.Text>
      </App.Flex>

      <App.Flex column gap={8}>
        <App.Flex row gap={[16, 8]}>
          <App.Flex row center gap={[12, 8]}>
            <App.Text size={[34, 22]} weight={900} height={1} gradient="radial-gradient(193.17% 113.6% at 96.29% 4.49%, #FFF6A3 0%, #FFF066 34.61%, #FFCB45 68.83%, #FFBD13 100%)">1</App.Text>

            <App.Flex column gap={2}>
              <App.Text uppercase size={[16, 12]} weight={900} height={1}>Trade</App.Text>
              <App.Text size={[12, 9]} weight={500} height={1}>${tournament.currency}</App.Text>
            </App.Flex>
          </App.Flex>

          <App.Flex row center gap={[12, 8]}>
            <App.Text size={[34, 22]} weight={900} height={1} gradient="radial-gradient(193.17% 113.6% at 96.29% 4.49%, #FFF6A3 0%, #FFF066 34.61%, #FFCB45 68.83%, #FFBD13 100%)">2</App.Text>

            <App.Flex column gap={2}>
              <App.Text uppercase size={[16, 12]} weight={900} height={1}>Collect</App.Text>
              <App.Text size={[12, 9]} weight={500} height={1}>POINTS</App.Text>
            </App.Flex>
          </App.Flex>

          <App.Flex row center gap={[12, 8]}>
            <App.Text size={[34, 22]} weight={900} height={1} gradient="radial-gradient(193.17% 113.6% at 96.29% 4.49%, #FFF6A3 0%, #FFF066 34.61%, #FFCB45 68.83%, #FFBD13 100%)">3</App.Text>

            <App.Flex column gap={2}>
              <App.Text uppercase size={[16, 12]} weight={900} height={1}>Climb</App.Text>
              <App.Text size={[12, 9]} weight={500} height={1}>Leaderboard</App.Text>
            </App.Flex>
          </App.Flex>

          <App.Flex row center gap={[12, 8]}>
            <App.Text size={[34, 22]} weight={900} height={1} gradient="radial-gradient(193.17% 113.6% at 96.29% 4.49%, #FFF6A3 0%, #FFF066 34.61%, #FFCB45 68.83%, #FFBD13 100%)">4</App.Text>

            <App.Flex column gap={2}>
              <App.Text uppercase size={[16, 12]} weight={900} height={1}>Win</App.Text>
              <App.Text size={[12, 9]} weight={500} height={1}>${tournament.currency}</App.Text>
            </App.Flex>
          </App.Flex>
        </App.Flex>

        <App.Text uppercase size={[16, 14]} weight={900} height={1} gradient="linear-gradient(180deg, #FFF 0%, #C7C7C7 100%)">Collect 1 POINT for every $1 traded!</App.Text>
      </App.Flex>
    </App.Flex>
  )
}

export default TournamentBanner