import { useDispatch, useSelector } from 'react-redux'
import { useRouter } from 'next/router'
import Image from 'next/image'
import cn from 'classnames'

import useWalletConnect from '@/myhooks/wallet-connect'

import $app from '@/store/app'
import $alert from '@/store/alert'
import $portfolio from '@/store/portfolio'

import App from '@/components/App'

import styles from './styles.module.scss'
import { useState } from 'react'

const Portfolio = ({ open, address, logo, onClose, onDisconnect }) => {
  const router = useRouter()

  const { wallet, scanUrl } = useWalletConnect()

  const dispatch = useDispatch()
  const blockchain = useSelector($app.get.blockchain)
  const portfolioUsd = useSelector(({ $portfolio }) => $portfolio.usd)
  const portfolioTicker = useSelector(({ $portfolio }) => $portfolio.ticker)
  const portfolioList = useSelector(({ $portfolio }) => $portfolio.list)

  const [isClicked, setIsClicked] = useState()

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

  const handleTrade = (item, side) => () => {
    if (!item.isNative && !item.isUsdt) {
      dispatch($portfolio.set.prefill({
        address: item.address,
        side,
        amount: side == 'buy' ? 1 : item.balance,
      }))

      router.push(`/exchange/${blockchain.code}/${item.address}`)
      handleClose()
    }
  }

  const handleClick = (address) => () => {
    const status = address == isClicked ? null : address
    setIsClicked(status)
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
                    <App.Icon icon={blockchain.code == 'polygon' || blockchain.code == 'mumbai' ? 'polyscan' : 'etherscan'} width={16} height={16} opacity={1} color="#fff" />
                  </a>
                </App.Flex>

                <App.Icon icon="logout2" onClick={handleDisconnect} style={{ cursor: 'pointer' }}/>
              </App.Flex>

              <App.Flex column gap={6}>
                <App.Text size={12} weight={600} height={1} color="#B9B8C5">Balance</App.Text>
                <App.Text size={[32, 24]} weight={700} height={1}>${portfolioUsd}</App.Text>

                {/* {portfolioUsd * 0 > 0 ? (
                  <App.Flex align="center" gap={4}>
                    {portfolioTicker?.type != 'zero' ? (
                      <App.Icon style={{transform: `rotate(${portfolioTicker?.type == 'minus' ? '0' : '180'}deg)`}} icon="caret-down" color={portfolioTicker?.type == 'minus' ? '#FF1D61' : '#53F19C' } width={12} height={12} />
                    ) : null}
                    <App.Text size={[16, 14]} height={1} color={portfolioTicker?.type == 'minus' ? '#FF1D61' : portfolioTicker?.type == 'plus' ? '#53F19C' : '#B9B8C5'}>{ portfolioTicker?.percent }%</App.Text>
                  </App.Flex>
                ) : null} */}
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
                    <App.Flex key={item.address} column className={cn(styles.row, styles.clickable)} onMouseLeave={handleClick(null)} onClick={handleClick(item.address)}>
                      <App.Flex row align="center" justify="space-between">
                        <App.Flex row gap={8} align="center">
                          {item.image ? (
                            <Image src={item.image} width={40} height={40} alt="" />
                          ) : (
                            <div className={styles.emptyImage} />
                          )}

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

                      {!item.isNative && !item.isUsdt ? (
                        <App.Flex row fullWidth className={cn(styles.buttonsBox, {[styles.active]: isClicked == item.address})}>
                          <App.Flex row fullWidth align="center" gap={16}>
                            <App.Flex flex={1}>
                              <App.Button fullWidth variant="success" onClick={handleTrade(item, 'buy')}>Buy</App.Button>
                            </App.Flex>

                            <App.Flex flex={1}>
                              <App.Button fullWidth variant="danger" onClick={handleTrade(item, 'sell')}>Sell</App.Button>
                            </App.Flex>
                          </App.Flex>
                        </App.Flex>
                      ) : (
                        <App.Flex className={cn(styles.textBox, {[styles.active]: isClicked == item.address})}>
                          <App.Text style="italic" color="#FFD600">This cryptocurrency is currently tradable only in token format.</App.Text>
                        </App.Flex>
                      )}
                    </App.Flex>
                  ))}
                </App.Flex>
              </div>
            </App.Flex>

            <App.Flex row sx={{ padding: 16 }}>
              <App.Flex className={styles.bottomBox}>
                <App.Text size={12} style="italic" color="#DB880C">Heads Up! 🌟 Assets under <b>$1</b> aren&apos;t displayed now, but fret not! We&apos;re updating soon. Stay tuned! 🚀</App.Text>
              </App.Flex>
            </App.Flex>
          </App.Flex>
        ) : (
          <App.Flex column center gap={16} sx={{ padding: '26px 50px' }}>
            <App.Text center size={20} weight={600}>Build Your Portfolio</App.Text>
            <App.Text center color="#B9B8C5">Whether your assets are under $1 or you&apos;re just getting started, explore opportunities and start building your crypto portfolio.</App.Text>
          </App.Flex>
        )}
      </App.Flex>

      <div className={styles.portfolioBackdrop} onClick={handleClose} />
    </div>
  )
}

export default Portfolio