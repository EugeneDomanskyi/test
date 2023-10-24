import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import cn from 'classnames'

import useWalletConnect from '@/myhooks/wallet-connect'

import { trackEvent } from '@/libs/analytics.lib'

import $raffle from '@/store/raffle'

import App from '@/components/App'

import styles from './styles.module.scss'

const RaffleSort = () => {
  const dispatch = useDispatch()
  const { wallet } = useWalletConnect()

  const balance = useSelector(({$raffle}) => $raffle.balance)

  const sort = useSelector(({ $raffle }) => $raffle.sort)
  const filter = useSelector(({ $raffle }) => $raffle.filter)

  const [dropdownShow, setDropdownShow] = useState()

  const sortOptions = [
    { code: 'status:asc', text: 'Featured' },
    { code: 'rewardAmount:desc', text: 'Reward: High to Low' },
    { code: 'rewardAmount:asc', text: 'Reward: Low to High' },
    { code: 'tKeyRequired:desc', text: 'TKeys Req: High to Low' },
    { code: 'tKeyRequired:asc', text: 'TKeys Req: Low to High' },
  ]

  const filterOptions = [
    { code: 'All', text: 'All' },
    { code: 'Active', text: 'Ongoing' },
    { code: 'Upcoming', text: 'Upcoming' },
    { code: 'Closed', text: 'Closed' },
  ]

  const handleDropdownToggle = (type) => () => {
    setDropdownShow(dropdownShow == type ? null : type)
  }

  const handleSortChange = (item) => () => {
    dispatch($raffle.set.sort(item.code))
  }

  const handleFilterChange = (item) => () => {
    dispatch($raffle.set.filter(item.code))
  }

  return (
    <App.Flex direction={['row', 'column']} fullWidth gap={[32, 12]}>
      <App.Flex column gap={8}>
        <App.Text size={12} weight={400} height={1} color="#B9B8C5">Sort by</App.Text>

        <App.Flex className={styles.container} width={[230, '100%']} sx={{ zIndex: 3 }}>
          <App.Flex column className={cn(styles.sort, {[styles.active]: dropdownShow == 'sort'})} onClick={handleDropdownToggle('sort')}>
            <App.Flex row align="center" justify="space-between" gap={8} className={styles.text}>
              <App.Text size={16} color="#B9B8C5">{sortOptions.find(item => item.code == sort)?.text}</App.Text>
              <App.Icon icon="chevron-down" color="#908F99" />
            </App.Flex>

            <App.Flex column className={styles.dropdown}>
              {sortOptions.map(item => (
                <App.Text key={item.code} size={16} className={cn(styles.option, {[styles.active]: sort == item.code})} onClick={handleSortChange(item)}>{item.text}</App.Text>
              ))}
            </App.Flex>
          </App.Flex>
        </App.Flex>
      </App.Flex>

      <App.Flex column gap={8}>
        <App.Text size={12} weight={400} height={1} color="#B9B8C5">Filter</App.Text>

        <App.Flex className={styles.container} width={[230, '100%']}>
          <App.Flex column className={cn(styles.sort, {[styles.active]: dropdownShow == 'filter'})} onClick={handleDropdownToggle('filter')}>
            <App.Flex row align="center" justify="space-between" gap={8} className={styles.text}>
              <App.Text size={16} color="#B9B8C5">{filterOptions.find(item => item.code == filter)?.text}</App.Text>
              <App.Icon icon="chevron-down" color="#908F99" />
            </App.Flex>

            <App.Flex column className={styles.dropdown}>
              {filterOptions.map(item => (
                <App.Text key={item.code} size={16} className={cn(styles.option, {[styles.active]: filter == item.code})} onClick={handleFilterChange(item)}>{item.text}</App.Text>
              ))}
            </App.Flex>
          </App.Flex>
        </App.Flex>
      </App.Flex>
    </App.Flex>
  )
}

export default RaffleSort