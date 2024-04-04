import { useState } from 'react'
import Image from 'next/image'
import { TableCell, TableRow } from '@mui/material'
import moment from 'moment'

import App from '@/components/App'
import RaffleListMyItemModal from '@/components/Raffle/RaffleListMyItemModal'

import styles from './styles.module.scss'

const RaffleListMyItemMobile = ({ item, number, onMoreCases }) => {
  const [isInfoOpen, setIsInfoOpen] = useState(false)

  const handleInfoModalShow = () => {
    setIsInfoOpen(true)
  }

  const handleInfoClose = () => {
    setIsInfoOpen(false)
  }

  return (
    <>
      <TableRow
        sx={{ '& th, & td': { border: '0', backgroundColor: '#120f25' } }}
        onClick={handleInfoModalShow}
      >
        <TableCell>
          <App.Text size={12}>{number}</App.Text>
        </TableCell>

        <TableCell>
          <App.Flex column gap={8}>
            <App.Flex row gap={8} align="center">
              {item.campaign.image ? (
                <img src={item.campaign.image} width={24} height={24} alt="" />
              ) : (
                <App.Flex className={styles.imagePlaceholder} width={24} height={24} />
              )}

              <App.Flex column>
                <App.Text size={12} nowrap height={1}>{item.campaign.title}</App.Text>
              </App.Flex>
            </App.Flex>

            <App.Text size={10} color="#B9B8C5" height={1}>{moment(item.participatedTimestamp * 1000).format('DD-MMM-YYYY hh:mm:ss A')}</App.Text>
          </App.Flex>
        </TableCell>

        <TableCell align="right">
          <App.Flex column gap={8} align="flex-end">
            <App.Flex row align="center" gap={4}>
              <Image src="/images/raffle/usdt.png" width={12} height={12} alt="" />
              <App.Text size={12} height={1}>{item.rewardAmount ?? 0} USDT</App.Text>
            </App.Flex>

            <App.Text size={10} color={item.status == 'Success' ? '#53F19C' : (item.status == 'Processing' ? '#FFD600' : '#FF1D61')}>{item.status}</App.Text>
          </App.Flex>
        </TableCell>

        <TableCell align="right" sx={{ width: 10, padding: 0 }}>
          <App.Icon icon="dots" />
        </TableCell>
      </TableRow>

      <App.Dialog
        open={isInfoOpen}
        onClose={handleInfoClose}
      >
        <RaffleListMyItemModal
          item={item}
          onMoreCases={onMoreCases}
        />
      </App.Dialog>
    </>
  )
}

export default RaffleListMyItemMobile