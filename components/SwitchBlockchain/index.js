import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useRouter } from 'next/router'
import Image from 'next/image'
import cn from 'classnames'

import { trackEvent } from '@/libs/analytics.lib'

import useWalletConnect from '@/myhooks/wallet-connect'
import { usePropsHelper } from '@/myhooks/props-helper'

import $app from '@/store/app'
import $collection from '@/store/collection'
import $token from '@/store/token'

import App from '@/components/App'

import styles from './styles.module.scss'

const SwitchBlockchain = ({ justify = 'center', onMobileMenuClose, onChangeNetwork }) => {
  const router = useRouter()
  const isExchange = router.pathname.includes('/exchange')
  const isEarn = router.pathname.includes('/earn')

  const { wallet, changeNetwork } = useWalletConnect()
  const { isMobile } = usePropsHelper()

  const dispatch = useDispatch()
  const blockchain = useSelector($app.get.blockchain)
  const pageBlockchains = useSelector($app.get.pageBlockchains(isExchange ? 'tokens' : (isEarn ? 'raffle' : 'nfts')))

  const [menuShow, setMenuShow] = useState(false)

  useEffect(() => {
    document.addEventListener('click', handleClickOutside, false)

    return () => {
      document.removeEventListener('click', handleClickOutside, false)
    }
  }, [])

  const handleClickOutside = (event) => {
    if (! event.target.closest('#blockchain')) {
      setMenuShow(false)
    }
  }

  const handleMenuToggle = () => {
    setMenuShow( ! menuShow)
  }

  const handleBlockchainChange = async (val) => {
    if (val != blockchain.code) {
      trackEvent('Switch Network', {
        'Old Network': blockchain.code.toUpperCase(),
        'New Network': val.toUpperCase(),
      })
      
      dispatch($collection.set.clear())
      dispatch($token.set.clear())
      setMenuShow(false)
      if (wallet) {
        const network = await changeNetwork(val)
        if (network) {
          onChangeNetwork()
        }
      }
      dispatch($app.set.code(val))

      if (onMobileMenuClose) {
        onMobileMenuClose()
      }
    }
  }

  return (
    <App.Flex row align="center" justify={justify} gap={8} sx={{ position: 'relative' }} id="blockchain">
      <App.Flex row center gap={8} className={cn(styles.badge, {[styles.active]: menuShow})} sx={{ cursor: 'pointer' }} onClick={handleMenuToggle}>
        <Image src={`/images/icon-${blockchain.code}.png`} width={28} height={28} alt="" />
        {
          ! isMobile
            ? <>
                <App.Text size={16} weight={700} className={styles.badgeTitle}>{blockchain.name}</App.Text>
              </>
            : null
        }
        <App.Icon icon="caret-down" color="#fff" />
      </App.Flex>

      <div className={cn(styles.menu, {[styles.active]: menuShow})}>
        <App.Flex column>
          {pageBlockchains.map(item => (
            <App.Flex row gap={8} key={item.id} align="center" className={styles.item} onClick={() => handleBlockchainChange(item.code)}>
              <Image src={`/images/icon-${item.code}.png`} width={28} height={28} alt="" />
              <App.Text nowrap size={16} weight={700} height={1}>{ item.name }</App.Text>
            </App.Flex>
          ))}
        </App.Flex>
      </div>
    </App.Flex>
  )
}

export default SwitchBlockchain