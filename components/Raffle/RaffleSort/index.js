import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import cn from 'classnames'

import $raffle from '@/store/raffle'

import App from '@/components/App'

import styles from './styles.module.scss'

const RaffleSort = () => {
  const dispatch = useDispatch()
  const sort = useSelector(({ $raffle }) => $raffle.sort)

  const [dropdownShow, setDropdownShow] = useState(false)

  const sortOptions = [
    { code: 'status:asc', text: 'Featured' },
    { code: 'rewardAmount:desc', text: 'Reward: High to Low' },
    { code: 'rewardAmount:asc', text: 'Reward: Low to High' },
    { code: 'tKeyRequired:desc', text: 'TKeys Req: High to Low' },
    { code: 'tKeyRequired:asc', text: 'TKeys Req: Low to High' },
  ]

  const handleDropdownToggle = () => {
    setDropdownShow( ! dropdownShow)
  }

  const handleSortChange = (value) => () => {
    dispatch($raffle.set.sort(value))
  }

  return (
    <App.Flex column gap={8} fullWidth>
      <App.Text size={12} weight={400} height={1} color="#B9B8C5">Sort by</App.Text>

      <App.Flex className={styles.container}>
        <App.Flex column className={cn(styles.sort, {[styles.active]: dropdownShow})} onClick={handleDropdownToggle}>
          <App.Flex row align="center" justify="space-between" gap={8} className={styles.text}>
            <App.Text size={16} color="#B9B8C5">{sortOptions.find(item => item.code == sort)?.text}</App.Text>
            <App.Icon icon="chevron-down" color="#908F99" />
          </App.Flex>

          <App.Flex column className={styles.dropdown}>
            {sortOptions.map(item => (
              <App.Text key={item.code} size={16} className={cn(styles.option, {[styles.active]: sort == item.code})} onClick={handleSortChange(item.code)}>{item.text}</App.Text>
            ))}
          </App.Flex>
        </App.Flex>
      </App.Flex>
    </App.Flex>
  )
}

export default RaffleSort