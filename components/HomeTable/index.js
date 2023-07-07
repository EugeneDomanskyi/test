import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useRouter } from 'next/router'
import Image from 'next/image'
import { Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TableSortLabel } from '@mui/material'
import numeral from 'numeral'
import cn from 'classnames'

import useWalletConnect from '@/myhooks/wallet-connect'
import { usePropsHelper } from '@/myhooks/props-helper'

import $modal from '@/store/modal'

import App from '@/components/App'

import styles from './styles.module.scss'

const HomeTable = ({ tokens }) => {
  const { isMobile } = usePropsHelper()
  const { connect, changeNetwork, scanUrl } = useWalletConnect()

  const dispatch = useDispatch()
  const router = useRouter()

  const [order, setOrder] = useState('asc')
  const [orderBy, setOrderBy] = useState('collection')
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
    return stableSort(tokens, getComparator(order, orderBy))
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

  const handleTrade = (token) => async (e) => {
    e.stopPropagation()
    if (token.nft20) {
      const address = await connect()
      if ( ! address) {
        return
      }

      const result = await changeNetwork(token.chain)
      if ( ! result) {
        return
      }

      dispatch($modal.set.show({modal: 'TradeModal', props: {
        token: token,
        header: {
          title: `Trade`,
        }
      }}))
    }
  }

  const handleMint = (token) => async (e) => {
    e.stopPropagation()
    const address = await connect()
    if ( ! address) {
      return
    }

    const result = await changeNetwork(token.chain)
    if ( ! result) {
      return
    }

    dispatch($modal.set.show({modal: 'MintModal', props: {
      token: token,
      header: {
        title: `Mint ${token.code} NFT20`,
        subtitle: `Convert ${token.collection} NFT to ${token.code} NFT20`,
        steps: [
          { title: 'Pick NFTs', step: 0 },
          { title: 'Approve Transfer', step: 2 },
          { title: 'Mint NFT20', step: 6 },
        ],
      },
      footer: 'info',
    }}))
  }

  const handleRedeem = (token) => async (e) => {
    e.stopPropagation()
    const address = await connect()
    if ( ! address) {
      return
    }

    const result = await changeNetwork(token.chain)
    if ( ! result) {
      return
    }

    dispatch($modal.set.show({modal: 'RedeemModal', props: {
      token: token,
      header: {
        title: `Redeem ${token.collection} NFTs`,
        subtitle: `Convert ${token.code} NFT20 into ${token.collection} NFTs`,
        steps: [
          { title: 'Redeem NFT20', step: 0 },
          { title: 'Successful', step: 3 },
        ],
      },
      footer: 'info',
    }}))
  }

  const onPressToken = (token) => () => {
    router.push(`pool/${token.poolId}`)
  }

  const handleTabChange = (value) => {
    setTab(value)
  }

  const handleHowTo = () => {
    const guide = document.getElementById('guide')
    if (guide) {
      guide.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const handleInfo = (token) => () => {
    dispatch($modal.set.show({modal: 'HomeInfoModal', props: {
      token: token,
      header: {
        content: <App.Flex center><Image src={token.image} width={120} height={120} alt="" /></App.Flex>
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
                        sortDirection={orderBy === 'collection' ? order : false}
                      >
                        <TableSortLabel
                          active={orderBy === 'collection'}
                          direction={orderBy === 'collection' ? order : 'asc'}
                          classes={{ root: styles.th, active: styles.active, icon: styles.icon }}
                          onClick={handleSort('collection')}
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
                          // onClick={onPressToken(item)}
                          sx={{
                            '& th, & td': { border: '0', backgroundColor: '#08051C' },
                            // '&:hover': {backgroundColor: 'rgba(255,255,255,0.1)', cursor: 'pointer'},
                          }}>
                          <TableCell colSpan={2}>
                            <App.Flex row justify="space-between" align="center">
                              <App.Flex row gap={8} align="center">
                                <a href={scanUrl(item.ognft, 'address', item.chain)} target="_blank" rel="noreferrer">
                                  <Image src={item.image} width={42} height={42} alt="" />
                                </a>

                                <App.Flex column>
                                  <App.Text height={1}>{item.collection}</App.Text>

                                  <App.Flex row center gap={8}>
                                    <App.Text size={12} weight={400} height={1} color="#B9B8C5">{item.game}</App.Text>
                                    <Image src={`/images/icon-${item.chain.toLowerCase()}.png`} width={24} height={24} alt="" />
                                  </App.Flex>

                                  <App.Text size={12} weight={400} height={1} color="#B9B8C5">{item.code}</App.Text>
                                </App.Flex>
                              </App.Flex>

                              <App.Flex row center onClick={handleInfo(item)}>
                                <App.Text nowrap>{item.pool?.id ? numeral(item.price).format('$0.[0000]') : '-' }</App.Text>
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
                        sortDirection={orderBy === 'collection' ? order : false}
                      >
                        <TableSortLabel
                          active={orderBy === 'collection'}
                          direction={orderBy === 'collection' ? order : 'asc'}
                          classes={{ root: styles.th, active: styles.active, icon: styles.icon }}
                          onClick={handleSort('collection')}
                        >
                          Name
                        </TableSortLabel>
                      </TableCell>

                      <TableCell></TableCell>

                      <TableCell
                        align='left'
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

                      <TableCell sx={{ width: '10px' }}></TableCell>

                      <TableCell
                        align='center'
                        sortDirection={orderBy === 'volumeToken1' ? order : false}
                      >
                        <TableSortLabel
                          active={orderBy === 'volumeToken1'}
                          direction={orderBy === 'volumeToken1' ? order : 'asc'}
                          classes={{ root: styles.th, active: styles.active, icon: styles.icon }}
                          onClick={handleSort('volumeToken1')}
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
                          // onClick={onPressToken(item)}
                          sx={{
                            '& th, & td': { border: '0', backgroundColor: '#08051C' },
                            // '&:hover': {backgroundColor: 'rgba(255,255,255,0.1)', cursor: 'pointer'},
                          }}>
                          <TableCell>
                            <App.Flex gap={16} align="center">
                              <a href={scanUrl(item.ognft, 'address', item.chain)} target="_blank" rel="noreferrer">
                                <Image src={item.image} width={48} height={48} alt="" />
                              </a>

                              <App.Flex column>
                                <App.Text weight={700}>{item.collection}</App.Text>
                                <App.Text size={12} weight={400} color="#B9B8C5">{item.game}</App.Text>
                                <App.Text size={12} weight={400} color="#B9B8C5">{item.code}</App.Text>
                              </App.Flex>
                            </App.Flex>
                          </TableCell>

                          <TableCell align="center">
                            <Image src={`/images/icon-${item.chain.toLowerCase()}.png`} width={24} height={24} alt="" />
                          </TableCell>

                          <TableCell align="left">
                            <App.Text nowrap>{item.pool?.id ? numeral(item.price).format('$0.[0000]') : '-' }</App.Text>
                          </TableCell>

                          <TableCell align="right">
                            <App.Button primary onClick={handleTrade(item)}>Trade</App.Button>
                          </TableCell>

                          <TableCell align="center">
                            <App.Text center>{item.pool?.id ? numeral(item.pool?.volumeToken1).format('$0.[00]') : '-'}</App.Text>
                          </TableCell>

                          <TableCell align="center">
                            <App.Text center>{item.pool?.id ? numeral(item.tvl).format('$0.[00]') : '-'}</App.Text>
                          </TableCell>

                          <TableCell align="center">
                            <App.Flex row>
                              <App.Button variant="success" outlined group onClick={handleMint(item)}>Mint</App.Button>
                              <App.Button variant="danger" outlined group onClick={handleRedeem(item)}>Redeem</App.Button>
                            </App.Flex>
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