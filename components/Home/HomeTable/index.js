import { memo, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Image from 'next/image'
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TableSortLabel } from '@mui/material'
import numeral from 'numeral'

import useWalletConnect from '@/myhooks/wallet-connect'
import { usePropsHelper } from '@/myhooks/props-helper'
import { trackEvent } from '@/libs/analytics.lib'

import $app from '@/store/app'
import $modal from '@/store/modal'
import $collection from '@/store/collection'

import App from '@/components/App'
import SidebarSearch from '@/components/Exchange/Sidebar/SidebarSearch'
import SidebarPagination from '@/components/Exchange/Sidebar/SidebarPagination'

import styles from './styles.module.scss'

const HomeTable = () => {
  const { isMobile } = usePropsHelper()
  const { wallet, connect, scanUrl, changeNetwork } = useWalletConnect()

  const dispatch = useDispatch()
  const blockchain = useSelector($app.get.blockchain)

  const collections = useSelector(({$collection}) => $collection.all)
  const searched = useSelector(({$collection}) => $collection.searched)
  const searching = useSelector(({$collection}) => $collection.searching)
  const search = useSelector(({$collection}) => $collection.search)
  const sort = useSelector(({$collection}) => $collection.sort)
  const loading = useSelector(({$collection}) => $collection.loading)
  const pages = useSelector($collection.get.pages)

  const list = (searching) ? searched : collections
  const [orderBy, order] = sort.toLowerCase().split(':')

  const handleSort = useCallback((field) => () => {
    const isAsc = orderBy === field && order === 'asc'
    const newOrder = isAsc ? 'desc' : 'asc'
    const result = `${field}:${newOrder}`.toUpperCase()
    dispatch($collection.set.sort(result))
  }, [sort])

  const handlePage = useCallback((value) => {
    dispatch($collection.set.pages({current: value ?? 1}))
  }, [])

  const handleSwap = (collection) => async (e) => {
    e.stopPropagation()

    const address = await connect()
    if ( ! address) {
      return
    }

    const network = await changeNetwork(blockchain.code)
    if ( ! network) {
      return
    }

    dispatch($modal.set.show({modal: 'SwapModal', props: {
      collection,
      header: {
        title: `Swap`,
      },
    }}))
  }

  const handleInfo = (collection) => () => {
    dispatch($modal.set.show({modal: 'Home/HomeInfoModal', props: {
      collection,
      header: {
        image: collection.image,
      },
    }}))
  }

  return (
    <div className={styles.container}>
      <App.Container className={styles.content}>
        <App.Flex column align="flex-end" gap={16}>
          <SidebarSearch sx={{ width: 300 }} />

          <App.Flex width="100%">
            <TableContainer>
              {isMobile ? (
                <Table>
                  <TableHead>
                    <TableRow sx={{ '& th, & td': { border: 0 },  background: '#0E0B23' }}>
                      <TableCell
                        align='left'
                        sortDirection={orderBy === 'name' ? order : false}
                      >
                        <TableSortLabel
                          active={orderBy === 'name'}
                          direction={orderBy === 'name' ? order : 'asc'}
                          classes={{ root: styles.th, active: styles.active, icon: styles.icon }}
                          onClick={handleSort('name')}
                        >
                          Name
                        </TableSortLabel>
                      </TableCell>

                      <TableCell
                        align='right'
                        sortDirection={orderBy === 'price' ? order : false}
                        sx={{ width: '10px' }}
                      >
                        <TableSortLabel
                          active={orderBy === 'price'}
                          direction={orderBy === 'price' ? order : 'asc'}
                          classes={{ root: styles.th, active: styles.active, icon: styles.icon }}
                          onClick={handleSort('price')}
                        >
                          Price
                        </TableSortLabel>
                      </TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {list.map((item, index) => {
                      return (
                        <TableRow
                          key={index}
                          sx={{ '& th, & td': { border: '0', backgroundColor: '#08051C' } }}
                        >
                          <TableCell colSpan={2}>
                            <App.Flex row justify="space-between" align="center">
                              <App.Flex row gap={8} align="center">
                                <a href={scanUrl(item.address, 'address', blockchain)} target="_blank" rel="noreferrer">
                                  {item.image ? (
                                    <img src={item.image} width={42} height={42} alt="" />
                                  ) : (
                                    <App.Flex className={styles.imagePlaceholder} width={42} height={42} />
                                  )}
                                </a>

                                <App.Flex column>
                                  <App.Text height={1}>{item.name}</App.Text>

                                  <App.Flex row center gap={8}>
                                    <App.Text size={12} weight={400} height={1} color="#B9B8C5">{item.slug}</App.Text>
                                    <Image src={`/images/icon-${blockchain.code}.png`} width={24} height={24} alt="" />
                                  </App.Flex>
                                </App.Flex>
                              </App.Flex>

                              <App.Flex row center onClick={handleInfo(item)}>
                                <App.Text nowrap>{item.price ? `${numeral(item.price).format('0,0.[0000]')} ${item.currency}` : '-' }</App.Text>
                                <App.Icon icon="chevron-right" />
                              </App.Flex>
                            </App.Flex>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              ) : (
                <Table>
                  <TableHead>
                    <TableRow sx={{ '& th, & td': { border: 0 },  background: '#0E0B23' }}>
                      <TableCell
                        align='left'
                        sortDirection={orderBy === 'name' ? order : false}
                      >
                        <TableSortLabel
                          active={orderBy === 'name'}
                          direction={orderBy === 'name' ? order : 'asc'}
                          classes={{ root: styles.th, active: styles.active, icon: styles.icon }}
                          onClick={handleSort('name')}
                        >
                          Name
                        </TableSortLabel>
                      </TableCell>

                      <TableCell></TableCell>

                      <TableCell
                        align='center'
                        sortDirection={orderBy === 'price' ? order : false}
                        sx={{ width: '10px' }}
                      >
                        <TableSortLabel
                          active={orderBy === 'price'}
                          direction={orderBy === 'price' ? order : 'asc'}
                          classes={{ root: styles.th, active: styles.active, icon: styles.icon }}
                          onClick={handleSort('price')}
                        >
                          Price
                        </TableSortLabel>
                      </TableCell>

                      <TableCell
                        align='center'
                        sortDirection={orderBy === 'volume' ? order : false}
                      >
                        <TableSortLabel
                          active={orderBy === 'volume'}
                          direction={orderBy === 'volume' ? order : 'asc'}
                          classes={{ root: styles.th, active: styles.active, icon: styles.icon }}
                          onClick={handleSort('volume')}
                        >
                          24H Volume
                        </TableSortLabel>
                      </TableCell>

                      <TableCell align='center'>
                        <App.Text center weight={600} color="rgba(185, 184, 197, 0.8)">Market Cap</App.Text>
                      </TableCell>

                      <TableCell sx={{ width: '10px' }}></TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {list.map((item, index) => {
                      return (
                        <TableRow
                          key={index}
                          sx={{ '& th, & td': { border: '0', backgroundColor: '#08051C' } }}
                        >
                          <TableCell>
                            <App.Flex gap={16} align="center">
                              <a href={scanUrl(item.address, 'address', blockchain)} target="_blank" rel="noreferrer">
                                {item.image ? (
                                  <img src={item.image} width={48} height={48} alt="" />
                                ) : (
                                  <App.Flex className={styles.imagePlaceholder} width={48} height={48} />
                                )}
                              </a>

                              <App.Flex column>
                                <App.Text weight={700}>{item.name}</App.Text>
                                <App.Text size={12} weight={400} color="#B9B8C5">{item.slug}</App.Text>
                              </App.Flex>
                            </App.Flex>
                          </TableCell>

                          <TableCell align="center">
                            <Image src={`/images/icon-${blockchain.code}.png`} width={24} height={24} alt="" />
                          </TableCell>

                          <TableCell align="center">
                            <App.Text center nowrap>{item.price ? `${numeral(item.price).format('0,0.[0000]')} ${item.currency}` : '-' }</App.Text>
                          </TableCell>

                          <TableCell align="center">
                            <App.Text center>{item.volume ? `${numeral(item.volume).format('0,0.[00]')} ${blockchain.currency}` : '-'}</App.Text>
                          </TableCell>

                          <TableCell align="center">
                            <App.Text center>{item.marketCap ? `${numeral(item.marketCap).format('0,0.[00]')} ${blockchain.currency}` : '-'}</App.Text>
                          </TableCell>

                          <TableCell align="center">
                            <App.Button primary onClick={handleSwap(item)}>Swap</App.Button>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              )}
            </TableContainer>
          </App.Flex>

          {!searching ? (
            <SidebarPagination pages={pages} loading={loading} onPage={handlePage} />
          ) : null}
        </App.Flex>
      </App.Container>
    </div>
  )
}

export default memo(HomeTable, () => true)