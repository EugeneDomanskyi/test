import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useRouter } from 'next/router'
import moment from 'moment'

import useWalletConnect from '@/myhooks/wallet-connect'

import Amplitude from '@/libs/amplitude.lib'

import $app from '@/store/app'
import $raffle from '@/store/raffle'

import App from '@/components/App'
import Raffle from '@/components/Raffle'
import RaffleModalParticipate from '@/components/Raffle/RaffleModalParticipate'

const RaffleList = ({ loading, onUpdateUserCases, onUpdateUserTKeys, getUserTKeysBalance }) => {
  const router = useRouter()
  const { wallet, connect, changeNetwork } = useWalletConnect()

  const blockchain = useSelector($app.get.blockchain)
  const campaigns = useSelector($raffle.get.filtered)

  const [queryCampaignId] = router.query.segments || []

  const [tab, setTab] = useState('browse')
  const [campaign, setCampaign] = useState()
  const [isParticipateOpen, setIsParticipateOpen] = useState(false)
  const [modalTitle, setModalTitle] = useState('Case Details')

  const tabs = [
    { key: 'browse', title: 'Browse Cases' },
    { key: 'my', title: 'Cases History', disabled: ! wallet },
  ]

  useEffect(() => {
    if (!wallet && tab == 'my') {
      setTab('browse')
    }
  }, [wallet])

  useEffect(() => {
    if (queryCampaignId && campaigns.length) {
      const item = campaigns.find(campaign => campaign.id === queryCampaignId)
      if (item) {
        setCampaign(item)
        setIsParticipateOpen(true)
      }
    }
  }, [queryCampaignId, campaigns])

  const getTime = (item) => {
    const end = item.endTimestamp * 1000
    const current = moment().valueOf()
    const duration = moment.duration(end - current, 'milliseconds')
    return duration.humanize()
  }

  const handleUpdateTitle = (value) => {
    setModalTitle(value)
  }

  const handleParticipateClose = () => {
    handleCloseModal()
    router.push('/earn', undefined, { scroll: false })
    getUserTKeysBalance()
  }

  const handleCloseModal = () => {
    setIsParticipateOpen(false)
  }

  const handleTabChange = (value) => {
    if (value === 'my') {
      Amplitude.event('View Case History')
    }
    setTab(value)
  }

  const handleParticipate = async (item) => {
    Amplitude.event('View Case', {
      'Name': item.title,
      'Time Left': getTime(item),
      'Tkey Cost': item.tKeyRequired,
      'Case ID': item.id,
    })

    const address = await connect()
    if ( ! address) {
      return
    }

    const network = await changeNetwork(blockchain.code)
    if ( ! network) {
      return
    }

    router.push(`/earn/${item.id}`, undefined, { scroll: false })
  }

  const handleShare = (text) => {
    window.open(getTweeButtonLink(text), '_blank')
  }

  const handleMoreCases = () => {
    handleTabChange('browse')
    setIsParticipateOpen(false)
  }

  const getTweeButtonLink = (text) => {
    const url = `https://bit.ly/3M8Tkh2`

    return `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`
  }

  return (
    <App.Container sx={{ paddingTop: '32px', paddingBottom: '32px' }}>
      <App.Flex column gap={32}>
        <App.Tabs active={tab} options={tabs} onChange={handleTabChange} />

        <App.Flex direction={['row', 'column']} gap={12} align={['flex-end', 'flex-start']} justify="space-between" height={[68, 'auto']}>
          <App.Flex fullWidth={[null, true]} flex={1}>{tab == 'browse' ? <Raffle.Sort /> : null}</App.Flex>
          <App.Flex fullWidth={[null, true]}><Raffle.Search /></App.Flex>
        </App.Flex>

        <App.Flex fullWidth sx={{ minHeight: 263 }}>
          {tab == 'browse' ? (
            <Raffle.ListBrowse loading={loading} onParticipate={handleParticipate} />
          ) : (
            <Raffle.ListMy loading={loading} onMoreCases={handleMoreCases} onShare={handleShare} onUpdateUserCases={onUpdateUserCases} onUpdateUserTKeys={onUpdateUserTKeys} />
          )}
        </App.Flex>
      </App.Flex>

      <App.Dialog
        title={modalTitle}
        size="large"
        open={isParticipateOpen}
        onClose={handleParticipateClose}
      >
        <RaffleModalParticipate
          item={campaign}
          onUpdateUserTKeys={onUpdateUserTKeys}
          getUserTKeysBalance={getUserTKeysBalance}
          onUpdateUserCases={onUpdateUserCases}
          onShare={handleShare}
          onUpdateTitle={handleUpdateTitle}
          onClose={handleCloseModal}
        />
      </App.Dialog>
    </App.Container>
  )
}

export default RaffleList