import { useState } from 'react'
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
    { code: 'date', text: 'Date' },
    { code: 'name', text: 'Name' },
    { code: 'prize', text: 'Prize' },
  ]

  const handleDropdownToggle = () => {
    setDropdownShow( ! dropdownShow)
  }

  const handleSortChange = (value) => () => {
    dispatch($raffle.set.sort(value))
  }

  return (
    <App.Flex className={styles.container}>
      <App.Flex column className={cn(styles.sort, {[styles.active]: dropdownShow})} onClick={handleDropdownToggle}>
        <App.Flex row align="center" justify="space-between" gap={8} className={styles.text}>
          <App.Text>Sort by: {sortOptions.find(item => item.code == sort)?.text}</App.Text>
          <App.Icon icon="chevron-down" />
        </App.Flex>

        <App.Flex column className={styles.dropdown}>
          {sortOptions.map(item => (
            <App.Text key={item.code} className={cn(styles.option, {[styles.active]: sort == item.code})} onClick={handleSortChange(item.code)}>by {item.text}</App.Text>
          ))}
        </App.Flex>
      </App.Flex>
    </App.Flex>
  )
}

export default RaffleSort