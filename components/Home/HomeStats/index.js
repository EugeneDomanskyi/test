import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import moment from 'moment'
import cn from 'classnames'

import $app from '@/store/app'

import App from '@/components/App'

import styles from './styles.module.scss'

const HomeStats = () => {
  const isMobile = useSelector(({ $app }) => $app.size.isMobile)

  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({ day: 0, volume: 0, created: 0, gas: 0, settled: 0, cancelled: 0 })

  const date = moment().startOf('day').format('MMM DD, hh:mm A')

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    let newStats = {...stats}
    const result = await $app.api.stats()
    if (result) {
      newStats = result
    }

    setStats(newStats)
    setLoading(false)
  }

  const formatNumber = (number) => {
    const suffixes = ['', 'K', 'M', 'B', 'T', 'Q']
    let suffixIndex = 0
  
    while (number >= 1000 && suffixIndex < suffixes.length - 1) {
      number /= 1000
      suffixIndex++
    }
  
    return `${number.toFixed(1)}${suffixes[suffixIndex]}`
  }

  return (
    <App.Container maxWidth={1200}>
      <App.Flex fullWidth column gap={64}>
        <App.Flex center column gap={10}>
          <App.Text tag="h2" size={80} weight={800} height={1}>CEX Speed, <App.Text inline italic size={80} weight={700} family="Playfair Display" color="#A6DC37">DEX Trust</App.Text></App.Text>
          <App.Text size={16} color="#FFFFFF99" height={1}>Enjoy the best of both worlds!</App.Text>
        </App.Flex>

        <App.Flex column fullWidth gap={24}>
          <App.Flex row gap={24}>
            <App.Flex flex={1} className={styles.box}>
              <App.Flex fullWidth column className={cn(styles.inner, styles.inner1)}>
                <App.Text size={24} weight={600}>Efficient Orderbooks</App.Text>
                <App.Text size={16} color="#FFFFFF99">Trade with tighter market spreads, rivaling a CEX.</App.Text>
              </App.Flex>
            </App.Flex>

            <App.Flex column flex={1} gap={24}>
              <App.Flex flex={1} className={styles.box}>
                <App.Flex full className={cn(styles.inner, styles.inner2)}>
                  Test
                </App.Flex>
              </App.Flex>

              <App.Flex flex={1} className={styles.box}>
                <App.Flex full className={cn(styles.inner, styles.inner3)}>
                  Test
                </App.Flex>
              </App.Flex>
            </App.Flex>
          </App.Flex>
        </App.Flex>
      </App.Flex>
    </App.Container>
  )
}

export default HomeStats