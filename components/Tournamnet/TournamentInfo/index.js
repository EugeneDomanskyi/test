import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useRouter } from 'next/router'
import cn from 'classnames'

import useWalletConnect from '@/myhooks/wallet-connect'

import $tournament from  '@/store/tournament'

import App from '@/components/App'
import HowWorks from '@/components/Tournamnet/HowWorks'

import styles from './styles.module.scss'

const TournamentInfo = ({ tournament }) => {
  const router = useRouter()
  const { wallet, connect, connection } = useWalletConnect()

  const isMobile = useSelector(({ $app }) => $app.size.isMobile)

  const [openModal, setOpenModal] = useState(false)
  const [loading, setLoading] = useState(true)
  const [results, setResults] = useState({position: 0, points: 0, volume: 0, address: ''})

  useEffect(() => {
    if (wallet) {
      fetchResults()
    } else {
      setResults({position: 0, points: 0, volume: 0, address: ''})
    }
  }, [wallet])

  const fetchResults = async () => {
    const result = await $tournament.api.walletResult(router.query.alias, wallet)
    if (result && result?.data) {
      setResults(result.data)
    }
    setLoading(false)
  }

  const formatNumber = (number) => {
    const suffixes = ['', 'K', 'M', 'B', 'T', 'Q']
    let suffixIndex = 0
  
    while (number >= 1000 && suffixIndex < suffixes.length - 1) {
      number /= 1000
      suffixIndex++
    }
  
    return `${number.toFixed(0)}${suffixes[suffixIndex]}`
  }

  const calculateWidth = () => {
    let width = 0

    if (results?.level && tournament?.tiers?.length) {
      const value = results.volume
      const level = results.tier.level
      const currentTier = tournament.tiers.find(item => item.level == level)
      const nextTier = level < tournament.tiers.length ? tournament.tiers.find(item => item.level == level + 1) : currentTier

      const step = 100 / (tournament.tiers.length - 1)

      if (currentTier.id == nextTier.id) {
        width = 100
      } else {
        if (value > 0) {
          const rest = value - currentTier.volume_required
          const delta = nextTier.volume_required - currentTier.volume_required

          const percent = rest * step / delta
          width = step * (level - 1) + percent
        }
      }
    }
    return `${width}%`
  }

  const handleHowTo = () => {
    setOpenModal(true)
  }

  const handleConnect = () => {
    connect()
  }

  return ! connection.loading ? (
    connection.connected ? (
      <App.Flex column fullWidth gap={24}>
        <App.Flex row fullWidth gap={24}>
          <App.Frame flex={1} padding={0} radius={16} background="radial-gradient(134.18% 120.73% at 67.99% -35.17%, #231F38 0%, #100D21 100%)" gradient="linear-gradient(101.49deg, #749828 -1.14%, #674EFF 109.57%)">
            <App.Flex direction={['row', 'column']} sx={[{ padding: 12 }, { padding: '8px 12px' }]} align={['center', 'flex-start']} justify="space-between" height={[68, 'auto']}>
              <App.Text size={[16, 14]} weight={700}>Current <App.Text inline italic family="Playfair Display" size={[16, 14]} weight={700}>Position</App.Text></App.Text>
              {loading ? (
                <App.Loader size={[40, 32]} />
              ) : (
                <App.Text size={[40, 32]} weight={700}>{results.position}</App.Text>
              )}
            </App.Flex>
          </App.Frame>

          <App.Flex direction={['row', 'column']} flex={1} className={styles.pointsBox} align={['center', 'flex-start']} justify="space-between" height={[68, 'auto']}>
            <App.Text size={[16, 14]} weight={700}>Points <App.Text inline italic family="Playfair Display" size={[16, 14]} weight={700}>Earned</App.Text></App.Text>
            {loading ? (
                <App.Loader size={[40, 32]} />
              ) : (
                <App.Text size={[40, 32]} weight={700}>{results.points}</App.Text>
              )}
          </App.Flex>
        </App.Flex>

        <App.Flex column fullWidth gap={32} className={styles.tier}>
          <App.Flex row align="flex-end" gap={8}>
            <App.Text size={[24, 20]} weight={600} height={1}>Current Tier:</App.Text>
            {loading ? (
                <App.Loader size={[32, 24]} />
              ) : (
                <App.Text size={[32, 24]} weight={700} italic family="Playfair Display" color="#7364FD" height={1}>{results?.tier?.title}</App.Text>
              )}
          </App.Flex>

          <App.Flex column fullWidth gap={8}>
            <App.Flex align="center" justify="space-between">
              {tournament.tiers.map(item => (
                <App.Flex key={item.id} center className={cn(styles.tierTitle, {[styles.active]: results?.tier?.level >= item?.level})}>
                  <App.Text size={12} color={results?.tier?.level >= item?.level ? '#fff' : '#9B99AE'}>{item.title}</App.Text>
                </App.Flex>
              ))}
            </App.Flex>

            <App.Flex fullWidth height={22} center>
              <div className={styles.progressBox}>
                <div className={styles.progress} style={{ width: calculateWidth() }}>
                  <App.Flex center className={styles.progressAmount}>
                    <App.Text size={12} color="#7364FD">{formatNumber(results.volume)}</App.Text>
                  </App.Flex>
                </div>
              </div>
            </App.Flex>

            <App.Flex align="center" justify="space-between">
              {tournament.tiers.map((item, index) => (
                <React.Fragment key={item.id}>
                  <App.Flex align="center" className={cn(styles.tierDesc)}>
                    <App.Text center size={12} color="#9B99AE">{formatNumber(item.volume_required)} USDT</App.Text>
                  </App.Flex>

                  {!isMobile && index < tournament.tiers.length - 1 ? (
                    <App.Flex flex={1} align="center" justify="space-around">
                      <App.Text size={10} color="#9B99AE" height={1}>&bull;</App.Text>
                      <App.Text size={10} color="#9B99AE" height={1}>&bull;</App.Text>
                      <App.Text size={10} color="#9B99AE" height={1}>&bull;</App.Text>
                      <App.Text size={10} color="#9B99AE" height={1}>&bull;</App.Text>
                      <App.Text size={10} color="#9B99AE" height={1}>&bull;</App.Text>
                    </App.Flex>
                  ) : null}
                </React.Fragment>
              ))}
            </App.Flex>
          </App.Flex>
          
          <App.Flex direction={['row', 'column']} align={['center', 'flex-start']} justify="space-between" gap={[0, 12]}>
            <App.Flex row align="flex-end" gap={8}>
              <App.Text size={20} weight={600} height={1}>Tier <App.Text inline size={20} weight={600} italic family="Playfair Display" height={1}>Benefits:</App.Text></App.Text>
              <App.Text size={20} weight={700} italic family="Playfair Display" color="#7364FD" height={1}>x{results?.tier?.multiplier}</App.Text>
            </App.Flex>

            <App.Flex row center sx={{ cursor: 'pointer' }} onClick={handleHowTo}>
              <App.Text weight={600} color="#A6DC37">How are points calculated?</App.Text>
              <App.Icon icon="chevron-right" width={16} height={16} color="#A6DC37" />
            </App.Flex>
          </App.Flex>
        </App.Flex>

        <App.Flex align="center" justify="space-between" gap={16}>
          <App.Text weight={700} color="rgba(255, 255, 255, .6)">Want to know more about the tournaments?</App.Text>
          <a href="https://blog.tegro.com/?utm_source=homepage&utm_medium=footer&utm_campaign=testnet" target="_blank" rel="noreferrer">
            <App.ButtonGradient icon="arrow-45">Visit Blog</App.ButtonGradient>
          </a>
        </App.Flex>

        <App.Dialog hideClose hideHeader width={1000} open={openModal} onClose={() => setOpenModal(false)}>
          <HowWorks tournament={tournament} onClose={() => setOpenModal(false)} />
        </App.Dialog>
      </App.Flex>
    ) : (
      <App.Flex fullWidth justify="center" align="flex-start">
        <App.ButtonGradient onClick={handleConnect}>Connect Wallet</App.ButtonGradient>
      </App.Flex>
    )
  ) : null
}

export default TournamentInfo