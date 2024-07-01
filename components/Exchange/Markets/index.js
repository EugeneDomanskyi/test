import { useState } from 'react'

import App from '@/components/App'
import MarketItem from '@/components/Exchange/Markets/MarketItem'

import styles from './styles.module.scss'

const Markets = ({ markets, onSelect, onClose }) => {
  const [search, setSearch] = useState('')

  const [sort, setSort] = useState({by: 'volume', direction: 'desc'})

  const handleSearchChange = (value) => {
    setSearch(value)
  }

  const handleClose = () => {
    if (onClose) {
      onClose()
    }
  }

  const handleSort = (by) => () => {
    const direction = by == sort.by ? (sort.direction == 'asc' ? 'desc' : 'asc') : 'desc'
    setSort({ by, direction })
  }

  const getMarkets = () => {
    const filteredMarkets = markets.filter(market => {
      return market.name.toLowerCase().includes(search.toLowerCase()) || market.address.toLowerCase().includes(search.toLowerCase())
    })

    filteredMarkets.sort((a, b) => {
      const aValue = sort.by == 'change' ? (a.ticker.value * (a.ticker.type == 'plus' ? 1 : -1)) : a[sort.by]
      const bValue = sort.by == 'change' ? (b.ticker.value * (b.ticker.type == 'plus' ? 1 : -1)) : b[sort.by]

      if (sort.direction == 'asc') {
        return aValue - bValue
      } else {
        return bValue - aValue
      }
    })

    return filteredMarkets
  }

  return (
    <App.Flex column fullWidth className={styles.container}>
      <App.Flex row gap={16} align="center" className={styles.search}>
        <App.Flex width={32} height={32} center onClick={handleClose}>
          <App.Icon icon="chevron-left2" />
        </App.Flex>

        <App.TextField
          value={search}
          type="text"
          labelFixed
          placeholder="Search"
          onChange={handleSearchChange}
          start={<App.Icon icon="search" color="#FFFFFF99" />}
          // end={search.trim() != '' && loading ? <App.Loader size={12} /> : null}
          size="small"
          variant={`search`}
          variantNotEmpty
          withClear
          autoComplete="search no-autocomplete"
          name="search no-autocomplete"
        />
      </App.Flex>

      {getMarkets().length ? (
        <App.Flex column className={styles.list}>
          <App.Flex row align="center" gap={16} className={styles.sort}>
            <App.Flex row width={100} align="center">
              <App.Text size={14} weight={600} height={1} color="#908F99">Name</App.Text>
            </App.Flex>

            <App.Flex row flex={1} align="center" justify="flex-end" gap={4} onClick={handleSort('price')}>
              <App.Text size={14} weight={600} height={1} color="#908F99">Price</App.Text>
              <App.Icon icon="caret-down" width={14} height={14} color={sort.by == 'price' ? '#A6DC37' : '#6F7C8E'} style={{transform: `rotate(${sort.by == 'price' && sort.direction == 'asc' ? '180deg' : '0deg'})`}} />
            </App.Flex>

            <App.Flex row width={80} align="center" justify="flex-end" gap={4} onClick={handleSort('change')}>
              <App.Text size={14} weight={600} height={1} color="#908F99">Change</App.Text>
              <App.Icon icon="caret-down" width={14} height={14} color={sort.by == 'change' ? '#A6DC37' : '#6F7C8E'} style={{transform: `rotate(${sort.by == 'change' && sort.direction == 'asc' ? '180deg' : '0deg'})`}} />
            </App.Flex>
          </App.Flex>

          <App.Flex column className={styles.scroll}>
            {getMarkets().map((market, index) => <MarketItem key={market.id} item={market} onSelect={onSelect} />)}
          </App.Flex>
        </App.Flex>
      ) : (
        <App.Flex center height={100}>
          {search == '' ? (
            <App.Text center>There are no markets in this chain</App.Text>
          ) : (
            <App.Text center>No results were found for your search</App.Text>
          )}
        </App.Flex>
      )}
    </App.Flex>
  )
}

export default Markets