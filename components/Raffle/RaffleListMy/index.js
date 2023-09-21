import { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TableSortLabel } from '@mui/material'

import { usePropsHelper } from '@/myhooks/props-helper'

import $raffle from '@/store/raffle'

import App from '@/components/App'
import RaffleListMyItem from '@/components/Raffle/RaffleListMyItem'

import styles from './styles.module.scss'

const RaffleListMy = ({ onParticipate, onClaim, onShare }) => {
  const { isMobile } = usePropsHelper()

  const dispatch = useDispatch()
  const campaigns = useSelector($raffle.get.filtered)
  const page = useSelector(({ $raffle }) => $raffle.page)

  const [orderBy, setOrderBy] = useState('title')
  const [order, setOrder] = useState('asc')

  const [pagesCount, setPagesCount] = useState(1)
  const perPage = 10

  useEffect(() => {
    if (participatedCampaigns().length) {
      const count = Math.ceil(participatedCampaigns().length / perPage)
      setPagesCount(count)

      if (page > count) {
        dispatch($raffle.set.page(count))
      }
    } else {
      setPagesCount(1)
    }
  }, [campaigns])

  const participatedCampaigns = () => {
    return campaigns.filter(item => item.hasOwnProperty('user'))
  }

  const handlePageChange = (value) => {
    dispatch($raffle.set.page(value))
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
    <App.Flex column sx={{ borderRadius: 12, overflow: 'hidden' }} fullWidth>
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
              {participatedCampaigns().map(item => <RaffleListMyItem key={item.id} item={item} onParticipate={onParticipate} onClaim={onClaim} onShare={onShare} />)}
            </TableBody>
          </Table>
        )}
      </TableContainer>

      <App.Flex center sx={{ background: '#17142a', padding: 16 }}>
        <App.Pagination page={page} count={pagesCount} onChange={handlePageChange} />
      </App.Flex>
    </App.Flex>
  )
}

export default RaffleListMy