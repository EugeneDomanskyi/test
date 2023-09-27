import { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TableSortLabel } from '@mui/material'

import { usePropsHelper } from '@/myhooks/props-helper'

import $raffle from '@/store/raffle'

import App from '@/components/App'
import RaffleListMyItem from '@/components/Raffle/RaffleListMyItem'
import RaffleListMyItemMobile from '@/components/Raffle/RaffleListMyItemMobile'

import styles from './styles.module.scss'

const RaffleListMy = ({ loading, onParticipate, onShare }) => {
  const { isMobile } = usePropsHelper()

  const dispatch = useDispatch()
  const campaigns = useSelector($raffle.get.filtered)
  const page = useSelector(({ $raffle }) => $raffle.page)

  const [orderBy, setOrderBy] = useState('status')
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
    const newCampaigns = [...campaigns]
    const statusOrder = {
      Active: 1,
      Upcoming: 2,
      Closed: 3,
    }

    newCampaigns.sort((a, b) => {
      if (orderBy == 'status') {
        return order == 'asc' ? statusOrder[a.status] - statusOrder[b.status] : statusOrder[b.status] - statusOrder[a.status]
      }

      if (orderBy == 'title') {
        const aTitle = a.title.toLowerCase()
        const bTitle = b.title.toLowerCase()

        if (order == 'asc') {
          return aTitle < bTitle ? -1 : (aTitle > bTitle ? 1 : 0)
        } else {
          return aTitle < bTitle ? 1 : (aTitle > bTitle ? -1 : 0)
        }
      }
      
      if (a.hasOwnProperty('user') && b.hasOwnProperty('user')) {
        return order == 'asc' ? a.user[orderBy] - b.user[orderBy] : b.user[orderBy] - a.user[orderBy]
      }

      return 0
    })

    return newCampaigns.filter(item => item.hasOwnProperty('user'))
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
      {loading ? (
        <App.LoaderBlock />
      ) : (
        <>
          {participatedCampaigns().length ? (
            <TableContainer>
              {isMobile ? (
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
                          Campaign
                        </TableSortLabel>
                      </TableCell>

                      <TableCell
                        align='right'
                      >
                        <TableSortLabel
                          active={orderBy === 'status'}
                          direction={orderBy === 'status' ? order : 'asc'}
                          classes={{ root: styles.th, active: styles.active, icon: styles.icon }}
                          onClick={handleSort('status')}
                        >
                          Status
                        </TableSortLabel>
                      </TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {participatedCampaigns().map(item => <RaffleListMyItemMobile key={item.id} item={item} onParticipate={onParticipate} onShare={onShare} />)}
                  </TableBody>
                </Table>
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
                          active={orderBy === 'totalEarned'}
                          direction={orderBy === 'totalEarned' ? order : 'asc'}
                          classes={{ root: styles.th, active: styles.active, icon: styles.icon }}
                          onClick={handleSort('totalEarned')}
                        >
                          Reward Won
                        </TableSortLabel>
                      </TableCell>

                      <TableCell
                        align='right'
                        sx={{ flexDirection: 'row' }}
                      >
                        <TableSortLabel
                          active={orderBy === 'totalTKeysSpent'}
                          direction={orderBy === 'totalTKeysSpent' ? order : 'asc'}
                          classes={{ root: styles.th, active: styles.active, icon: styles.icon }}
                          onClick={handleSort('totalTKeysSpent')}
                        >
                          TKeys Spent
                        </TableSortLabel>
                      </TableCell>

                      <TableCell sx={{ width: '10px' }}></TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {participatedCampaigns().map(item => <RaffleListMyItem key={item.id} item={item} onParticipate={onParticipate} onShare={onShare} />)}
                  </TableBody>
                </Table>
              )}
            </TableContainer>
          ) : (
            <App.Flex center height={300}>
              <App.Text>There are no campaigns yet</App.Text>
            </App.Flex>
          )}
        </>
      )}

      <App.Flex center sx={{ background: '#17142a', padding: 16 }}>
        <App.Pagination page={page} count={pagesCount} onChange={handlePageChange} />
      </App.Flex>
    </App.Flex>
  )
}

export default RaffleListMy