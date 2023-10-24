import { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useRouter } from 'next/router'
import moment from 'moment'

import useWalletConnect from '@/myhooks/wallet-connect'

import { trackEvent } from '@/libs/analytics.lib'

import $app from '@/store/app'
import $modal from '@/store/modal'
import $raffle from '@/store/raffle'

import App from '@/components/App'
import Raffle from '@/components/Raffle'

const RaffleList = ({ loading, onUpdateUserCases, onUpdateUserTKeys, getUserTKeysBalance }) => {
  const dispatch = useDispatch()
  const router = useRouter()
  const { wallet, connect, changeNetwork } = useWalletConnect()

  const blockchain = useSelector($app.get.blockchain)
  const campaigns = useSelector($raffle.get.filtered)
  const balance = useSelector(({$raffle}) => $raffle.balance)

  const [queryCampaignId] = router.query.segments || []

  const [tab, setTab] = useState('browse')

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
        dispatch($modal.set.show({modal: 'Raffle/RaffleModalParticipate', props: {
          size: 'large',
          item: item,
          onUpdateUserTKeys,
          getUserTKeysBalance,
          onUpdateUserCases,
          onShare: handleShare,
          onTop: true,
          onClose: handleClose,
          header: {
            title: `Case Details`,
          },
        }}))
      }
    }
  }, [queryCampaignId, campaigns])

  const getTime = (item) => {
    const end = item.endTimestamp * 1000
    const current = moment().valueOf()
    const duration = moment.duration(end - current, 'milliseconds')
    return duration.humanize()
  }

  const handleClose = () => {
    router.push('/earn', undefined, { scroll: false })
    getUserTKeysBalance()
  }

  const handleTabChange = (value) => {
    if (value === 'my') {
      trackEvent('View Case History')
    }
    setTab(value)
  }

  const handleParticipate = async (item) => {
    trackEvent('View Case', {
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
    dispatch($modal.set.close())
  }

  const getTweeButtonLink = (text) => {
    const url = `${window.location.origin}/earn`
    
    return `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`
  }

  const handleSearch = (search) => {
    // trackEvent('Click Search', {
    //   'Wallet connect Status': wallet ? 'Connected' : 'Not Connected',
    //   'Tkeys Quantity': balance,
    //   'Search Term': search,
    // })
  }

  return (
    <App.Container sx={{ paddingTop: '32px', paddingBottom: '32px' }}>
      <App.Flex column gap={32}>
        <App.Tabs active={tab} options={tabs} onChange={handleTabChange} />

        <App.Flex direction={['row', 'column']} gap={12} align={['flex-end', 'flex-start']} justify="space-between" height={[68, 'auto']}>
          <App.Flex fullWidth={[null, true]} flex={1}>{tab == 'browse' ? <Raffle.Sort /> : null}</App.Flex>
          <App.Flex fullWidth={[null, true]}><Raffle.Search onSearch={handleSearch} /></App.Flex>
        </App.Flex>

        <App.Flex fullWidth sx={{ minHeight: 263 }}>
          {tab == 'browse' ? (
            <Raffle.ListBrowse loading={loading} onParticipate={handleParticipate} />
          ) : (
            <Raffle.ListMy loading={loading} onMoreCases={handleMoreCases} onShare={handleShare} onUpdateUserCases={onUpdateUserCases} onUpdateUserTKeys={onUpdateUserTKeys} />
          )}
        </App.Flex>
      </App.Flex>
    </App.Container>
  )
}

export default RaffleList