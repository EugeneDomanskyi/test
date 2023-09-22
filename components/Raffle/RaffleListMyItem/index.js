import Image from 'next/image'
import { TableCell, TableRow } from '@mui/material'
import moment from 'moment'
import cn from 'classnames'

import App from '@/components/App'

import styles from './styles.module.scss'

const RaffleListMyItem = ({ item, onParticipate, onShare }) => {
  const getTime = () => {
    const end = item.endTimestamp * 1000
    const current = moment().valueOf()
    const duration = moment.duration(end - current, 'milliseconds')
    return duration.humanize()
  }

  return (
    <TableRow
      sx={{ '& th, & td': { border: '0', backgroundColor: '#120f25' } }}
    >
      <TableCell>
        <App.Flex gap={8} align="center">
          {item.image ? (
            <img src={item.image} width={48} height={48} alt="" />
          ) : (
            <App.Flex className={styles.imagePlaceholder} width={48} height={48} />
          )}

          <App.Flex column>
            <App.Text size={16}>{item.title}</App.Text>
          </App.Flex>
        </App.Flex>
      </TableCell>

      <TableCell align="center" sx={{ width: 10 }}>
        {item.status == 'Active' ? (
          <>
            {item?.user?.isResolved ? (
              <App.Button primary onClick={() => onParticipate(item)}>Play Again</App.Button>
            ) : (
              <App.Tooltip variant="gray" text="You need to wait till your current mystery box has been opened" placement="top">
                <App.Button variant="gray" disabled>Play Again</App.Button>
              </App.Tooltip>
            )}
          </>
        ) : null}
      </TableCell>

      <TableCell align="center">
        <App.Flex center>
          <App.Flex row align="center" gap={8} className={cn(styles.timeBadge, styles[item.status])}>
            <App.Flex center className={styles.dot} />
            <App.Text height={1}>{item.status == 'Active' ? `${getTime()} left` : item.status}</App.Text>
          </App.Flex>
        </App.Flex>
      </TableCell>

      <TableCell align="right">
        <App.Flex row align="center" justify="flex-end" sx={{ padding: '0 8px' }}>
          <App.Text right>${item?.user?.totalEarned ?? 0}</App.Text>
        </App.Flex>
      </TableCell>

      <TableCell align="right">
        <App.Flex row align="center" justify="flex-end" gap={4} sx={{ padding: '0 8px' }}>
          <Image src="/images/raffle/tkey-small.png" width={12} height={17} alt="" />
          <App.Text center>{item?.user?.tKeysSpent ?? 0}</App.Text>
        </App.Flex>
      </TableCell>

      <TableCell align="right">
        {item.status == 'Active' ? (
          <App.Button primary outlined onClick={() => onShare(item)}>
            Share on
            <App.Icon icon="x" />
          </App.Button>
        ) : null}
      </TableCell>
    </TableRow>
  )
}

export default RaffleListMyItem