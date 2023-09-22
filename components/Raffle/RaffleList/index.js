import { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useRouter } from 'next/router'

import useWalletConnect from '@/myhooks/wallet-connect'

import $modal from '@/store/modal'
import $raffle from '@/store/raffle'

import App from '@/components/App'
import Raffle from '@/components/Raffle'

const RaffleList = ({ onUpdateUser }) => {
  const dispatch = useDispatch()
  const router = useRouter()
  const { wallet, connect, changeNetwork } = useWalletConnect()

  const campaigns = useSelector($raffle.get.filtered)
  const showModal = useSelector((state) => state.$modal.show)

  const [queryCampaignId] = router.query.segments || []

  const [tab, setTab] = useState('browse')

  const tabs = [
    { key: 'browse', title: 'Browse Raffle' },
    { key: 'my', title: 'My Raffle', disabled: ! wallet },
  ]

  const timer = useRef()

  useEffect(() => {
    if (!wallet && tab == 'my') {
      setTab('browse')
    }
  }, [wallet])

  useEffect(() => {
    if (tab == 'my' && wallet) {
      if (onUpdateUser) {
        onUpdateUser()
        timer.current = setInterval(onUpdateUser, 5000)
      }
    }

    return () => {
      clearInterval(timer.current)
    }
  }, [tab, wallet])

  useEffect(() => {
    if (queryCampaignId && campaigns.length) {
      const item = campaigns.find(campaign => campaign.id === queryCampaignId)

      if (item) {
        dispatch($modal.set.show({modal: 'Raffle/RaffleInfoModal', props: {
          size: 'large',
          item: item,
          header: {
            title: `Win your prize!`,
          },
        }}))
      }
    }
  }, [queryCampaignId, campaigns])

  useEffect(() => {
    if (! showModal) {
      router.push('/raffle', undefined, { scroll: false })
    }
  }, [showModal])

  const handleTabChange = (value) => {
    setTab(value)
  }

  const handleParticipate = async (item) => {
    const address = await connect()
    if ( ! address) {
      return
    }

    const networkCode = process.env.NEXT_PUBLIC_APP_ENV == 'local' ? 'mumbai' : 'polygon'
    const network = await changeNetwork(networkCode)
    if ( ! network) {
      return
    }

    if (item.hasOwnProperty('user') && item.user.isResolved || !item.hasOwnProperty('user')) {
      router.push(`/raffle/${item.id}`, undefined, { scroll: false })
    }
  }

  const handleShare = (item) => {
    console.log('Share Campaign Id', item.id)
  }

  return (
    <App.Container sx={{ paddingTop: '32px', paddingBottom: '32px' }}>
      <App.Flex column gap={32}>
        <App.Tabs active={tab} options={tabs} onChange={handleTabChange} />

        <App.Flex direction={['row', 'column']} gap={12} align={['flex-end', 'flex-start']} justify="space-between" height={[68, 'auto']}>
          <App.Flex fullWidth={[null, true]}>{tab == 'browse' ? <Raffle.Sort /> : null}</App.Flex>
          <App.Flex fullWidth={[null, true]}><Raffle.Search /></App.Flex>
        </App.Flex>

        <App.Flex fullWidth sx={{ minHeight: 263 }}>
          {tab == 'browse' ? (
            <Raffle.ListBrowse onParticipate={handleParticipate} onShare={handleShare} />
          ) : (
            <Raffle.ListMy onParticipate={handleParticipate} onShare={handleShare} />
          )}
        </App.Flex>
      </App.Flex>
    </App.Container>
  )
}

export default RaffleList