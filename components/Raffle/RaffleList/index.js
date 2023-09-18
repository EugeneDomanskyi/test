import { useEffect, useState } from 'react'

import useWalletConnect from '@/myhooks/wallet-connect'

import App from '@/components/App'
import Raffle from '@/components/Raffle'
import { TRUE } from 'sass'

const RaffleList = () => {
  const { wallet } = useWalletConnect()
  const [tab, setTab] = useState('browse')

  const tabs = [
    { key: 'browse', title: 'Browse Raffle' },
    { key: 'my', title: 'My Raffle', disabled: ! wallet },
  ]

  const all = [
    { id: 1, hash: 1, status: 'open', time: '2w', keys: 3, title: 'Win upto 100 USDT Reward', rewardMax: 2345, rewardDist: 60, image: '/images/raffle/usdt.png', reward: 161.52, spent: 30, claim: false, },
    { id: 2, hash: 2, status: 'closed', time: '0', keys: 3, title: 'Win upto 100 USDT Reward', rewardMax: 2345, rewardDist: 2345, image: '/images/raffle/usdt.png', reward: 161.52, spent: 30, claim: false, },
    { id: 3, hash: 3, status: 'open', time: '2w', keys: 3, title: 'Win upto 100 USDT Reward', rewardMax: 2345, rewardDist: 60, image: '/images/raffle/usdt.png', reward: 161.52, spent: 30, claim: true, },
    { id: 4, hash: 4, status: 'open', time: '2w', keys: 3, title: 'Win upto 100 USDT Reward', rewardMax: 2345, rewardDist: 60, image: '/images/raffle/usdt.png', reward: 161.52, spent: 30, claim: false, },
    { id: 5, hash: 5, status: 'open', time: '2w', keys: 3, title: 'Win upto 100 USDT Reward', rewardMax: 2345, rewardDist: 60, image: '/images/raffle/usdt.png', reward: 161.52, spent: 30, claim: false, },
    { id: 6, hash: 6, status: 'open', time: '2w', keys: 3, title: 'Win upto 100 USDT Reward', rewardMax: 2345, rewardDist: 60, image: '/images/raffle/usdt.png', reward: 161.52, spent: 30, claim: true, },
    { id: 7, hash: 7, status: 'open', time: '2w', keys: 3, title: 'Win upto 100 USDT Reward', rewardMax: 2345, rewardDist: 60, image: '/images/raffle/usdt.png', reward: 161.52, spent: 30, claim: false, },
    { id: 8, hash: 8, status: 'closed', time: '0', keys: 3, title: 'Win upto 100 USDT Reward', rewardMax: 2345, rewardDist: 2345, image: '/images/raffle/usdt.png', reward: 161.52, spent: 30, claim: false, },
    { id: 9, hash: 9, status: 'open', time: '2w', keys: 3, title: 'Win upto 100 USDT Reward', rewardMax: 2345, rewardDist: 60, image: '/images/raffle/usdt.png', reward: 161.52, spent: 30, claim: false, },
    { id: 10, hash: 10, status: 'closed', time: '0', keys: 3, title: 'Win upto 100 USDT Reward', rewardMax: 2345, rewardDist: 2345, image: '/images/raffle/usdt.png', reward: 161.52, spent: 30, claim: false, },
    { id: 11, hash: 11, status: 'open', time: '2w', keys: 3, title: 'Win upto 100 USDT Reward', rewardMax: 2345, rewardDist: 60, image: '/images/raffle/usdt.png', reward: 161.52, spent: 30, claim: true, },
    { id: 12, hash: 12, status: 'open', time: '2w', keys: 3, title: 'Win upto 100 USDT Reward', rewardMax: 2345, rewardDist: 60, image: '/images/raffle/usdt.png', reward: 161.52, spent: 30, claim: false, },
  ]

  useEffect(() => {
    if (!wallet && tab == 'my') {
      setTab('browse')
    }
  }, [wallet])

  const handleTabChange = (value) => {
    setTab(value)
  }

  const handleParticipate = (hash) => {
    console.log('Participate', hash)
  }

  const handleClaim = (hash) => {
    console.log('Claim', hash)
  }

  const handleShare = (hash) => {
    console.log('Share', hash)
  }

  return (
    <App.Container sx={{ paddingTop: '32px', paddingBottom: '32px' }}>
      <App.Flex column gap={32}>
        <App.Tabs active={tab} options={tabs} onChange={handleTabChange} />

        <App.Flex direction={['row', 'column']} gap={12} align={['center', 'flex-start']} justify="space-between">
          <App.Flex order={[1, 2]}><Raffle.Sort /></App.Flex>
          <App.Flex order={[2, 1]} fullWidth={[null, true]}><Raffle.Search /></App.Flex>
        </App.Flex>

        {tab == 'browse' ? (
          <Raffle.ListBrowse all={all} onParticipate={handleParticipate} onClaim={handleClaim} onShare={handleShare} />
        ) : (
          <Raffle.ListMy all={all} onParticipate={handleParticipate} onClaim={handleClaim} onShare={handleShare} />
        )}
      </App.Flex>
    </App.Container>
  )
}

export default RaffleList