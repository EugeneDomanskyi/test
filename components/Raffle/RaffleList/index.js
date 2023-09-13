import { useState } from 'react'

import App from '@/components/App'
import Raffle from '@/components/Raffle'

const RaffleList = () => {
  const [tab, setTab] = useState('browse')

  const tabs = [
    { key: 'browse', title: 'Browse Raffle' },
    { key: 'my', title: 'My Raffle' },
  ]

  const handleTabChange = (value) => {
    setTab(value)
  }

  return (
    <App.Container sx={{ padding: '32px 0' }}>
      <App.Flex column gap={32}>
        <App.Tabs active={tab} options={tabs} onChange={handleTabChange} />

        <App.Flex row align="center" justify="space-between">
          <App.Text>Sort By</App.Text>
          <App.Text>Search</App.Text>
        </App.Flex>

        {tab == 'browse' ? (
          <Raffle.ListBrowse />
        ) : (
          <Raffle.ListMy />
        )}
      </App.Flex>
    </App.Container>
  )
}

export default RaffleList