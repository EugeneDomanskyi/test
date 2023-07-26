import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useRouter } from 'next/router'
import Image from 'next/image'
import { Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TableSortLabel } from '@mui/material'
import numeral from 'numeral'
import cn from 'classnames'

import useWalletConnect from '@/myhooks/wallet-connect'
import { usePropsHelper } from '@/myhooks/props-helper'
import { trackEvent } from '@/libs/analytics.lib'

import $app from '@/store/app'
import $modal from '@/store/modal'

import App from '@/components/App'

import styles from './styles.module.scss'

const HomeTable = () => {
  const { isMobile } = usePropsHelper()
  const { wallet, connect, scanUrl, changeNetwork } = useWalletConnect()

  const dispatch = useDispatch()
  const blockchain = useSelector($app.get.blockchain)
  const { all: collections } = useSelector(({ $collection }) => $collection)

  const [order, setOrder] = useState('desc')
  const [orderBy, setOrderBy] = useState('volume')
  const [tab, setTab] = useState('trade')

  const tabs = [
    { key: 'trade', title: 'Trade' },
    { key: 'earn', title: 'Earn', variant: 'glow' },
  ]

  const handleSort = (field) => () => {
    const isAsc = orderBy === field && order === 'asc'
    setOrder(isAsc ? 'desc' : 'asc')
    setOrderBy(field)
  }

  const sortedTokens = () => {
    return stableSort(collections, getComparator(order, orderBy))
  }

  const stableSort = (array, comparator) => {
    const stabilizedThis = array.map((el, index) => [el, index])
    stabilizedThis.sort((a, b) => {
      const order = comparator(a[0], b[0])
      if (order !== 0) {
        return order
      }

      return a[1] - b[1]
    })

    return stabilizedThis.map((el) => el[0])
  }
  

  const getComparator = (order, orderBy) => {
    return order === 'desc' ? (a, b) => descendingComparator(a, b, orderBy) : (a, b) => -descendingComparator(a, b, orderBy);
  }

  const descendingComparator = (a, b, orderBy) => {
    if (b[orderBy] < a[orderBy]) {
      return -1
    }

    if (b[orderBy] > a[orderBy]) {
      return 1
    }

    return 0
  }

  const handleSwap = (collection) => async (e) => {
    e.stopPropagation()

    trackEvent('Dex Swap Clicked', {
      'Token': collection.name,
      'Wallet connect Status': wallet ? 'Connected' : 'Not Connected',
    })

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

  const handleTrade = (collection) => async (e) => {
    e.stopPropagation()

    trackEvent('Dex Trade Clicked', {
      'Token': collection.name,
      'Wallet connect Status': wallet ? 'Connected' : 'Not Connected',
    })

    const address = await connect()
    if ( ! address) {
      return
    }

    dispatch($modal.set.show({modal: 'TradeModal', props: {
      collection,
      header: {
        title: `Trade`,
      },
      size: 'small',
    }}))
  }

  const handleBuy = (collection) => async (e) => {
    e.stopPropagation()
    const address = await connect()
    if ( ! address) {
      return
    }

    dispatch($modal.set.show({modal: 'BuyModal', props: {
      collection,
      header: {
        title: `Buy`,
      },
    }}))
  }

  const handleSell = (collection) => async (e) => {
    e.stopPropagation()
    const address = await connect()
    if ( ! address) {
      return
    }

    dispatch($modal.set.show({modal: 'SellModal', props: {
      collection,
      header: {
        title: `Sell`,
      },
    }}))
  }

  const handleMint = (collection) => async (e) => {
    e.stopPropagation()

    trackEvent('Dex Mint Clicked', {
      'Token': token.collection,
      'Wallet connect Status': wallet ? 'Connected' : 'Not Connected',
    })

    const address = await connect()
    if ( ! address) {
      return
    }

    dispatch($modal.set.show({modal: 'MintModal', props: {
      collection,
      header: {
        title: `Mint ${collection.name} NFT20`,
        subtitle: `Convert ${collection.name} NFT to ${collection.name} NFT20`,
        steps: [
          { title: 'Pick NFTs', step: 0 },
          { title: 'Approve Transfer', step: 2 },
          { title: 'Mint NFT20', step: 6 },
        ],
      },
      footer: 'info',
    }}))
  }

  const handleRedeem = (collection) => async (e) => {
    e.stopPropagation()

    trackEvent('Dex Redeem Clicked', {
      'Token': collection.name,
      'Wallet connect Status': wallet ? 'Connected' : 'Not Connected',
    })

    const address = await connect()
    if ( ! address) {
      return
    }

    dispatch($modal.set.show({modal: 'RedeemModal', props: {
      collection,
      header: {
        title: `Redeem ${collection.name} NFTs`,
        subtitle: `Convert ${collection.name} NFT20 into ${collection.name} NFTs`,
        steps: [
          { title: 'Redeem NFT20', step: 0 },
          { title: 'Successful', step: 3 },
        ],
      },
      footer: 'info',
    }}))
  }

  const handleTabChange = (value) => {
    if (value == 'earn') {
      trackEvent('Dex Earn Clicked', {
        'Wallet Status': wallet ? 'Connected' : 'Not Connected',
      })
    }

    if (value == 'trade') {
      trackEvent('Dex Trade Clicked', {
        'Wallet connect Status': wallet ? 'Connected' : 'Not Connected',
      })
    }

    setTab(value)
  }

  const handleHowTo = () => {
    const guide = document.getElementById('guide')
    if (guide) {
      guide.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const handleInfo = (collection) => () => {
    dispatch($modal.set.show({modal: 'Home/HomeInfoModal', props: {
      collection,
      header: {
        image: collection.image,
      },
    }}))
  }

  const HowToUse = () => (
    isMobile ? null : (
      <App.Flex row center gap={12} className={styles.badge} sx={{ padding: '8px 16px', cursor: 'pointer' }} onClick={handleHowTo}>
        <App.Text size={16} color="#B9B8C5">Wondering how to use?</App.Text>
        <App.Icon icon="arrow-down" color="#fff" />
      </App.Flex>
    )
  )

  return (
    <div className={styles.container}>
      <App.Container className={styles.content}>
        <App.Flex column>
          <App.Tabs options={tabs} active={tab} variant="classic" end={<HowToUse />} onChange={handleTabChange} />

          <App.Flex width="100%" className={cn(styles.paper, {[styles.glow]: tab == 'earn'})}>
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
                    {sortedTokens().map((item, index) => {
                      return (
                        <TableRow
                          key={index}
                          sx={{ '& th, & td': { border: '0', backgroundColor: '#08051C' } }}
                        >
                          <TableCell colSpan={2}>
                            <App.Flex row justify="space-between" align="center">
                              <App.Flex row gap={8} align="center">
                                <a href={scanUrl(item.address, 'address', blockchain.code)} target="_blank" rel="noreferrer">
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
                                <App.Text nowrap>{item.price ? numeral(item.price).format('$0,0.[0000]') : '-' }</App.Text>
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

                      <TableCell
                        align='center'
                        sortDirection={orderBy === 'tvl' ? order : false}
                      >
                        <TableSortLabel
                          active={orderBy === 'tvl'}
                          direction={orderBy === 'tvl' ? order : 'asc'}
                          classes={{ root: styles.th, active: styles.active, icon: styles.icon }}
                          onClick={handleSort('tvl')}
                        >
                          TVL
                        </TableSortLabel>
                      </TableCell>

                      <TableCell sx={{ width: '10px' }}></TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {sortedTokens().map((item, index) => {
                      return (
                        <TableRow
                          key={index}
                          sx={{ '& th, & td': { border: '0', backgroundColor: '#08051C' } }}
                        >
                          <TableCell>
                            <App.Flex gap={16} align="center">
                              <a href={scanUrl(item.address, 'address', blockchain.code)} target="_blank" rel="noreferrer">
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
                            <App.Text center nowrap>{item.price ? numeral(item.price).format('$0,0.[0000]') : '-' }</App.Text>
                          </TableCell>

                          <TableCell align="center">
                            <App.Text center>{item.volume ? `${numeral(item.volume).format('0,0.[00]')} ${blockchain.currency}` : '-'}</App.Text>
                          </TableCell>

                          <TableCell align="center">
                            <App.Text center>{item.tvl ? `${numeral(item.tvl).format('0,0.[00]')} ${blockchain.currency}` : '-'}</App.Text>
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

            {/* <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={rows.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            /> */}

            {tab == 'earn' ? (
              <App.Flex column center className={styles.earn}>
                <Image src="/images/crown.png" width={166} height={167} alt="" />

                <App.Text center size={[40, 28]} weight={700} gradient="linear-gradient(90deg, #FFF066, #FF9A01)">Excitement awaits!</App.Text>
                <App.Text center size={[20, 16]} weight={700} color="#B9B8C5">Stay tuned for something incredible coming soon.</App.Text>
              </App.Flex>
            ) : null}
          </App.Flex>

          {isMobile ? <div style={{paddingTop: 16}}><HowToUse /></div> : null}
        </App.Flex>
      </App.Container>
    </div>
  )
}

export default HomeTable