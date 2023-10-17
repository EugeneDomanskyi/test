import { useSelector } from 'react-redux'
import Image from 'next/image'
import { TableCell, TableRow } from '@mui/material'
import moment from 'moment'

import $app from '@/store/app'

import { trackEvent } from '@/libs/analytics.lib'

import useWalletConnect from '@/myhooks/wallet-connect'

import App from '@/components/App'

import styles from './styles.module.scss'

const RaffleListMyItem = ({ item, number, onShare }) => {
  const blockchain = useSelector($app.get.blockchain)

  const { wallet } = useWalletConnect()

  const handleTransactionClick = (tx) => () => {
    window.open(`${blockchain.raffle.txUrl}${tx}`, '_blank')
  }

  const handleClickShare = () => {
    trackEvent('Click Share My Case Opens', {
      'Wallet connect Status': wallet ? 'Connected' : 'Not Connected',
    })
    const shareText = `🥳💸 Woohoo! I just won $${item.rewardAmount} in USDT from a case! You can win $USDT, $PEPE, $SHIB, $FLOKI, and other tokens in the $10000 Tegro Treasure Case series! 💰💰 Join me now! Unlock your first Tegro case 🎁 for FREE! 👀 Start here 👉`
    onShare(shareText)
  }

  return (
    <TableRow
      sx={{ '& th, & td': { border: '0', backgroundColor: '#120f25' } }}
    >
      <TableCell>
        <App.Text>{number}</App.Text>
      </TableCell>

      <TableCell>
        <App.Text>{moment(item.participatedTimestamp * 1000).format('DD-MMM-YYYY')}</App.Text>
        <App.Text>{moment(item.participatedTimestamp * 1000).format('hh:mm:ss A')}</App.Text>
      </TableCell>

      <TableCell>
        <App.Flex gap={8} align="center">
          {item.campaign.image ? (
            <img src={item.campaign.image} width={48} height={48} alt="" />
          ) : (
            <App.Flex className={styles.imagePlaceholder} width={48} height={48} />
          )}

          <App.Flex column>
            <App.Text>{item.campaign.title}</App.Text>
          </App.Flex>
        </App.Flex>
      </TableCell>

      <TableCell align="left">
        {item.resolvedTransaction ? (
          <App.Text className={styles.link} onClick={handleTransactionClick(item.resolvedTransaction)}>{item.resolvedTransaction.slice(0, 20)}...</App.Text>
        ) : null}
      </TableCell>

      <TableCell align="left">
        <App.Flex row align="center" gap={4}>
          <Image src="/images/raffle/usdt.png" width={16} height={16} alt="" />
          <App.Text>{item.rewardAmount ?? 0} USDT</App.Text>
        </App.Flex>
      </TableCell>

      <TableCell align="left">
        <App.Text color={item.status == 'Success' ? '#53F19C' : (item.status == 'Processing' ? '#FFD600' : '#FF1D61')}>{item.status}</App.Text>
      </TableCell>

      <TableCell align="left">
        <App.Flex row align="center" gap={4}>
          <Image src="/images/raffle/tkey-small.png" width={12} height={17} alt="" />
          <App.Text center>{item.tKeysCount ?? 0}</App.Text>
        </App.Flex>
      </TableCell>

      <TableCell>
        <App.Flex row align="center" onClick={handleClickShare} sx={{ cursor: 'pointer' }}>
          <App.Icon icon="share" />
        </App.Flex>
      </TableCell>
    </TableRow>
  )
}

export default RaffleListMyItem