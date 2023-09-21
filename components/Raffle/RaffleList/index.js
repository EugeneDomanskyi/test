import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'

import useWalletConnect from '@/myhooks/wallet-connect'

import $modal from '@/store/modal'

import App from '@/components/App'
import Raffle from '@/components/Raffle'

const RaffleList = () => {
  const dispatch = useDispatch()
  const { wallet } = useWalletConnect()
  const [tab, setTab] = useState('browse')

  const tabs = [
    { key: 'browse', title: 'Browse Raffle' },
    { key: 'my', title: 'My Raffle', disabled: ! wallet },
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

  const handleClick = (item) => {
    console.log('Click', item)

    dispatch($modal.set.show({modal: 'Raffle/RaffleInfoModal', props: {
      size: 'large',
      item: item,
      header: {
        title: `Win your prize!`,
      },
    }}))
  }

  const handleShare = (hash) => {
    console.log('Share', hash)
  }

  return (
    <App.Container sx={{ paddingTop: '32px', paddingBottom: '32px' }}>
      <App.Flex column gap={32}>
        <App.Tabs active={tab} options={tabs} onChange={handleTabChange} />

        <App.Flex direction={['row', 'column']} gap={12} align={['flex-end', 'flex-start']} justify="space-between">
          <App.Flex fullWidth={[null, true]}><Raffle.Sort /></App.Flex>
          <App.Flex fullWidth={[null, true]}><Raffle.Search /></App.Flex>
        </App.Flex>

        <App.Flex fullWidth sx={{ minHeight: 263 }}>
          {tab == 'browse' ? (
            <Raffle.ListBrowse onParticipate={handleParticipate} onClick={handleClick} onShare={handleShare} />
          ) : (
            <Raffle.ListMy onParticipate={handleParticipate} onClick={handleClick} onShare={handleShare} />
          )}
        </App.Flex>
      </App.Flex>
    </App.Container>
  )
}

export default RaffleList