import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import useWagmiHelper from '@/myhooks/useWagmiHelper'

import $gem from '@/store/gem'

import App from '@/components/App'
import GemsHomeStats from '@/components/Gems/GemsHomeStats'
import GemsHomeLeaderboard from '@/components/Gems/GemsHomeLeaderboard'

import styles from './styles.module.scss'

const GemsHome = () => {
  const { wallet } = useWagmiHelper()

  const dispatch = useDispatch()
  const statsLoading = useSelector(({ $gem }) => $gem.statsLoading)

  useEffect(() => {
    fetchStats()
  }, [wallet])

  const fetchStats = async () => {
    const result = await $gem.api.stats(wallet ?? '0xF1f8ed0a5F170c0fFedf165912478A66f28aAe00', {})
    if (result) {
      dispatch($gem.set.stats(result))
    }

    dispatch($gem.set.statsLoading(false))
  }

  return (
    <App.Flex column fullWidth flex={1}>
      <App.Flex>
        {statsLoading ? (
          <App.LoaderBlock height={300} />
        ) : (
          <App.Flex column fullWidth className={styles.background}>
            <App.Container maxWidth={1230}>
              <GemsHomeStats />
              <GemsHomeLeaderboard />
            </App.Container>
          </App.Flex>
        )}
      </App.Flex>
    </App.Flex>
  )
}

export default GemsHome