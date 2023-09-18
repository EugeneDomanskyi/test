import { TableCell, TableRow } from '@mui/material'
import cn from 'classnames'

import App from '@/components/App'

import styles from './styles.module.scss'
import Image from 'next/image'

const RaffleListMyItem = ({ item, onParticipate, onClaim, onShare }) => {
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

      <TableCell align="center">
        {item.status != 'closed' ? (
          <App.Button primary onClick={() => onParticipate(item.hash)} sx={{ minWidth: 120 }}>Participate</App.Button>
        ) : null}
      </TableCell>

      <TableCell align="center">
        <App.Flex center>
          <App.Flex row align="center" gap={8} className={cn(styles.timeBadge, styles[item.status])}>
            <App.Flex center className={styles.dot} />
            <App.Text height={1}>{item.status == 'open' ? `${item.time} Left` : 'Closed'}</App.Text>
          </App.Flex>
        </App.Flex>
      </TableCell>

      <TableCell align="right">
        <App.Flex row align="center" justify="flex-end" sx={{ padding: '0 8px' }}>
          <App.Text right>${item.reward}</App.Text>
        </App.Flex>
      </TableCell>

      <TableCell align="right">
        <App.Flex row align="center" justify="flex-end" gap={4} sx={{ padding: '0 8px' }}>
          <Image src="/images/raffle/tkey-small.png" width={12} height={17} alt="" />
          <App.Text center>{item.spent}</App.Text>
        </App.Flex>
      </TableCell>

      <TableCell align="right">
        <App.Button primary outlined onClick={() => onShare(item.hash)}>Share</App.Button>
      </TableCell>
    </TableRow>
  )
}

export default RaffleListMyItem