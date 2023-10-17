import { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useRouter } from 'next/router'

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
    { key: 'my', title: 'My Case Opens', disabled: ! wallet },
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

  const handleClose = () => {
    router.push('/earn', undefined, { scroll: false })
    onUpdateUserCases()
    getUserTKeysBalance()
  }

  const handleTabChange = (value) => {
    trackEvent(value === 'my' ? 'Click My Case Opens' :  'Click Browse Case', {
      'Wallet connect Status': wallet ? 'Connected' : 'Not Connected',
      'Tkeys Quantity': balance,
    })
    setTab(value)
  }

  const handleParticipate = async (item) => {
    trackEvent('Click View Case', {
      'Wallet connect Status': wallet ? 'Connected' : 'Not Connected',
      'Tkeys Quantity': balance,
      'TKeys Required': item.tKeyRequired,
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
    trackEvent('Click Search', {
      'Wallet connect Status': wallet ? 'Connected' : 'Not Connected',
      'Tkeys Quantity': balance,
      'Search Term': search,
    })
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