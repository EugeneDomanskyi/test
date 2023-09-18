import { useCallback, useState } from 'react'
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TableSortLabel } from '@mui/material'

import { usePropsHelper } from '@/myhooks/props-helper'

import App from '@/components/App'
import RaffleListMyItem from '@/components/Raffle/RaffleListMyItem'

import styles from './styles.module.scss'

const RaffleListMy = ({ all, onParticipate, onClaim, onShare }) => {
  const { isMobile } = usePropsHelper()

  const [orderBy, setOrderBy] = useState('title')
  const [order, setOrder] = useState('asc')

  const handlePageChange = (value) => {
    console.log(value)
  }

  const handleSort = useCallback((field) => () => {
    const isAsc = orderBy === field && order === 'asc'
    const newOrder = isAsc ? 'desc' : 'asc'

    if (orderBy != field) {
      setOrderBy(field)
    }

    if (order != newOrder) {
      setOrder(newOrder)
    }
  }, [order, orderBy])

  return (
    <App.Flex column sx={{ borderRadius: 12, overflow: 'hidden' }}>
      <TableContainer>
        {isMobile ? (
          <App.Text>Mobile</App.Text>
        ) : (
          <Table>
            <TableHead>
              <TableRow sx={{ '& th, & td': { border: 0 },  background: '#17142a' }}>
                <TableCell
                  align='left'
                >
                  <TableSortLabel
                    active={orderBy === 'title'}
                    direction={orderBy === 'title' ? order : 'asc'}
                    classes={{ root: styles.th, active: styles.active, icon: styles.icon }}
                    onClick={handleSort('title')}
                  >
                    Campaign Name
                  </TableSortLabel>
                </TableCell>

                <TableCell></TableCell>

                <TableCell
                  align='center'
                >
                  <TableSortLabel
                    active={orderBy === 'status'}
                    direction={orderBy === 'status' ? order : 'asc'}
                    classes={{ root: styles.th, active: styles.active, icon: styles.icon }}
                    onClick={handleSort('status')}
                  >
                    Campaign Status
                  </TableSortLabel>
                </TableCell>

                <TableCell
                  align='right'
                  sx={{ flexDirection: 'row' }}
                >
                  <TableSortLabel
                    active={orderBy === 'reward'}
                    direction={orderBy === 'reward' ? order : 'asc'}
                    classes={{ root: styles.th, active: styles.active, icon: styles.icon }}
                    onClick={handleSort('reward')}
                  >
                    Reward Won
                  </TableSortLabel>
                </TableCell>

                <TableCell
                  align='right'
                  sx={{ flexDirection: 'row' }}
                >
                  <TableSortLabel
                    active={orderBy === 'spent'}
                    direction={orderBy === 'spent' ? order : 'asc'}
                    classes={{ root: styles.th, active: styles.active, icon: styles.icon }}
                    onClick={handleSort('spent')}
                  >
                    TKeys Spent
                  </TableSortLabel>
                </TableCell>

                <TableCell sx={{ width: '10px' }}></TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {all.map(item => <RaffleListMyItem key={item.hash} item={item} onParticipate={onParticipate} onClaim={onClaim} onShare={onShare} />)}
            </TableBody>
          </Table>
        )}
      </TableContainer>

      <App.Flex center sx={{ background: '#17142a', padding: 16 }}>
        <App.Pagination page={1} count={10} onChange={handlePageChange} />
      </App.Flex>
    </App.Flex>
  )
}

export default RaffleListMy