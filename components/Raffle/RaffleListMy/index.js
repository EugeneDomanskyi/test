import { useCallback, useEffect, useState, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TableSortLabel } from '@mui/material'

import { usePropsHelper } from '@/myhooks/props-helper'

import $raffle from '@/store/raffle'

import App from '@/components/App'
import RaffleListMyItem from '@/components/Raffle/RaffleListMyItem'
import RaffleListMyItemMobile from '@/components/Raffle/RaffleListMyItemMobile'

import styles from './styles.module.scss'

const RaffleListMy = ({ loading, onParticipate, onShare, onUpdateUserCases, onUpdateUserTKeys }) => {
  const { isMobile } = usePropsHelper()

  const dispatch = useDispatch()
  const campaigns = useSelector($raffle.get.filtered)
  const campaign = useSelector($raffle.get.campaign)
  const participants = useSelector(({$raffle}) => $raffle.participants)
  const page = useSelector(({ $raffle }) => $raffle.page)

  const [orderBy, setOrderBy] = useState('participatedTimestamp')
  const [order, setOrder] = useState('desc')

  const [pagesCount, setPagesCount] = useState(1)
  const perPage = 10

  const timer = useRef()

  useEffect(() => {
    if (onUpdateUserCases) {
      onUpdateUserCases(true)
    }
  }, [])

  useEffect(() => {
    if (participatedCampaigns().length) {
      const count = Math.ceil(participatedCampaigns().length / perPage)
      setPagesCount(count)

      if (page > count) {
        dispatch($raffle.set.page(count))
      }

      const processings = participatedCampaigns().filter(item => item.status == 'Processing')
      if (processings.length) {
        timer.current = setInterval(() => {
          const processings = participatedCampaigns().filter(item => item.status == 'Processing')
          if (processings.length) {
            onUpdateUserCases(true)
          } else {
            clearInterval(timer.current)
          }
        }, 10000)
      }
    } else {
      setPagesCount(1)
    }

    return () => {
      clearInterval(timer.current)
    }
  }, [campaigns])

  const participatedCampaigns = () => {
    const newCampaigns = participants.map(item => {
      return {
        ...item,
        campaign: campaign(item.campaign.id)
      }
    })

    const statusOrder = {
      Processing: 1,
      Success: 2,
      Failed: 3,
    }

    newCampaigns.sort((a, b) => {
      if (orderBy == 'status') {
        return order == 'asc' ? statusOrder[a.status] - statusOrder[b.status] : statusOrder[b.status] - statusOrder[a.status]
      }

      if (orderBy == 'title') {
        const aTitle = a.campaign.title.toLowerCase()
        const bTitle = b.campaign.title.toLowerCase()

        if (order == 'asc') {
          return aTitle < bTitle ? -1 : (aTitle > bTitle ? 1 : 0)
        } else {
          return aTitle < bTitle ? 1 : (aTitle > bTitle ? -1 : 0)
        }
      }
      
      return order == 'asc' ? a[orderBy] - b[orderBy] : b[orderBy] - a[orderBy]
    })

    return newCampaigns
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
                        <App.Text weight={600} color="rgba(185, 184, 197, 0.8)">#</App.Text>
                      </TableCell>

                      <TableCell
                        align='left'
                      >
                        <TableSortLabel
                          active={orderBy === 'title'}
                          direction={orderBy === 'title' ? order : 'asc'}
                          classes={{ root: styles.th, active: styles.active, icon: styles.icon }}
                          onClick={handleSort('title')}
                        >
                          <App.Text weight={600} color="rgba(185, 184, 197, 0.8)">Campaign</App.Text>
                        </TableSortLabel>
                      </TableCell>

                      <TableCell
                        align='right'
                      >
                        <TableSortLabel
                          active={orderBy === 'rewardAmount'}
                          direction={orderBy === 'rewardAmount' ? order : 'asc'}
                          classes={{ root: styles.th, active: styles.active, icon: styles.icon }}
                          onClick={handleSort('rewardAmount')}
                        >
                          <App.Text weight={600} color="rgba(185, 184, 197, 0.8)">Reward</App.Text>
                        </TableSortLabel>
                      </TableCell>

                      <TableCell sx={{ width: 10, padding: 0 }}></TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {participatedCampaigns().slice((page - 1) * perPage, page * perPage).map((item, index) => <RaffleListMyItemMobile key={item.id} item={item} number={(page - 1) * perPage + (index + 1)} onParticipate={onParticipate} onShare={onShare} />)}
                  </TableBody>
                </Table>
              ) : (
                <Table>
                  <TableHead>
                    <TableRow sx={{ '& th, & td': { border: 0 },  background: '#17142a' }}>
                      <TableCell
                        align='left'
                      >
                        <App.Text weight={600} color="rgba(185, 184, 197, 0.8)">#</App.Text>
                      </TableCell>

                      <TableCell
                        align='left'
                      >
                        <TableSortLabel
                          active={orderBy === 'participatedTimestamp'}
                          direction={orderBy === 'participatedTimestamp' ? order : 'asc'}
                          classes={{ root: styles.th, active: styles.active, icon: styles.icon }}
                          onClick={handleSort('participatedTimestamp')}
                        >
                          <App.Text weight={600} color="rgba(185, 184, 197, 0.8)">Date</App.Text>
                        </TableSortLabel>
                      </TableCell>

                      <TableCell
                        align='left'
                      >
                        <TableSortLabel
                          active={orderBy === 'title'}
                          direction={orderBy === 'title' ? order : 'asc'}
                          classes={{ root: styles.th, active: styles.active, icon: styles.icon }}
                          onClick={handleSort('title')}
                        >
                          <App.Text weight={600} color="rgba(185, 184, 197, 0.8)">Cases</App.Text>
                        </TableSortLabel>
                      </TableCell>

                      <TableCell
                        align='left'
                      >
                        <App.Text weight={600} color="rgba(185, 184, 197, 0.8)">Blockchain Hash</App.Text>
                      </TableCell>

                      <TableCell
                        align='left'
                      >
                        <TableSortLabel
                          active={orderBy === 'rewardAmount'}
                          direction={orderBy === 'rewardAmount' ? order : 'asc'}
                          classes={{ root: styles.th, active: styles.active, icon: styles.icon }}
                          onClick={handleSort('rewardAmount')}
                        >
                          <App.Text weight={600} color="rgba(185, 184, 197, 0.8)">Reward</App.Text>
                        </TableSortLabel>
                      </TableCell>

                      <TableCell
                        align='left'
                      >
                        <TableSortLabel
                          active={orderBy === 'status'}
                          direction={orderBy === 'status' ? order : 'asc'}
                          classes={{ root: styles.th, active: styles.active, icon: styles.icon }}
                          onClick={handleSort('status')}
                        >
                          <App.Text weight={600} color="rgba(185, 184, 197, 0.8)">Status</App.Text>
                        </TableSortLabel>
                      </TableCell>

                      <TableCell
                        align='left'
                      >
                        <TableSortLabel
                          active={orderBy === 'tKeysCount'}
                          direction={orderBy === 'tKeysCount' ? order : 'asc'}
                          classes={{ root: styles.th, active: styles.active, icon: styles.icon }}
                          onClick={handleSort('tKeysCount')}
                        >
                          <App.Text weight={600} color="rgba(185, 184, 197, 0.8)">TKeys burnt</App.Text>
                        </TableSortLabel>
                      </TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {participatedCampaigns().slice((page - 1) * perPage, page * perPage).map((item, index) => <RaffleListMyItem key={item.id} item={item} number={(page - 1) * perPage + (index + 1)} onParticipate={onParticipate} onShare={onShare} />)}
                  </TableBody>
                </Table>
              )}
            </TableContainer>
          ) : (
            <App.Flex center height={300}>
              <App.Text>There are no cases yet</App.Text>
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