import { useDispatch } from 'react-redux'
import { TableCell, TableRow } from '@mui/material'
import moment from 'moment'
import cn from 'classnames'

import $modal from '@/store/modal'

import App from '@/components/App'

import styles from './styles.module.scss'

const RaffleListMyItemMobile = ({ item, onParticipate, onShare }) => {
  const dispatch = useDispatch()

  const getTime = () => {
    const end = item.endTimestamp * 1000
    const current = moment().valueOf()
    const duration = moment.duration(end - current, 'milliseconds')
    return duration.humanize()
  }

  const handleInfoModalShow = () => {
    dispatch($modal.set.show({modal: 'Raffle/RaffleListMyItemModal', props: { item, onParticipate, onShare }}))
  }

  return (
    <TableRow
      sx={{ '& th, & td': { border: '0', backgroundColor: '#120f25' } }}
    >
      <TableCell>
        <App.Flex gap={8} align="center">
          {item.image ? (
            <img src={item.image} width={32} height={32} alt="" />
          ) : (
            <App.Flex className={styles.imagePlaceholder} width={32} height={32} />
          )}

          <App.Flex column>
            <App.Text>{item.title}</App.Text>
          </App.Flex>
        </App.Flex>
      </TableCell>

      <TableCell align="center">
        <App.Flex row center gap={8}>
          <App.Flex center>
            <App.Flex row align="center" gap={4} className={cn(styles.timeBadge, styles[item.status])}>
              <App.Flex center className={styles.dot} />
              <App.Text height={1}>{item.status == 'Active' ? `${getTime()} left` : item.status}</App.Text>
            </App.Flex>
          </App.Flex>

          <App.Icon icon="arrow-right" onClick={handleInfoModalShow} />
        </App.Flex>
      </TableCell>
    </TableRow>
  )
}

export default RaffleListMyItemMobile