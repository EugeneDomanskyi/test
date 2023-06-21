import { useState } from 'react'
import { useDispatch } from 'react-redux'
import Image from 'next/image'
import { Container, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TableSortLabel } from '@mui/material'
import numeral from 'numeral'

import useWalletConnect from '@/myhooks/wallet-connect'

import $modal from '@/store/modal'

import AppText from '@/components/AppText'
import AppButton from '@/components/AppButton'

import styles from './styles.module.scss'

const HomeTable = ({ tokens }) => {
  const { connect, changeNetwork } = useWalletConnect()

  const dispatch = useDispatch()

  const [order, setOrder] = useState('asc')
  const [orderBy, setOrderBy] = useState('collection')

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

  const handleTrade = (token) => async () => {
    if (token.nft20) {
      const address = await connect()
      if ( ! address) {
        return
      }

      const result = await changeNetwork(token.chain)
      if ( ! result) {
        return
      }

      dispatch($modal.set.show({modal: 'TradeModal', props: { token: token, tokens: tokens }}))
    }
  }

  const handleMint = (token) => async () => {
    const address = await connect()
    if ( ! address) {
      return
    }

    const result = await changeNetwork(token.chain)
    if ( ! result) {
      return
    }

    dispatch($modal.set.show({modal: 'MintModal', props: { token: token }}))
  }

  const handleRedeem = (token) => async () => {
    const address = await connect()
    if ( ! address) {
      return
    }

    const result = await changeNetwork(token.chain)
    if ( ! result) {
      return
    }

    dispatch($modal.set.show({modal: 'RedeemModal', props: { token: token }}))
  }

  return (
    <div className={styles.container}>
      <Container maxWidth="xl" className={styles.content}>
        <Paper sx={{ width: '100%', border: '1px solid rgba(255, 255, 255, 0.08)', background: 'linear-gradient(0deg, rgba(255, 255, 255, 0.04), rgba(255, 255, 255, 0.04)), #09051D' }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ '& th, & td': { borderColor: 'rgba(255, 255, 255, 0.08)' },  background: 'linear-gradient(0deg, rgba(255, 255, 255, 0.06), rgba(255, 255, 255, 0.06)), #09051D' }}>
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
                    align='center'
                    sortDirection={orderBy === 'price' ? order : false}
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
                  >
                    <AppText center weight={600} color="rgba(185, 184, 197, 0.8)">Blockchain</AppText>
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
                  <TableCell sx={{ width: '10px' }}></TableCell>
                  <TableCell sx={{ width: '10px' }}></TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {sortedTokens().map((item, index) => {
                  return (
                    <TableRow key={index}  sx={{ '& th, & td': { borderColor: 'rgba(255, 255, 255, 0.08)' } }}>
                      <TableCell>
                        <Stack spacing={2} direction="row" sx={{ alignItems: 'center' }}>
                          <Image src={item.image} width={32} height={32} alt="" />

                          <Stack>
                            <AppText weight={700}>{item.collection}</AppText>
                            <AppText size={12} weight={400} color="#B9B8C5">{item.game}</AppText>
                            <AppText size={12} weight={400} color="#B9B8C5">{item.code}</AppText>
                          </Stack>
                        </Stack>
                      </TableCell>

                      <TableCell align="center">
                        <AppText center>{item.pool?.id ? numeral(item.price).format('$0.[0000]') : '-' }</AppText>
                      </TableCell>

                      <TableCell align="center">
                        <Image src={`/images/icon-${item.chain.toLowerCase()}.png`} width={24} height={24} alt="" />
                      </TableCell>

                      <TableCell align="center">
                        <AppText center>{item.pool?.id ? numeral(item.tvl).format('$0.[00]') : '-'}</AppText>
                      </TableCell>

                      <TableCell align="center">
                        <AppButton primary onClick={handleTrade(item)}>Trade</AppButton>
                      </TableCell>

                      <TableCell align="center">
                        <AppButton variant="success" onClick={handleMint(item)}>Mint</AppButton>
                      </TableCell>

                      <TableCell align="center">
                        <AppButton variant="danger" onClick={handleRedeem(item)}>Redeem</AppButton>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
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
        </Paper>
      </Container>
    </div>
  )
}

export default HomeTable