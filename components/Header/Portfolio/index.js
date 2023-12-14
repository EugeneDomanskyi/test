import { useDispatch, useSelector } from 'react-redux'
import { useRouter } from 'next/router'
import Image from 'next/image'
import cn from 'classnames'

import useWalletConnect from '@/myhooks/wallet-connect'

import $app from '@/store/app'
import $alert from '@/store/alert'
import $token from '@/store/token'

import App from '@/components/App'

import styles from './styles.module.scss'

const Portfolio = ({ open, address, logo, onClose, onDisconnect }) => {
  const router = useRouter()

  const { wallet, scanUrl } = useWalletConnect()

  const dispatch = useDispatch()
  const blockchain = useSelector($app.get.blockchain)
  const portfolioUsd = useSelector(({ $portfolio }) => $portfolio.usd)
  const portfolioTicker = useSelector(({ $portfolio }) => $portfolio.ticker)
  const portfolioList = useSelector(({ $portfolio }) => $portfolio.list)

  const handleClose = () => {
    if (onClose) {
      onClose(false)
    }
  }

  const handleCopy = async () => {
    await navigator.clipboard.writeText(wallet)
    dispatch($alert.set.success({ title: 'Address Copied', text: 'The address has been successfully copied to clipboard' }))
  }

  const handleDisconnect = async () => {
    if (onDisconnect) {
      onDisconnect()
    }
  }

  const handleTrade = (item) => () => {
    if (!item.isNative && !item.isUsdt) {
      dispatch($token.set.current({}))
      router.push(`/exchange/${blockchain.code}/${item.address}`)
      handleClose()
    }
  }

  return (
    <div className={cn(styles.portfolioContainer, {[styles.active]: open})}>
      <App.Flex column gap={26} className={styles.portfolio}>
        <App.Flex row align="center" justify="space-between" className={styles.header}>
          <App.Text size={16} weight={600} height={1}>Wallet</App.Text>
          <App.Flex center className={styles.closeButton} onClick={handleClose}>
            <App.Icon icon="cross" width={7} height={7} color="#fff" />
          </App.Flex>
        </App.Flex>

        <App.Flex className={styles.portfolioCardBox}>
          <App.Frame width="100%" padding={1} radius={12} background="linear-gradient(99deg, #6100FF 0.33%, rgba(97, 0, 255, 0.13) 100%)" gradient="linear-gradient(135deg, #E2DDFF, #ECE9FF54, #FFFFFF1F)">
            <App.Flex column gap={24} className={styles.portfolioCard}>
              <App.Flex row gap={16} align="center" justify="space-between">
                <App.Flex row gap={12} align="center">
                  <App.Flex row gap={4} align="center">
                    <Image src={logo} width={34} height={34} alt="" />
                    <App.Text size={[16, 14]} weight={600} height={1}>{address}</App.Text>
                  </App.Flex>

                  <App.Icon icon="copy3" onClick={handleCopy} style={{ cursor: 'pointer' }} />

                  <a href={scanUrl(wallet, 'address', blockchain)} target="_blank" rel="noreferrer" style={{ lineHeight: 1 }}>
                    <App.Icon icon={blockchain.code == 'polygon' ? 'polyscan' : 'etherscan'} width={16} height={16} opacity={1} color="#fff" />
                  </a>
                </App.Flex>

                <App.Icon icon="logout2" onClick={handleDisconnect} style={{ cursor: 'pointer' }}/>
              </App.Flex>

              <App.Flex column gap={6}>
                <App.Text size={12} weight={600} height={1} color="#B9B8C5">Balance</App.Text>
                <App.Text size={[32, 24]} weight={700} height={1}>${portfolioUsd}</App.Text>

                <App.Flex align="center" gap={4}>
                  {portfolioTicker?.type != 'zero' ? (
                    <App.Icon style={{transform: `rotate(${portfolioTicker?.type == 'minus' ? '0' : '180'}deg)`}} icon="caret-down" color={portfolioTicker?.type == 'minus' ? '#FF1D61' : '#53F19C' } width={12} height={12} />
                  ) : null}
                  <App.Text size={[16, 14]} height={1} color={portfolioTicker?.type == 'minus' ? '#FF1D61' : portfolioTicker?.type == 'plus' ? '#53F19C' : '#B9B8C5'}>{ portfolioTicker?.percent }%</App.Text>
                </App.Flex>
              </App.Flex>
            </App.Flex>
          </App.Frame>
        </App.Flex>
        
        {portfolioList.length > 0 ? (
          <App.Flex column gap={16} flex={1}>
            <App.Flex row sx={{ padding: '0 16px' }}>
              <App.Text size={16} weight={600} height={1}>Assets Held</App.Text>
            </App.Flex>

            <App.Flex column flex={1} sx={{ position: 'relative' }}>
              <div className={styles.scroll}>
                <App.Flex column>
                  {portfolioList.map(item => (
                    <App.Flex key={item.address} row align="center" justify="space-between" className={cn(styles.row, {[styles.clickable]: !item.isNative && !item.isUsdt})} onClick={handleTrade(item)}>
                      <App.Flex row gap={8} align="center">
                        <Image src={item.image} width={40} height={40} alt="" />

                        <App.Flex column gap={6}>
                          <App.Text size={16} weight={700} height={1}>{item.name}</App.Text>
                          <App.Text size={12} weight={600} height={1} color="#5E5C6B">{item.balance} {item.symbol}</App.Text>
                        </App.Flex>
                      </App.Flex>

                      <App.Flex column gap={6}>
                        <App.Text size={16} weight={700} height={1}>${item.usd}</App.Text>

                        <App.Flex align="center" justify="flex-end" gap={4}>
                          {item.ticker?.type != 'zero' ? (
                            <App.Icon style={{transform: `rotate(${item.ticker?.type == 'minus' ? '0' : '180'}deg)`}} icon="caret-down" color={item.ticker?.type == 'minus' ? '#FF1D61' : '#53F19C' } width={10} height={10} />
                          ) : null}
                          <App.Text size={12} height={1} color={item.ticker?.type == 'minus' ? '#FF1D61' : item.ticker?.type == 'plus' ? '#53F19C' : '#5E5C6B' }>{ item.ticker?.percent }%</App.Text>
                        </App.Flex>
                      </App.Flex>
                    </App.Flex>
                  ))}
                </App.Flex>
              </div>
            </App.Flex>
          </App.Flex>
        ) : null}
      </App.Flex>

      <div className={styles.portfolioBackdrop} onClick={handleClose} />
    </div>
  )
}

export default Portfolio